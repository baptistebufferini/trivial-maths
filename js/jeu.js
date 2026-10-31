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
  deplacements: 0,    // déplacements d'affilée du joueur en cours
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
  chapitre: '',      // code du chapitre en cours ('' = premier chapitre)
}));
let nombreJoueurs = 2;

// On retrouve les réglages de la dernière partie sur cet appareil
// (prénoms, niveaux, chapitres). Ils ne quittent jamais l'appareil.
try {
  const memoire = JSON.parse(localStorage.getItem('trivial-maths-joueurs'));
  if (memoire) {
    nombreJoueurs = memoire.nombreJoueurs;
    memoire.joueurs.forEach((j, i) => Object.assign(brouillon[i], j));
  }
} catch (e) { /* pas de mémoire disponible : tant pis */ }

function memoriserJoueurs() {
  try {
    localStorage.setItem('trivial-maths-joueurs', JSON.stringify({ nombreJoueurs, joueurs: brouillon }));
  } catch (e) { /* idem */ }
}
// Niveau de l'adversaire virtuel (numéro dans NIVEAUX_ADVERSAIRE),
// ou null = pas d'adversaire. Par défaut : « Moyen ».
let adversaire = 1;

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
    // Changer de niveau change la liste des chapitres : on réaffiche.
    niveau.onchange = () => { r.niveau = niveau.value; r.chapitre = ''; afficherAccueil(); };

    // Chapitre en cours (pas pour les parents, qui ont tout le programme)
    const chapitre = document.createElement('select');
    chapitre.className = 'choix-chapitre';
    chapitre.setAttribute('aria-label', `Chapitre en cours ${i + 1}`);
    const chapitres = Banque.chapitresDu(r.niveau);
    chapitres.forEach(c => chapitre.add(new Option(c.titre, c.chapitre)));
    if (!chapitres.some(c => c.chapitre === r.chapitre)) r.chapitre = chapitres.length ? chapitres[0].chapitre : '';
    chapitre.value = r.chapitre;
    chapitre.onchange = () => { r.chapitre = chapitre.value; };
    chapitre.title = 'Chapitre en cours en classe';
    if (r.niveau === 'parents' || chapitres.length === 0) chapitre.style.visibility = 'hidden';

    ligne.append(pastille, nom, couleur, niveau, chapitre);
    liste.appendChild(ligne);
  }

  // Adversaire virtuel : proposé seulement à un joueur seul
  $('carte-adversaire').classList.toggle('cache', nombreJoueurs !== 1);
  const zoneAdversaire = $('choix-adversaire');
  zoneAdversaire.innerHTML = '';
  [null, ...NIVEAUX_ADVERSAIRE.keys()].forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = k === null
      ? 'Aucun<small>jouer seul</small>'
      : `${NIVEAUX_ADVERSAIRE[k].nom}<small>${NIVEAUX_ADVERSAIRE[k].reussite} % de réussite</small>`;
    b.classList.toggle('choisi', k === adversaire);
    b.onclick = () => { adversaire = k; afficherAccueil(); };
    zoneAdversaire.appendChild(b);
  });

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
  memoriserJoueurs();
  etat.joueurs = choisis.map((r, i) => ({
    nom: r.nom.trim() || `Joueur ${i + 1}`,
    pion: COULEURS_PIONS[r.couleur],
    niveau: r.niveau,
    chapitre: r.chapitre,
    position: 'centre',
    camemberts: new Set(),
  }));
  // Un joueur seul peut affronter l'adversaire virtuel. Il prend
  // une couleur de pion libre et reçoit des questions du même niveau.
  if (nombreJoueurs === 1 && adversaire !== null) {
    etat.joueurs.push({
      nom: ADVERSAIRE_NOM,
      pion: COULEURS_PIONS.find((p, k) => k !== choisis[0].couleur),
      niveau: choisis[0].niveau,
      chapitre: choisis[0].chapitre,
      position: 'centre',
      camemberts: new Set(),
      robot: NIVEAUX_ADVERSAIRE[adversaire],   // { nom, reussite }
    });
  }
  etat.courant = 0;
  etat.deplacements = 0;
  Banque.dejaPosees.clear();

  $('ecran-accueil').classList.add('cache');
  $('ecran-jeu').classList.remove('cache');
  Plateau.construire();
  Plateau.dessiner($('plateau'));
  // Pendant le tour de l'adversaire, les clics du joueur sont ignorés.
  Plateau.surClic = (id) => { if (!joueur().robot) clicSurCase(id); };
  Plateau.placerPions(etat.joueurs);
  debutTour(`La partie commence ! But : gagner ${etat.objectif} camemberts.`);
}

