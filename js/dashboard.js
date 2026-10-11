import { db } from "./firebase.js";
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { requireLogin } from "./guard.js";
import { ensureProfile } from "./profile.js";

const status = document.getElementById("status");
const content = document.getElementById("content");

requireLogin(async (user) => {
  try {
    await ensureProfile(user);
    const snap = await getDoc(doc(db, "users", user.uid));
    const p = snap.exists() ? snap.data() : {};
    const joined = p.createdAt && p.createdAt.toDate
      ? p.createdAt.toDate().toLocaleDateString()
      : "just now";

    document.getElementById("welcome").textContent =
      "Welcome, " + (p.displayName || user.displayName || "student") + "!";
    document.getElementById("email").textContent = "Email: " + user.email;
    document.getElementById("joined").textContent = "Member since: " + joined;

    status.style.display = "none";
    content.style.display = "block";
  } catch (err) {
    console.error(err);
    status.textContent = "Could not load your profile. Please refresh and try again.";
    status.style.color = "#b91c1c";
  }
});
