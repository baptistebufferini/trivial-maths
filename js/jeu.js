// =============================================================
// LE JEU : accueil, tours de jeu, questions, fin de partie.
// =============================================================

// Raccourci : $('message') = l'élément de la page dont l'id est « message ».
const $ = (id) => document.getElementById(id);

// L'état de la partie en cours.
const etat = {
  joueurs: [],        // { nom, pion, niveau, position, camemberts }
  courant: 0,         // numéro du joueur dont c'est le tour
  objectif: 5,        // nombre de camemberts à gagner
  phase: 'lancer',    // 'lancer' | 'roulement' | 'deplacer' | 'question' | 'fin'
  destinations: [],   // cases accessibles après le lancer de dé
  question: null,     // { q, themeId, estCamembert } : question en cours
};

const joueur = () => etat.joueurs[etat.courant];

// =============================================================
// 1) ÉCRAN D'ACCUEIL
// =============================================================

// Les réglages des 6 joueurs possibles (on n'affiche que les premiers).
const brouillon = COULEURS_PIONS.map((pion, i) => ({
  nom: '',
  couleur: i,        // numéro dans COULEURS_PIONS
  niveau: '5e',
}));
let nombreJoueurs = 2;

function afficherAccueil() {
  // Boutons 1 à 6
  const zoneNombre = $('choix-nombre');
  zoneNombre.innerHTML = '';
  for (let n = 1; n <= 6; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = n;
    b.classList.toggle('choisi', n === nombreJoueurs);
    b.onclick = () => { nombreJoueurs = n; afficherAccueil(); };
    zoneNombre.appendChild(b);
  }

  // Une ligne par joueur : pastille, nom, couleur, niveau
  const liste = $('liste-joueurs');
  liste.innerHTML = '';
  for (let i = 0; i < nombreJoueurs; i++) {
    const r = brouillon[i];
    const ligne = document.createElement('div');
    ligne.className = 'ligne-joueur';

    const pastille = document.createElement('span');
    pastille.className = 'pastille';
    pastille.style.background = COULEURS_PIONS[r.couleur].couleur;

    const nom = document.createElement('input');
    nom.placeholder = `Joueur ${i + 1}`;
    nom.value = r.nom;
    nom.maxLength = 20;
    nom.setAttribute('aria-label', `Prénom ou équipe ${i + 1}`);
    nom.oninput = () => { r.nom = nom.value; };

    const couleur = document.createElement('select');
    couleur.setAttribute('aria-label', `Couleur du pion ${i + 1}`);
    COULEURS_PIONS.forEach((p, k) => couleur.add(new Option(p.nom, k)));
    couleur.value = r.couleur;
    couleur.onchange = () => {
      r.couleur = Number(couleur.value);
      pastille.style.background = COULEURS_PIONS[r.couleur].couleur;
    };

    const niveau = document.createElement('select');
    niveau.setAttribute('aria-label', `Niveau ${i + 1}`);
    [...NIVEAUX, 'parents'].forEach(n => niveau.add(new Option(n === 'parents' ? 'Parents' : n, n)));
    niveau.value = r.niveau;
    niveau.onchange = () => { r.niveau = niveau.value; };

    ligne.append(pastille, nom, couleur, niveau);
    liste.appendChild(ligne);
  }

  // Durée
  document.querySelectorAll('#choix-duree button').forEach(b => {
    b.classList.toggle('choisi', Number(b.dataset.objectif) === etat.objectif);
    b.onclick = () => { etat.objectif = Number(b.dataset.objectif); afficherAccueil(); };
  });
}

function commencerPartie() {
  const choisis = brouillon.slice(0, nombreJoueurs);
  const couleurs = choisis.map(r => r.couleur);
  if (new Set(couleurs).size !== couleurs.length) {
    alert('Deux joueurs ont la même couleur de pion. Changez-en une pour pouvoir les distinguer.');
    return;
  }
  etat.joueurs = choisis.map((r, i) => ({
    nom: r.nom.trim() || `Joueur ${i + 1}`,
    pion: COULEURS_PIONS[r.couleur],
    niveau: r.niveau,
    position: 'centre',
    camemberts: new Set(),
  }));
  etat.courant = 0;
  Banque.dejaPosees.clear();

  $('ecran-accueil').classList.add('cache');
  $('ecran-jeu').classList.remove('cache');
  Plateau.construire();
  Plateau.dessiner($('plateau'));
  Plateau.surClic = clicSurCase;
  Plateau.placerPions(etat.joueurs);
  debutTour(`La partie commence ! But : gagner ${etat.objectif} camemberts.`);
}

// =============================================================
// 2) UN TOUR DE JEU : lancer → choisir sa case → question
// =============================================================

function debutTour(texte) {
  etat.phase = 'lancer';
  afficherPanneau();
  message((texte ? texte + '\n' : '') + `${joueur().nom}, lance le dé !`);
  $('bouton-de').disabled = false;
  $('legende-de').textContent = 'Lancer le dé';
}