// =============================================================
// 2) UN TOUR DE JEU : lancer → choisir sa case → question
// =============================================================

function debutTour(texte) {
  etat.phase = 'lancer';
  afficherPanneau();
  const j = joueur();
  $('legende-de').textContent = 'Lancer le dé';
  if (j.robot) {
    // L'adversaire virtuel lance le dé tout seul, après une petite pause.
    message((texte ? texte + '\n' : '') + `${j.nom} lance le dé…`);
    $('bouton-de').disabled = true;
    plusTard(lancerDe, 1200);
  } else {
    message((texte ? texte + '\n' : '') + `${j.nom}, lance le dé !`);
    $('bouton-de').disabled = false;
  }
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
    if (tours === 10 || etat.phase !== 'roulement') {
      clearInterval(animation);
      if (etat.phase === 'roulement') proposerDestinations(valeur);
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
  if (joueur().robot) {
    message(`${joueur().nom} a fait ${valeur} et choisit sa case…`);
    plusTard(() => clicSurCase(choixDuRobot(etat.destinations)), 1200);
  } else {
    message(`${joueur().nom} a fait ${valeur}. Clique sur une des cases qui clignotent.`);
  }
}

// L'adversaire virtuel choisit sa case : d'abord un camembert qui lui
// manque, sinon une case « Rejouer », sinon une case au hasard.
function choixDuRobot(destinations) {
  const j = joueur();
  const cases = destinations.map(id => Plateau.cases[id]);
  const camembert = cases.find(c => c.type === 'camembert' && !j.camemberts.has(c.theme));
  if (camembert) return camembert.id;
  const rejouer = cases.find(c => c.type === 'rejouer');
  if (rejouer) return rejouer.id;
  return cases[Math.floor(Math.random() * cases.length)].id;
}

function clicSurCase(id) {
  if (etat.phase !== 'deplacer' || !etat.destinations.includes(id)) return;
  Plateau.surligner([]);
  joueur().position = id;
  etat.deplacements++;
  Plateau.placerPions(etat.joueurs);
  etat.phase = 'question';
  // On attend la fin du déplacement du pion avant d'afficher la suite.
  plusTard(() => arriverSurCase(Plateau.cases[id]), 500);
}

function arriverSurCase(c) {
  if (c.type === 'rejouer') {
    if (peutRejouer()) debutTour('Case « Rejouer » !');
    else joueurSuivant(`Case « Rejouer »… mais ${MAX_DEPLACEMENTS_AFFILEE} déplacements d'affilée : on passe la main.`);
  } else if (c.type === 'centre') {
    ouvrirChoixTheme();
  } else {
    poserQuestion(c.theme, c.type === 'camembert');
  }
}

// Au centre, le joueur choisit le thème de sa question.
function ouvrirChoixTheme() {
  const j = joueur();
  if (j.robot) {
    // L'adversaire prend au hasard un thème dont il n'a pas le camembert.
    const manquants = THEMES.filter(t => !j.camemberts.has(t.id));
    const t = manquants[Math.floor(Math.random() * manquants.length)];
    message(`${j.nom} choisit « ${themeDuJoueur(j, t.id).nom} ».`);
    plusTard(() => poserQuestion(t.id, false), 900);
    return;
  }
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
  $('q-joueur').textContent = `${j.nom} · ${etiquette(j)}`;
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
      if (j.robot) b.disabled = true;   // c'est l'adversaire qui choisit
      else b.onclick = () => corriger(texte === q.reponse, b);
      zone.appendChild(b);
    });
  } else if (!j.robot) {
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
  $('q-bulle').classList.add('cache');
  ouvrir('fenetre-question');
  if (j.robot) faireRepondreRobot(q);
}

// L'adversaire virtuel « réfléchit », puis répond dans une bulle.
// Il trouve la bonne réponse avec la probabilité de son niveau
// (par exemple 65 % pour « Moyen »).
function faireRepondreRobot(q) {
  const juste = Math.random() * 100 < joueur().robot.reussite;
  const reponse = juste ? q.reponse : mauvaiseReponse(q);
  const bulle = $('q-bulle');
  bulle.textContent = 'Hmm…';
  bulle.classList.remove('cache');
  plusTard(() => {
    bulle.textContent = reponse === null ? 'Euh… je ne sais pas !' : `Hmm, je dirais ${reponse}…`;
    plusTard(() => {
      // En QCM, on retrouve le bouton choisi pour le colorer.
      const bouton = [...$('q-reponses').querySelectorAll('button')].find(b => b.textContent === reponse);
      corriger(juste, bouton);
    }, 1400);
  }, 1200 + Math.random() * 1300);
}

