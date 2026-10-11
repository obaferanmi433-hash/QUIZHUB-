import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const loginLink = document.getElementById("navLogin");
const registerLink = document.getElementById("navRegister");
const logoutLink = document.getElementById("navLogout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutLink.style.display = "block";
    logoutLink.textContent = "Log out (" + (user.displayName || "you") + ")";
  } else {
    loginLink.style.display = "block";
    registerLink.style.display = "block";
    logoutLink.style.display = "none";
  }
});

logoutLink.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
});
