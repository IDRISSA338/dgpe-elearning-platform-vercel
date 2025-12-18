import {
  getFirestore,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

/* ==============================
   FIREBASE CONFIG
============================== */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ==============================
   MAPPING OFFICIEL DGPE 2026
============================== */
const dureesDGPE = {
  "Gouvernance stratégique et analyse financière": "4 j",
  "Pilotage stratégique": "4 j",
  "Audit & conformité": "3 j",
  "Performance & KPI": "2 j",
  "Transformation digitale": "3 j",
  "IA & Décision": "2 j",
  "Leadership": "2 j",
  "Communication de crise": "2 j",
  "RSE : Concevoir et piloter une stratégie durable": "3 j",
  "Manager le changement durable": "2 j"
};

/* ==============================
   NORMALISATION DES TITRES
============================== */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* ==============================
   CORRECTION DES DURÉES
============================== */
async function corrigerDurees() {
  const snap = await getDocs(collection(db, "modules"));
  let count = 0;

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
  const titreModule =
  data.titre ||
  data.title ||
  data.nom ||
  data.name ||
  "";


    if (!titreModule) continue;

    const cleCorrespondante = Object.keys(dureesDGPE).find(
      key => normalize(key) === normalize(titreModule)
    );

    if (cleCorrespondante) {
      const nouvelleDuree = dureesDGPE[cleCorrespondante];

      if (data.duree !== nouvelleDuree) {
        await updateDoc(docSnap.ref, {
          duree: nouvelleDuree
        });

        console.log(`✔ ${titreModule} → ${nouvelleDuree}`);
        count++;
      }
    }
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `<p>✅ ${count} modules mis à jour.</p>`
  );
}

/* ==============================
   LANCEMENT
============================== */
corrigerDurees();
