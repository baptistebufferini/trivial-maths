// =============================================================
// LE DÉ : animation en 3D au centre de l'écran, et bruit de dé.
// Le bruit est fabriqué par le navigateur (aucun fichier son).
// =============================================================

const De = {
  // Points de chaque face, sur une grille 3 × 3 numérotée de 1 à 9 :
  //  1 2 3
  //  4 5 6
  //  7 8 9
  POINTS: { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] },
  // Rotation du dé (en degrés autour des axes X et Y) qui montre chaque face devant.
  ORIENTATION: { 1: [0, 0], 2: [90, 0], 3: [0, -90], 4: [0, 90], 5: [-90, 0], 6: [0, 180] },
  DUREE: 1300,   // durée du lancer, en millisecondes

  // Fabrique les 6 faces du dé (une seule fois).
  construire() {
    const de = $('de3d');
    if (de.children.length) return;
    for (let f = 1; f <= 6; f++) {
      const face = document.createElement('div');
      face.className = `face face-${f}`;
      for (let c = 1; c <= 9; c++) {
        const case_ = document.createElement('span');
        if (this.POINTS[f].includes(c)) case_.className = 'point';
        face.appendChild(case_);
      }
      de.appendChild(face);
    }
  },

  // Lance le dé et montre « valeur ». Appelle « fin » quand c'est terminé.
  lancer(valeur, nomJoueur, fin) {
    this.construire();
    const de = $('de3d'), scene = $('scene-de');
    $('de-qui').textContent = `${nomJoueur} lance le dé…`;
    $('de-resultat').textContent = '';
    ouvrir('fenetre-de');

    // Départ : une position au hasard, sans animation…
    de.style.transition = 'none';
    de.style.transform = `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`;
    scene.classList.remove('lance');
    void de.offsetWidth;   // (oblige le navigateur à prendre en compte la position de départ)
    // … puis plusieurs tours complets jusqu'à la face tirée.
    const [ax, ay] = this.ORIENTATION[valeur];
    const tours = () => 360 * (2 + Math.floor(Math.random() * 2));
    de.style.transition = `transform ${this.DUREE}ms cubic-bezier(.15, .6, .3, 1)`;
    de.style.transform = `rotateX(${ax + tours()}deg) rotateY(${ay + tours()}deg)`;
    scene.classList.add('lance');
    Son.lancerDe(this.DUREE / 1000);

    plusTard(() => { $('de-resultat').textContent = `${valeur} !`; }, this.DUREE);
    plusTard(() => { fermer('fenetre-de'); fin(); }, this.DUREE + 900);
  },
};

// =============================================================
// LES SONS
// =============================================================

const Son = {
  contexte: null,
  actif: (() => { try { return localStorage.getItem('trivial-maths-son') !== 'non'; } catch (e) { return true; } })(),

  basculer() {
    this.actif = !this.actif;
    try { localStorage.setItem('trivial-maths-son', this.actif ? 'oui' : 'non'); } catch (e) { /* tant pis */ }
    return this.actif;
  },

  preparer() {
    if (!this.actif) return null;
    const Contexte = window.AudioContext || window.webkitAudioContext;
    if (!Contexte) return null;
    if (!this.contexte) this.contexte = new Contexte();
    if (this.contexte.state === 'suspended') this.contexte.resume();
    return this.contexte;
  },

  // Un petit choc (le dé qui tape la table) : un bruit très court, filtré.
  choc(instant, force, aigu) {
    const ctx = this.contexte, duree = 0.06;
    const tampon = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duree), ctx.sampleRate);
    const donnees = tampon.getChannelData(0);
    for (let i = 0; i < donnees.length; i++) donnees[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / donnees.length, 4);
    const source = ctx.createBufferSource();
    source.buffer = tampon;
    const filtre = ctx.createBiquadFilter();
    filtre.type = 'bandpass';
    filtre.frequency.value = aigu ? 2500 + Math.random() * 1500 : 700 + Math.random() * 400;
    filtre.Q.value = aigu ? 2 : 1;
    const volume = ctx.createGain();
    volume.gain.value = force;
    source.connect(filtre).connect(volume).connect(ctx.destination);
    source.start(instant);
  },

  // Bruit d'un dé lancé : des cliquetis, et trois rebonds plus forts.
  lancerDe(duree) {
    const ctx = this.preparer();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    for (let t = 0.1; t < duree; t += 0.05 + Math.random() * 0.09) this.choc(t0 + t, 0.25 * (1 - t / duree) + 0.05, true);
    [[0.45, 0.9], [0.75, 0.6], [1, 0.35]].forEach(([part, force]) => {
      this.choc(t0 + part * duree, force, false);
      this.choc(t0 + part * duree + 0.01, force * 0.6, true);
    });
  },
};
