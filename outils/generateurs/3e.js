// =============================================================
// GÉNÉRATEURS DE QUESTIONS DE 3e
// Même principe que 4e.js. Certains types de 4e sont repris en
// révision (fonction « reprendre »), avec d'autres valeurs.
// =============================================================

GENERATEURS['3e'] = [];
const G3 = GENERATEURS['3e'];

// Reprend un générateur de 4e, rangé dans un chapitre de 3e.
function reprendre(code4e, nouveauCode, theme, chapitre, nombre) {
  const g = GENERATEURS['4e'].find(x => x.code === code4e);
  G3.push({ code: nouveauCode, theme, chapitre, nombre, creer: g.creer });
}

// Écrit une liste : [−2, 3] → « −2 et 3 » ; [1, 2, 4] → « 1, 2 et 4 »
function enListe(nombres) {
  const t = nombres.map(fr);
  return t.length === 1 ? t[0] : t.slice(0, -1).join(', ') + ' et ' + t[t.length - 1];
}

// =============================================================
// FONCTIONS — Notion de fonction (3e-notion-fonction)
// =============================================================

// Courbe au hasard : des valeurs entières aux abscisses −4 à 4.
function courbeAuHasard() {
  let ys, essais = 0;
  do {
    ys = [ent(-3, 3)];
    for (let i = 1; i < 9; i++) ys.push(Math.max(-4, Math.min(4, ys[i - 1] + choix([-2, -1, -1, 0, 1, 1, 2]))));
  } while (new Set(ys).size < 5 && ++essais < 30);
  return ys.map((y, i) => [i - 4, y]);
}
function svgFonction(points) {
  return svgRepere({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, unite: 27, nomX: 'x', nomY: 'y', courbes: [{ points: courbeLisse(points) }] });
}
// Antécédents de k lisibles exactement (aux points de la grille), ou null.
function antecedentsExacts(points, k) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i][1] - k, b = points[i + 1][1] - k;
    if (a * b < 0 || (a === 0 && b === 0)) return null;
  }
  return points.filter(p => p[1] === k).map(p => p[0]);
}

G3.push({ code: 'FON1', theme: 'donnees', chapitre: '3e-notion-fonction', nombre: 12, creer() {
  const pts = courbeAuHasard(), [x, y] = choix(pts);
  const formulation = hasard() < 0.5 ? `Quelle est l'image de ${fr(x)} par f ?` : `Lire f(${fr(x)}).`;
  return { enonce: `La courbe ci-dessous représente une fonction f. ${formulation}`, reponse: fr(y), svg: svgFonction(pts),
    correction: `On part de ${fr(x)} sur l'axe des abscisses, on va verticalement jusqu'à la courbe, puis on lit l'ordonnée : f(${fr(x)}) = ${fr(y)}.` };
} });

G3.push({ code: 'FON2', theme: 'donnees', chapitre: '3e-notion-fonction', nombre: 12, creer() {
  const pts = courbeAuHasard(), k = ent(-3, 3);
  const ant = antecedentsExacts(pts, k);
  if (!ant || ant.length === 0) return null;
  const bonne = enListe(ant);
  const image = pts.find(p => p[0] === k);
  const autres = [
    image ? fr(image[1]) : null,                         // confusion image / antécédent
    ant.length > 1 ? enListe(ant.slice(1)) : enListe([ant[0] + 1]),
    enListe(ant.map(a => -a).sort((p, q) => p - q)),
    enListe([...ant, ant[ant.length - 1] + 2].filter(a => a <= 4)),
  ];
  return { enonce: `La courbe représente une fonction f. Quel(s) est (sont) le(s) antécédent(s) de ${fr(k)} par f ?`, reponse: bonne, faux: qcm(bonne, autres), svg: svgFonction(pts),
    correction: `On repère ${fr(k)} sur l'axe des ordonnées et on trace la droite horizontale y = ${fr(k)}. Elle coupe la courbe ${ant.length === 1 ? 'en un point d\'abscisse' : 'en des points d\'abscisses'} ${bonne} : ${ant.length === 1 ? 'c\'est l\'antécédent' : 'ce sont les antécédents'} de ${fr(k)}.` };
} });

G3.push({ code: 'FON3', theme: 'donnees', chapitre: '3e-notion-fonction', nombre: 8, creer() {
  const xs = melangeH([-3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 5).sort((a, b) => a - b);
  const a = entNonNul(-3, 3), b = ent(-4, 4), carre = hasard() < 0.4;
  const f = (x) => carre ? x * x + b : a * x + b;
  const ys = xs.map(f);
  const svg = svgTableau('x', xs.map(fr), 'f(x)', ys.map(fr));
  const i = ent(0, 4);
  if (hasard() < 0.5) return { enonce: `Voici un tableau de valeurs d'une fonction f. Quelle est l'image de ${fr(xs[i])} par f ?`, reponse: fr(ys[i]), svg,
    correction: `L'image se lit sur la 2e ligne, sous ${fr(xs[i])} : f(${fr(xs[i])}) = ${fr(ys[i])}.` };
  const j = ys.findIndex((y, k) => ys.indexOf(y) === k && ys.lastIndexOf(y) === k && k === i);
  if (j < 0) return null;
  return { enonce: `Voici un tableau de valeurs d'une fonction f. D'après ce tableau, quel nombre a pour image ${fr(ys[i])} ?`, reponse: fr(xs[i]), svg,
    correction: `On cherche ${fr(ys[i])} sur la 2e ligne (les images), puis on lit au-dessus : f(${fr(xs[i])}) = ${fr(ys[i])}, donc ${fr(xs[i])} est un antécédent de ${fr(ys[i])}.` };
} });

G3.push({ code: 'FON4', theme: 'donnees', chapitre: '3e-notion-fonction', nombre: 8, creer() {
  const x = entNonNul(-4, 4), a = ent(1, 3), b = entNonNul(-6, 6), c = ent(-9, 9);
  const expr = poly([[a, 'x²'], [b, 'x'], [c, '']]);
  const v = a * x * x + b * x + c;
  return { enonce: `f(x) = ${expr}. Calculer f(${fr(x)}).`, reponse: fr(v),
    correction: `On remplace x par ${fr(x)} : ${a === 1 ? '' : a + ' × '}${par(x)}² ${b < 0 ? '−' : '+'} ${Math.abs(b)} × ${par(x)}${c ? ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}` : ''} = ${fr(a * x * x)} ${b * x < 0 ? '−' : '+'} ${Math.abs(b * x)}${c ? ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}` : ''} = ${fr(v)}.` };
} });

G3.push({ code: 'FON5', theme: 'donnees', chapitre: '3e-notion-fonction', nombre: 6, creer() {
  const a = entNonNul(-6, 9), b = entNonNul(-6, 9);
  if (a === b) return null;
  if (hasard() < 0.5) {
    const bonne = `${fr(b)} est l'image de ${fr(a)} par f`;
    return { enonce: `On sait que f(${fr(a)}) = ${fr(b)}. Quelle phrase est vraie ?`, reponse: bonne,
      faux: [`${fr(a)} est l'image de ${fr(b)} par f`, `${fr(b)} est un antécédent de ${fr(a)} par f`, `${fr(a)} a pour image ${fr(a)} par f`],
      correction: `f(${fr(a)}) = ${fr(b)} se lit « f de ${fr(a)} égale ${fr(b)} » : ${fr(b)} est l'image de ${fr(a)}, et ${fr(a)} est un antécédent de ${fr(b)}.` };
  }
  const bonne = `f(${fr(a)}) = ${fr(b)}`;
  return { enonce: `Dire que ${fr(a)} est un antécédent de ${fr(b)} par f, c'est dire que…`, reponse: bonne,
    faux: [`f(${fr(b)}) = ${fr(a)}`, `f(${fr(a)}) = ${fr(a)}`, `f(${fr(b)}) = ${fr(b)}`],
    correction: `Un antécédent est un nombre de départ : ${fr(a)} a pour image ${fr(b)}, c'est-à-dire f(${fr(a)}) = ${fr(b)}.` };
} });

// =============================================================
// FONCTIONS — Fonctions affines et linéaires (3e-fonctions-affines)
// =============================================================

const COULEURS_DROITES = ['#c2185b', '#1f6fd1', '#2a9d4b'];
const ecrireAffine = (a, b) => `f(x) = ${poly([[a, 'x'], [b, '']])}`;

// Place le nom d'une droite là où elle est bien séparée des autres droites
// (et loin des noms déjà placés), de préférence vers les bords.
function abscisseNom(d, toutes, dejaPrises) {
  for (const x of [...melangeH([-4, 4, -3.5, 3.5]), ...melangeH([-3, 3, -2.5, 2.5, -2, 2])]) {
    const y = d.a * x + d.b;
    if (Math.abs(y) > 4.2) continue;
    if (toutes.some(o => o !== d && Math.abs(o.a * x + o.b - y) < 1.4)) continue;
    if (dejaPrises.some(p => Math.abs(p[0] - x) < 1.5 && Math.abs(p[1] - y) < 1.5)) continue;
    dejaPrises.push([x, y]);
    return x;
  }
  return null;
}

