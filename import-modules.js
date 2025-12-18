/* ===============================
   FIREBASE SDK
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ===============================
   CONFIG FIREBASE DGPE
   ⚠️ METS TES VRAIES CLÉS
================================ */
const firebaseConfig = {
  apiKey: "TA_API_KEY",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning",
  storageBucket: "dgpe-elearning.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXX"
};

/* ===============================
   INITIALISATION
================================ */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===============================
   MODULES DGPE OFFICIELS 2026
================================ */
const MODULES_DGPE = [
  { titre: "Gouvernance stratégique et analyse financière", domaine: "Gouvernance", duree: "4 j" },
  { titre: "Pilotage stratégique", domaine: "Gouvernance", duree: "4 j" },
  { titre: "Audit & conformité", domaine: "Gouvernance", duree: "3 j" },
  { titre: "Performance & KPI", domaine: "Performance", duree: "2 j" },
  { titre: "Transformation digitale", domaine: "Digital", duree: "3 j" },
  { titre: "IA & Décision", domaine: "Digital", duree: "2 j" },
  { titre: "Leadership", domaine: "Management", duree: "2 j" },
  { titre: "Communication de crise", domaine: "Management", duree: "2 j" },
  { titre: "RSE : Concevoir et piloter une stratégie durable", domaine: "Gouvernance", duree: "3 j" },
  { titre: "Manager le changement durable", domaine: "Management", duree: "2 j" }
];

/* ===============================
   LOG UTILITAIRE
================================ */
function log(msg) {
  const el = document.getElementById("log");
  if (el) el.textContent += msg + "\n";
}

/* ===============================
   IMPORT DANS FIRESTORE
================================ */
async function creerModulesDGPE() {
  log("Initialisation...");
  log("Connexion à Firestore OK");

  let count = 0;

  for (const m of MODULES_DGPE) {
    await addDoc(collection(db, "modules"), {
      titre: m.titre,
      domaine: m.domaine,
      duree: m.duree,
      actif: true,
      createdAt: serverTimestamp()
    });

    log(`✔ ${m.titre} → ${m.duree}`);
    count++;
  }

  log("=============================");
  log(`Modules créés : ${count}`);
  log("===== TERMINÉ =====");
}

/* ===============================
   LANCEMENT
================================ */
creerModulesDGPE();
