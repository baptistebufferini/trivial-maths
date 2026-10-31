// =============================================================
// OUTILS COMMUNS AUX GÉNÉRATEURS DE QUESTIONS
// Utilisés seulement par outils/generer.html, pour fabriquer les
// questions de banque.xlsx. Le jeu lui-même n'en a pas besoin.
// =============================================================

// ---------- Hasard reproductible ----------
// Une même « graine » donne toujours les mêmes questions : on peut
// relancer la génération sans que tout change.
let graineHasard = 1;
function initHasard(graine) { graineHasard = graine >>> 0; }
function hasard() {
  graineHasard = (graineHasard + 0x6D2B79F5) >>> 0;
  let t = graineHasard;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
// Graine tirée d'un texte (ex. « 4e-REL1 »)
function graineDe(texte) {
  let h = 2166136261;
  for (const c of texte) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
function ent(a, b) { return a + Math.floor(hasard() * (b - a + 1)); }        // entier entre a et b
function entNonNul(a, b) { let n; do { n = ent(a, b); } while (n === 0); return n; }
function choix(liste) { return liste[Math.floor(hasard() * liste.length)]; }
function melangeH(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const k = Math.floor(hasard() * (i + 1));
    [copie[i], copie[k]] = [copie[k], copie[i]];
  }
  return copie;
}

// ---------- Écriture des nombres « à la française » ----------
function arrondi(x, chiffres = 9) { const p = 10 ** chiffres; return Math.round(x * p) / p; }

// 3.5 → « 3,5 » ; -4 → « −4 » ; 12500 → « 12 500 »
function fr(x) {
  x = arrondi(x);
  const [entiere, decimale] = Math.abs(x).toString().split('.');
  const avecEspaces = entiere.length > 4 ? entiere.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : entiere;
  return (x < 0 ? '−' : '') + avecEspaces + (decimale ? ',' + decimale : '');
}
// Met un nombre négatif entre parenthèses : -3 → « (−3) »
function par(x) { return x < 0 ? `(${fr(x)})` : fr(x); }
function pgcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
function ppcm(a, b) { return Math.abs(a * b) / pgcd(a, b); }
// Fraction simplifiée : frac(6, 8) → « 3/4 » ; frac(8, 4) → « 2 »
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = pgcd(n, d) || 1;
  n /= g; d /= g;
  if (d === 1) return fr(n);
  return (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;
}
// Fraction écrite telle quelle (sans simplifier)
function fracBrute(n, d) { return (n < 0 ? '−' : '') + Math.abs(n) + '/' + d; }
function estSimplifiable(n, d) { return pgcd(n, d) > 1; }

// Exposants : sup(3) → « ³ », sup(-2) → « ⁻² »
const EXPOSANTS = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
function sup(n) { return String(n).split('').map(c => EXPOSANTS[c]).join(''); }

// Expression littérale à partir de termes [coefficient, lettre] :
// poly([[3,'x'],[-5,'']]) → « 3x − 5 » ; poly([[1,'x²'],[-1,'x']]) → « x² − x »
function poly(termes) {
  let texte = '';
  for (const [coef, lettre] of termes) {
    if (coef === 0) continue;
    const valeur = Math.abs(coef);
    const corps = lettre ? (valeur === 1 ? lettre : fr(valeur) + lettre) : fr(valeur);
    if (texte === '') texte = (coef < 0 ? '−' : '') + corps;
    else texte += (coef < 0 ? ' − ' : ' + ') + corps;
  }
  return texte || '0';
}

// ---------- QCM ----------
// Garde les premières mauvaises réponses distinctes de la bonne.
function qcm(bonne, candidats, nombre = 3) {
  const vus = new Set([String(bonne)]);
  const faux = [];
  for (const c of candidats) {
    if (faux.length >= nombre) break;
    if (c === undefined || c === null || c === '' || vus.has(String(c))) continue;
    vus.add(String(c));
    faux.push(String(c));
  }
  return faux;
}

// =============================================================
// FIGURES (images SVG)
// =============================================================

function enteteSVG(largeur, hauteur) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${arrondi(largeur, 1)} ${arrondi(hauteur, 1)}" `
    + `width="${arrondi(largeur, 1)}" height="${arrondi(hauteur, 1)}" font-family="Arial, sans-serif" font-size="15">`
    + `<rect width="100%" height="100%" fill="#ffffff"/>`;
}
const r1 = (x) => arrondi(x, 1);
function trait(x1, y1, x2, y2, couleur = '#222', epaisseur = 1.5, extra = '') {
  return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${couleur}" stroke-width="${epaisseur}" ${extra}/>`;
}
function texteSVG(x, y, contenu, options = '') {
  return `<text x="${r1(x)}" y="${r1(y)}" ${options}>${contenu}</text>`;
}
const FLECHE = `<defs><marker id="fleche" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#222"/></marker></defs>`;
const COULEUR_TRACE = '#c2185b';