G3.push({ code: 'AFF1', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 10, creer() {
  const droites = [];
  while (droites.length < 3) {
    const a = choix([-3, -2, -1, 1, 2, 3, 0.5, -0.5]), b = ent(-3, 3);
    if (!droites.some(d => d.a === a && d.b === b)) droites.push({ a, b });
  }
  const prises = [];
  droites.forEach((d, i) => { d.couleur = COULEURS_DROITES[i]; d.nom = `d${i + 1}`; d.xNom = abscisseNom(d, droites, prises); });
  if (droites.some(d => d.xNom === null)) return null;
  const k = ent(0, 2), cible = droites[k];
  return { enonce: `Quelle droite représente la fonction ${ecrireAffine(cible.a, cible.b)} ?`, reponse: cible.nom,
    faux: droites.filter((_, i) => i !== k).map(d => d.nom),
    svg: svgRepere({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, unite: 27, nomX: 'x', nomY: 'y', droites }),
    correction: `La droite passe par le point (0 ; ${fr(cible.b)}) (ordonnée à l'origine ${fr(cible.b)}) et, quand x augmente de 1, y ${cible.a > 0 ? 'augmente' : 'diminue'} de ${fr(Math.abs(cible.a))} (coefficient directeur ${fr(cible.a)}). C'est la droite ${cible.nom}.` };
} });

G3.push({ code: 'AFF2', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 8, creer() {
  const a = choix([-3, -2, -1, 1, 2, 3]), b = ent(-3, 3);
  const svg = svgRepere({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, unite: 27, nomX: 'x', nomY: 'y', droites: [{ a, b }] });
  if (hasard() < 0.5) return { enonce: 'La droite représente une fonction affine f. Quelle est son ordonnée à l\'origine ?', reponse: fr(b), svg,
    correction: `L'ordonnée à l'origine se lit là où la droite coupe l'axe des ordonnées : au point (0 ; ${fr(b)}). Elle vaut ${fr(b)}.` };
  return { enonce: 'La droite représente une fonction affine f. Quel est son coefficient directeur ?', reponse: fr(a), svg,
    correction: `À partir d'un point de la droite, on avance de 1 vers la droite : on ${a > 0 ? 'monte' : 'descend'} de ${Math.abs(a)} pour retrouver la droite. Le coefficient directeur vaut ${fr(a)}.` };
} });

G3.push({ code: 'AFF3', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 7, creer() {
  const a = choix([-3, -2, -1, 1, 2, 3]), b = entNonNul(-3, 3);
  if (Math.abs(a) === Math.abs(b)) return null;
  const bonne = ecrireAffine(a, b);
  return { enonce: 'Quelle est l\'expression de la fonction représentée par cette droite ?', reponse: bonne,
    faux: qcm(bonne, [ecrireAffine(b, a), ecrireAffine(-a, b), ecrireAffine(a, -b), ecrireAffine(-a, -b)]),
    svg: svgRepere({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, unite: 27, nomX: 'x', nomY: 'y', droites: [{ a, b }] }),
    correction: `La droite coupe l'axe des ordonnées en ${fr(b)} (ordonnée à l'origine), et elle ${a > 0 ? 'monte' : 'descend'} de ${Math.abs(a)} quand x augmente de 1 (coefficient ${fr(a)}). Donc ${bonne}.` };
} });

