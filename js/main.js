// ============================================================
//  main.js — script principal de Space Beaver Coffee
//  j'essaie de tout organiser proprement ici
//  source principale : cours JS + quelques trucs sur MDN
// ============================================================


// =============================================================
//  PARTIE 1 — TOGGLE MODE JOUR / NUIT
//  c'est la fonctionnalité principale du site
//  j'utilise localStorage pour que le mode soit sauvegardé
//  même quand on recharge la page, ça marche nickel
// =============================================================

// je récupère le body pour lui ajouter/enlever la classe dark-mode
const body = document.body;

// je sélectionne TOUS les boutons toggle (il y en a un par page)
// querySelectorAll renvoie une NodeList, pas un Array
// mais forEach marche quand même dessus, ouf !
const toggleBtns = document.querySelectorAll('.mode-toggle');

// je stocke les labels dans des constantes pour pas me répéter
// (j'avais mis les textes en dur avant, c'était nul)
const DAY_LABEL   = '🌙 Black Orbit Mode';
const NIGHT_LABEL = '☀️ Laboratory Mode';

// fonction qui applique le mode selon un booléen
// j'ai mis ça dans une fonction parce que j'en ai besoin à 2 endroits
// (au chargement de la page ET au clic sur le bouton)
function applyMode(isDark) {
  if (isDark) {
    // on passe en mode nuit : on ajoute la classe dark-mode au body
    // c'est cette classe qui déclenche tout le changement CSS (variables)
    body.classList.add('dark-mode');

    // on met à jour le texte de TOUS les boutons toggle
    toggleBtns.forEach(btn => {
      btn.textContent = NIGHT_LABEL;
    });
  } else {
    // mode jour : on retire la classe
    body.classList.remove('dark-mode');
    toggleBtns.forEach(btn => {
      btn.textContent = DAY_LABEL;
    });
  }

  // on sauvegarde le choix dans localStorage
  // localStorage stocke tout en string donc 'true' ou 'false'
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

// au chargement de la page, on vérifie si un mode a été sauvegardé
// getItem renvoie null si la clé n'existe pas
const savedMode = localStorage.getItem('darkMode');
applyMode(savedMode === 'true');  // si null → false → mode jour par défaut

// on attache l'événement clic sur chaque bouton toggle
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // on inverse le mode actuel
    const isDark = !body.classList.contains('dark-mode');
    applyMode(isDark);
  });
});


// =============================================================
//  PARTIE 2 — MENU BURGER (RESPONSIVE MOBILE)
//  sur mobile la navbar devient un menu burger
//  j'active/désactive une classe 'open' avec du JS
//  l'animation est gérée par le CSS
// =============================================================

const burger   = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

// vérification que les éléments existent bien avant de les utiliser
if (burger && navLinks) {

  // clic sur le burger : toggle les deux classes
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');    // animation burger → croix
    navLinks.classList.toggle('open');    // affiche/cache le menu
  });

  // quand on clique sur un lien → on ferme le menu
  // sinon il reste ouvert après navigation, c'est pas top
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // clic en dehors → fermeture aussi
  // contains() vérifie si le clic est à l'intérieur d'un élément
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


// =============================================================
//  PARTIE 3 — LIEN ACTIF DANS LA NAVBAR
//  pour mettre en évidence la page sur laquelle on est
//  j'utilise window.location.pathname pour détecter la page
// =============================================================

// pathname donne par ex. "/space-beaver/index.html"
// .split('/').pop() récupère juste le dernier morceau "index.html"
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});


// =============================================================
//  PARTIE 4 — OMBRE SUR LA NAVBAR AU SCROLL
//  quand on scrolle la navbar reçoit une ombre pour la démarquer
// =============================================================

const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}


// =============================================================
//  PARTIE 5 — ANIMATIONS D'APPARITION AU SCROLL (REVEAL)
//  IntersectionObserver observe les éléments et déclenche
//  l'animation quand ils entrent dans le viewport
//  c'est plus propre que d'écouter le scroll directement
// =============================================================

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);  // stop d'observer une fois animé
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'  // décale un peu pour l'effet
  });

  revealEls.forEach(el => observer.observe(el));
}

initReveal();


