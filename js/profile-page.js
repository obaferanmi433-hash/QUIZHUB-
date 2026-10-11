import { auth, db } from "./firebase.js";
import { updateProfile }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, getDoc, updateDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { requireLogin } from "./guard.js";
import { ensureProfile } from "./profile.js";

const status = document.getElementById("status");
const content = document.getElementById("content");
const box = document.getElementById("message");
const nameInput = document.getElementById("displayName");
const bioInput = document.getElementById("bio");
const bioCount = document.getElementById("bioCount");
const saveBtn = document.getElementById("saveBtn");

function show(text, type) {
  box.innerHTML = "";
  const d = document.createElement("div");
  d.className = "alert alert-" + type;
  d.textContent = text;
  box.appendChild(d);
}

bioInput.addEventListener("input", () => {
  bioCount.textContent = bioInput.value.length;
});

requireLogin(async (user) => {
  try {
    await ensureProfile(user);
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const p = snap.exists() ? snap.data() : {};

    document.getElementById("email").textContent = "Email: " + user.email;
    nameInput.value = p.displayName || user.displayName || "";
    bioInput.value = p.bio || "";
    bioCount.textContent = bioInput.value.length;

    status.style.display = "none";
    content.style.display = "block";

    document.getElementById("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const bio = bioInput.value.trim().slice(0, 300);
      if (name.length < 2) return show("Display name must be at least 2 characters.", "error");

      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";
      try {
        await updateDoc(ref, {
          displayName: name,
          bio: bio,
          updatedAt: serverTimestamp()
        });
        await updateProfile(auth.currentUser, { displayName: name });
        show("Profile saved!", "success");
      } catch (err) {
        console.error(err);
        show("Could not save (" + (err.code || "error") + "). Please try again.", "error");
      }
      saveBtn.disabled = false;
      saveBtn.textContent = "Save changes";
    });
  } catch (err) {
    console.error(err);
    status.textContent = "Could not load your profile. Please refresh and try again.";
    status.style.color = "#b91c1c";
  }
});