G3.push({ code: 'AFF4', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 6, creer() {
  const a = choix([-1, 1]) * ent(2, 7), b = choix([-1, 1]) * ent(1, 9);
  const [expr, bonne, explication] = choix([
    [`f(x) = ${fr(a)}x`, 'linéaire', `elle est de la forme ax avec a = ${fr(a)}`],
    [ecrireAffine(a, b), 'affine non linéaire', `elle est de la forme ax + b avec a = ${fr(a)} et b = ${fr(b)} ≠ 0`],
    [`f(x) = ${fr(b)}`, 'constante', 'elle donne toujours la même image'],
    [`f(x) = x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, 'ni affine, ni linéaire', 'elle contient x²'],
    [`f(x) = ${Math.abs(a)}/x`, 'ni affine, ni linéaire', 'x est au dénominateur'],
  ]);
  return { enonce: `La fonction ${expr} est…`, reponse: bonne, faux: qcm(bonne, ['linéaire', 'affine non linéaire', 'constante', 'ni affine, ni linéaire']),
    correction: `Cette fonction est ${bonne} : ${explication}.` };
} });

G3.push({ code: 'AFF5', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 7, creer() {
  const a = entNonNul(-6, 6), b = entNonNul(-9, 9), x = entNonNul(-6, 6);
  if (Math.abs(a) === 1) return null;
  const y = a * x + b;
  if (hasard() < 0.5) return { enonce: `${ecrireAffine(a, b)}. Calculer l'image de ${fr(x)}.`, reponse: fr(y),
    correction: `f(${fr(x)}) = ${fr(a)} × ${par(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(a * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(y)}.` };
  return { enonce: `${ecrireAffine(a, b)}. Quel est l'antécédent de ${fr(y)} ?`, reponse: fr(x),
    correction: `On résout ${poly([[a, 'x'], [b, '']])} = ${fr(y)} : ${fr(a)}x = ${fr(y - b)}, donc x = ${fr(y - b)} ÷ ${par(a)} = ${fr(x)}.` };
} });

G3.push({ code: 'AFF6', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 5, creer() {
  const a = entNonNul(-4, 5), b = ent(-6, 6), x1 = ent(-3, 2), x2 = x1 + ent(1, 4);
  const y1 = a * x1 + b, y2 = a * x2 + b;
  return { enonce: `f est une fonction affine avec f(${fr(x1)}) = ${fr(y1)} et f(${fr(x2)}) = ${fr(y2)}. Quel est son coefficient directeur ?`, reponse: fr(a),
    correction: `a = (f(${fr(x2)}) − f(${fr(x1)})) ÷ (${fr(x2)} − ${par(x1)}) = (${fr(y2)} − ${par(y1)}) ÷ ${fr(x2 - x1)} = ${fr(y2 - y1)} ÷ ${fr(x2 - x1)} = ${fr(a)}.` };
} });

G3.push({ code: 'AFF7', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 5, creer() {
  const a = choix([-1, 1]) * choix([2, 3, 4, 5, 1.5, 2.5]), m = ent(2, 8), n = a * m;
  if (hasard() < 0.5) return { enonce: `f est une fonction linéaire telle que f(${m}) = ${fr(n)}. Quel est son coefficient ?`, reponse: fr(a),
    correction: `f(x) = ax, donc a × ${m} = ${fr(n)} et a = ${fr(n)} ÷ ${m} = ${fr(a)}.` };
  const p = ent(2, 10);
  return { enonce: `f est une fonction linéaire telle que f(${m}) = ${fr(n)}. Calculer f(${p}).`, reponse: fr(a * p),
    correction: `Le coefficient est ${fr(n)} ÷ ${m} = ${fr(a)}, donc f(x) = ${fr(a)}x et f(${p}) = ${fr(a)} × ${p} = ${fr(a * p)}.` };
} });

G3.push({ code: 'AFF8', theme: 'donnees', chapitre: '3e-fonctions-affines', nombre: 4, creer() {
  const a = entNonNul(-6, 6), b = ent(-9, 9);
  const bonne = a > 0 ? 'croissante' : 'décroissante';
  return { enonce: `La fonction ${ecrireAffine(a, b)} est…`, reponse: bonne, faux: qcm(bonne, ['croissante', 'décroissante', 'constante']),
    correction: `Le coefficient directeur est ${fr(a)}, ${a > 0 ? 'positif : la fonction est croissante (la droite monte)' : 'négatif : la fonction est décroissante (la droite descend)'}.` };
} });

// =============================================================
// NOMBRES — Expressions algébriques (3e-expr-alg-1 à -4)
// =============================================================

G3.push({ code: 'EXP1', theme: 'nombres', chapitre: '3e-expr-alg-1', nombre: 10, creer() {
  const a = ent(1, 9), forme = ent(1, 3);
  if (forme === 1) {
    const bonne = poly([[1, 'x²'], [2 * a, 'x'], [a * a, '']]);
    return { enonce: `Développer (x + ${a})²`, reponse: bonne,
      faux: qcm(bonne, [poly([[1, 'x²'], [a * a, '']]), poly([[1, 'x²'], [a, 'x'], [a * a, '']]), poly([[1, 'x²'], [2 * a, 'x'], [2 * a, '']])]),
      correction: `Identité remarquable (a + b)² = a² + 2ab + b² : (x + ${a})² = x² + 2 × x × ${a} + ${a}² = ${bonne}.` };
  }
  if (forme === 2) {
    const bonne = poly([[1, 'x²'], [-2 * a, 'x'], [a * a, '']]);
    return { enonce: `Développer (x − ${a})²`, reponse: bonne,
      faux: qcm(bonne, [poly([[1, 'x²'], [-a * a, '']]), poly([[1, 'x²'], [-2 * a, 'x'], [-a * a, '']]), poly([[1, 'x²'], [a * a, '']])]),
      correction: `Identité remarquable (a − b)² = a² − 2ab + b² : (x − ${a})² = x² − 2 × x × ${a} + ${a}² = ${bonne}.` };
  }
  const bonne = poly([[1, 'x²'], [-a * a, '']]);
  return { enonce: `Développer (x + ${a})(x − ${a})`, reponse: bonne,
    faux: qcm(bonne, [poly([[1, 'x²'], [a * a, '']]), poly([[1, 'x²'], [-2 * a, 'x'], [-a * a, '']]), poly([[1, 'x²'], [-2 * a, '']])]),
    correction: `Identité remarquable (a + b)(a − b) = a² − b² : (x + ${a})(x − ${a}) = x² − ${a}² = ${bonne}.` };
} });

G3.push({ code: 'EXP2', theme: 'nombres', chapitre: '3e-expr-alg-1', nombre: 4, creer() {
  const a = ent(2, 9), b = ent(2, 9);
  const bonne = poly([[-a, ''], [b, 'x']]);
  return { enonce: `Écrire sans parenthèses : −(${a} − ${b}x)`, reponse: bonne,
    faux: qcm(bonne, [poly([[-a, ''], [-b, 'x']]), poly([[a, ''], [b, 'x']]), poly([[a, ''], [-b, 'x']])]),
    correction: `Le signe − devant la parenthèse change le signe de chaque terme : −(${a} − ${b}x) = −${a} + ${b}x.` };
} });

G3.push({ code: 'EXP3', theme: 'nombres', chapitre: '3e-expr-alg-1', nombre: 5, creer() {
  const k = ent(2, 6), a = ent(1, 6), m = ent(2, 5), b = entNonNul(-6, 6);
  const cx = k - m, cc = k * a - m * b;
  if (cx === 0) return null;
  const bonne = poly([[cx, 'x'], [cc, '']]);
  return { enonce: `Développer et réduire ${k}(x + ${a}) − ${m}(x ${b < 0 ? '−' : '+'} ${Math.abs(b)})`, reponse: bonne,
    faux: qcm(bonne, [poly([[cx, 'x'], [k * a + m * b, '']]), poly([[k + m, 'x'], [cc, '']]), poly([[cx, 'x'], [k * a - b, '']])]),
    correction: `${k}(x + ${a}) = ${k}x + ${k * a} et −${m}(x ${b < 0 ? '−' : '+'} ${Math.abs(b)}) = −${m}x ${-m * b < 0 ? '−' : '+'} ${Math.abs(m * b)}. On réduit : ${bonne}.` };
} });

G3.push({ code: 'EXP4', theme: 'nombres', chapitre: '3e-expr-alg-1', nombre: 7, creer() {
  const n = ent(2, 9), forme = ent(1, 3);
  if (forme === 1) return { enonce: `Calculer −${n}²`, reponse: fr(-n * n),
    correction: `Attention : le carré ne porte que sur ${n}. −${n}² = −(${n} × ${n}) = ${fr(-n * n)}. (Ne pas confondre avec (−${n})² = ${n * n}.)` };
  if (forme === 2) return { enonce: `Calculer (−${n})²`, reponse: String(n * n),
    correction: `(−${n})² = (−${n}) × (−${n}) = ${n * n} : le produit de deux nombres négatifs est positif.` };
  const x = -ent(1, 5), a = ent(2, 5), b = ent(1, 9);
  const v = a * x * x - b * x;
  return { enonce: `Calculer ${a}x² − ${b}x pour x = ${fr(x)}`, reponse: fr(v),
    correction: `${a} × ${par(x)}² − ${b} × ${par(x)} = ${a} × ${x * x} − ${par(b * x)} = ${a * x * x} + ${-b * x} = ${fr(v)}.` };
} });

G3.push({ code: 'FAC1', theme: 'nombres', chapitre: '3e-expr-alg-3', nombre: 6, creer() {
  const k = ent(1, 4), a = ent(1, 5), b = entNonNul(-9, 9);
  if (pgcd(a, b) !== 1) return null;
  const facteur = k === 1 ? 'x' : `${k}x`;
  const bonne = `${facteur}(${poly([[a, 'x'], [b, '']])})`;
  const developpe = poly([[k * a, 'x²'], [k * b, 'x']]);
  return { enonce: `Factoriser ${developpe}`, reponse: bonne,
    faux: qcm(bonne, [`${facteur}(${poly([[a, 'x'], [k * b, '']])})`, `x²(${poly([[k * a, ''], [k * b, '']])})`, `${k}(${poly([[a, 'x²'], [b, 'x']])})`.replace(/^1\(/, '('), `${facteur}(${poly([[a, 'x²'], [b, '']])})`]),
    correction: `${facteur} est un facteur commun : ${developpe} = ${facteur} × ${poly([[a, 'x']])} ${b < 0 ? '−' : '+'} ${facteur} × ${Math.abs(b)} = ${bonne}.` };
} });

G3.push({ code: 'FAC2', theme: 'nombres', chapitre: '3e-expr-alg-3', nombre: 8, creer() {
  const a = ent(1, 9), forme = ent(1, 4);
  if (forme === 1) {
    const bonne = `(x − ${a})(x + ${a})`;
    return { enonce: `Factoriser x² − ${a * a}`, reponse: bonne,
      faux: [`(x − ${a})²`, `(x + ${a})²`, `(x − ${a * a})(x + ${a * a})`],
      correction: `On reconnaît a² − b² = (a − b)(a + b) avec a = x et b = ${a} : x² − ${a * a} = ${bonne}.` };
  }
  if (forme === 2) {
    const bonne = `(x + ${a})²`;
    return { enonce: `Factoriser ${poly([[1, 'x²'], [2 * a, 'x'], [a * a, '']])}`, reponse: bonne,
      faux: [`(x − ${a})²`, `(x + ${a})(x − ${a})`, `(x + ${2 * a})²`],
      correction: `On reconnaît a² + 2ab + b² = (a + b)² avec a = x et b = ${a} (2 × x × ${a} = ${2 * a}x) : ${bonne}.` };
  }
  if (forme === 3) {
    const bonne = `(x − ${a})²`;
    return { enonce: `Factoriser ${poly([[1, 'x²'], [-2 * a, 'x'], [a * a, '']])}`, reponse: bonne,
      faux: [`(x + ${a})²`, `(x − ${a})(x + ${a})`, `(x − ${2 * a})²`],
      correction: `On reconnaît a² − 2ab + b² = (a − b)² avec a = x et b = ${a} : ${bonne}.` };
  }
  const k = ent(2, 5);
  if (pgcd(k, a) !== 1) return null;
  const bonne = `(${k}x − ${a})(${k}x + ${a})`;
  return { enonce: `Factoriser ${k * k}x² − ${a * a}`, reponse: bonne,
    faux: [`(${k}x − ${a})²`, `(${k * k}x − ${a})(${k * k}x + ${a})`, `(${k}x + ${a})²`],
    correction: `${k * k}x² = (${k}x)² et ${a * a} = ${a}². On applique a² − b² = (a − b)(a + b) : ${bonne}.` };
} });

G3.push({ code: 'FAC3', theme: 'nombres', chapitre: '3e-expr-alg-3', nombre: 4, creer() {
  const a = entNonNul(-6, 6), b = ent(1, 4), c = entNonNul(-6, 6), d = ent(1, 4), e = entNonNul(-6, 6);
  const commun = `(x ${a < 0 ? '−' : '+'} ${Math.abs(a)})`;
  const f1 = poly([[b, 'x'], [c, '']]), f2 = poly([[d, 'x'], [e, '']]);
  if (c + e === 0) return null;
  const bonne = `${commun}(${poly([[b + d, 'x'], [c + e, '']])})`;
  return { enonce: `Factoriser ${commun}(${f1}) + ${commun}(${f2})`, reponse: bonne,
    faux: qcm(bonne, [`${commun}(${poly([[b * d, 'x'], [c * e, '']])})`, `${commun}²(${poly([[b + d, 'x'], [c + e, '']])})`, `(${f1})(${f2})`]),
    correction: `${commun} est un facteur commun. On l'écrit devant et on additionne ce qui reste : (${f1}) + (${f2}) = ${poly([[b + d, 'x'], [c + e, '']])}. Donc ${bonne}.` };
} });

reprendre('EQU3', 'EQU1', 'nombres', '3e-expr-alg-2', 5);
reprendre('EQU4', 'EQU2', 'nombres', '3e-expr-alg-2', 5);

G3.push({ code: 'EQU3', theme: 'nombres', chapitre: '3e-expr-alg-2', nombre: 6, creer() {
  const n = entNonNul(-6, 12), a = ent(2, 9), b = entNonNul(-15, 15), c = a * n + b;
  return { enonce: `Je pense à un nombre. Je le multiplie par ${a}, puis ${b > 0 ? `j'ajoute ${b}` : `je soustrais ${-b}`}. J'obtiens ${fr(c)}. Quel est ce nombre ?`, reponse: fr(n),
    correction: `On appelle x le nombre : ${poly([[a, 'x'], [b, '']])} = ${fr(c)}. Donc ${a}x = ${fr(c - b)} et x = ${fr(c - b)} ÷ ${a} = ${fr(n)}.` };
} });

G3.push({ code: 'EQU4', theme: 'nombres', chapitre: '3e-expr-alg-4', nombre: 7, creer() {
  const k = choix([1, 1, 2, 3]), r1v = entNonNul(-7, 7), r2v = entNonNul(-7, 7);
  if (r1v === r2v) return null;
  const f1 = k === 1 ? `(x ${r1v > 0 ? '−' : '+'} ${Math.abs(r1v)})` : `(${k}x ${r1v > 0 ? '−' : '+'} ${Math.abs(k * r1v)})`;
  const f2 = `(x ${r2v > 0 ? '−' : '+'} ${Math.abs(r2v)})`;
  const sol = [r1v, r2v].sort((a, b) => a - b);
  const bonne = enListe(sol);
  return { enonce: `Quelles sont les solutions de l'équation ${f1}${f2} = 0 ?`, reponse: bonne,
    faux: qcm(bonne, [enListe([-r1v, -r2v].sort((a, b) => a - b)), enListe([r1v * k, r2v].sort((a, b) => a - b)), enListe([-r1v, r2v].sort((a, b) => a - b)), fr(r1v * r2v)]),
    correction: `Un produit est nul si l'un de ses facteurs est nul : ${f1} = 0 donne x = ${fr(r1v)}, et ${f2} = 0 donne x = ${fr(r2v)}. Solutions : ${bonne}.` };
} });

G3.push({ code: 'EQU5', theme: 'nombres', chapitre: '3e-expr-alg-4', nombre: 4, creer() {
  const n = ent(2, 12), bonne = `${fr(-n)} et ${n}`;
  return { enonce: `Quelles sont les solutions de l'équation x² = ${n * n} ?`, reponse: bonne, faux: qcm(`${fr(-n)} et ${n}`, [String(n), fr(n * n / 2), `${fr(-n * n)} et ${n * n}`, String(n * n)]),
    correction: `Deux nombres ont pour carré ${n * n} : ${n} et −${n} (car (−${n})² = ${n * n} aussi). Solutions : ${bonne}.` };
} });

G3.push({ code: 'EQU6', theme: 'nombres', chapitre: '3e-expr-alg-2', nombre: 4, creer() {
  const a = ent(2, 6), b = entNonNul(-9, 9), c = ent(-5, 20), x = ent(-3, 6);
  const op = choix(['<', '>', '≤', '≥']);
  const g = a * x + b;
  const vrai = { '<': g < c, '>': g > c, '≤': g <= c, '≥': g >= c }[op];
  return { enonce: `${fr(x)} est-il solution de l'inéquation ${poly([[a, 'x'], [b, '']])} ${op} ${fr(c)} ?`, reponse: vrai ? 'Oui' : 'Non', faux: [vrai ? 'Non' : 'Oui'],
    correction: `On remplace x par ${fr(x)} : ${a} × ${par(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(g)}. ${fr(g)} ${op} ${fr(c)} est ${vrai ? 'vrai : c\'est une solution' : 'faux : ce n\'est pas une solution'}.` };
} });

// =============================================================
// NOMBRES — Arithmétique (3e-arithmetique)
// =============================================================

function etapesEuclide(a, b) {
  const etapes = [];
  while (b) { etapes.push(`${a} = ${b} × ${Math.floor(a / b)} + ${a % b}`); [a, b] = [b, a % b]; }
  return etapes;
}

G3.push({ code: 'ARI1', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 6, creer() {
  const b = ent(3, 12), q = ent(5, 40), r = ent(0, b - 1), a = b * q + r;
  if (hasard() < 0.5) return { enonce: `Quel est le reste de la division euclidienne de ${a} par ${b} ?`, reponse: String(r),
    correction: `${b} × ${q} = ${b * q} et ${a} − ${b * q} = ${r}, avec ${r} < ${b}. Donc ${a} = ${b} × ${q} + ${r} : le reste est ${r}.` };
  return { enonce: `Quel est le quotient de la division euclidienne de ${a} par ${b} ?`, reponse: String(q),
    correction: `On cherche le plus grand multiple de ${b} inférieur ou égal à ${a} : ${b} × ${q} = ${b * q} (et ${b} × ${q + 1} = ${b * (q + 1)} est trop grand). Le quotient est ${q}.` };
} });

G3.push({ code: 'ARI2', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 6, creer() {
  const k = ent(2, 15), m = ent(2, 9), n = ent(2, 9);
  if (m === n || pgcd(m, n) !== 1) return null;
  const a = Math.max(k * m, k * n), b = Math.min(k * m, k * n);
  return { enonce: `Quel est le PGCD de ${a} et ${b} ?`, reponse: String(k),
    correction: `Algorithme d'Euclide : ${etapesEuclide(a, b).join(' ; ')}. Le dernier reste non nul est ${k}. (Ou : ${a} = ${k} × ${a / k} et ${b} = ${k} × ${b / k}, et ${a / k} et ${b / k} n'ont pas d'autre diviseur commun que 1.)` };
} });

G3.push({ code: 'ARI3', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 4, creer() {
  const k = ent(4, 12), m = ent(2, 7), n = ent(2, 7);
  if (m === n || pgcd(m, n) !== 1) return null;
  const [obj1, obj2, groupes] = choix([['roses', 'tulipes', 'bouquets identiques'], ['billes rouges', 'billes bleues', 'sachets identiques'], ['crayons', 'gommes', 'lots identiques']]);
  return { enonce: `On a ${k * m} ${obj1} et ${k * n} ${obj2}. On veut faire le plus grand nombre possible de ${groupes}, en utilisant tout. Combien de ${groupes.split(' ')[0]} ?`, reponse: String(k),
    correction: `Le nombre de ${groupes.split(' ')[0]} doit diviser ${k * m} et ${k * n}. Le plus grand est leur PGCD : ${k}. (Chaque ${groupes.split(' ')[0].replace(/s$/, '')} contiendra ${m} ${obj1} et ${n} ${obj2}.)` };
} });

G3.push({ code: 'ARI4', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 4, creer() {
  const a = choix([4, 6, 8, 9, 10, 12, 15]), b = choix([6, 8, 10, 12, 14, 18, 20]);
  if (a === b || ppcm(a, b) === Math.max(a, b)) return null;
  const m = ppcm(a, b);
  return { enonce: `Un bus passe toutes les ${a} minutes et un autre toutes les ${b} minutes. Ils viennent de passer ensemble. Dans combien de minutes repasseront-ils ensemble ?`, reponse: String(m),
    correction: `On cherche le plus petit multiple commun à ${a} et ${b}. Multiples de ${a} : ${[1, 2, 3, 4, 5, 6].map(i => a * i).filter(v => v <= m).join(', ')}… ; ${m} est aussi un multiple de ${b}. Réponse : ${m} minutes.` };
} });

G3.push({ code: 'ARI5', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 5, creer() {
  const n = choix([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 60, 64, 72, 100]);
  const diviseurs = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) diviseurs.push(d);
  return { enonce: `Combien de diviseurs le nombre ${n} a-t-il ?`, reponse: String(diviseurs.length),
    correction: `On les cherche par paires (d × ${n}/d = ${n}) : ${diviseurs.join(', ')}. Il y en a ${diviseurs.length}.` };
} });

G3.push({ code: 'ARI6', theme: 'nombres', chapitre: '3e-arithmetique', nombre: 4, creer() {
  const k = ent(6, 21), a = ent(2, 9), b = ent(2, 9);
  if (a >= b || pgcd(a, b) !== 1) return null;
  const n = k * a, d = k * b, bonne = `${a}/${b}`;
  const g = pgcd(k, 2) === 2 ? 2 : 3;
  return { enonce: `Quelle est la forme irréductible de ${n}/${d} ?`, reponse: bonne,
    faux: qcm(bonne, [k % g === 0 ? `${n / g}/${d / g}` : `${a}/${b + 1}`, `${b}/${a}`, `${a + 1}/${b + 1}`, `${a}/${b * 2}`]),
    correction: `PGCD(${n} ; ${d}) = ${k}. On divise le numérateur et le dénominateur par ${k} : ${n}/${d} = ${bonne}.` };
} });

reprendre('FRA6', 'PRE1', 'nombres', '3e-arithmetique', 4);
reprendre('FRA7', 'DEC1', 'nombres', '3e-arithmetique', 4);

// =============================================================
// NOMBRES — Puissances et fractions (révisions)
// =============================================================

G3.push({ code: 'PUI1', theme: 'nombres', chapitre: '3e-puissances', nombre: 6, creer() {
  const base = choix([2, 3, 4, 5, 10]), n = ent(1, base === 10 ? 4 : 3);
  if (hasard() < 0.2) return { enonce: `Calculer ${base}⁰`, reponse: '1', correction: `Tout nombre non nul élevé à la puissance 0 vaut 1 : ${base}⁰ = 1.` };
  const d = base ** n;
  return { enonce: `Écrire ${base}${sup(-n)} sous forme d'une fraction`, reponse: `1/${d}`, variantes: [fr(1 / d)],
    correction: `${base}${sup(-n)} = 1/${base}${sup(n)} = 1/${d}${base === 10 || [2, 4, 5].includes(base) ? ` (= ${fr(1 / d)})` : ''}.` };
} });

G3.push({ code: 'PUI2', theme: 'nombres', chapitre: '3e-puissances', nombre: 6, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const a = choix([2, 3, 5, 7]), m = ent(2, 6), n = ent(2, 6);
    return { enonce: `Compléter : ${a}${sup(m)} × ${a}${sup(n)} = ${a} puissance …`, reponse: String(m + n),
      correction: `${a}${sup(m)} × ${a}${sup(n)}, c'est ${m} facteurs ${a} puis ${n} autres : ${m} + ${n} = ${m + n} facteurs. Donc ${a}${sup(m + n)}.` };
  }
  if (forme === 2) {
    const n = ent(2, 4), [a, b] = choix([[2, 5], [4, 25], [5, 2]]);
    return { enonce: `Calculer ${a}${sup(n)} × ${b}${sup(n)}`, reponse: fr((a * b) ** n),
      correction: `Même exposant : ${a}${sup(n)} × ${b}${sup(n)} = (${a} × ${b})${sup(n)} = ${a * b}${sup(n)} = ${fr((a * b) ** n)}.` };
  }
  const a = choix([2, 3, 10]), m = ent(5, 9), n = ent(2, 4);
  return { enonce: `Compléter : ${a}${sup(m)} ÷ ${a}${sup(n)} = ${a} puissance …`, reponse: String(m - n),
    correction: `On simplifie ${n} facteurs ${a} : il en reste ${m} − ${n} = ${m - n}. Donc ${a}${sup(m - n)}.` };
} });