function lancerDe() {
  if (etat.phase !== 'lancer') return;
  etat.phase = 'roulement';
  $('bouton-de').disabled = true;
  // Petite animation : le dé change 10 fois de face avant de s'arrêter.
  let tours = 0;
  const animation = setInterval(() => {
    const valeur = 1 + Math.floor(Math.random() * 6);
    afficherDe(valeur);
    tours++;
    if (tours === 10) {
      clearInterval(animation);
      proposerDestinations(valeur);
    }
  }, 70);
}

function afficherDe(valeur) {
  $('face-de').textContent = '⚀⚁⚂⚃⚄⚅'[valeur - 1];
  $('legende-de').textContent = `Tu as fait ${valeur}`;
}

function proposerDestinations(valeur) {
  etat.destinations = Plateau.destinations(joueur().position, valeur);
  etat.phase = 'deplacer';
  Plateau.surligner(etat.destinations);
  message(`${joueur().nom} a fait ${valeur}. Clique sur une des cases qui clignotent.`);
}

function clicSurCase(id) {
  if (etat.phase !== 'deplacer' || !etat.destinations.includes(id)) return;
  Plateau.surligner([]);
  joueur().position = id;
  Plateau.placerPions(etat.joueurs);
  etat.phase = 'question';
  // On attend la fin du déplacement du pion avant d'afficher la suite.
  setTimeout(() => arriverSurCase(Plateau.cases[id]), 500);
}

function arriverSurCase(c) {
  if (c.type === 'rejouer') {
    debutTour('Case « Rejouer » !');
  } else if (c.type === 'centre') {
    ouvrirChoixTheme();
  } else {
    poserQuestion(c.theme, c.type === 'camembert');
  }
}

// Au centre, le joueur choisit le thème de sa question.
function ouvrirChoixTheme() {
  const liste = $('liste-themes');
  liste.innerHTML = '';
  THEMES.forEach(t => {
    const theme = themeDuJoueur(joueur(), t.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.style.background = theme.couleur;
    b.textContent = `${theme.icone}  ${theme.nom}`;
    b.onclick = () => { fermer('fenetre-theme'); poserQuestion(t.id, false); };
    liste.appendChild(b);
  });
  ouvrir('fenetre-theme');
}

// =============================================================
// 3) LES QUESTIONS
// =============================================================

function poserQuestion(themeId, caseCamembert) {
  const j = joueur();
  const theme = themeDuJoueur(j, themeId);
  const q = Banque.tirer(j, themeId);
  if (!q) {
    joueurSuivant(`Aucune question « ${theme.nom} » pour le niveau ${j.niveau}. On passe.`);
    return;
  }
  // Une case camembert ne fait gagner que si on n'a pas déjà ce camembert.
  const estCamembert = caseCamembert && !j.camemberts.has(themeId);
  etat.question = { q, themeId, estCamembert };

  const entete = $('q-entete');
  entete.style.background = theme.couleur;
  entete.textContent = `${theme.icone}  ${theme.nom}` + (estCamembert ? '  —  🧀 question camembert !' : '');
  $('q-joueur').textContent = `${j.nom} · ${j.niveau === 'parents' ? 'Parents' : j.niveau}`;
  $('q-enonce').textContent = q.enonce;

  const image = $('q-image');
  if (q.image) { image.src = q.image; image.classList.remove('cache'); }
  else { image.removeAttribute('src'); image.classList.add('cache'); }

  const zone = $('q-reponses');
  zone.innerHTML = '';
  $('q-resultat').className = 'cache';

  if (q.type === 'qcm') {
    // QCM : la bonne réponse et les mauvaises, dans le désordre.
    zone.className = 'choix-qcm';
    melanger([q.reponse, ...q.faux]).forEach(texte => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = texte;
      b.onclick = () => corriger(texte === q.reponse, b);
      zone.appendChild(b);
    });
  } else {
    // Réponse tapée au clavier.
    zone.className = 'saisie';
    const formulaire = document.createElement('form');
    formulaire.className = 'saisie';
    formulaire.style.width = '100%';
    const champ = document.createElement('input');
    champ.autocomplete = 'off';
    champ.setAttribute('aria-label', 'Ta réponse');
    champ.placeholder = 'Ta réponse';
    const valider = document.createElement('button');
    valider.type = 'submit';
    valider.textContent = 'Valider';
    const passer = document.createElement('button');
    passer.type = 'button';
    passer.className = 'je-sais-pas';
    passer.textContent = 'Je ne sais pas';
    passer.onclick = () => corriger(false);
    formulaire.onsubmit = (e) => {
      e.preventDefault();   // empêche la page de se recharger
      if (champ.value.trim() === '') { champ.focus(); return; }
      corriger(estBonneReponse(champ.value, q));
    };
    formulaire.append(champ, valider, passer);
    zone.appendChild(formulaire);
    setTimeout(() => champ.focus(), 50);
  }
  ouvrir('fenetre-question');
}

