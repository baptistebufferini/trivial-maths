// =============================================================
// BANQUE DE QUESTIONS
// Charge les questions et les progressions (fichier data/banque.xlsx),
// puis choisit une question adaptée au niveau et au chapitre du joueur.
// =============================================================

const Banque = {
  questions: [],          // toutes les questions valides
  progressions: {},       // { '5e': [ { chapitre, titre }, ... ], ... } dans l'ordre de l'année
  messages: [],           // informations affichées sur l'accueil
  alertes: [],            // problèmes à signaler (affichés en orange)
  dejaPosees: new Set(),  // pour éviter de reposer la même question

  // Charge tout. Si le fichier Excel est illisible, on prend les
  // données de secours de data/demo.js et on prévient.
  async charger() {
    this.messages = [];
    this.alertes = [];
    let lignesQuestions, lignesProgressions;
    try {
      const onglets = await lireExcel(FICHIER_BANQUE);
      lignesQuestions = onglets.Questions;
      lignesProgressions = onglets.Progressions;
      if (!lignesQuestions) throw new Error('onglet « Questions » introuvable');
      if (!lignesProgressions) throw new Error('onglet « Progressions » introuvable');
      this.messages.push('Banque chargée depuis data/banque.xlsx.');
    } catch (e) {
      this.alertes.push(`Impossible de lire la banque de questions : ${e.message}.\nOn joue avec les questions de démonstration.`);
      lignesQuestions = lireCSV(QUESTIONS_DEMO);
      lignesProgressions = lireCSV(PROGRESSIONS_DEMO);
    }

    // Progressions : on range les chapitres par niveau, dans l'ordre des lignes.
    this.progressions = {};
    for (const l of lignesProgressions) {
      const niveau = l.niveau.toLowerCase();
      if (!l.chapitre) continue;
      (this.progressions[niveau] = this.progressions[niveau] || [])
        .push({ chapitre: l.chapitre, titre: l.titre || l.chapitre });
    }

    // Questions : on écarte (en le signalant) les lignes incomplètes.
    const toutes = lignesQuestions.map(preparerQuestion);
    this.questions = [];
    const ignorees = [];
    for (const q of toutes) {
      const probleme = problemeQuestion(q);
      if (probleme) ignorees.push(`${q.id || '(sans id)'} : ${probleme}`);
      else this.questions.push(q);
    }
    this.messages.push(`${this.questions.length} questions prêtes.`);
    if (ignorees.length > 0) {
      this.alertes.push(`${ignorees.length} question(s) ignorée(s), à corriger dans le fichier Excel :\n• `
        + ignorees.slice(0, 8).join('\n• ') + (ignorees.length > 8 ? '\n• …' : ''));
    }

    // Chapitres des questions absents des progressions (faute de frappe ?)
    const connus = new Set(Object.values(this.progressions).flat().map(c => c.chapitre));
    const inconnus = [...new Set(this.questions
      .filter(q => q.niveau !== 'parents' && !connus.has(q.chapitre))
      .map(q => q.chapitre || '(vide)'))];
    if (inconnus.length > 0) {
      this.alertes.push(`Chapitre(s) absent(s) de l'onglet Progressions : ${inconnus.join(', ')}.\n`
        + 'Les questions de ces chapitres ne sont posées qu\'aux niveaux supérieurs.');
    }
  },

  // Les chapitres d'un niveau, dans l'ordre (liste vide si aucun).
  chapitresDu(niveau) {
    return this.progressions[niveau] || [];
  },

  // D'où vient une question, pour l'afficher au-dessus de l'énoncé :
  // « Question de 5e · 3. Nombres relatifs », « Énigme »…
  origine(q) {
    if (q.theme === THEME_ENIGME.id) return 'Énigme';
    if (q.niveau === 'parents') return 'Question parents';
    const chapitre = this.chapitresDu(q.niveau).find(c => c.chapitre === q.chapitre);
    return `Question de ${q.niveau}` + (chapitre ? ` · ${chapitre.titre}` : '');
  },

  // Cette question peut-elle être posée à ce joueur ?
  // « toutLeNiveau » sert de plan B si aucune question ne convient :
  // on ignore alors le chapitre en cours.
  estAccessible(q, joueur, toutLeNiveau) {
    // Parents : tout le programme (et les énigmes).
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
    if (toutLeNiveau) return true;
    // Année en cours : les chapitres jusqu'au chapitre en cours (inclus).
    const chapitres = this.chapitresDu(joueur.niveau).map(c => c.chapitre);
    const rangQ = chapitres.indexOf(q.chapitre);
    const rangEnCours = chapitres.indexOf(joueur.chapitre);
    return rangQ !== -1 && rangQ <= rangEnCours;
  },

  // Tire au sort une question du thème « themeId » pour ce joueur.
  // Renvoie null s'il n'y en a aucune.
  tirer(joueur, themeId) {
    const theme = themeDuJoueur(joueur, themeId).id;
    const duTheme = this.questions.filter(q => q.theme === theme);

    // On cherche d'abord jusqu'au chapitre en cours, puis dans tout le niveau.
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

// Transforme une ligne brute du fichier en question prête à l'emploi.
// (Majuscules et espaces en trop sont tolérés : « QCM », « 5E »…)
function preparerQuestion(ligne) {
  const minuscule = (texte) => (texte || '').trim().toLowerCase();
  return {
    id: ligne.id,
    theme: minuscule(ligne.theme),
    niveau: minuscule(ligne.niveau),
    programme: minuscule(ligne.programme) || 'commun',
    chapitre: ligne.chapitre,
    enonce: ligne.enonce,
    type: minuscule(ligne.type) === 'qcm' ? 'qcm' : 'saisie',
    reponse: ligne.reponse,
    variantes: (ligne.variantes || '').split(';').map(v => v.trim()).filter(v => v !== ''),
    faux: [ligne.faux1, ligne.faux2, ligne.faux3].filter(f => f),
    correction: ligne.correction,
    image: ligne.image,
  };
}

// Renvoie ce qui ne va pas dans une question, ou null si elle est complète.
function problemeQuestion(q) {
  const themes = [...THEMES.map(t => t.id), THEME_ENIGME.id];
  if (!q.enonce) return 'énoncé vide';
  if (!q.reponse) return 'réponse vide';
  if (!themes.includes(q.theme)) return `thème « ${q.theme} » inconnu`;
  if (![...NIVEAUX, 'parents'].includes(q.niveau)) return `niveau « ${q.niveau} » inconnu`;
  if (q.type === 'qcm' && q.faux.length === 0) return 'QCM sans mauvaise réponse';
  return null;
}

// Le thème réellement joué : pour les parents, « algo » devient « énigmes ».
function themeDuJoueur(joueur, themeId) {
  if (joueur.niveau === 'parents' && themeId === 'algo') return THEME_ENIGME;
  return THEMES.find(t => t.id === themeId);
}