// Repère avec grille. Options :
//   xmin, xmax, ymin, ymax : fenêtre ; grilleX, grilleY : pas de la grille
//   etiquettesX, etiquettesY : pas des nombres écrits sur les axes
//   unite, uniteY : pixels par unité ; droites : [{ a, b }] (y = ax + b)
//   courbes : [[ [x, y], ... ]] ; points : [{ x, y, nom }]
//   nomX, nomY : légende des axes
function svgRepere(o) {
  const { xmin, xmax, ymin, ymax } = o;
  const gx = o.grilleX || 1, gy = o.grilleY || 1;
  const lx = o.etiquettesX || gx, ly = o.etiquettesY || gy;
  const u = o.unite || Math.min(34, 330 / (xmax - xmin));
  const v = o.uniteY || u;
  const marge = 34;
  const W = (xmax - xmin) * u + 2 * marge, H = (ymax - ymin) * v + 2 * marge;
  const X = x => marge + (x - xmin) * u, Y = y => marge + (ymax - y) * v;
  let s = enteteSVG(W, H) + FLECHE;
  s += `<defs><clipPath id="zone"><rect x="${r1(X(xmin))}" y="${r1(Y(ymax))}" width="${r1((xmax - xmin) * u)}" height="${r1((ymax - ymin) * v)}"/></clipPath></defs>`;
  // Grille
  for (let x = Math.ceil(xmin / gx) * gx; x <= xmax + 1e-9; x += gx) s += trait(X(x), Y(ymin), X(x), Y(ymax), '#dddddd', 1);
  for (let y = Math.ceil(ymin / gy) * gy; y <= ymax + 1e-9; y += gy) s += trait(X(xmin), Y(y), X(xmax), Y(y), '#dddddd', 1);
  // Axes (avec flèches)
  const y0 = Math.min(Math.max(0, ymin), ymax), x0 = Math.min(Math.max(0, xmin), xmax);
  s += trait(X(xmin), Y(y0), X(xmax) + 14, Y(y0), '#222', 1.6, 'marker-end="url(#fleche)"');
  s += trait(X(x0), Y(ymin), X(x0), Y(ymax) - 14, '#222', 1.6, 'marker-end="url(#fleche)"');
  // Nombres sur les axes
  for (let x = Math.ceil(xmin / lx) * lx; x <= xmax + 1e-9; x += lx) {
    if (Math.abs(x) < 1e-9) continue;
    s += trait(X(x), Y(y0) - 4, X(x), Y(y0) + 4);
    s += texteSVG(X(x), Y(y0) + 19, fr(x), 'text-anchor="middle" font-size="13"');
  }
  for (let y = Math.ceil(ymin / ly) * ly; y <= ymax + 1e-9; y += ly) {
    if (Math.abs(y) < 1e-9) continue;
    s += trait(X(x0) - 4, Y(y), X(x0) + 4, Y(y));
    s += texteSVG(X(x0) - 7, Y(y) + 5, fr(y), 'text-anchor="end" font-size="13"');
  }
  s += texteSVG(X(x0) - 7, Y(y0) + 17, '0', 'text-anchor="end" font-size="13"');
  if (o.nomX) s += texteSVG(X(xmax) + 10, Y(y0) - 8, o.nomX, 'text-anchor="end" font-size="13" font-style="italic"');
  if (o.nomY) s += texteSVG(X(x0) + 8, Y(ymax) - 4, o.nomY, 'font-size="13" font-style="italic"');
  // Droites et courbes
  for (const d of (o.droites || [])) {
    s += `<g clip-path="url(#zone)">` + trait(X(xmin), Y(d.a * xmin + d.b), X(xmax), Y(d.a * xmax + d.b), d.couleur || COULEUR_TRACE, 2.5) + `</g>`;
    if (d.nom) s += texteSVG(X(d.xNom), Y(d.a * d.xNom + d.b) - 8, d.nom, `font-weight="bold" fill="${d.couleur || COULEUR_TRACE}"`);
  }
  for (const c of (o.courbes || [])) {
    const pts = c.points.map(([x, y]) => `${r1(X(x))},${r1(Y(y))}`).join(' ');
    s += `<g clip-path="url(#zone)"><polyline points="${pts}" fill="none" stroke="${c.couleur || COULEUR_TRACE}" stroke-width="2.5"/></g>`;
  }
  // Points
  for (const p of (o.points || [])) {
    s += `<circle cx="${r1(X(p.x))}" cy="${r1(Y(p.y))}" r="4" fill="${COULEUR_TRACE}"/>`;
    if (p.nom) s += texteSVG(X(p.x) + 7, Y(p.y) - 7, p.nom, 'font-weight="bold"');
  }
  return s + '</svg>';
}