// Affiche si c'est juste, la bonne réponse et la méthode.
function corriger(juste, boutonClique) {
  const { q } = etat.question;

  // On bloque les réponses, et en QCM on colore les boutons.
  $('q-reponses').querySelectorAll('button, input').forEach(el => { el.disabled = true; });
  if (q.type === 'qcm') {
    $('q-reponses').querySelectorAll('button').forEach(b => {
      if (b.textContent === q.reponse) b.classList.add('bonne');
      else if (b === boutonClique) b.classList.add('mauvaise');
    });
  }

  const resultat = $('q-resultat');
  resultat.className = juste ? 'juste' : 'faux';
  resultat.innerHTML = '';
  const verdict = document.createElement('p');
  verdict.className = 'verdict';
  verdict.textContent = juste ? '✔ Bonne réponse !' : '✘ Pas tout à fait…';
  resultat.appendChild(verdict);
  if (!juste || q.type === 'saisie') {
    const attendue = document.createElement('p');
    attendue.textContent = `Réponse : ${q.reponse}`;
    resultat.appendChild(attendue);
  }
  if (q.correction) {
    const methode = document.createElement('p');
    methode.textContent = `Méthode : ${q.correction}`;
    resultat.appendChild(methode);
  }
  const suite = document.createElement('button');
  suite.type = 'button';
  suite.className = 'bouton-principal';
  suite.textContent = 'Continuer';
  suite.onclick = () => { fermer('fenetre-question'); apresQuestion(juste); };
  resultat.appendChild(suite);
  setTimeout(() => suite.focus(), 50);
}

function apresQuestion(juste) {
  const j = joueur();
  const { themeId, estCamembert } = etat.question;
  let texte = juste ? 'Bonne réponse !' : 'Raté.';

  if (juste && estCamembert) {
    j.camemberts.add(themeId);
    texte = `${j.nom} gagne le camembert « ${themeDuJoueur(j, themeId).nom} » !`;
    if (j.camemberts.size >= etat.objectif) { victoire(j); return; }
  }
  if (juste && REJOUER_APRES_BONNE_REPONSE) debutTour(texte + ' On rejoue.');
  else joueurSuivant(texte);
}

function joueurSuivant(texte) {
  etat.courant = (etat.courant + 1) % etat.joueurs.length;
  debutTour(texte);
}

function victoire(j) {
  etat.phase = 'fin';
  afficherPanneau();
  $('texte-fin').textContent = `Bravo ${j.nom}, tu as gagné !`;
  $('camembert-fin').innerHTML = dessinCamembert(j);
  ouvrir('fenetre-fin');
}

// =============================================================
// 4) AFFICHAGE DU PANNEAU ET OUTILS
// =============================================================

function afficherPanneau() {
  const j = joueur();
  $('tour-de').innerHTML = '';
  const pastille = document.createElement('span');
  pastille.className = 'pastille';
  pastille.style.background = j.pion.couleur;
  const texte = document.createElement('span');
  texte.textContent = `Au tour de ${j.nom} `;
  const niveau = document.createElement('small');
  niveau.textContent = `(${j.niveau === 'parents' ? 'Parents' : j.niveau})`;
  texte.appendChild(niveau);
  $('tour-de').append(pastille, texte);

  const scores = $('scores');
  scores.innerHTML = '';
  etat.joueurs.forEach((autre, n) => {
    const li = document.createElement('li');
    li.classList.toggle('actif', n === etat.courant);
    li.innerHTML = dessinCamembert(autre);
    const nom = document.createElement('span');
    nom.className = 'nom';
    nom.textContent = autre.nom;
    const detail = document.createElement('small');
    detail.textContent = `${autre.niveau === 'parents' ? 'Parents' : autre.niveau} · ${autre.camemberts.size}/${etat.objectif} 🧀`;
    nom.appendChild(detail);
    li.appendChild(nom);
    scores.appendChild(li);
  });
}

function message(texte) { $('message').textContent = texte; }
function ouvrir(id) { $(id).classList.remove('cache'); }
function fermer(id) { $(id).classList.add('cache'); }

// Mélange une liste au hasard (méthode de Fisher-Yates).
function melanger(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[k]] = [copie[k], copie[i]];
  }
  return copie;
}

function retourAccueil() {
  fermer('fenetre-fin');
  fermer('fenetre-question');
  fermer('fenetre-theme');
  $('ecran-jeu').classList.add('cache');
  $('ecran-accueil').classList.remove('cache');
  afficherAccueil();
}

// =============================================================
// 5) DÉMARRAGE DE LA PAGE
// =============================================================

async function demarrer() {
  afficherAccueil();
  $('bouton-commencer').onclick = commencerPartie;
  $('bouton-de').onclick = lancerDe;
  $('bouton-rejouer').onclick = retourAccueil;
  $('bouton-quitter').onclick = () => {
    if (confirm('Quitter la partie en cours ?')) retourAccueil();
  };

  // Le lien peut contenir ?prof=baptiste
  const codeProf = new URLSearchParams(location.search).get('prof');
  await Banque.charger(codeProf ? codeProf.toLowerCase() : null);
  $('info-chargement').textContent = Banque.messages.join('\n');
}

demarrer();
