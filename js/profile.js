import { db } from "./firebase.js";
import { doc, getDoc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export async function ensureProfile(user) {
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return true;

    let name = user.displayName || (user.email ? user.email.split("@")[0] : "");
    if (name.length < 2) name = "Student";

    await setDoc(ref, {
      displayName: name.slice(0, 50),
      bio: "",
      photoURL: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.error("Profile error:", err);
    return false;
  }
}