// Invente une mauvaise réponse vraisemblable pour l'adversaire.
// Renvoie null s'il vaut mieux qu'il dise « je ne sais pas ».
function mauvaiseReponse(q) {
  if (q.type === 'qcm') return q.faux[Math.floor(Math.random() * q.faux.length)];
  const valeur = valeurNumerique(normaliser(q.reponse));
  if (valeur === null || q.reponse.includes('/')) return null;
  // Erreurs classiques : ± 1, ± 10, facteur 10 ou facteur 2.
  const essais = [valeur + 1, valeur - 1, valeur + 10, valeur * 10, valeur / 10, valeur * 2]
    .map(x => Math.round(x * 1000) / 1000)
    .filter(x => Math.abs(x - valeur) > 1e-9);
  const x = essais[Math.floor(Math.random() * essais.length)];
  return String(x).replace('.', ',');   // écriture française : virgule
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
  const j = joueur();
  if (j.robot) verdict.textContent = juste ? `✔ ${j.nom} a trouvé !` : `✘ ${j.nom} s'est trompé…`;
  else verdict.textContent = juste ? '✔ Bonne réponse !' : '✘ Pas tout à fait…';
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
  if (juste && REJOUER_APRES_BONNE_REPONSE) {
    if (peutRejouer()) debutTour(texte + ' On rejoue.');
    else joueurSuivant(texte + ` ${MAX_DEPLACEMENTS_AFFILEE} déplacements d'affilée : on passe la main.`);
  } else {
    joueurSuivant(texte);
  }
}

// Le joueur a-t-il encore droit à un déplacement d'affilée ?
function peutRejouer() {
  return etat.deplacements < MAX_DEPLACEMENTS_AFFILEE;
}

function joueurSuivant(texte) {
  etat.courant = (etat.courant + 1) % etat.joueurs.length;
  etat.deplacements = 0;   // le nouveau joueur repart à zéro
  debutTour(texte);
}

function victoire(j) {
  etat.phase = 'fin';
  afficherPanneau();
  $('texte-fin').textContent = j.robot
    ? `${j.nom} a gagné… Prends ta revanche !`
    : `Bravo ${j.nom}, tu as gagné !`;
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
  niveau.textContent = `(${etiquette(j)})`;
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
    detail.textContent = `${etiquette(autre)} · ${autre.camemberts.size}/${etat.objectif} 🧀`;
    nom.appendChild(detail);
    li.appendChild(nom);
    scores.appendChild(li);
  });
}

// Petit texte décrivant un joueur : « 5e », « Parents » ou « Adversaire moyen ».
function etiquette(j) {
  if (j.robot) return `Adversaire ${j.robot.nom.toLowerCase()}`;
  return j.niveau === 'parents' ? 'Parents' : j.niveau;
}

// Actions retardées (déplacement, réflexion de l'adversaire…).
// On les garde en mémoire pour pouvoir toutes les annuler si on quitte.
let minuteries = [];
function plusTard(action, delai) { minuteries.push(setTimeout(action, delai)); }
function annulerMinuteries() { minuteries.forEach(clearTimeout); minuteries = []; }

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
  annulerMinuteries();
  etat.phase = 'fin';
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
  $('bouton-commencer').onclick = commencerPartie;
  $('bouton-de').onclick = () => { if (!joueur().robot) lancerDe(); };
  $('bouton-rejouer').onclick = retourAccueil;
  $('bouton-quitter').onclick = () => {
    if (confirm('Quitter la partie en cours ?')) retourAccueil();
  };

  // On charge les questions et les progressions, puis on affiche l'accueil
  // (les listes de chapitres en ont besoin).
  await Banque.charger();
  afficherAccueil();
  $('info-chargement').textContent = Banque.messages.join('\n');
  if (Banque.alertes.length > 0) {
    $('alertes').textContent = '⚠ ' + Banque.alertes.join('\n\n⚠ ');
    $('alertes').classList.remove('cache');
  }
  $('bouton-commencer').disabled = false;
  $('bouton-commencer').textContent = 'Commencer la partie';
}

demarrer();
