import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, query, where, writeBatch,
  increment, serverTimestamp, deleteField }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { requireLogin } from "./guard.js";
import { ensureProfile } from "./profile.js";
import { clean, setupToolbar } from "./richtext.js";
import { setupAdd } from "./question-add.js";

const $ = (id) => document.getElementById(id);
const quizId = new URLSearchParams(location.search).get("quiz");
let me = null;

function show(text, type) {
  const box = $("message");
  box.innerHTML = "";
  const d = document.createElement("div");
  d.className = "alert alert-" + type;
  d.textContent = text;
  box.appendChild(d);
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function listQuizzes() {
  $("picker").style.display = "block";
  const snap = await getDocs(query(collection(db, "quizzes"), where("ownerId", "==", me.uid)));
  const list = $("quizList");
  if (snap.empty) {
    list.innerHTML = '<p class="sub">You have no quizzes yet. <a href="create-quiz.html">Create one</a>.</p>';
    return;
  }
  snap.forEach((d) => {
    const q = d.data();
    const a = document.createElement("a");
    a.className = "quizlink";
    a.href = "questions.html?quiz=" + encodeURIComponent(d.id);
    a.textContent = q.title + " (" + (q.questionCount || 0) + " questions, " + q.status + ")";
    list.appendChild(a);
  });
}

async function loadQuestions() {
  const snap = await getDocs(collection(db, "quizzes", quizId, "questions"));
  const items = [];
  snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  $("quizInfo").textContent = items.length + " question(s) so far";
  const box = $("qList");
  box.innerHTML = "";
  if (!items.length) { box.innerHTML = '<p class="sub">No questions yet.</p>'; return; }
  items.forEach((it, i) => {
    const row = document.createElement("div");
    row.className = "qrow";
    const t = document.createElement("div");
    t.innerHTML = "<b>" + (i + 1) + ".</b> " + clean(it.question || "");
    const m = document.createElement("div");
    m.className = "hint";
    m.textContent = (it.options || []).length + " options, " + it.marks + " mark(s)";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-outline";
    del.textContent = "Delete";
    del.addEventListener("click", () => removeQuestion(it.id));
    row.append(t, m, del);
    box.appendChild(row);
  });
}

async function removeQuestion(id) {
  if (!confirm("Delete this question?")) return;
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, "quizzes", quizId, "questions", id));
    batch.update(doc(db, "quizzes", quizId, "private", "answerKey"), {
      ["correctOptions." + id]: deleteField(),
      ["explanations." + id]: deleteField()
    });
    batch.update(doc(db, "quizzes", quizId), {
      questionCount: increment(-1),
      updatedAt: serverTimestamp()
    });
    await batch.commit();
    show("Question deleted.", "success");
    await loadQuestions();
  } catch (err) {
    console.error(err);
    show("Could not delete (" + (err.code || "error") + ").", "error");
  }
}

async function openQuiz() {
  const snap = await getDoc(doc(db, "quizzes", quizId));
  if (!snap.exists()) return show("That quiz was not found.", "error");
  const q = snap.data();
  if (q.ownerId !== me.uid) return show("You can only edit your own quizzes.", "error");
  $("editor").style.display = "block";
  $("quizTitle").textContent = q.title;
  setupToolbar($("toolbar"));
  setupAdd(quizId, show, loadQuestions);
  await loadQuestions();
}

requireLogin(async (user) => {
  me = user;
  try {
    await ensureProfile(user);
    $("status").style.display = "none";
    $("content").style.display = "block";
    if (quizId) await openQuiz(); else await listQuizzes();
  } catch (err) {
    console.error(err);
    $("status").style.display = "none";
    $("content").style.display = "block";
    show("Could not load this page (" + (err.code || "error") + "). The quiz may not exist or is not yours.", "error");
  }
});
