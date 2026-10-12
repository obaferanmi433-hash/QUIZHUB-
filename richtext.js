const ALLOWED = ["B","STRONG","I","EM","U","SUP","SUB","UL","OL","LI","BR"];
const BLOCK = ["DIV","P"];

export function clean(html) {
  const parsed = new DOMParser().parseFromString("<body>" + html + "</body>", "text/html");
  const out = document.createElement("div");
  function walk(node, target) {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) { target.appendChild(document.createTextNode(n.nodeValue)); return; }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === "SCRIPT" || tag === "STYLE") return;
      if (ALLOWED.includes(tag)) {
        const el = document.createElement(tag.toLowerCase());
        walk(n, el);
        target.appendChild(el);
      } else if (BLOCK.includes(tag)) {
        if (target.lastChild) target.appendChild(document.createElement("br"));
        walk(n, target);
      } else {
        walk(n, target);
      }
    });
  }
  walk(parsed.body, out);
  return out.innerHTML.trim();
}

export function plain(html) {
  const d = document.createElement("div");
  d.innerHTML = clean(html);
  return d.textContent.trim();
}

export function setupToolbar(bar) {
  let last = null;
  document.addEventListener("focusin", (e) => {
    if (e.target.classList && e.target.classList.contains("rt")) last = e.target;
  });
  bar.addEventListener("mousedown", (e) => e.preventDefault());
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || !last) return;
    last.focus();
    document.execCommand(b.dataset.cmd, false, null);
  });
}
