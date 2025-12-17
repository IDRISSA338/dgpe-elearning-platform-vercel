/* =====================================================
   🔐 FIREBASE – DGPE (APP GLOBAL)
===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= CONFIG FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* =====================================================
   🔑 CONNEXION (LOGIN)
===================================================== */
window.login = async function () {
  const email    = document.querySelector('input[type="email"]').value.trim();
  const password = document.querySelector('input[type="password"]').value.trim();

  if (!email || !password) {
    alert("❌ Veuillez remplir tous les champs.");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // 🔎 Vérification Firestore
    const ref  = doc(db, "users", cred.user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists() || snap.data().status !== "ACTIF") {
      alert("⛔ Compte non activé par la DGPE.");
      return;
    }

    // ✅ OK
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("❌ Connexion refusée : identifiants incorrects.");
  }
};

/* =====================================================
   📱 MENU MOBILE / OFFCANVAS
===================================================== */
const burger    = document.querySelector('.burger');
const offcanvas = document.querySelector('.offcanvas');
const closeBtn  = document.querySelector('.offcanvas .close');

if (burger && offcanvas) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    offcanvas.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      burger.classList.remove('active');
      offcanvas.classList.remove('open');
    });
  }
}

/* =====================================================
   ✨ ANIMATION REVEAL
===================================================== */
function reveal() {
  document.querySelectorAll('.card, .panel').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 60) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
  });
}
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

/* =====================================================
   📚 CATALOGUE DYNAMIQUE
===================================================== */
async function loadCatalogue() {
  const grid = document.querySelector('.modules-grid');
  if (!grid) return;

  try {
    const res  = await fetch('./assets/data/modules.json');
    const data = await res.json();

    grid.innerHTML = data.modules.map(m => `
      <a href="module.html?id=${m.id}" class="card">
        <h3>${m.titre}</h3>
        <p style="color:#a7b1bd">${m.domaine} • ${m.duree}</p>
        <p>${m.resume}</p>
      </a>
    `).join('');

  } catch (e) {
    grid.innerHTML = `<div class="panel">❌ Erreur lors du chargement.</div>`;
  }
}
loadCatalogue();