reprendre('PUI4', 'SCI1', 'nombres', '3e-puissances', 4);
reprendre('FRA3', 'FRC1', 'nombres', '3e-expr-alg-1', 4);
reprendre('FRB1', 'FRC2', 'nombres', '3e-expr-alg-1', 4);
reprendre('FRB3', 'FRC3', 'nombres', '3e-expr-alg-1', 3);

// =============================================================
// DONNÉES — Proportionnalité : pourcentages, ratio (3e-proportionnalite)
// =============================================================

G3.push({ code: 'POU1', theme: 'donnees', chapitre: '3e-proportionnalite', nombre: 6, creer() {
  const t = choix([5, 10, 15, 20, 25, 30, 40, 50, 3, 12]), hausse = hasard() < 0.5;
  const c = hausse ? 1 + t / 100 : 1 - t / 100;
  return { enonce: `${hausse ? 'Augmenter' : 'Diminuer'} une quantité de ${t} %, c'est la multiplier par…`, reponse: fr(c),
    correction: `${hausse ? `On garde 100 % et on ajoute ${t} %` : `On garde 100 % − ${t} %`} = ${fr(c * 100)} %, soit × ${fr(c)}.` };
} });

G3.push({ code: 'POU2', theme: 'donnees', chapitre: '3e-proportionnalite', nombre: 5, creer() {
  const depart = choix([20, 40, 50, 80, 200, 25, 60]), t = choix([10, 20, 25, 50, 5, 30, 15]), hausse = hasard() < 0.6;
  const arrivee = depart * (hausse ? 1 + t / 100 : 1 - t / 100);
  if (arrivee !== Math.round(arrivee * 100) / 100) return null;
  return { enonce: `Un prix passe de ${depart} € à ${fr(arrivee)} €. De quel pourcentage a-t-il ${hausse ? 'augmenté' : 'baissé'} ?`, reponse: String(t), variantes: [`${t} %`],
    correction: `L'écart vaut ${fr(Math.abs(arrivee - depart))} €. ${fr(Math.abs(arrivee - depart))} ÷ ${depart} = ${fr(t / 100)}, soit ${t} %.` };
} });

