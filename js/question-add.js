import { db } from "./firebase.js";
import { collection, doc, writeBatch, increment, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { clean, plain } from "./richtext.js";

const $ = (id) => document.getElementById(id);

export function setupAdd(quizId, show, onSaved) {
  $("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const qHtml = clean($("qText").innerHTML);
    if (plain(qHtml).length < 2) return show("Please type the question.", "error");

    const options = [];
    let correct = -1;
    const chosen = document.querySelector('input[name="correct"]:checked');
    document.querySelectorAll(".opt .rt").forEach((el, i) => {
      const h = clean(el.innerHTML);
      if (plain(h).length) {
        if (chosen && Number(chosen.value) === i) correct = options.length;
        options.push(h);
      }
    });
    if (options.length < 2) return show("Enter at least 2 options.", "error");
    if (correct < 0) return show("Tap the circle beside the correct option.", "error");

    const marks = Number($("marks").value);
    if (!(marks >= 1 && marks <= 100)) return show("Marks must be between 1 and 100.", "error");
    const explanation = clean($("explanation").innerHTML);
    if (qHtml.length > 5000 || explanation.length > 5000) return show("That text is too long.", "error");

    const btn = $("addBtn");
    btn.disabled = true;
    btn.textContent = "Saving...";
    try {
      const qRef = doc(collection(db, "quizzes", quizId, "questions"));
      const batch = writeBatch(db);
      batch.set(qRef, { question: qHtml, options: options, marks: marks, order: Date.now() });
      batch.set(doc(db, "quizzes", quizId, "private", "answerKey"), {
        correctOptions: { [qRef.id]: correct },
        explanations: { [qRef.id]: explanation }
      }, { merge: true });
      batch.update(doc(db, "quizzes", quizId), {
        questionCount: increment(1),
        updatedAt: serverTimestamp()
      });
      await batch.commit();

      $("qText").innerHTML = "";
      $("explanation").innerHTML = "";
      document.querySelectorAll(".opt .rt").forEach((el) => { el.innerHTML = ""; });
      document.querySelectorAll('input[name="correct"]').forEach((r) => { r.checked = false; });
      $("marks").value = 1;
      show("Question saved!", "success");
      await onSaved();
    } catch (err) {
      console.error(err);
      show("Could not save (" + (err.code || "error") + "). Please try again.", "error");
    }
    btn.disabled = false;
    btn.textContent = "Save question";
  });
}
