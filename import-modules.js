import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const db = getFirestore();

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
   IMPORT DANS FIRESTORE
================================ */
async function creerModulesDGPE() {
  const log = document.getElementById("log");
  let count = 0;

  log.textContent += "\n🔗 Connexion Firestore...\n";

  for (const m of MODULES_DGPE) {
    await addDoc(collection(db, "modules"), {
      titre: m.titre,
      domaine: m.domaine,
      duree: m.duree,
      actif: true,
      createdAt: serverTimestamp()
    });

    log.textContent += `✔ ${m.titre} → ${m.duree}\n`;
    count++;
  }

  log.textContent += "\n=============================\n";
  log.textContent += `🎉 Modules créés : ${count}\n`;
  log.textContent += "✅ TERMINÉ\n";
}

creerModulesDGPE();