// Droite graduée de « nb » intervalles. Les nombres sont écrits tous les
// « tousLes » graduations ; un point nommé est placé à la graduation « rang ».
function svgDroiteGraduee(debut, pas, nb, tousLes, rang, nom) {
  const ecart = 34, marge = 30;
  const W = nb * ecart + 2 * marge + 10, H = 80;
  const X = k => marge + k * ecart, yAxe = 42;
  let s = enteteSVG(W, H) + FLECHE;
  s += trait(marge - 10, yAxe, X(nb) + 22, yAxe, '#222', 1.6, 'marker-end="url(#fleche)"');
  for (let k = 0; k <= nb; k++) {
    const ecrit = k % tousLes === 0;
    s += trait(X(k), yAxe - (ecrit ? 9 : 6), X(k), yAxe + (ecrit ? 9 : 6));
    if (ecrit) s += texteSVG(X(k), yAxe + 27, fr(debut + k * pas), 'text-anchor="middle" font-size="14"');
  }
  s += `<path d="M${r1(X(rang) - 7)},${yAxe - 21} L${r1(X(rang) + 7)},${yAxe - 21} L${r1(X(rang))},${yAxe - 9} z" fill="${COULEUR_TRACE}"/>`;
  s += texteSVG(X(rang), yAxe - 26, nom, 'text-anchor="middle" font-weight="bold"');
  return s + '</svg>';
}

// Triangle rectangle : angle droit en bas à gauche, côtés de l'angle droit
// « a » (horizontal) et « b » (vertical). noms = [sommet de l'angle droit,
// bout du côté horizontal, bout du côté vertical] ; etiquettes = [horizontal,
// vertical, hypoténuse] (texte, ou '' pour ne rien écrire).
function svgTriangleRectangle(a, b, noms, etiquettes) {
  const echelle = Math.min(230 / a, 150 / b);
  const L = a * echelle, Hh = b * echelle;
  const ox = 84, oy = 28 + Hh;   // marge à gauche pour écrire la longueur du côté vertical
  const W = ox + L + 56, H = oy + 40;
  const R = [ox, oy], P = [ox + L, oy], Q = [ox, oy - Hh];
  let s = enteteSVG(W, H);
  s += `<polygon points="${R.map(r1)} ${P.map(r1)} ${Q.map(r1)}" fill="#fde7f1" stroke="#222" stroke-width="2"/>`;
  s += `<polyline points="${ox},${r1(oy - 14)} ${ox + 14},${r1(oy - 14)} ${ox + 14},${r1(oy)}" fill="none" stroke="#222" stroke-width="1.5"/>`;
  s += texteSVG(R[0] - 18, R[1] + 18, noms[0], 'font-weight="bold"');
  s += texteSVG(P[0] + 6, P[1] + 18, noms[1], 'font-weight="bold"');
  s += texteSVG(Q[0] - 18, Q[1] - 4, noms[2], 'font-weight="bold"');
  const style = (t) => t === '?' ? `font-weight="bold" fill="${COULEUR_TRACE}"` : '';
  if (etiquettes[0]) s += texteSVG(ox + L / 2, oy + 22, etiquettes[0], 'text-anchor="middle" ' + style(etiquettes[0]));
  if (etiquettes[1]) s += texteSVG(ox - 8, oy - Hh / 2 + 5, etiquettes[1], 'text-anchor="end" ' + style(etiquettes[1]));
  if (etiquettes[2]) s += texteSVG(ox + L / 2 + 10, oy - Hh / 2 - 6, etiquettes[2], style(etiquettes[2]));
  return s + '</svg>';
}

