import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { requireLogin } from "./guard.js";
import { ensureProfile } from "./profile.js";

const status = document.getElementById("status");
const content = document.getElementById("content");
const box = document.getElementById("message");
const form = document.getElementById("quizForm");
const saveBtn = document.getElementById("saveBtn");

const val = (id) => document.getElementById(id).value.trim();
const chk = (id) => document.getElementById(id).checked;

// Keeps subject names tidy: "  physics " becomes "Physics"
const tidySubject = (s) => {
  const t = s.replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function show(text, type) {
  box.innerHTML = "";
  const d = document.createElement("div");
  d.className = "alert alert-" + type;
  d.textContent = text;
  box.appendChild(d);
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

requireLogin(async (user) => {
  await ensureProfile(user);
  status.style.display = "none";
  content.style.display = "block";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = val("title");
    const subject = tidySubject(val("subject"));
    const duration = Number(val("duration"));
    const attemptLimit = Number(val("attemptLimit"));

    if (title.length < 3) return show("The title must be at least 3 characters.", "error");
    if (subject.length < 2) return show("Please enter a subject (at least 2 letters).", "error");
    if (!(duration >= 1 && duration <= 300)) return show("Duration must be between 1 and 300 minutes.", "error");
    if (!(attemptLimit >= 0 && attemptLimit <= 50)) return show("Attempts allowed must be between 0 and 50.", "error");

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
    try {
      const ref = await addDoc(collection(db, "quizzes"), {
        ownerId: user.uid,
        ownerName: user.displayName || "Student",
        title: title,
        description: val("description"),
        subject: subject,
        difficulty: val("difficulty"),
        instructions: val("instructions"),
        durationMinutes: duration,
        attemptLimit: attemptLimit,
        shuffleQuestions: chk("shuffleQuestions"),
        shuffleOptions: chk("shuffleOptions"),
        access: val("access"),
        showScore: chk("showScore"),
        reviewAnswers: chk("reviewAnswers"),
        showExplanations: chk("showExplanations"),
        leaderboard: chk("leaderboard"),
        resultRelease: val("resultRelease"),
        status: "draft",
        questionCount: 0,
        attemptCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
            window.location.href = "questions.html?quiz=" + ref.id;
      form.reset();
    } catch (err) {
      console.error(err);
      show("Could not save (" + (err.code || "error") + "). Please try again.", "error");
    }
    saveBtn.disabled = false;
    saveBtn.textContent = "Save as draft";
  });
});
