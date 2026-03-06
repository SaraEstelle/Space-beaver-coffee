// main.js — script principal de Space Beaver Coffee
// chargé en dernier dans chaque page (juste avant </body>)
// comme ça tout le HTML est déjà chargé quand le JS s'exécute


// ---- PARTIE 1 : TOGGLE MODE JOUR / NUIT ----
// c'est la fonctionnalité principale du site
// j'utilise localStorage pour sauvegarder le choix de l'utilisateur
// comme ça même en rechargent la page, le mode reste actif

// je récupère le <body> pour lui ajouter/enlever la classe dark-mode
// c'est cette classe qui déclenche tous les changements CSS
const body = document.body;

// je sélectionne TOUS les boutons toggle du site en une seule fois
// querySelectorAll renvoie une NodeList, pas un Array
// mais forEach marche quand même dessus
const toggleBtns = document.querySelectorAll('.mode-toggle');

// textes des boutons selon le mode actif
// je les mets dans des constantes pour pas réécrire les chaînes partout
const DAY_LABEL   = '🌙 Black Orbit Mode';
const NIGHT_LABEL = '☀️ Laboratory Mode';

// fonction centrale du toggle : prend un booléen et applique le bon mode
// j'en ai besoin à 2 endroits (chargement + clic) donc j'en fais une fonction
function applyMode(isDark) {
  if (isDark) {
    // mode nuit : j'ajoute .dark-mode au body
    // cette classe écrase les variables CSS dans style.css → tout change de couleur
    body.classList.add('dark-mode');

    // je mets à jour le texte de tous les boutons toggle
    toggleBtns.forEach(btn => {
      btn.textContent = NIGHT_LABEL;
    });
  } else {
    // mode jour : je retire .dark-mode
    body.classList.remove('dark-mode');
    toggleBtns.forEach(btn => {
      btn.textContent = DAY_LABEL;
    });
  }

  // je sauvegarde le choix dans localStorage
  // localStorage stocke tout en chaîne de caractères, donc 'true' ou 'false'
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

// au chargement de la page : est-ce qu'un mode avait été choisi avant ?
// getItem renvoie null si la clé n'existe pas encore
const savedMode = localStorage.getItem('darkMode');
applyMode(savedMode === 'true'); // si null → false → mode jour par défaut

// clic sur un bouton toggle : j'inverse le mode actuel
toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // si dark-mode est actif → isDark = true → on passe en jour (false)
    // si dark-mode est inactif → isDark = false → on passe en nuit (true)
    const isDark = !body.classList.contains('dark-mode');
    applyMode(isDark);
  });
});


// ---- PARTIE 2 : MENU BURGER (MOBILE) ----
// sur mobile, les liens de navigation se cachent derrière un bouton 3 traits
// le CSS gère l'animation, le JS gère juste l'ajout/retrait des classes

const burger   = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

// je vérifie que les éléments existent avant de les utiliser
// sans ce check, le script crasherait sur une page sans navbar
if (burger && navLinks) {

  // clic sur le burger : toggle les deux classes en même temps
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');   // .active → le burger devient une croix (voir CSS)
    navLinks.classList.toggle('open');   // .open → le menu se déplie (max-height → 400px)
  });

  // clic sur un lien : fermeture du menu mobile
  // sinon le menu reste ouvert après avoir cliqué, ce qui est bizarre
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // clic en dehors du menu et du burger → fermeture aussi
  // contains() vérifie si l'élément cliqué est à l'intérieur du menu ou du burger
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      burger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}


// ---- PARTIE 3 : LIEN ACTIF DANS LA NAVBAR ----
// je détecte sur quelle page on est et j'ajoute .active sur le lien correspondant
// .active applique le soulignement et la couleur accent sur le lien

// pathname donne le chemin complet ex : "/space-beaver/crew.html"
// .split('/').pop() récupère juste le dernier morceau "crew.html"
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  // si le href du lien correspond à la page courante → on l'active
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});


// ---- PARTIE 4 : OMBRE SUR LA NAVBAR AU SCROLL ----
// quand on scrolle vers le bas, la navbar reçoit une ombre
// ça la "détache" visuellement du contenu derrière elle