// Rectangle avec ses deux dimensions écrites.
function svgRectangle(largeurTexte, hauteurTexte) {
  let s = enteteSVG(300, 170);
  s += `<rect x="60" y="25" width="190" height="100" fill="#e8f0fb" stroke="#222" stroke-width="2"/>`;
  s += texteSVG(155, 150, largeurTexte, 'text-anchor="middle"');
  s += texteSVG(52, 80, hauteurTexte, 'text-anchor="end"');
  return s + '</svg>';
}

// Diagramme en barres (valeurs entières).
function svgBarres(categories, valeurs, nomY) {
  const max = Math.max(...valeurs);
  const pasY = max > 12 ? 2 : 1;
  const haut = Math.ceil((max + 1) / pasY) * pasY;
  const unite = 190 / haut, largeurBarre = 46, ecart = 22, marge = 46;
  const W = marge + categories.length * (largeurBarre + ecart) + 20, H = 260;
  const Y = y => 220 - y * unite;
  let s = enteteSVG(W, H);
  for (let y = 0; y <= haut; y += pasY) {
    s += trait(marge, Y(y), W - 10, Y(y), y === 0 ? '#222' : '#dddddd', y === 0 ? 1.6 : 1);
    s += texteSVG(marge - 6, Y(y) + 5, fr(y), 'text-anchor="end" font-size="12"');
  }
  s += trait(marge, Y(0), marge, Y(haut) - 6, '#222', 1.6);
  categories.forEach((c, i) => {
    const x = marge + ecart / 2 + i * (largeurBarre + ecart);
    s += `<rect x="${r1(x)}" y="${r1(Y(valeurs[i]))}" width="${largeurBarre}" height="${r1(valeurs[i] * unite)}" fill="#1f6fd1"/>`;
    s += texteSVG(x + largeurBarre / 2, 240, c, 'text-anchor="middle" font-size="13"');
  });
  if (nomY) s += texteSVG(marge - 30, 14, nomY, 'font-size="12" font-style="italic"');
  return s + '</svg>';
}

// Quadrillage avec des points nommés (et éventuellement un vecteur).
// points : [{ x, y, nom }] en unités de la grille (0..largeur, 0..hauteur)
function svgQuadrillage(largeur, hauteur, points, vecteur) {
  const c = 30, marge = 20;
  const W = largeur * c + 2 * marge, H = hauteur * c + 2 * marge;
  const X = x => marge + x * c, Y = y => marge + (hauteur - y) * c;
  let s = enteteSVG(W, H) + FLECHE;
  for (let x = 0; x <= largeur; x++) s += trait(X(x), Y(0), X(x), Y(hauteur), '#d9d9d9', 1);
  for (let y = 0; y <= hauteur; y++) s += trait(X(0), Y(y), X(largeur), Y(y), '#d9d9d9', 1);
  if (vecteur) s += trait(X(vecteur[0][0]), Y(vecteur[0][1]), X(vecteur[1][0]), Y(vecteur[1][1]), COULEUR_TRACE, 2.5, 'marker-end="url(#fleche)"');
  for (const p of points) {
    s += trait(X(p.x) - 5, Y(p.y) - 5, X(p.x) + 5, Y(p.y) + 5, '#222', 2) + trait(X(p.x) - 5, Y(p.y) + 5, X(p.x) + 5, Y(p.y) - 5, '#222', 2);
    s += texteSVG(X(p.x) + 6, Y(p.y) - 7, p.nom, 'font-weight="bold"');
  }
  return s + '</svg>';
}
