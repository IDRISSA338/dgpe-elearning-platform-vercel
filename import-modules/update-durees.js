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

/* ===== NORMALISATION TEXTE ===== */
function normalize(txt = "") {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "et")
    .replace(/\s+/g, " ")
    .trim();
}

/* ===== MAPPING OFFICIEL DGPE 2026 ===== */
const dureesDGPE = {
  "gouvernance strategique et analyse financiere": "4 j",
  "pilotage strategique": "4 j",
  "audit et conformite": "3 j",
  "performance et kpi": "2 j",
  "transformation digitale": "3 j",
  "ia et decision": "2 j",
  "leadership": "2 j",
  "communication de crise": "2 j",
  "rse concevoir et piloter une strategie durable": "3 j",
  "manager le changement durable": "2 j"
};

/* ===== CORRECTION ===== */
async function corrigerDurees() {
  const snap = await getDocs(collection(db, "modules"));
  let count = 0;

  for (const d of snap.docs) {
    const data = d.data();

    const titreBrut =
      data.titre ||
      data.title ||
      data.nom ||
      data.name ||
      "";

    const titreNormalise = normalize(titreBrut);

    const duree = dureesDGPE[titreNormalise];

    if (duree && data.duree !== duree) {
      await updateDoc(doc(db, "modules", d.id), { duree });
      count++;
      console.log(`✔ ${titreBrut} → ${duree}`);
    } else {
      console.log(`⏭ Ignoré : "${titreBrut}"`);
    }
  }

  document.body.innerHTML += `<p>✅ ${count} modules mis à jour.</p>`;
}

corrigerDurees();
