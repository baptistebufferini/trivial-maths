// =============================================================
// LE PLATEAU EN ROUE
// - un anneau extérieur de 35 cases : 5 cases camembert, et entre
//   deux camemberts 6 cases (dont une case « Rejouer ») ;
// - 5 rayons de 5 cases qui relient chaque camembert au centre ;
// - le centre, où tout le monde démarre.
// Le dessin est en SVG : une image faite de formes, qui reste nette
// sur le tableau numérique comme sur un téléphone.
// =============================================================

const Plateau = {
  cases: {},       // toutes les cases, rangées par identifiant
  svg: null,       // l'image du plateau dans la page
  surClic: null,   // fonction appelée quand on clique sur une case

  // Dimensions du dessin (l'image fait 1000 × 1000 unités).
  C: 500,                  // centre
  NB_ANNEAU: 35,           // cases de l'anneau
  ANNEAU_INT: 395, ANNEAU_EXT: 480,   // rayons de l'anneau
  CAMEMBERT_INT: 375, CAMEMBERT_EXT: 497,
  RAYON_CENTRE: 110,
  LONGUEUR_CASE_RAYON: 53,

  // ---------- 1) Construction des cases et de leurs liaisons ----------
  construire() {
    this.cases = {};
    const pas = 360 / this.NB_ANNEAU;
    // Dans chaque portion entre deux camemberts : décalage de couleur
    // de chaque case (null = case « Rejouer »).
    const decalages = [0, 1, 2, null, 3, 4, 0];

    // L'anneau
    for (let k = 0; k < this.NB_ANNEAU; k++) {
      const portion = Math.floor(k / 7);   // numéro du camembert précédent (0 à 4)
      const rang = k % 7;                  // position dans la portion
      const angle = -90 + k * pas;         // en degrés, la case 0 est en haut
      let type = 'normale';
      let theme = null;
      if (rang === 0) { type = 'camembert'; theme = THEMES[portion].id; }
      else if (decalages[rang] === null) { type = 'rejouer'; }
      else { theme = THEMES[(portion + decalages[rang]) % 5].id; }
      const r = (this.ANNEAU_INT + this.ANNEAU_EXT) / 2;
      this.ajouterCase(`a${k}`, type, theme, angle, r);
    }
    // Liaisons de l'anneau : chaque case touche la précédente et la suivante.
    for (let k = 0; k < this.NB_ANNEAU; k++) {
      this.relier(`a${k}`, `a${(k + 1) % this.NB_ANNEAU}`);
    }

    // Le centre
    this.ajouterCase('centre', 'centre', null, 0, 0);

    // Les 5 rayons
    THEMES.forEach((t, i) => {
      const angle = -90 + i * 72;
      for (let j = 0; j < 5; j++) {
        const r = this.CAMEMBERT_INT - (j + 0.5) * this.LONGUEUR_CASE_RAYON;
        this.ajouterCase(`r${i}_${j}`, 'normale', THEMES[(i + 1 + j) % 5].id, angle, r);
        // chaque case du rayon touche la précédente (ou le camembert)
        this.relier(`r${i}_${j}`, j === 0 ? `a${i * 7}` : `r${i}_${j - 1}`);
      }
      this.relier(`r${i}_4`, 'centre');
    });
  },

  ajouterCase(id, type, theme, angle, rayon) {
    const rad = angle * Math.PI / 180;
    this.cases[id] = {
      id, type, theme, angle,
      x: this.C + rayon * Math.cos(rad),
      y: this.C + rayon * Math.sin(rad),
      voisins: [],
    };
  },

  relier(id1, id2) {
    this.cases[id1].voisins.push(id2);
    this.cases[id2].voisins.push(id1);
  },

  // ---------- 2) Déplacements ----------
  // Renvoie les cases où l'on peut arriver en faisant exactement « n » pas
  // depuis « depart », sans faire demi-tour en chemin (règle du Trivial).
  destinations(depart, n) {
    const trouvees = new Set();
    const explorer = (id, precedente, reste) => {
      if (reste === 0) { trouvees.add(id); return; }
      for (const voisine of this.cases[id].voisins) {
        if (voisine !== precedente) explorer(voisine, id, reste - 1);
      }
    };
    explorer(depart, null, n);
    return [...trouvees];
  },

  // ---------- 3) Dessin ----------
  dessiner(svg) {
    this.svg = svg;
    svg.innerHTML = '';
    // Fond
    svg.appendChild(creerSVG('circle', { cx: this.C, cy: this.C, r: 499, class: 'fond-plateau' }));

    const pas = 360 / this.NB_ANNEAU;
    for (const c of Object.values(this.cases)) {
      const groupe = creerSVG('g', { class: 'case', 'data-id': c.id });
      const couleur = c.theme ? THEMES.find(t => t.id === c.theme).couleur : null;

      if (c.id === 'centre') {
        // Le centre : une rosace aux 5 couleurs
        THEMES.forEach((t, i) => {
          const a = -90 + i * 72;
          groupe.appendChild(creerSVG('path', {
            d: cheminSecteur(this.C, this.C, 0, this.RAYON_CENTRE, a - 36, a + 36),
            fill: t.couleur, class: 'forme',
          }));
        });
        groupe.appendChild(creerSVG('circle', { cx: this.C, cy: this.C, r: 58, fill: '#fff' }));
        groupe.appendChild(creerTexte(this.C, this.C - 8, 'Au', 'texte-centre'));
        groupe.appendChild(creerTexte(this.C, this.C + 20, 'choix', 'texte-centre'));
      } else if (c.id.startsWith('a')) {
        // Case de l'anneau : une portion de couronne
        const camembert = c.type === 'camembert';
        const rInt = camembert ? this.CAMEMBERT_INT : this.ANNEAU_INT;
        const rExt = camembert ? this.CAMEMBERT_EXT : this.ANNEAU_EXT;
        const demiLargeur = camembert ? pas * 0.62 : pas / 2;
        groupe.appendChild(creerSVG('path', {
          d: cheminSecteur(this.C, this.C, rInt, rExt, c.angle - demiLargeur, c.angle + demiLargeur),
          fill: couleur || '#f1f1f1', class: 'forme',
        }));
      } else {
        // Case d'un rayon : un rectangle tourné dans l'axe du rayon
        const l = this.LONGUEUR_CASE_RAYON - 4;
        groupe.appendChild(creerSVG('rect', {
          x: -34, y: -l / 2, width: 68, height: l, rx: 6,
          transform: `translate(${c.x} ${c.y}) rotate(${c.angle + 90})`,
          fill: couleur, class: 'forme',
        }));
      }

      // Symbole sur la case
      if (c.type === 'camembert') {
        groupe.appendChild(creerSVG('circle', { cx: c.x, cy: c.y, r: 30, fill: '#fff' }));
        groupe.appendChild(creerTexte(c.x, c.y, THEMES.find(t => t.id === c.theme).icone, 'icone-camembert', couleur));
      } else if (c.type === 'rejouer') {
        groupe.appendChild(creerTexte(c.x, c.y, '↻', 'icone-rejouer'));
      } else if (c.type === 'normale') {
        groupe.appendChild(creerTexte(c.x, c.y, THEMES.find(t => t.id === c.theme).icone, 'icone-case'));
      }

      groupe.addEventListener('click', () => { if (this.surClic) this.surClic(c.id); });
      svg.appendChild(groupe);
    }
    // Calque des pions, dessiné par-dessus les cases
    svg.appendChild(creerSVG('g', { id: 'pions' }));
  },

  // Fait clignoter les cases accessibles (liste vide = plus rien).
  surligner(ids) {
    this.svg.classList.toggle('mode-choix', ids.length > 0);
    this.svg.querySelectorAll('.case').forEach(g => {
      g.classList.toggle('accessible', ids.includes(g.dataset.id));
    });
  },

  // Place (ou déplace) les pions de tous les joueurs.
  placerPions(joueurs) {
    const calque = this.svg.querySelector('#pions');
    joueurs.forEach((j, n) => {
      let pion = calque.querySelector(`[data-joueur="${n}"]`);
      if (!pion) {
        pion = creerSVG('g', { class: 'pion', 'data-joueur': n });
        pion.appendChild(creerSVG('circle', { r: 24, fill: j.pion.couleur }));
        pion.appendChild(creerTexte(0, 1, j.nom.charAt(0).toUpperCase(), 'initiale', j.pion.texte));
        calque.appendChild(pion);
      }
      // Si plusieurs pions sont sur la même case, on les écarte un peu.
      const memeCase = joueurs.filter(autre => autre.position === j.position);
      const rang = memeCase.indexOf(j);
      let dx = 0, dy = 0;
      if (memeCase.length > 1) {
        const a = (rang / memeCase.length) * 2 * Math.PI;
        dx = 22 * Math.cos(a);
        dy = 22 * Math.sin(a);
      }
      const c = this.cases[j.position];
      pion.style.transform = `translate(${c.x + dx}px, ${c.y + dy}px)`;
    });
  },
};