G3.push({ code: 'RAT1', theme: 'donnees', chapitre: '3e-proportionnalite', nombre: 6, creer() {
  const a = ent(1, 5), b = ent(2, 7), k = ent(2, 10);
  if (a === b || pgcd(a, b) !== 1) return null;
  const [p1, p2] = melangeH(PRENOMS).slice(0, 2);
  if (hasard() < 0.5) return { enonce: `${p1} et ${p2} se partagent ${(a + b) * k} billes dans le ratio ${a} : ${b}. Combien de billes reçoit ${p1} ?`, reponse: String(a * k),
    correction: `Ratio ${a} : ${b} → ${a + b} parts en tout. Une part vaut ${(a + b) * k} ÷ ${a + b} = ${k}. ${p1} reçoit ${a} parts : ${a} × ${k} = ${a * k}.` };
  return { enonce: `Dans une recette, la farine et le sucre sont dans le ratio ${b} : ${a}. Pour ${b * k * 10} g de farine, combien faut-il de sucre (en g) ?`, reponse: String(a * k * 10),
    correction: `${b * k * 10} g de farine correspondent à ${b} parts, donc une part vaut ${k * 10} g. Le sucre fait ${a} parts : ${a} × ${k * 10} = ${a * k * 10} g.` };
} });

reprendre('PRO5', 'POU3', 'donnees', '3e-proportionnalite', 4);
reprendre('PRO6', 'POU4', 'donnees', '3e-proportionnalite', 4);

// =============================================================
// DONNÉES — Statistiques et probabilités (3e-stats-probas)
// =============================================================

reprendre('STA1', 'STA1', 'donnees', '3e-stats-probas', 4);
reprendre('STA2', 'STA2', 'donnees', '3e-stats-probas', 4);
reprendre('STA3', 'STA3', 'donnees', '3e-stats-probas', 3);
reprendre('PRB1', 'PRB1', 'donnees', '3e-stats-probas', 3);
reprendre('PRB3', 'PRB2', 'donnees', '3e-stats-probas', 3);

const DEUX_EPREUVES = [
  ['On lance deux pièces équilibrées. Quelle est la probabilité d\'obtenir deux fois « pile » ?', '1/4', 'Issues : PP, PF, FP, FF (4 issues équiprobables). Une seule est favorable : 1/4.'],
  ['On lance deux pièces équilibrées. Quelle est la probabilité d\'obtenir au moins une fois « pile » ?', '3/4', 'Issues : PP, PF, FP, FF. Trois contiennent « pile » : 3/4. (Ou : 1 − P(FF) = 1 − 1/4.)'],
  ['On lance deux pièces équilibrées. Quelle est la probabilité d\'obtenir un « pile » et un « face » ?', '1/2', 'Issues : PP, PF, FP, FF. Deux sont favorables (PF et FP) : 2/4 = 1/2.'],
  ['On lance deux dés équilibrés à 6 faces. Quelle est la probabilité d\'obtenir un double 6 ?', '1/36', '6 × 6 = 36 issues équiprobables, une seule est (6 ; 6) : 1/36.'],
  ['On lance deux dés équilibrés à 6 faces. Quelle est la probabilité que la somme fasse 7 ?', '1/6', '36 issues. Somme 7 : (1;6), (2;5), (3;4), (4;3), (5;2), (6;1), soit 6 issues : 6/36 = 1/6.'],
  ['On lance deux dés équilibrés à 6 faces. Quelle est la probabilité que la somme fasse 12 ?', '1/36', '36 issues ; seule (6 ; 6) donne 12 : 1/36.'],
  ['On lance deux dés équilibrés à 6 faces. Quelle est la probabilité d\'obtenir un double ?', '1/6', '36 issues ; 6 doubles (1;1) … (6;6) : 6/36 = 1/6.'],
  ['On lance deux dés équilibrés à 6 faces. Quelle est la probabilité que la somme fasse 2 ?', '1/36', '36 issues ; seule (1 ; 1) donne 2 : 1/36.'],
];
G3.push({ code: 'PRB3', theme: 'donnees', chapitre: '3e-stats-probas', nombre: 6, creer() {
  const [enonce, reponse, correction] = choix(DEUX_EPREUVES);
  return { enonce, reponse, correction };
} });

// =============================================================
// GRANDEURS — Espace, agrandissement, grandeurs composées
// =============================================================

G3.push({ code: 'BOU1', theme: 'grandeurs', chapitre: '3e-espace', nombre: 5, creer() {
  const r = choix([3, 6, 9, 1.5, 12, 0.3]), k = arrondi(4 * r ** 3 / 3);
  const bonne = `${fr(k)}π cm³`;
  return { enonce: `Quel est le volume exact d'une boule de rayon ${fr(r)} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${fr(4 * r * r)}π cm³`, `${fr(r ** 3)}π cm³`, `${fr(4 * r ** 3)}π cm³`, `${fr(k / 2)}π cm³`]),
    correction: `Volume de la boule = 4/3 × π × rayon³ = 4/3 × π × ${fr(r ** 3)} = ${fr(k)}π cm³.` };
} });

G3.push({ code: 'BOU2', theme: 'grandeurs', chapitre: '3e-espace', nombre: 6, creer() {
  const r = ent(1, 8), bonne = `${4 * r * r}π cm²`;
  return { enonce: `Quelle est l'aire exacte d'une sphère de rayon ${r} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${r * r}π cm²`, `${2 * r * r}π cm²`, `${4 * r}π cm²`, `${8 * r * r}π cm²`]),
    correction: `Aire de la sphère = 4 × π × rayon² = 4 × π × ${r * r} = ${4 * r * r}π cm².` };
} });

reprendre('VOL4', 'VOL1', 'grandeurs', '3e-espace', 5);
reprendre('VOL5', 'VOL2', 'grandeurs', '3e-espace', 4);

G3.push({ code: 'REP1', theme: 'grandeurs', chapitre: '3e-espace', nombre: 4, creer() {
  const L = ent(2, 8), l = ent(2, 6), h = ent(2, 5);
  const bonne = `(${L} ; ${l} ; ${h})`;
  return { enonce: `Un pavé droit de longueur ${L}, largeur ${l} et hauteur ${h} a un sommet A à l'origine du repère, ses arêtes suivant les axes. Quelles sont les coordonnées du sommet opposé à A ?`, reponse: bonne,
    faux: qcm(bonne, [`(${L} ; ${l} ; 0)`, `(${l} ; ${L} ; ${h})`, `(${L} ; 0 ; ${h})`, `(${h} ; ${l} ; ${L})`]),
    correction: `Le sommet opposé à A est au bout des trois arêtes : abscisse ${L}, ordonnée ${l}, altitude ${h}, soit ${bonne}.` };
} });

G3.push({ code: 'PYR1', theme: 'grandeurs', chapitre: '3e-espace', nombre: 3, creer() {
  const [question, bonne, faux] = choix([
    ['Les faces latérales d\'une pyramide régulière à base carrée sont des…', 'triangles isocèles', ['carrés', 'rectangles', 'triangles rectangles']],
    ['Combien de faces a une pyramide à base hexagonale ?', '7', ['6', '8', '12']],
    ['Le patron d\'un cylindre est formé de deux disques et…', 'd\'un rectangle', ['d\'un triangle', 'd\'un troisième disque', 'd\'un carré obligatoirement']],
  ]);
  return { enonce: question, reponse: bonne, faux,
    correction: { 'triangles isocèles': 'Le sommet est à égale distance des sommets de la base : chaque face latérale a deux côtés égaux.', 7: '1 base hexagonale + 6 faces latérales triangulaires = 7 faces.', 'd\'un rectangle': 'En « déroulant » la surface latérale, on obtient un rectangle dont la longueur est le périmètre du disque.' }[bonne] };
} });

