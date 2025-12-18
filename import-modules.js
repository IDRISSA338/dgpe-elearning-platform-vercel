import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ===============================
   FIRESTORE
================================ */
const db = getFirestore();

/* ===============================
   MODULES DGPE OFFICIELS 2026
================================ */
const MODULES_DGPE = [
  { titre: "Gouvernance stratégique et analyse financière", domaine: "Gouvernance", duree: "4 jours" },
  { titre: "Pilotage stratégique", domaine: "Gouvernance", duree: "4 jours" },
  { titre: "Audit et conformité", domaine: "Gouvernance", duree: "3 jours" },
  { titre: "Performance et KPI", domaine: "Performance", duree: "2 jours" },
  { titre: "Transformation digitale", domaine: "Digital", duree: "3 jours" },
  { titre: "Intelligence artificielle et décision", domaine: "Digital", duree: "2 jours" },
  { titre: "Leadership et management public", domaine: "Management", duree: "2 jours" },
  { titre: "Communication de crise", domaine: "Management", duree: "2 jours" },
  { titre: "RSE – stratégie et pilotage durable", domaine: "Gouvernance", duree: "3 jours" },
  { titre: "Manager le changement durable", domaine: "Management", duree: "2 jours" }
];

/* ===============================
   IMPORT DANS FIRESTORE
================================ */
async function creerModulesDGPE() {
  const log = document.getElementById("log");
  let count = 0;

  log.textContent = "🔥 Connexion à Firestore...\n\n";

  try {
    for (const module of MODULES_DGPE) {
      await addDoc(collection(db, "modules"), {
        titre: module.titre,
        domaine: module.domaine,
        duree: module.duree,
        actif: true,
        createdAt: serverTimestamp()
      });

      log.textContent += `✔ ${module.titre} (${module.duree})\n`;
      count++;
    }

    log.textContent += "\n=============================\n";
    log.textContent += `✅ Modules créés : ${count}\n`;
    log.textContent += "🎉 IMPORT TERMINÉ AVEC SUCCÈS\n";

  } catch (error) {
    log.textContent += "\n❌ ERREUR :\n";
    log.textContent += error.message;
    console.error(error);
  }
}

creerModulesDGPE();
