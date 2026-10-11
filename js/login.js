import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword, onAuthStateChanged,
  signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.getElementById("loginForm");
const box = document.getElementById("message");
const btn = document.getElementById("submitBtn");
const loginView = document.getElementById("loginView");
const loggedInView = document.getElementById("loggedInView");
const whoami = document.getElementById("whoami");

function show(text, type) {
  box.innerHTML = "";
  const d = document.createElement("div");
  d.className = "alert alert-" + type;
  d.textContent = text;
  box.appendChild(d);
}

function friendly(code) {
  const map = {
    "auth/invalid-credential": "Wrong email or password. Please try again.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Wrong email or password. Please try again.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "Network problem. Check your internet and try again."
  };
  return map[code] || "Something went wrong (" + code + "). Please try again.";
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginView.style.display = "none";
    loggedInView.style.display = "block";
    whoami.textContent = "Signed in as " + (user.displayName || user.email);
  } else {
    loginView.style.display = "block";
    loggedInView.style.display = "none";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  btn.disabled = true;
  btn.textContent = "Logging in...";
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById("email").value.trim(),
      document.getElementById("password").value
    );
    box.innerHTML = "";
  } catch (err) {
    show(friendly(err.code), "error");
  }
  btn.disabled = false;
  btn.textContent = "Log in";
});

document.getElementById("resetLink").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) return show("Type your email above first, then tap the link again.", "error");
  try {
    await sendPasswordResetEmail(auth, email);
    show("If that email has an account, a reset link has been sent. Check your spam folder too.", "success");
  } catch (err) {
    show(friendly(err.code), "error");
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  show("You have been logged out.", "success");
});