G3.push({ code: 'CER1', theme: 'geometrie', chapitre: '3e-pythagore', nombre: 3, creer() {
  if (hasard() < 0.6) {
    const c = 2 * ent(2, 9), [A, B, C] = choix(LETTRES_TRIANGLES).split('');
    return { enonce: `${A}${B}${C} est rectangle en ${A} et ${B}${C} = ${c} cm. Quel est le rayon de son cercle circonscrit (en cm) ?`, reponse: String(c / 2),
      correction: `Le cercle circonscrit à un triangle rectangle a pour diamètre l'hypoténuse [${B}${C}]. Rayon = ${c} ÷ 2 = ${c / 2} cm.` };
  }
  return { enonce: 'Le centre du cercle circonscrit à un triangle rectangle est…', reponse: 'le milieu de l\'hypoténuse', faux: ['le sommet de l\'angle droit', 'le centre de gravité', 'le milieu d\'un côté de l\'angle droit'],
    correction: 'Dans un triangle rectangle, l\'hypoténuse est un diamètre du cercle circonscrit : son centre est donc le milieu de l\'hypoténuse.' };
} });

G3.push({ code: 'AGR1', theme: 'grandeurs', chapitre: '3e-thales', nombre: 9, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const a = ent(2, 8), k = choix([2, 3, 1.5, 0.5, 4]);
    return { enonce: `Une figure est ${k > 1 ? 'agrandie' : 'réduite'} : un côté de ${a} cm devient ${fr(a * k)} cm. Quel est le coefficient ${k > 1 ? 'd\'agrandissement' : 'de réduction'} ?`, reponse: fr(k),
      correction: `Coefficient = nouvelle longueur ÷ longueur initiale = ${fr(a * k)} ÷ ${a} = ${fr(k)}.` };
  }
  if (forme === 2) {
    const s = choix([5, 8, 10, 12, 20]), k = choix([2, 3, 0.5]);
    return { enonce: `Une figure d'aire ${s} cm² est ${k > 1 ? 'agrandie' : 'réduite'} avec un coefficient ${fr(k)}. Quelle est sa nouvelle aire (en cm²) ?`, reponse: fr(s * k * k),
      correction: `Les aires sont multipliées par k² = ${fr(k)}² = ${fr(k * k)} : ${s} × ${fr(k * k)} = ${fr(s * k * k)} cm².` };
  }
  const v = choix([24, 40, 80, 160, 16]), k = choix([0.5, 2, 3]);
  return { enonce: `Un solide de volume ${v} cm³ est ${k > 1 ? 'agrandi' : 'réduit'} avec un coefficient ${fr(k)}. Quel est son nouveau volume (en cm³) ?`, reponse: fr(v * k ** 3),
    correction: `Les volumes sont multipliés par k³ = ${fr(k)}³ = ${fr(k ** 3)} : ${v} × ${fr(k ** 3)} = ${fr(v * k ** 3)} cm³.` };
} });

G3.push({ code: 'DEB1', theme: 'grandeurs', chapitre: '3e-proportionnalite', nombre: 7, creer() {
  const forme = ent(1, 2);
  if (forme === 1) {
    const d = choix([6, 8, 10, 12, 15, 20]), m = choix([5, 10, 15, 30, 45]);
    return { enonce: `Un robinet débite ${d} L par minute. Combien de litres coulent en ${m} minutes ?`, reponse: String(d * m),
      correction: `Volume = débit × durée = ${d} × ${m} = ${d * m} L.` };
  }
  const v = choix([200, 300, 600, 900, 1200]), d = choix([10, 20, 30, 60]);
  if (v % d) return null;
  return { enonce: `Une baignoire de ${v} L se remplit à ${d} L par minute. Combien de minutes faut-il pour la remplir ?`, reponse: String(v / d),
    correction: `Durée = volume ÷ débit = ${v} ÷ ${d} = ${v / d} min.` };
} });

reprendre('VIT1', 'VIT1', 'grandeurs', '3e-proportionnalite', 3);
reprendre('VIT2', 'VIT2', 'grandeurs', '3e-proportionnalite', 3);
reprendre('VIT4', 'VIT3', 'grandeurs', '3e-proportionnalite', 3);
reprendre('AIR3', 'CON1', 'grandeurs', '3e-espace', 4);

// =============================================================
// GÉOMÉTRIE — Pythagore (révisions), Thalès, trigonométrie
// =============================================================

reprendre('PYT1', 'PYT1', 'geometrie', '3e-pythagore', 4);
reprendre('PYT2', 'PYT2', 'geometrie', '3e-pythagore', 3);
reprendre('REC1', 'REC1', 'geometrie', '3e-pythagore', 4);

G3.push({ code: 'PYT3', theme: 'geometrie', chapitre: '3e-pythagore', nombre: 3, creer() {
  const [a, b, c] = choix(TRIPLETS.filter(t => t[0] >= 3));
  return { enonce: `Un rectangle mesure ${fr(a)} cm sur ${fr(b)} cm. Combien mesure sa diagonale (en cm) ?`, reponse: fr(c),
    correction: `La diagonale est l'hypoténuse d'un triangle rectangle de côtés ${fr(a)} et ${fr(b)} : d² = ${fr(a * a)} + ${fr(b * b)} = ${fr(c * c)}, donc d = ${fr(c)} cm.` };
} });

const RAPPORTS = [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4]];
const NOMS_THALES = [['A', 'B', 'C', 'M', 'N'], ['R', 'S', 'T', 'U', 'V'], ['E', 'F', 'G', 'K', 'L'], ['O', 'P', 'Q', 'I', 'J']];
G3.push({ code: 'THA1', theme: 'geometrie', chapitre: '3e-thales', nombre: 8, creer() {
  const [p, q] = choix(RAPPORTS), noms = choix(NOMS_THALES), [A, B, C, M, N] = noms;
  const AB = q * ent(1, 4), AM = p * AB / q, BC = q * ent(1, 4), MN = p * BC / q;
  return { enonce: `(${M}${N}) // (${B}${C}), ${A}${M} = ${fr(AM)} cm, ${A}${B} = ${fr(AB)} cm et ${B}${C} = ${fr(BC)} cm. Combien mesure ${M}${N} (en cm) ?`, reponse: fr(MN),
    svg: svgThales(p / q, noms),
    correction: `Les droites (${M}${N}) et (${B}${C}) sont parallèles : d'après le théorème de Thalès, ${A}${M}/${A}${B} = ${A}${N}/${A}${C} = ${M}${N}/${B}${C}. Donc ${M}${N} = ${B}${C} × ${A}${M} ÷ ${A}${B} = ${fr(BC)} × ${fr(AM)} ÷ ${fr(AB)} = ${fr(MN)} cm.` };
} });

G3.push({ code: 'THA2', theme: 'geometrie', chapitre: '3e-thales', nombre: 5, creer() {
  const [p, q] = choix(RAPPORTS), noms = choix(NOMS_THALES), [A, B, C, M, N] = noms;
  const AB = q * ent(1, 4), AM = p * AB / q, BC = q * ent(1, 4), MN = p * BC / q;
  return { enonce: `(${M}${N}) // (${B}${C}), ${M}${N} = ${fr(MN)} cm, ${B}${C} = ${fr(BC)} cm et ${A}${B} = ${fr(AB)} cm. Combien mesure ${A}${M} (en cm) ?`, reponse: fr(AM),
    svg: svgThales(p / q, noms),
    correction: `D'après le théorème de Thalès, ${A}${M}/${A}${B} = ${M}${N}/${B}${C}. Donc ${A}${M} = ${A}${B} × ${M}${N} ÷ ${B}${C} = ${fr(AB)} × ${fr(MN)} ÷ ${fr(BC)} = ${fr(AM)} cm.` };
} });

G3.push({ code: 'THA3', theme: 'geometrie', chapitre: '3e-thales', nombre: 5, creer() {
  const [p, q] = choix(RAPPORTS), [A, B, C, M, N] = choix(NOMS_THALES);
  const AB = q * ent(1, 3), AM = p * AB / q, AC = q * ent(1, 4);
  const paralleles = hasard() < 0.5;
  const AN = paralleles ? p * AC / q : p * AC / q + choix([-1, 1]);
  if (AN <= 0 || AN >= AC) return null;
  const r1 = AM / AB, r2 = AN / AC;
  return { enonce: `${A}, ${M}, ${B} sont alignés et ${A}, ${N}, ${C} aussi, dans le même ordre. ${A}${M} = ${fr(AM)}, ${A}${B} = ${fr(AB)}, ${A}${N} = ${fr(AN)} et ${A}${C} = ${fr(AC)}. Les droites (${M}${N}) et (${B}${C}) sont-elles parallèles ?`,
    reponse: paralleles ? 'Oui' : 'Non', faux: [paralleles ? 'Non' : 'Oui'],
    correction: `${A}${M}/${A}${B} = ${fr(AM)}/${fr(AB)} = ${frac(Math.round(AM * 10), Math.round(AB * 10))} et ${A}${N}/${A}${C} = ${fr(AN)}/${fr(AC)} = ${frac(Math.round(AN * 10), Math.round(AC * 10))}. ${r1 === r2 ? 'Les rapports sont égaux : d\'après la réciproque du théorème de Thalès, les droites sont parallèles.' : 'Les rapports sont différents : les droites ne sont pas parallèles.'}` };
} });