// =============================================================
//  PARTIE 6 — VALIDATION DU FORMULAIRE DE CONTACT
//  vérification côté client : champs requis, format email, longueur
//  NOTE : pas de vrai envoi (pas de backend), c'est simulé avec setTimeout
// =============================================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {

  // affiche l'erreur sous un champ
  function showError(input, msg) {
    input.classList.add('error');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  // efface l'erreur d'un champ
  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) errEl.classList.remove('show');
  }

  // validation au blur + effacement pendant la saisie
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) clearError(field);
    });
  });

  function validateField(field) {
    clearError(field);

    const val  = field.value.trim();
    const name = field.name;

    // champ vide et obligatoire
    if (field.required && val === '') {
      showError(field, '⚠ Ce champ est requis');
      return false;
    }

    // regex email : trouvée sur MDN, vérifie le format basique
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(field, '⚠ Adresse email invalide');
        return false;
      }
    }

    if (name === 'name' && val.length < 2) {
      showError(field, '⚠ Minimum 2 caractères requis');
      return false;
    }

    if (name === 'message' && val.length < 10) {
      showError(field, '⚠ Message trop court (min 10 caractères)');
      return false;
    }

    return true;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();  // empêche le rechargement de la page

    const fields = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid  = true;

    // on valide tous les champs requis
    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (isValid) {
      const formInner = contactForm.querySelector('.form-fields');
      const successEl = contactForm.querySelector('.form-success');
      const submitBtn = contactForm.querySelector('.form-submit');

      // feedback pendant l'envoi simulé
      submitBtn.textContent = body.classList.contains('dark-mode')
        ? '[ TRANSMISSION EN COURS... ]'
        : 'ENVOI EN COURS...';
      submitBtn.disabled = true;

      // dans un vrai projet ici on ferait un fetch() POST vers un serveur
      // pour l'instant setTimeout simule le délai réseau
      setTimeout(() => {
        if (formInner) formInner.style.display = 'none';
        if (successEl) successEl.classList.add('show');
      }, 1200);
    }
  });
}


// =============================================================
//  PARTIE 7 — ONGLETS DU MENU (TABS)
//  filtrage des sections par catégorie sur menu.html
// =============================================================

function initMenuTabs() {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  if (!tabs.length) return;  // pas d'onglets sur cette page → on sort

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.target;

      sections.forEach(section => {
        if (target === 'all' || section.dataset.category === target) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    });
  });
}

initMenuTabs();


// =============================================================
//  PARTIE 8 — EFFET GLITCH EN MODE NUIT
//  les titres ont un effet glitch avec ::before et ::after en CSS
//  mais il faut que data-text soit renseigné (CSS utilise attr())
// =============================================================

function applyGlitch() {
  document.querySelectorAll('.section-title').forEach(el => {
    el.setAttribute('data-text', el.textContent);
    el.classList.add('glitch');
  });
}

// on observe les changements de classe sur le body
const modeObserver = new MutationObserver(() => {
  if (body.classList.contains('dark-mode')) applyGlitch();
});
modeObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

if (body.classList.contains('dark-mode')) applyGlitch();


// =============================================================
//  PARTIE 9 — PARTICULES FLOTTANTES EN MODE NUIT
//  petits points lumineux violet/cyan dans le hero
//  créés dynamiquement et supprimés après 7s pour pas surcharger le DOM
// =============================================================

// keyframes injectées en JS car elles ne changeront pas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatParticle {
    from { transform: translateY(0) translateX(0); opacity: 0.3; }
    to   { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
  }
`;
document.head.appendChild(particleStyle);

function createParticle() {
  if (!body.classList.contains('dark-mode')) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const particle = document.createElement('div');
  const size     = Math.random() * 3 + 1;
  const color    = Math.random() > 0.5 ? '#b026ff' : '#00f5d4';

  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    pointer-events: none;
    z-index: 1;
    opacity: ${Math.random() * 0.7 + 0.2};
    animation: floatParticle ${Math.random() * 4 + 3}s ease-in-out infinite alternate;
    box-shadow: 0 0 6px ${color};
  `;

  hero.appendChild(particle);

  // suppression après 7s pour pas alourdir le DOM
  setTimeout(() => { if (particle.parentNode) particle.remove(); }, 7000);
}

let particleInterval;

function toggleParticles() {
  clearInterval(particleInterval);
  if (body.classList.contains('dark-mode')) {
    particleInterval = setInterval(createParticle, 600);
  }
}

toggleParticles();

document.querySelectorAll('.mode-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    setTimeout(toggleParticles, 100);  // petit délai pour que la classe soit déjà là
  });
});


// =============================================================
//  PARTIE 10 — ANNÉE DANS LE FOOTER
//  automatique pour pas avoir à changer le code chaque année
// =============================================================

const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// =============================================================
//  PARTIE 11 — SMOOTH SCROLL SUR LES LIENS ANCRES
//  scroll doux au lieu du saut brutal natif
//  offset de 80px pour pas que la navbar fixe cache le titre
// =============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
