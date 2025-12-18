import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ================= LOG UI ================= */
const logBox = document.getElementById("log");
function log(msg) {
  console.log(msg);
  if (logBox) logBox.textContent += "\n" + msg;
}

/* ================= NORMALISATION ================= */
function normalize(txt = "") {
  return txt.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= REGLES DGPE ================= */
const REGLES = [
  { k: "gouvernance", d: "4 j" },
  { k: "pilotage", d: "4 j" },
  { k: "audit", d: "3 j" },
  { k: "conformite", d: "3 j" },
  { k: "performance", d: "2 j" },
  { k: "kpi", d: "2 j" },
  { k: "transformation digitale", d: "3 j" },
  { k: "ia", d: "2 j" },
  { k: "intelligence artificielle", d: "2 j" },
  { k: "leadership", d: "2 j" },
  { k: "communication de crise", d: "2 j" },
  { k: "rse", d: "3 j" },
  { k: "changement", d: "2 j" }
];

function trouverDuree(titre) {
  const t = normalize(titre);
  for (const r of REGLES) {
    if (t.includes(r.k)) return r.d;
  }
  return null;
}

/* ================= EXECUTION ================= */
async function run() {
  log("Connexion à Firestore…");

  try {
    const snap = await getDocs(collection(db, "modules"));
    log(`Modules trouvés : ${snap.size}`);

    let corriges = 0;

    for (const d of snap.docs) {
      const m = d.data();
      const titre = m.titre || "";

      const duree = trouverDuree(titre);
      if (!duree) continue;

      await updateDoc(doc(db, "modules", d.id), {
        duree: duree,
        nbHeures: null,
        heures: null
      });

      corriges++;
      log(`✔ ${titre} → ${duree}`);
    }

    log("====== TERMINÉ ======");
    log(`Modules corrigés : ${corriges}`);

  } catch (err) {
    console.error(err);
    log("❌ ERREUR FIRESTORE :");
    log(err.message);
  }
}

run();