G3.push({ code: 'SEM1', theme: 'geometrie', chapitre: '3e-thales', nombre: 3, creer() {
  const [question, bonne, faux] = choix([
    ['Deux triangles semblables ont…', 'des angles deux à deux égaux', ['forcément la même aire', 'des côtés deux à deux égaux', 'des angles tous de 60°']],
    ['Si deux triangles sont semblables, les longueurs de leurs côtés sont…', 'proportionnelles', ['égales', 'toujours doublées', 'perpendiculaires']],
    ['Deux triangles dont les angles sont deux à deux égaux sont…', 'semblables', ['égaux', 'rectangles', 'isocèles']],
  ]);
  return { enonce: question, reponse: bonne, faux,
    correction: 'Deux triangles semblables ont la même forme : leurs angles sont deux à deux égaux et les longueurs de leurs côtés sont proportionnelles.' };
} });

// Trigonométrie : triangle rectangle en R, on regarde l'angle au sommet P.
G3.push({ code: 'TRI1', theme: 'geometrie', chapitre: '3e-trigonometrie', nombre: 8, creer() {
  const [R, P, Q] = choix(LETTRES_TRIANGLES).split('');
  const adj = `${R}${P}`, opp = `${R}${Q}`, hyp = `${P}${Q}`;
  const [fonction, bonne] = choix([['cos', `${adj}/${hyp}`], ['sin', `${opp}/${hyp}`], ['tan', `${opp}/${adj}`]]);
  return { enonce: `Le triangle ${R}${P}${Q} est rectangle en ${R}. Que vaut ${fonction}(${P}̂) ?`, reponse: bonne,
    faux: qcm(bonne, [`${adj}/${hyp}`, `${opp}/${hyp}`, `${opp}/${adj}`, `${hyp}/${adj}`]),
    svg: svgTriangleRectangle(4, 3, [R, P, Q], ['', '', ''], 1),
    correction: `Pour l'angle ${P}̂ : le côté adjacent est [${adj}], le côté opposé est [${opp}] et l'hypoténuse est [${hyp}]. CAH-SOH-TOA : ${fonction}(${P}̂) = ${bonne}.` };
} });

G3.push({ code: 'TRI2', theme: 'geometrie', chapitre: '3e-trigonometrie', nombre: 8, creer() {
  const [R, P, Q] = choix(LETTRES_TRIANGLES).split('');
  const forme = ent(1, 4), k = ent(1, 4);
  if (forme === 1) {   // cosinus : adjacent = hypoténuse × cos
    const [a, b, c] = choix([[3, 4, 5], [4, 3, 5]]).map(v => v * k);
    return { enonce: `${R}${P}${Q} est rectangle en ${R}, ${P}${Q} = ${c} cm et cos(${P}̂) = ${fr(a / c)}. Combien mesure ${R}${P} (en cm) ?`, reponse: fr(a),
      svg: svgTriangleRectangle(a, b, [R, P, Q], ['?', '', `${c} cm`], 1),
      correction: `cos(${P}̂) = ${R}${P}/${P}${Q} (adjacent/hypoténuse), donc ${R}${P} = ${P}${Q} × cos(${P}̂) = ${c} × ${fr(a / c)} = ${fr(a)} cm.` };
  }
  if (forme === 2) {   // sinus : opposé = hypoténuse × sin
    const [a, b, c] = choix([[3, 4, 5], [4, 3, 5]]).map(v => v * k);
    return { enonce: `${R}${P}${Q} est rectangle en ${R}, ${P}${Q} = ${c} cm et sin(${P}̂) = ${fr(b / c)}. Combien mesure ${R}${Q} (en cm) ?`, reponse: fr(b),
      svg: svgTriangleRectangle(a, b, [R, P, Q], ['', '?', `${c} cm`], 1),
      correction: `sin(${P}̂) = ${R}${Q}/${P}${Q} (opposé/hypoténuse), donc ${R}${Q} = ${P}${Q} × sin(${P}̂) = ${c} × ${fr(b / c)} = ${fr(b)} cm.` };
  }
  if (forme === 3) {   // tangente : opposé = adjacent × tan
    const t = choix([2, 0.5, 1.5, 3, 0.75]), a = 4 * k, b = a * t;
    return { enonce: `${R}${P}${Q} est rectangle en ${R}, ${R}${P} = ${a} cm et tan(${P}̂) = ${fr(t)}. Combien mesure ${R}${Q} (en cm) ?`, reponse: fr(b),
      svg: svgTriangleRectangle(a, b, [R, P, Q], [`${a} cm`, '?', ''], 1),
      correction: `tan(${P}̂) = ${R}${Q}/${R}${P} (opposé/adjacent), donc ${R}${Q} = ${R}${P} × tan(${P}̂) = ${a} × ${fr(t)} = ${fr(b)} cm.` };
  }
  const c = 2 * ent(2, 8);   // angle de 60° : cos(60°) = 0,5
  return { enonce: `${R}${P}${Q} est rectangle en ${R}, ${P}${Q} = ${c} cm et l'angle ${P}̂ mesure 60°. Sachant que cos(60°) = 0,5, combien mesure ${R}${P} (en cm) ?`, reponse: String(c / 2),
    svg: svgTriangleRectangle(1, Math.sqrt(3), [R, P, Q], ['?', '', `${c} cm`], 1, '60°'),
    correction: `${R}${P} = ${P}${Q} × cos(60°) = ${c} × 0,5 = ${c / 2} cm.` };
} });

G3.push({ code: 'TRI3', theme: 'geometrie', chapitre: '3e-trigonometrie', nombre: 3, creer() {
  const [texte, angle] = choix([['cos(x) = 0,5', 60], ['sin(x) = 0,5', 30], ['tan(x) = 1', 45]]);
  return { enonce: `x est un angle aigu et ${texte}. Combien mesure x (en degrés) ?`, reponse: String(angle), variantes: [`${angle}°`],
    correction: `Valeur à connaître (ou à la calculatrice avec la touche ${texte.slice(0, 3)}⁻¹) : ${texte} pour x = ${angle}°.` };
} });

// =============================================================
// GÉOMÉTRIE — Sections de solides (3e-sections)
// =============================================================

const SECTIONS = [
  ['La section d\'un cube par un plan parallèle à une face est…', 'un carré'],
  ['La section d\'un pavé droit par un plan parallèle à une face est…', 'un rectangle'],
  ['La section d\'un cylindre par un plan parallèle à sa base est…', 'un disque'],
  ['La section d\'un cylindre par un plan parallèle à son axe est…', 'un rectangle'],
  ['La section d\'une boule par un plan est…', 'un disque'],
  ['La section d\'une pyramide par un plan parallèle à sa base est…', 'une réduction de la base'],
  ['La section d\'un cône par un plan parallèle à sa base est…', 'un disque'],
  ['La section d\'un cube par un plan parallèle à une arête (mais pas à une face) est…', 'un rectangle'],
];
G3.push({ code: 'SEC1', theme: 'geometrie', chapitre: '3e-sections', nombre: 8, creer() {
  const [question, bonne] = choix(SECTIONS);
  return { enonce: question, reponse: bonne, faux: qcm(bonne, melangeH(['un carré', 'un rectangle', 'un disque', 'un triangle', 'une réduction de la base'])),
    correction: `${question.replace('…', '')} ${bonne}.` };
} });

// =============================================================
// GÉOMÉTRIE — Transformations : homothétie, rotation (3e-transformations)
// =============================================================

G3.push({ code: 'HOM1', theme: 'geometrie', chapitre: '3e-transformations', nombre: 6, creer() {
  const L = 12, H = 8, k = choix([2, -1, -2, 0.5, 3]);
  const O = { x: ent(3, L - 3), y: ent(2, H - 2) }, A = { x: ent(1, L - 1), y: ent(1, H - 1) };
  const dx = A.x - O.x, dy = A.y - O.y;
  if (Math.abs(dx) + Math.abs(dy) < 2 || (k === 0.5 && (dx % 2 || dy % 2))) return null;
  const point = (r) => ({ x: O.x + r * dx, y: O.y + r * dy });
  const image = point(k);
  if (!dansGrille(image, L, H)) return null;
  const nommes = pointsQuadrillage(image, [point(-k), point(k + 1), point(k - 1), point(1 / k), point(-1 / k)].filter(p => Number.isInteger(p.x) && Number.isInteger(p.y)), L, H)
    .filter(p => !(p.x === O.x && p.y === O.y) && !(p.x === A.x && p.y === A.y));
  if (nommes.length < 3 || nommes[0].x !== image.x || nommes[0].y !== image.y) return null;
  const bonne = nommes[0].nom;
  return { enonce: `Quelle est l'image du point A par l'homothétie de centre O et de rapport ${fr(k)} ?`, reponse: bonne,
    faux: nommes.slice(1).map(p => p.nom), svg: svgQuadrillage(L, H, [{ ...O, nom: 'O' }, { ...A, nom: 'A' }, ...nommes]),
    correction: `De O à A : ${dx >= 0 ? '+' : '−'}${Math.abs(dx)} en largeur et ${dy >= 0 ? '+' : '−'}${Math.abs(dy)} en hauteur. On multiplie ce déplacement par ${fr(k)}${k < 0 ? ' (de l\'autre côté de O)' : ''} : ${fr(k * dx)} et ${fr(k * dy)}. On arrive en ${bonne}.` };
} });

