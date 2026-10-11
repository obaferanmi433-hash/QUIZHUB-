import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const form = document.getElementById("registerForm");
const box = document.getElementById("message");
const btn = document.getElementById("submitBtn");

function show(text, type) {
  box.innerHTML = "";
  const d = document.createElement("div");
  d.className = "alert alert-" + type;
  d.textContent = text;
  box.appendChild(d);
}

function friendly(code) {
  const map = {
    "auth/email-already-in-use": "That email is already registered. Try logging in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/network-request-failed": "Network problem. Check your internet and try again.",
    "auth/operation-not-allowed": "Email sign-up is not switched on in Firebase yet."
  };
  return map[code] || "Something went wrong (" + code + "). Please try again.";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (name.length < 2) return show("Please enter a display name.", "error");
  if (password !== confirm) return show("Passwords do not match.", "error");

  btn.disabled = true;
  btn.textContent = "Creating account...";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    show("Account created! Taking you to the homepage...", "success");
    setTimeout(() => { window.location.href = "index.html"; }, 1500);
  } catch (err) {
    show(friendly(err.code), "error");
    btn.disabled = false;
    btn.textContent = "Create account";
  }
});
