// =============================================================
// BANQUE DE QUESTIONS
// Charge les questions et les déblocages, puis choisit une question
// adaptée au niveau du joueur.
// =============================================================

const Banque = {
  questions: [],             // toutes les questions chargées
  chapitresDebloques: null,  // ensemble des chapitres cochés par le prof,
                             // ou null si pas de prof : tout est ouvert
  prof: null,                // le prof du lien (?prof=...), s'il existe
  messages: [],              // informations à afficher sur l'accueil
  dejaPosees: new Set(),     // pour éviter de reposer la même question

  // Charge tout. « codeProf » vient du lien (?prof=baptiste), ou null.
  // (Étape 5 : on lira ici les Google Sheets ; pour l'instant, la démo.)
  async charger(codeProf) {
    this.questions = lireCSV(QUESTIONS_DEMO).map(preparerQuestion);
    this.messages.push(`${this.questions.length} questions de démonstration chargées.`);

    if (!codeProf) {
      this.messages.push('Pas de lien prof : tous les chapitres sont ouverts.');
      return;
    }
    this.prof = PROFS[codeProf];
    const csv = DEBLOCAGES_DEMO[codeProf];
    if (!this.prof || !csv) {
      this.messages.push(`Prof « ${codeProf} » inconnu : tous les chapitres sont ouverts.`);
      return;
    }
    const coches = lireCSV(csv).filter(l => estCoche(l.debloque));
    this.chapitresDebloques = new Set(coches.map(l => l.chapitre));
    this.messages.push(`Chapitres débloqués par ${this.prof.nom} : ${coches.length}.`);
  },

  // Cette question peut-elle être posée à ce joueur ?
  // « ignorerDeblocages » sert de plan B si aucune question ne convient.
  estAccessible(q, joueur, ignorerDeblocages) {
    // Parents : tout le programme, débloqué ou non (et les énigmes).
    if (joueur.niveau === 'parents') return true;
    // Les questions « parents » (énigmes) sont réservées aux parents.
    const rangJoueur = NIVEAUX.indexOf(joueur.niveau);
    const rangQuestion = NIVEAUX.indexOf(q.niveau);
    if (rangQuestion === -1 || rangQuestion > rangJoueur) return false;
    // Bon programme (ancien / nouveau) ?
    const programme = PROGRAMME_PAR_NIVEAU[joueur.niveau];
    if (q.programme !== 'commun' && q.programme !== programme) return false;
    // Années précédentes : toujours accessibles.
    if (rangQuestion < rangJoueur) return true;
    // Année en cours : seulement les chapitres débloqués par le prof.
    return ignorerDeblocages
      || this.chapitresDebloques === null
      || this.chapitresDebloques.has(q.chapitre);
  },

  // Tire au sort une question du thème « themeId » pour ce joueur.
  // Renvoie null s'il n'y en a aucune.
  tirer(joueur, themeId) {
    const theme = themeDuJoueur(joueur, themeId).id;
    const duTheme = this.questions.filter(q => q.theme === theme);

    // On cherche d'abord en respectant les déblocages, puis sans.
    let possibles = duTheme.filter(q => this.estAccessible(q, joueur, false));
    if (possibles.length === 0) possibles = duTheme.filter(q => this.estAccessible(q, joueur, true));
    if (possibles.length === 0) return null;

    // On évite les questions déjà posées pendant la partie.
    // Quand elles y sont toutes passées, on recommence.
    let neuves = possibles.filter(q => !this.dejaPosees.has(q.id));
    if (neuves.length === 0) {
      possibles.forEach(q => this.dejaPosees.delete(q.id));
      neuves = possibles;
    }
    const question = neuves[Math.floor(Math.random() * neuves.length)];
    this.dejaPosees.add(question.id);
    return question;
  },
};

// Transforme une ligne brute du tableur en question prête à l'emploi.
function preparerQuestion(ligne) {
  return {
    id: ligne.id,
    theme: ligne.theme,
    niveau: ligne.niveau,
    programme: ligne.programme || 'commun',
    chapitre: ligne.chapitre,
    enonce: ligne.enonce,
    type: ligne.type === 'qcm' ? 'qcm' : 'saisie',
    reponse: ligne.reponse,
    variantes: (ligne.variantes || '').split(';').map(v => v.trim()).filter(v => v !== ''),
    faux: [ligne.faux1, ligne.faux2, ligne.faux3].filter(f => f),
    correction: ligne.correction,
    image: ligne.image,
  };
}

// Une case à cocher Google Sheets donne TRUE ou FALSE.
// On accepte aussi VRAI, oui, x et 1 si le prof les tape à la main.
function estCoche(valeur) {
  return ['true', 'vrai', 'oui', 'x', '1'].includes(String(valeur).trim().toLowerCase());
}

// Le thème réellement joué : pour les parents, « algo » devient « énigmes ».
function themeDuJoueur(joueur, themeId) {
  if (joueur.niveau === 'parents' && themeId === 'algo') return THEME_ENIGME;
  return THEMES.find(t => t.id === themeId);
}