G3.push({ code: 'ROT1', theme: 'geometrie', chapitre: '3e-transformations', nombre: 6, creer() {
  const L = 12, H = 8;
  const O = { x: ent(4, L - 4), y: ent(3, H - 3) }, A = { x: ent(1, L - 1), y: ent(1, H - 1) };
  const dx = A.x - O.x, dy = A.y - O.y;
  if (Math.abs(dx) + Math.abs(dy) < 3) return null;   // A pas trop près de O : figure lisible
  const direct = hasard() < 0.5;   // direct = sens inverse des aiguilles d'une montre
  const tourne = (s) => s ? { x: O.x - dy, y: O.y + dx } : { x: O.x + dy, y: O.y - dx };
  const image = tourne(direct);
  if (!dansGrille(image, L, H)) return null;
  const nommes = pointsQuadrillage(image, [tourne(!direct), { x: O.x - dx, y: O.y - dy }, { x: O.x + dx, y: O.y - dy }, { x: O.x - dx, y: O.y + dy }], L, H)
    .filter(p => !(p.x === O.x && p.y === O.y) && !(p.x === A.x && p.y === A.y));
  if (nommes.length < 3 || nommes[0].x !== image.x || nommes[0].y !== image.y) return null;
  const bonne = nommes[0].nom;
  return { enonce: `Quelle est l'image du point A par la rotation de centre O et d'angle 90° dans le sens ${direct ? 'inverse des aiguilles d\'une montre' : 'des aiguilles d\'une montre'} ?`, reponse: bonne,
    faux: nommes.slice(1).map(p => p.nom), svg: svgQuadrillage(L, H, [{ ...O, nom: 'O' }, { ...A, nom: 'A' }, ...nommes]),
    correction: `L'image est à la même distance de O que A, et l'angle entre [OA] et [O${bonne}] est droit, en tournant dans le sens ${direct ? 'inverse des aiguilles d\'une montre' : 'des aiguilles d\'une montre'}. C'est le point ${bonne}.` };
} });

const TRANSFORMATIONS = [
  ['Une homothétie de rapport 3 multiplie les longueurs par…', '3', ['9', '27', '6']],
  ['Une homothétie de rapport 3 multiplie les aires par…', '9', ['3', '27', '6']],
  ['Une homothétie de rapport −1 est aussi…', 'une symétrie centrale', ['une symétrie axiale', 'une translation', 'une rotation de 90°']],
  ['Une rotation conserve…', 'les longueurs, les angles et les aires', ['seulement les longueurs', 'seulement les aires', 'rien du tout']],
  ['Une homothétie de rapport 0,5 est…', 'une réduction', ['un agrandissement', 'une symétrie', 'une translation']],
  ['Une symétrie centrale est une rotation d\'angle…', '180°', ['90°', '360°', '45°']],
];
G3.push({ code: 'TRF1', theme: 'geometrie', chapitre: '3e-transformations', nombre: 6, creer() {
  const [question, bonne, faux] = choix(TRANSFORMATIONS);
  return { enonce: question, reponse: bonne, faux,
    correction: `${question.replace('…', '')} ${bonne}.` };
} });

reprendre('COO1', 'COO1', 'geometrie', '3e-notion-fonction', 3);

// =============================================================
// ALGORITHMIQUE — Scratch et tableur (3e-algo)
// =============================================================

G3.push({ code: 'TAB1', theme: 'algo', chapitre: '3e-algo', nombre: 9, creer() {
  const v = ent(-5, 9), a = ent(2, 6), b = ent(1, 9);
  const [formule, resultat, detail] = choix([
    [`=${a}*A1-${b}`, a * v - b, `${a} × ${par(v)} − ${b}`],
    [`=A1*A1+${b}`, v * v + b, `${par(v)} × ${par(v)} + ${b}`],
    [`=${a}*(A1+${b})`, a * (v + b), `${a} × (${fr(v)} + ${b})`],
    [`=A1^2-${a}*A1`, v * v - a * v, `${par(v)}² − ${a} × ${par(v)}`],
  ]);
  return { enonce: `Dans un tableur, la cellule A1 contient ${fr(v)}. En B1, on écrit ${formule}. Qu'affiche B1 ?`, reponse: fr(resultat),
    correction: `Le tableur remplace A1 par ${fr(v)} : ${detail} = ${fr(resultat)}. (Dans un tableur, * veut dire × et ^ veut dire « puissance ».)` };
} });

G3.push({ code: 'TAB2', theme: 'algo', chapitre: '3e-algo', nombre: 5, creer() {
  const a = ent(2, 9), b = ent(1, 9);
  const [texte, bonne, pieges] = choix([
    [`le triple de A2, diminué de ${b}`, `=3*A2-${b}`, [`3*A2-${b}`, `=3*A1-${b}`, `=3*(A2-${b})`]],
    [`le carré de A2, augmenté de ${b}`, `=A2^2+${b}`, [`=A2*2+${b}`, `A2^2+${b}`, `=(A2+${b})^2`]],
    [`${a} fois la somme de A2 et de ${b}`, `=${a}*(A2+${b})`, [`=${a}*A2+${b}`, `${a}*(A2+${b})`, `=${a}*(A1+${b})`]],
  ]);
  return { enonce: `On veut calculer en B2 ${texte}. Quelle formule écrire en B2 ?`, reponse: bonne, faux: pieges,
    correction: `Une formule de tableur commence toujours par « = ». Ici : ${bonne}${bonne.includes('(') ? ' (les parenthèses sont nécessaires pour faire la somme en premier)' : ''}.` };
} });

G3.push({ code: 'TAB3', theme: 'algo', chapitre: '3e-algo', nombre: 5, creer() {
  const a = ent(2, 9), b = ent(1, 9), fin = ent(4, 9);
  if (hasard() < 0.5) {
    const bonne = `=A${fin}*${a}+${b}`;
    return { enonce: `En B2, on a écrit =A2*${a}+${b}, puis on a recopié la formule vers le bas. Quelle formule y a-t-il en B${fin} ?`, reponse: bonne,
      faux: [`=A2*${a}+${b}`, `=A${fin}*${a}+${b + fin - 2}`, `=B${fin}*${a}+${b}`],
      correction: `En recopiant vers le bas, les numéros de ligne avancent avec la cellule : A2 devient A${fin}. La formule devient ${bonne}.` };
  }
  const bonne = `=A${fin}*$D$1`;
  return { enonce: `En B2, on a écrit =A2*$D$1, puis on a recopié la formule vers le bas. Quelle formule y a-t-il en B${fin} ?`, reponse: bonne,
    faux: [`=A${fin}*$D$${fin - 1}`, `=A2*$D$1`, `=A${fin}*D${fin - 1}`],
    correction: `A2 est une référence relative : elle devient A${fin}. $D$1 est une référence absolue (avec des $) : elle ne change pas. Formule : ${bonne}.` };
} });

G3.push({ code: 'SCR1', theme: 'algo', chapitre: '3e-algo', nombre: 8, creer() {
  const a = ent(2, 5), b = entNonNul(-7, 7), c = ent(2, 4);
  const bonne = poly([[a * c, 'x'], [b * c, '']]);
  return { enonce: `Programme : choisir un nombre x, le multiplier par ${a}, ${b > 0 ? `ajouter ${b}` : `soustraire ${-b}`}, puis multiplier le résultat par ${c}. Quelle expression donne le résultat ?`, reponse: bonne,
    faux: qcm(bonne, [poly([[a * c, 'x'], [b, '']]), poly([[a, 'x'], [b * c, '']]), poly([[a + c, 'x'], [b, '']]), poly([[a * c, 'x'], [b + c, '']])]),
    correction: `On suit les étapes : x → ${a}x → ${poly([[a, 'x'], [b, '']])} → ${c}(${poly([[a, 'x'], [b, '']])}) = ${bonne}.` };
} });

G3.push({ code: 'SCR2', theme: 'algo', chapitre: '3e-algo', nombre: 5, creer() {
  if (hasard() < 0.5) {
    const n = ent(4, 10);
    const termes = Array.from({ length: n }, (_, i) => i + 1);
    return { enonce: `somme vaut 0. « Pour i allant de 1 à ${n} : ajouter i à somme ». Que vaut somme à la fin ?`, reponse: String(n * (n + 1) / 2),
      correction: `On ajoute successivement ${termes.join(', ')} : ${termes.join(' + ')} = ${n * (n + 1) / 2}.` };
  }
  const b = ent(2, 4), n = ent(2, 5);
  return { enonce: `p vaut 1. « Répéter ${n} fois : mettre p à p × ${b} ». Que vaut p à la fin ?`, reponse: String(b ** n),
    correction: `On multiplie ${n} fois par ${b} : p = ${b}${sup(n)} = ${b ** n}.` };
} });

G3.push({ code: 'SCR3', theme: 'algo', chapitre: '3e-algo', nombre: 5, creer() {
  const N = choix([6, 10, 20, 12, 8]), k = ent(2, N);
  const gagnants = k - 1;
  return { enonce: `n prend une valeur entière au hasard entre 1 et ${N}. « Si n < ${k} alors dire Gagné ». Quelle est la probabilité que le lutin dise « Gagné » ?`, reponse: frac(gagnants, N),
    correction: `Les valeurs gagnantes sont 1 à ${k - 1}, soit ${gagnants} valeur(s) sur ${N} équiprobables : ${gagnants}/${N}${frac(gagnants, N) !== `${gagnants}/${N}` ? ` = ${frac(gagnants, N)}` : ''}.` };
} });

reprendre('ALG2', 'ALG1', 'algo', '3e-algo', 4);
reprendre('ALG3', 'ALG2', 'algo', '3e-algo', 3);
reprendre('ALG6', 'ALG3', 'algo', '3e-algo', 3);
reprendre('ALG8', 'ALG4', 'algo', '3e-algo', 3);
reprendre('ALG4', 'ALG5', 'algo', '3e-algo', 3);