const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    // scrollY = nombre de pixels scrollés depuis le haut
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
      // on enlève l'ombre quand on revient tout en haut
      navbar.style.boxShadow = 'none';
    }
  });
}


// ---- PARTIE 5 : ANIMATIONS D'APPARITION AU SCROLL (REVEAL) ----
// les éléments avec class="reveal" sont invisibles et décalés vers le bas au départ
// IntersectionObserver détecte quand ils entrent dans le viewport
// et ajoute .visible → le CSS les fait apparaître en fondu
// c'est plus propre que d'écouter l'événement scroll directement

function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  // je crée un observer qui surveille les éléments
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // l'élément est visible à l'écran → je lui ajoute .visible
        entry.target.classList.add('visible');
        // j'arrête de surveiller cet élément : il est déjà animé, pas besoin de revenir
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,                    // déclenche quand 10% de l'élément est visible
    rootMargin: '0px 0px -40px 0px'   // décale le déclenchement de 40px vers le haut
  });

  // j'applique l'observer sur chaque élément .reveal
  revealEls.forEach(el => observer.observe(el));
}

initReveal();


// ---- PARTIE 6 : VALIDATION DU FORMULAIRE DE CONTACT ----
// vérifie les champs avant l'envoi : obligatoires, format email, longueur minimum
// NOTE : pas de vraie requête réseau (pas de serveur),
//        l'envoi est simulé avec setTimeout

const contactForm = document.getElementById('contactForm');

if (contactForm) {

  // affiche un message d'erreur sous le champ
  function showError(input, msg) {
    input.classList.add('error');          // bordure rouge via CSS
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');         // .show → le message devient visible
    }
  }

  // efface le message d'erreur sous le champ
  function clearError(input) {
    input.classList.remove('error');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) errEl.classList.remove('show');
  }

  // validation au blur (quand on quitte un champ) + effacement pendant la saisie
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      // si l'erreur est déjà affichée et qu'on tape → on efface
      if (field.classList.contains('error')) clearError(field);
    });
  });

  // valide un champ et renvoie true si valide, false sinon
  function validateField(field) {
    clearError(field); // on repart propre

    const val  = field.value.trim(); // trim() enlève les espaces au début/fin
    const name = field.name;

    // champ obligatoire vide ?
    if (field.required && val === '') {
      showError(field, '⚠ Ce champ est requis');
      return false;
    }

    // vérification du format email avec une regex
    // ^ début, [^\s@]+ pas d'espace ni @, @ obligatoire, etc.
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        showError(field, '⚠ Adresse email invalide');
        return false;
      }
    }

    // nom trop court ?
    if (name === 'name' && val.length < 2) {
      showError(field, '⚠ Minimum 2 caractères requis');
      return false;
    }

    // message trop court ?
    if (name === 'message' && val.length < 10) {
      showError(field, '⚠ Message trop court (min 10 caractères)');
      return false;
    }

    return true; // tout est ok
  }

  // soumission du formulaire
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // empêche le rechargement de la page (comportement par défaut)

    // je valide tous les champs obligatoires
    const fields = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid  = true;

    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (isValid) {
      const formInner = contactForm.querySelector('.form-fields');
      const successEl = contactForm.querySelector('.form-success');
      const submitBtn = contactForm.querySelector('.form-submit');

      // feedback visuel pendant l'envoi : je change le texte du bouton
      submitBtn.textContent = body.classList.contains('dark-mode')
        ? '[ TRANSMISSION EN COURS... ]'
        : 'ENVOI EN COURS...';
      submitBtn.disabled = true; // désactive le bouton pour éviter un double envoi

      // dans un vrai projet : fetch() POST vers un serveur ici
      // pour l'instant setTimeout simule un délai réseau de 1.2s
      setTimeout(() => {
        if (formInner) formInner.style.display = 'none'; // cache le formulaire
        if (successEl) successEl.classList.add('show');  // affiche le message de succès
      }, 1200);
    }
  });
}


