import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

/* ===== CONFIG FIREBASE ===== */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== NORMALISATION ===== */
function normalize(txt = "") {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "et")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ===== RÈGLES OFFICIELLES DGPE 2026 ===== */
const rules = [
  { match: ["gouvernance"], duree: "4 j" },
  { match: ["pilotage"], duree: "4 j" },
  { match: ["audit"], duree: "3 j" },
  { match: ["performance", "kpi"], duree: "2 j" },
  { match: ["transformation", "digitale"], duree: "3 j" },
  { match: ["ia"], duree: "2 j" },
  { match: ["decision"], duree: "2 j" },
  { match: ["leadership"], duree: "2 j" },
  { match: ["crise"], duree: "2 j" },
  { match: ["rse"], duree: "3 j" },
  { match: ["changement"], duree: "2 j" }
];

/* ===== CORRECTION ===== */
async function corrigerDurees() {
  const snap = await getDocs(collection(db, "modules"));
  let count = 0;

  for (const d of snap.docs) {
    const data = d.data();
    const titre = data.titre || data.title || data.nom || "";
    const t = normalize(titre);

    const rule = rules.find(r =>
      r.match.every(word => t.includes(word))
    );

    if (rule && data.duree !== rule.duree) {
      await updateDoc(doc(db, "modules", d.id), {
        duree: rule.duree
      });
      console.log(`✔ ${titre} → ${rule.duree}`);
      count++;
    } else {
      console.log(`⏭ Ignoré : ${titre}`);
    }
  }

  document.body.innerHTML += `<p>✅ ${count} modules mis à jour.</p>`;
}

corrigerDurees();