// ---------- Petits outils de dessin ----------

// Crée un élément SVG avec ses attributs.
function creerSVG(balise, attributs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', balise);
  for (const [nom, valeur] of Object.entries(attributs)) el.setAttribute(nom, valeur);
  return el;
}

// Crée un texte centré en (x, y).
function creerTexte(x, y, contenu, classe, couleur) {
  const t = creerSVG('text', { x, y, class: classe, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
  if (couleur) t.setAttribute('fill', couleur);
  t.textContent = contenu;
  return t;
}

// Chemin SVG d'une portion de couronne (ou de disque si rInt = 0),
// entre les angles a1 et a2 (en degrés).
function cheminSecteur(cx, cy, rInt, rExt, a1, a2) {
  const point = (r, a) => {
    const rad = a * Math.PI / 180;
    return `${cx + r * Math.cos(rad)} ${cy + r * Math.sin(rad)}`;
  };
  const grandArc = a2 - a1 > 180 ? 1 : 0;
  if (rInt === 0) {
    return `M ${cx} ${cy} L ${point(rExt, a1)} A ${rExt} ${rExt} 0 ${grandArc} 1 ${point(rExt, a2)} Z`;
  }
  return `M ${point(rExt, a1)} A ${rExt} ${rExt} 0 ${grandArc} 1 ${point(rExt, a2)} `
       + `L ${point(rInt, a2)} A ${rInt} ${rInt} 0 ${grandArc} 0 ${point(rInt, a1)} Z`;
}

// Petit dessin du « camembert » d'un joueur : 5 parts, colorées si gagnées.
function dessinCamembert(joueur) {
  let parts = '';
  THEMES.forEach((t, i) => {
    const a = -90 + i * 72;
    const gagne = joueur.camemberts.has(t.id);
    const couleur = themeDuJoueur(joueur, t.id).couleur;
    parts += `<path d="${cheminSecteur(50, 50, 0, 46, a, a + 72)}" fill="${gagne ? couleur : '#e4e4e4'}" stroke="#fff" stroke-width="3"/>`;
  });
  return `<svg viewBox="0 0 100 100" class="mini-camembert" aria-hidden="true">${parts}</svg>`;
}