// ---- PARTIE 7 : ONGLETS DU MENU (TABS) ----
// les onglets Boissons / Pâtisseries / Fast Food sur menu.html
// permettent de filtrer les sections par catégorie

function initMenuTabs() {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  // si pas d'onglets sur cette page → on sort sans rien faire
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // je retire .active de tous les onglets puis j'ajoute sur celui cliqué
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // data-target de l'onglet cliqué (ex: "boissons", "patisseries", "all")
      const target = tab.dataset.target;

      // je montre ou cache chaque section selon la catégorie
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


// ---- PARTIE 8 : EFFET GLITCH EN MODE NUIT ----
// les titres ont un effet de "glitch" (bug visuel) en mode nuit
// le CSS utilise ::before et ::after pour créer deux copies décalées du texte
// mais il faut que l'attribut data-text soit renseigné (CSS utilise attr(data-text))
// c'est le JS qui s'en charge ici

function applyGlitch() {
  document.querySelectorAll('.section-title').forEach(el => {
    el.setAttribute('data-text', el.textContent); // copie le texte dans data-text
    el.classList.add('glitch');                   // active les règles CSS ::before/::after
  });
}

// MutationObserver surveille les changements d'attributs sur le body
// ici je surveille la classe pour détecter le passage en dark-mode
const modeObserver = new MutationObserver(() => {
  if (body.classList.contains('dark-mode')) applyGlitch();
});
modeObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

// si la page se charge déjà en mode nuit, on applique tout de suite
if (body.classList.contains('dark-mode')) applyGlitch();


// ---- PARTIE 9 : PARTICULES FLOTTANTES EN MODE NUIT ----
// petits points lumineux qui flottent dans le hero en mode nuit
// créés dynamiquement avec createElement et supprimés après 7s
// pour ne pas alourdir le DOM avec trop d'éléments

// j'injecte l'animation dans le <head> via un élément <style>
// je ne peux pas la mettre dans style.css car elle dépend de valeurs aléatoires
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatParticle {
    from { transform: translateY(0) translateX(0); opacity: 0.3; }
    to   { transform: translateY(-30px) translateX(15px); opacity: 0.8; }
  }
`;
document.head.appendChild(particleStyle);

// crée une particule aléatoire dans le hero
function createParticle() {
  // ne crée des particules qu'en mode nuit
  if (!body.classList.contains('dark-mode')) return;

  const hero = document.querySelector('.hero');
  if (!hero) return; // pas de hero sur cette page → on sort

  const particle = document.createElement('div');

  // taille et couleur aléatoires
  const size  = Math.random() * 3 + 1;
  const color = Math.random() > 0.5 ? '#b026ff' : '#00f5d4';

  // je mets tous les styles en une seule string avec cssText
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

  // suppression automatique après 7 secondes pour ne pas alourdir le DOM
  setTimeout(() => { if (particle.parentNode) particle.remove(); }, 7000);
}

let particleInterval;

// démarre ou arrête la création de particules selon le mode
function toggleParticles() {
  clearInterval(particleInterval);
  if (body.classList.contains('dark-mode')) {
    // crée une nouvelle particule toutes les 600ms
    particleInterval = setInterval(createParticle, 600);
  }
}

// lancement au chargement (si déjà en mode nuit)
toggleParticles();

// mise à jour au clic sur le bouton toggle
document.querySelectorAll('.mode-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    // petit délai de 100ms pour que la classe dark-mode soit déjà ajoutée/retirée
    setTimeout(toggleParticles, 100);
  });
});


// ---- PARTIE 10 : ANNÉE DANS LE FOOTER ----
// met l'année en cours automatiquement dans le footer
// comme ça pas besoin de changer le code chaque 1er janvier

const yearEl = document.querySelector('.footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ---- PARTIE 11 : SMOOTH SCROLL SUR LES LIENS ANCRES ----
// les liens href="#section" font défiler vers la section
// je remplace le saut brutal natif par un scroll doux
// et j'ajoute un offset de 80px pour ne pas que la navbar fixe cache le titre

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault(); // annule le scroll natif
      const offset = 80;  // hauteur de la navbar fixe
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' }); // scroll animé
    }
  });
});
