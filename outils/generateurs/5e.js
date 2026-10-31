// =============================================================
// GÉNÉRATEURS DE QUESTIONS DE 5e
// Même principe que 4e.js. Les types de 4e (ou de 3e) qui relèvent
// aussi du programme de 5e sont repris avec d'autres valeurs.
// =============================================================

GENERATEURS['5e'] = [];
const G5 = GENERATEURS['5e'];

// Reprend un générateur d'un autre niveau, rangé dans un chapitre de 5e.
function reprendre5(niveau, code, nouveauCode, theme, chapitre, nombre) {
  const g = GENERATEURS[niveau].find(x => x.code === code);
  G5.push({ code: nouveauCode, theme, chapitre, nombre, creer: g.creer });
}

// ---------- Figures propres à la 5e ----------

// Deux droites parallèles (d) et (d') coupées par une sécante.
// angles : [{ point: 'A'|'B', position: 'HD'|'BD'|'BG'|'HG', texte }]
// (HD = en haut à droite de la sécante, BG = en bas à gauche…)
function svgParalleles(theta, angles) {
  const W = 400, H = 240, yA = 75, yB = 175;
  const t = Math.tan(theta * Math.PI / 180);
  const B = [175, yB], A = [175 + (yB - yA) / t, yA];
  const ux = Math.cos(theta * Math.PI / 180), uy = -Math.sin(theta * Math.PI / 180);
  let s = enteteSVG(W, H);
  s += trait(15, yA, W - 15, yA, '#222', 2) + trait(15, yB, W - 15, yB, '#222', 2);
  s += texteSVG(18, yA - 8, '(d)', 'font-style="italic"') + texteSVG(18, yB - 8, '(d\')', 'font-style="italic"');
  s += trait(B[0] - 70 * ux, B[1] - 70 * uy, A[0] + 70 * ux, A[1] + 70 * uy, '#222', 2);
  s += texteSVG(A[0] + 8, A[1] - 8, 'A', 'font-weight="bold"') + texteSVG(B[0] - 20, B[1] + 20, 'B', 'font-weight="bold"');
  // Angles en degrés dans le repère de l'image (y vers le bas, sens des aiguilles)
  const zones = { HD: [-theta, 0], BD: [0, 180 - theta], BG: [180 - theta, 180], HG: [180, 360 - theta] };
  for (const a of angles) {
    const P = a.point === 'A' ? A : B, [d1, d2] = zones[a.position];
    const rad = (d) => d * Math.PI / 180, rayon = 24;
    const p1 = [P[0] + rayon * Math.cos(rad(d1)), P[1] + rayon * Math.sin(rad(d1))];
    const p2 = [P[0] + rayon * Math.cos(rad(d2)), P[1] + rayon * Math.sin(rad(d2))];
    s += `<path d="M${p1.map(r1)} A${rayon},${rayon} 0 ${d2 - d1 > 180 ? 1 : 0} 1 ${p2.map(r1)}" fill="none" stroke="${COULEUR_TRACE}" stroke-width="2.2"/>`;
    const m = rad((d1 + d2) / 2), dist = d2 - d1 < 60 ? 50 : 40;
    s += texteSVG(P[0] + dist * Math.cos(m), P[1] + dist * Math.sin(m) + 5, a.texte, `text-anchor="middle" font-weight="bold" fill="${COULEUR_TRACE}"`);
  }
  return s + '</svg>';
}

// Bande partagée en « n » parts égales, dont « k » sont coloriées.
function svgBande(n, k) {
  const largeur = 320, h = 60, x0 = 20, y0 = 20, part = largeur / n;
  let s = enteteSVG(largeur + 40, h + 40);
  for (let i = 0; i < n; i++) {
    s += `<rect x="${r1(x0 + i * part)}" y="${y0}" width="${r1(part)}" height="${h}" fill="${i < k ? '#7bb1f0' : '#ffffff'}" stroke="#222" stroke-width="1.5"/>`;
  }
  return s + '</svg>';
}

// Figure en L (deux rectangles accolés) avec ses dimensions.
// Rectangle du bas : L × h1 ; rectangle du haut (à gauche) : l × h2.
function svgFigureL(L, h1, l, h2) {
  const e = Math.min(260 / L, 170 / (h1 + h2));
  const x0 = 50, y0 = 25, W = x0 + L * e + 50, H = y0 + (h1 + h2) * e + 40;
  const P = (x, y) => `${r1(x0 + x * e)},${r1(y0 + (h1 + h2 - y) * e)}`;
  let s = enteteSVG(W, H);
  s += `<polygon points="${P(0, 0)} ${P(L, 0)} ${P(L, h1)} ${P(l, h1)} ${P(l, h1 + h2)} ${P(0, h1 + h2)}" fill="#e8f0fb" stroke="#222" stroke-width="2"/>`;
  s += texteSVG(x0 + L * e / 2, y0 + (h1 + h2) * e + 22, `${fr(L)} cm`, 'text-anchor="middle"');
  s += texteSVG(x0 + L * e + 6, y0 + (h2 + h1 / 2) * e + 5, `${fr(h1)} cm`);
  s += texteSVG(x0 + l * e / 2, y0 - 6, `${fr(l)} cm`, 'text-anchor="middle"');
  s += texteSVG(x0 - 6, y0 + (h1 + h2) * e / 2 + 5, `${fr(h1 + h2)} cm`, 'text-anchor="end"');
  return s + '</svg>';
}

// =============================================================
// NOMBRES — Règles de calcul (5e-calcul)
// =============================================================

G5.push({ code: 'CAL1', theme: 'nombres', chapitre: '5e-calcul', nombre: 8, creer() {
  const a = ent(2, 20), b = ent(2, 9), c = ent(2, 9), d = ent(2, 9);
  const forme = ent(1, 3);
  if (forme === 1) return { enonce: `Calculer ${a} + ${b} × ${c}`, reponse: String(a + b * c),
    correction: `La multiplication est prioritaire : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${a + b * c}.` };
  if (forme === 2) {
    const q = b * c;
    if (a + q <= c) return null;
    return { enonce: `Calculer ${a + q} − ${q} ÷ ${c}`, reponse: String(a + q - b),
      correction: `La division est prioritaire : ${q} ÷ ${c} = ${b}, puis ${a + q} − ${b} = ${a + q - b}.` };
  }
  if (a * b - c * d < 0) return null;
  return { enonce: `Calculer ${a} × ${b} − ${c} × ${d}`, reponse: String(a * b - c * d),
    correction: `On calcule d'abord les deux produits : ${a} × ${b} = ${a * b} et ${c} × ${d} = ${c * d}. Puis ${a * b} − ${c * d} = ${a * b - c * d}.` };
} });

G5.push({ code: 'CAL2', theme: 'nombres', chapitre: '5e-calcul', nombre: 7, creer() {
  const a = ent(2, 9), b = ent(2, 12), c = ent(1, 9), d = ent(1, 5);
  const forme = ent(1, 3);
  if (forme === 1) return { enonce: `Calculer ${a} × (${b} + ${c})`, reponse: String(a * (b + c)),
    correction: `On calcule d'abord entre parenthèses : ${b} + ${c} = ${b + c}, puis ${a} × ${b + c} = ${a * (b + c)}.` };
  if (forme === 2) {
    if (c <= d) return null;
    return { enonce: `Calculer (${a} + ${b}) × (${c} − ${d})`, reponse: String((a + b) * (c - d)),
      correction: `Les parenthèses d'abord : ${a} + ${b} = ${a + b} et ${c} − ${d} = ${c - d}. Puis ${a + b} × ${c - d} = ${(a + b) * (c - d)}.` };
  }
  if (b <= c || 20 + a < b - c) return null;
  return { enonce: `Calculer ${20 + a} − (${b} − ${c})`, reponse: String(20 + a - (b - c)),
    correction: `Les parenthèses d'abord : ${b} − ${c} = ${b - c}, puis ${20 + a} − ${b - c} = ${20 + a - (b - c)}.` };
} });

G5.push({ code: 'CAL3', theme: 'nombres', chapitre: '5e-calcul', nombre: 5, creer() {
  const a = ent(2, 9), b = ent(2, 9), c = ent(2, 9);
  const [calcul, bonne, raison] = choix([
    [`${a} × (${b} + ${c})`, 'un produit', `la dernière opération effectuée est la multiplication par ${a}`],
    [`${a} + ${b} × ${c}`, 'une somme', `on calcule d'abord ${b} × ${c}, et la dernière opération est l'addition`],
    [`(${a} + ${b}) − ${c}`, 'une différence', 'la dernière opération effectuée est la soustraction'],
    [`${a * b} ÷ (${b} + ${c})`, 'un quotient', 'la dernière opération effectuée est la division'],
    [`${a} × ${b} + ${c}`, 'une somme', `on calcule d'abord ${a} × ${b}, et la dernière opération est l'addition`],
  ]);
  return { enonce: `Le calcul ${calcul} est…`, reponse: bonne, faux: qcm(bonne, ['une somme', 'une différence', 'un produit', 'un quotient']),
    correction: `C'est ${bonne} : ${raison}.` };
} });

G5.push({ code: 'CAL4', theme: 'nombres', chapitre: '5e-calcul', nombre: 5, creer() {
  const a = ent(2, 9), b = ent(2, 9), c = ent(2, 9);
  const [phrase, bonne, faux] = choix([
    [`la somme de ${a} et du produit de ${b} par ${c}`, `${a} + ${b} × ${c}`, [`(${a} + ${b}) × ${c}`, `${a} × ${b} + ${c}`, `${a} + ${b} + ${c}`]],
    [`le produit de ${a} par la somme de ${b} et ${c}`, `${a} × (${b} + ${c})`, [`${a} × ${b} + ${c}`, `${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`]],
    [`la différence entre ${a * 10} et le produit de ${b} par ${c}`, `${a * 10} − ${b} × ${c}`, [`(${a * 10} − ${b}) × ${c}`, `${b} × ${c} − ${a * 10}`, `${a * 10} × ${b} − ${c}`]],
    [`le quotient de la somme de ${a} et ${b} par ${c}`, `(${a} + ${b}) ÷ ${c}`, [`${a} + ${b} ÷ ${c}`, `${c} ÷ (${a} + ${b})`, `${a} ÷ ${c} + ${b}`]],
  ]);
  return { enonce: `Quelle expression correspond à « ${phrase} » ?`, reponse: bonne, faux,
    correction: `On repère la dernière opération (le mot principal de la phrase), puis ce sur quoi elle porte, avec des parenthèses si besoin : ${bonne}.` };
} });

G5.push({ code: 'CAL5', theme: 'nombres', chapitre: '5e-calcul', nombre: 5, creer() {
  const depart = ent(2, 12), a = ent(1, 9), m = ent(2, 5), s = ent(1, 9);
  const v1 = depart + a, v2 = v1 * m, v3 = v2 - s;
  return { enonce: `Programme de calcul : choisir un nombre, ajouter ${a}, multiplier le résultat par ${m}, puis soustraire ${s}. Quel résultat obtient-on avec ${depart} ?`, reponse: String(v3),
    correction: `On suit les étapes : ${depart} → ${depart} + ${a} = ${v1} → ${v1} × ${m} = ${v2} → ${v2} − ${s} = ${v3}.` };
} });

// =============================================================
// NOMBRES — Relatifs : ordre et repérage, addition (5e-relatifs…)
// =============================================================

G5.push({ code: 'REL1', theme: 'nombres', chapitre: '5e-relatifs', nombre: 6, creer() {
  const n = entNonNul(-30, 30);
  if (hasard() < 0.5) return { enonce: `Quel est l'opposé de ${fr(n)} ?`, reponse: fr(-n),
    correction: `L'opposé d'un nombre a la même distance à zéro, mais le signe contraire : l'opposé de ${fr(n)} est ${fr(-n)}.` };
  return { enonce: `Quelle est la distance à zéro de ${fr(n)} ?`, reponse: String(Math.abs(n)),
    correction: `La distance à zéro est le nombre sans son signe : ${fr(n)} est à ${Math.abs(n)} unités de zéro.` };
} });

G5.push({ code: 'REL2', theme: 'nombres', chapitre: '5e-relatifs', nombre: 7, creer() {
  if (hasard() < 0.5) {
    const a = entNonNul(-15, 15), b = entNonNul(-15, 15);
    if (a === b || (a > 0 && b > 0)) return null;
    const bonne = a < b ? '<' : '>';
    return { enonce: `Compléter par < ou > :  ${fr(a)} … ${fr(b)}`, reponse: bonne, faux: [bonne === '<' ? '>' : '<'],
      correction: a < 0 && b < 0 ? `Deux nombres négatifs : le plus petit est celui qui a la plus grande distance à zéro. Donc ${fr(a)} ${bonne} ${fr(b)}.` : `Un nombre négatif est toujours plus petit qu'un nombre positif : ${fr(a)} ${bonne} ${fr(b)}.` };
  }
  const nombres = [];
  while (nombres.length < 4) { const n = entNonNul(-20, 20); if (!nombres.includes(n)) nombres.push(n); }
  const plusGrand = hasard() < 0.5, cible = plusGrand ? Math.max(...nombres) : Math.min(...nombres);
  return { enonce: `Quel est le plus ${plusGrand ? 'grand' : 'petit'} de ces nombres ?`, reponse: fr(cible), faux: nombres.filter(n => n !== cible).map(fr),
    correction: `Rangés dans l'ordre croissant : ${[...nombres].sort((x, y) => x - y).map(fr).join(' < ')}. Le plus ${plusGrand ? 'grand' : 'petit'} est ${fr(cible)}.` };
} });

reprendre5('4e', 'ABS1', 'ABS1', 'nombres', '5e-relatifs', 6);
reprendre5('4e', 'COO1', 'COO1', 'geometrie', '5e-relatifs', 6);
reprendre5('4e', 'REL1', 'ADD1', 'nombres', '5e-relatifs-addition', 7);
reprendre5('4e', 'REL2', 'ADD2', 'nombres', '5e-relatifs-addition', 7);
reprendre5('4e', 'REL7', 'ADD3', 'nombres', '5e-relatifs-addition', 5);

G5.push({ code: 'ADD4', theme: 'nombres', chapitre: '5e-relatifs-addition', nombre: 5, creer() {
  const a = entNonNul(-12, 12), r = entNonNul(-12, 12);
  if (a === r || (a > 0 && r > 0)) return null;   // au moins un nombre négatif
  const b = r - a;
  return { enonce: `Compléter : ${fr(a)} + … = ${fr(r)}`, reponse: fr(b),
    correction: `On cherche ce qu'il faut ajouter à ${fr(a)} pour obtenir ${fr(r)} : ${fr(r)} − ${par(a)} = ${fr(b)}. Vérification : ${fr(a)} + ${par(b)} = ${fr(r)}.` };
} });

// =============================================================
// NOMBRES — Divisibilité (5e-divisibilite)
// =============================================================

G5.push({ code: 'DIV1', theme: 'nombres', chapitre: '5e-divisibilite', nombre: 8, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const d = ent(3, 12), q = ent(4, 15), n = d * q + (hasard() < 0.5 ? 0 : ent(1, d - 1));
    const oui = n % d === 0;
    return { enonce: `${d} est-il un diviseur de ${n} ?`, reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'],
      correction: oui ? `Oui : ${n} = ${d} × ${n / d}, la division tombe juste.` : `Non : ${d} × ${Math.floor(n / d)} = ${d * Math.floor(n / d)} et il reste ${n % d}.` };
  }
  if (forme === 2) {
    const d = ent(3, 12), seuil = ent(20, 90), m = (Math.floor(seuil / d) + 1) * d;
    return { enonce: `Quel est le plus petit multiple de ${d} strictement supérieur à ${seuil} ?`, reponse: String(m),
      correction: `${d} × ${Math.floor(seuil / d)} = ${d * Math.floor(seuil / d)} (pas assez), ${d} × ${m / d} = ${m}. Réponse : ${m}.` };
  }
  const d = choix([3, 4, 6, 7, 8, 9]), bon = d * ent(5, 15);
  const autres = [bon + 1, bon + 2, bon - 1, bon + d - 1].filter(n => n % d !== 0);
  return { enonce: `Lequel de ces nombres est un multiple de ${d} ?`, reponse: String(bon), faux: qcm(String(bon), autres.map(String)),
    correction: `${bon} = ${d} × ${bon / d} : c'est un multiple de ${d}. Les autres ne sont pas dans la table de ${d}.` };
} });

G5.push({ code: 'DIV2', theme: 'nombres', chapitre: '5e-divisibilite', nombre: 6, creer() {
  const premiers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  if (hasard() < 0.3) {
    const n = choix([10, 20, 30]), liste = premiers.filter(p => p < n);
    return { enonce: `Combien y a-t-il de nombres premiers inférieurs à ${n} ?`, reponse: String(liste.length),
      correction: `Ce sont ${liste.join(', ')} : il y en a ${liste.length}. (1 n'est pas premier : il n'a qu'un seul diviseur.)` };
  }
  const p = choix(premiers.filter(x => x > 2));
  const composes = melangeH([[9, '3 × 3'], [15, '3 × 5'], [21, '3 × 7'], [25, '5 × 5'], [27, '3 × 9'], [1, 'un seul diviseur'], [14, '2 × 7'], [22, '2 × 11']]).slice(0, 3);
  return { enonce: 'Lequel de ces nombres est premier ?', reponse: String(p), faux: composes.map(c => String(c[0])),
    correction: `${composes.map(c => c[0] === 1 ? '1 n\'a qu\'un seul diviseur' : `${c[0]} = ${c[1]}`).join(' ; ')}. ${p} n'a que deux diviseurs, 1 et ${p} : il est premier.` };
} });

reprendre5('4e', 'FRA8', 'DIV3', 'nombres', '5e-divisibilite', 6);

// =============================================================
// NOMBRES — Puissances (5e-puissances)
// =============================================================

G5.push({ code: 'PUI1', theme: 'nombres', chapitre: '5e-puissances', nombre: 8, creer() {
  const forme = ent(1, 3);
  if (forme === 1) { const n = ent(2, 12); return { enonce: `Calculer ${n}²`, reponse: String(n * n), correction: `${n}² = ${n} × ${n} = ${n * n}.` }; }
  if (forme === 2) { const n = choix([2, 3, 4, 5, 10]); return { enonce: `Calculer ${n}³`, reponse: String(n ** 3), correction: `${n}³ = ${n} × ${n} × ${n} = ${n ** 3}.` }; }
  const n = ent(2, 12);
  return { enonce: `Quel nombre positif a pour carré ${n * n} ?`, reponse: String(n), correction: `${n} × ${n} = ${n * n}, donc c'est ${n}.` };
} });

G5.push({ code: 'PUI2', theme: 'nombres', chapitre: '5e-puissances', nombre: 7, creer() {
  const a = ent(2, 9), b = ent(2, 6), c = ent(2, 5);
  const forme = ent(1, 4);
  if (forme === 1) return { enonce: `Calculer ${a} + ${b}²`, reponse: String(a + b * b),
    correction: `La puissance est prioritaire : ${b}² = ${b * b}, puis ${a} + ${b * b} = ${a + b * b}.` };
  if (forme === 2) return { enonce: `Calculer ${a} × ${b}²`, reponse: String(a * b * b),
    correction: `La puissance est prioritaire sur la multiplication : ${b}² = ${b * b}, puis ${a} × ${b * b} = ${a * b * b}.` };
  if (forme === 3) return { enonce: `Calculer (${a} + ${c})²`, reponse: String((a + c) ** 2),
    correction: `Les parenthèses d'abord : ${a} + ${c} = ${a + c}, puis ${a + c}² = ${(a + c) ** 2}.` };
  if (a <= c) return null;
  return { enonce: `Calculer ${a}² − ${c}²`, reponse: String(a * a - c * c),
    correction: `${a}² = ${a * a} et ${c}² = ${c * c}, donc ${a * a} − ${c * c} = ${a * a - c * c}.` };
} });

// =============================================================
// NOMBRES — Écritures fractionnaires (5e-fractions, 5e-fractions-addition)
// =============================================================

reprendre5('4e', 'FRA9', 'FRA1', 'nombres', '5e-fractions', 5);
reprendre5('4e', 'FRA1', 'FRA2', 'nombres', '5e-fractions', 5);
reprendre5('4e', 'FRA5', 'FRA3', 'nombres', '5e-fractions', 4);
reprendre5('4e', 'FRB4', 'FRA4', 'nombres', '5e-fractions', 5);

G5.push({ code: 'FRA5', theme: 'nombres', chapitre: '5e-fractions', nombre: 7, creer() {
  const d = choix([2, 3, 4, 5, 6]), n = d <= 3 ? 3 * d : 2 * d;
  let k;
  do { k = ent(1, n - 1); } while (k % d === 0);
  return { enonce: 'Quelle fraction correspond à l\'abscisse du point A ?', reponse: frac(k, d), variantes: [fracBrute(k, d)],
    svg: svgDroiteGraduee(0, 1 / d, n, d, k, 'A'),
    correction: `L'unité est partagée en ${d} parts égales : chaque graduation vaut 1/${d}. A est à ${k} graduation${k > 1 ? 's' : ''} de 0 : son abscisse est ${k}/${d}${frac(k, d) !== `${k}/${d}` ? ` = ${frac(k, d)}` : ''}.` };
} });

G5.push({ code: 'FRA6', theme: 'nombres', chapitre: '5e-fractions', nombre: 6, creer() {
  const n = choix([4, 5, 6, 8, 10, 12]), k = ent(1, n - 1);
  return { enonce: 'Quelle fraction de la bande est coloriée ?', reponse: frac(k, n), variantes: [fracBrute(k, n)], svg: svgBande(n, k),
    correction: `La bande est partagée en ${n} parts égales et ${k} sont coloriées : ${k}/${n}${frac(k, n) !== `${k}/${n}` ? ` = ${frac(k, n)}` : ''}.` };
} });

reprendre5('4e', 'FRA2', 'FRB1', 'nombres', '5e-fractions-addition', 5);
reprendre5('4e', 'FRA3', 'FRB2', 'nombres', '5e-fractions-addition', 5);
reprendre5('4e', 'FRA4', 'FRB3', 'nombres', '5e-fractions-addition', 3);

G5.push({ code: 'FRB4', theme: 'nombres', chapitre: '5e-fractions-addition', nombre: 4, creer() {
  const e = ent(1, 4), a = ent(1, 7), b = ent(2, 8);
  if (a >= b || pgcd(a, b) !== 1) return null;
  return { enonce: `Calculer ${e} + ${a}/${b} (sous forme d'une fraction)`, reponse: frac(e * b + a, b),
    correction: `${e} = ${e * b}/${b}. Donc ${e} + ${a}/${b} = ${e * b}/${b} + ${a}/${b} = ${e * b + a}/${b}.` };
} });

// =============================================================
// NOMBRES — Calcul littéral et équations (5e-calcul-litteral, 5e-equations)
// =============================================================

G5.push({ code: 'LIT1', theme: 'nombres', chapitre: '5e-calcul-litteral', nombre: 6, creer() {
  const a = ent(2, 9), b = ent(2, 9);
  const [ecriture, bonne, faux] = choix([
    [`${a} × x`, `${a}x`, [`x${a}`, `${a} + x`, `x²`]],
    [`x × ${a}`, `${a}x`, [`x + ${a}`, `${a}x²`, `x${a}`]],
    [`x × x`, 'x²', ['2x', 'xx2', 'x + x']],
    [`${a} × x × x`, `${a}x²`, [`${2 * a}x`, `${a}x`, `(${a}x)²`]],
    [`x × x × x`, 'x³', ['3x', 'x²', '3x³']],
    [`${a} × x + ${b} × y`, `${a}x + ${b}y`, [`${a + b}xy`, `${a * b}xy`, `${a}x × ${b}y`]],
  ]);
  return { enonce: `Écrire plus simplement : ${ecriture}`, reponse: bonne, faux,
    correction: `On peut supprimer le signe × devant une lettre et écrire le nombre en premier. ${ecriture} = ${bonne}${bonne.includes('²') ? ' (x × x se note x²)' : bonne.includes('³') ? ' (x × x × x se note x³)' : ''}.` };
} });

G5.push({ code: 'LIT2', theme: 'nombres', chapitre: '5e-calcul-litteral', nombre: 7, creer() {
  const [a, b, astuce, resultat] = choix([
    [25, 4 * ent(2, 9), null, null], [99, ent(3, 12), null, null], [101, ent(12, 45), null, null], [ent(12, 39), 11, null, null], [ent(12, 25), 9, null, null],
  ]);
  const p = a * b;
  let correction;
  if (a === 25) correction = `25 × ${b} = 25 × 4 × ${b / 4} = 100 × ${b / 4} = ${p}.`;
  else if (a === 99) correction = `99 × ${b} = (100 − 1) × ${b} = ${100 * b} − ${b} = ${p}.`;
  else if (a === 101) correction = `101 × ${b} = (100 + 1) × ${b} = ${100 * b} + ${b} = ${p}.`;
  else if (b === 11) correction = `${a} × 11 = ${a} × (10 + 1) = ${10 * a} + ${a} = ${p}.`;
  else correction = `${a} × 9 = ${a} × (10 − 1) = ${10 * a} − ${a} = ${p}.`;
  return { enonce: `Calculer astucieusement ${a} × ${b}`, reponse: fr(p), correction: `On utilise la distributivité : ${correction}` };
} });

reprendre5('4e', 'LIT1', 'LIT3', 'nombres', '5e-calcul-litteral', 5);
reprendre5('4e', 'LIT2', 'LIT4', 'nombres', '5e-calcul-litteral', 4);
reprendre5('4e', 'LIT7', 'LIT5', 'nombres', '5e-calcul-litteral', 4);
reprendre5('4e', 'LIT6', 'LIT6', 'nombres', '5e-calcul-litteral', 4);

G5.push({ code: 'EQU1', theme: 'nombres', chapitre: '5e-equations', nombre: 8, creer() {
  const forme = ent(1, 4), x = ent(2, 30), a = ent(2, 9), b = ent(3, 40);
  if (forme === 1) return { enonce: `Trouver le nombre manquant : … + ${b} = ${x + b}`, reponse: String(x),
    correction: `On fait l'opération inverse : ${x + b} − ${b} = ${x}.` };
  if (forme === 2) return { enonce: `Trouver le nombre manquant : ${a} × … = ${a * x}`, reponse: String(x),
    correction: `On fait l'opération inverse : ${a * x} ÷ ${a} = ${x}.` };
  if (forme === 3) return { enonce: `Résoudre x − ${b} = ${x}`, reponse: String(x + b), variantes: [`x = ${x + b}`],
    correction: `On ajoute ${b} : x = ${x} + ${b} = ${x + b}.` };
  return { enonce: `Résoudre ${a}x = ${a * x}`, reponse: String(x), variantes: [`x = ${x}`],
    correction: `${a}x signifie ${a} × x. On divise par ${a} : x = ${a * x} ÷ ${a} = ${x}.` };
} });

// =============================================================
// DONNÉES — Proportionnalité (5e-proportionnalite)
// =============================================================

G5.push({ code: 'PRO1', theme: 'donnees', chapitre: '5e-proportionnalite', nombre: 7, creer() {
  const k = choix([2, 3, 4, 5, 1.5, 2.5, 6]), xs = melangeH([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 4).sort((a, b) => a - b);
  const i = ent(0, 3), ys = xs.map(x => fr(k * x));
  const affichees = ys.map((y, j) => j === i ? '?' : y);
  return { enonce: 'Ce tableau est un tableau de proportionnalité. Quel nombre remplace le « ? » ?', reponse: fr(k * xs[i]),
    svg: svgTableau('', xs.map(String), '', affichees),
    correction: `On passe de la 1re ligne à la 2e en multipliant par ${fr(k)} (par exemple ${xs[(i + 1) % 4]} × ${fr(k)} = ${ys[(i + 1) % 4]}). Donc ? = ${xs[i]} × ${fr(k)} = ${fr(k * xs[i])}.` };
} });

G5.push({ code: 'PRO2', theme: 'donnees', chapitre: '5e-proportionnalite', nombre: 5, creer() {
  const k = ent(2, 6), xs = melangeH([1, 2, 3, 4, 5, 6]).slice(0, 3).sort((a, b) => a - b);
  const oui = hasard() < 0.5;
  const ys = xs.map((x, j) => (j === 2 && !oui) ? k * x + choix([-1, 1]) : k * x);
  return { enonce: 'Ce tableau est-il un tableau de proportionnalité ?', reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'],
    svg: svgTableau('', xs.map(String), '', ys.map(String)),
    correction: oui ? `Oui : on passe toujours de la 1re ligne à la 2e en multipliant par ${k} (${xs.map((x, j) => `${ys[j]} ÷ ${x} = ${k}`).join(' ; ')}).`
      : `Non : ${ys[0]} ÷ ${xs[0]} = ${k}, mais ${ys[2]} ÷ ${xs[2]} = ${fr(arrondi(ys[2] / xs[2], 2))}${ys[2] % xs[2] ? ' environ' : ''}. Le coefficient n'est pas le même.` };
} });

reprendre5('4e', 'PRO1', 'PRO3', 'donnees', '5e-proportionnalite', 6);
reprendre5('4e', 'PRO2', 'PRO4', 'donnees', '5e-proportionnalite', 4);
reprendre5('4e', 'PRO5', 'PRO5', 'donnees', '5e-proportionnalite', 6);
reprendre5('4e', 'PRO7', 'PRO6', 'donnees', '5e-proportionnalite', 4);
reprendre5('4e', 'PRO8', 'PRO7', 'donnees', '5e-proportionnalite', 5);
reprendre5('4e', 'PRO3', 'PRO8', 'donnees', '5e-proportionnalite', 4);
reprendre5('4e', 'PRO4', 'PRO9', 'donnees', '5e-proportionnalite', 4);

// =============================================================
// DONNÉES — Statistique et probabilité (5e-stats-probas)
// =============================================================

reprendre5('4e', 'STA1', 'STA1', 'donnees', '5e-stats-probas', 6);
reprendre5('4e', 'STA4', 'STA2', 'donnees', '5e-stats-probas', 4);
reprendre5('4e', 'STA5', 'STA3', 'donnees', '5e-stats-probas', 7);
reprendre5('4e', 'STA6', 'STA4', 'donnees', '5e-stats-probas', 3);
reprendre5('4e', 'PRB1', 'PRB1', 'donnees', '5e-stats-probas', 6);
reprendre5('4e', 'PRB2', 'PRB2', 'donnees', '5e-stats-probas', 6);
reprendre5('4e', 'PRB4', 'PRB3', 'donnees', '5e-stats-probas', 5);

// =============================================================
// GRANDEURS — Aires et périmètres, espace et volumes
// =============================================================

G5.push({ code: 'PER1', theme: 'grandeurs', chapitre: '5e-aires', nombre: 9, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const L = ent(3, 15), l = ent(2, L - 1);
    return { enonce: `Quel est le périmètre d'un rectangle de ${L} cm sur ${l} cm (en cm) ?`, reponse: String(2 * (L + l)),
      correction: `Périmètre = 2 × (longueur + largeur) = 2 × (${L} + ${l}) = ${2 * (L + l)} cm.` };
  }
  if (forme === 2) {
    const c = ent(2, 15);
    return { enonce: `Quel est le périmètre d'un carré de côté ${c} cm (en cm) ?`, reponse: String(4 * c),
      correction: `Périmètre = 4 × côté = 4 × ${c} = ${4 * c} cm.` };
  }
  const r = ent(1, 10), bonne = `${2 * r}π cm`;
  return { enonce: `Quel est le périmètre exact d'un cercle de rayon ${r} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${r * r}π cm`, `${r}π cm`, `${4 * r}π cm`, `${2 * r * r}π cm`]),
    correction: `Périmètre du cercle = 2 × π × rayon = 2 × π × ${r} = ${2 * r}π cm.` };
} });

G5.push({ code: 'AIR1', theme: 'grandeurs', chapitre: '5e-aires', nombre: 8, creer() {
  const L = ent(5, 12), h1 = ent(2, 5), l = ent(2, L - 2), h2 = ent(2, 5);
  const aire = L * h1 + l * h2, perimetre = 2 * (L + h1 + h2);
  if (hasard() < 0.6) return { enonce: 'Quelle est l\'aire de cette figure (en cm²) ?', reponse: String(aire), svg: svgFigureL(L, h1, l, h2),
    correction: `On découpe la figure en deux rectangles : ${L} × ${h1} = ${L * h1} cm² (en bas) et ${l} × ${h2} = ${l * h2} cm² (en haut). Total : ${L * h1} + ${l * h2} = ${aire} cm².` };
  return { enonce: 'Quel est le périmètre de cette figure (en cm) ?', reponse: String(perimetre), svg: svgFigureL(L, h1, l, h2),
    correction: `On fait le tour de la figure. Les côtés horizontaux font en tout 2 × ${L} = ${2 * L} cm et les côtés verticaux 2 × ${h1 + h2} = ${2 * (h1 + h2)} cm. Périmètre : ${2 * L} + ${2 * (h1 + h2)} = ${perimetre} cm.` };
} });

reprendre5('4e', 'AIR1', 'AIR2', 'grandeurs', '5e-aires', 6);
reprendre5('4e', 'AIR2', 'AIR3', 'grandeurs', '5e-aires', 4);
reprendre5('4e', 'AIR3', 'AIR4', 'grandeurs', '5e-aires', 4);

const CONVERSIONS_LONGUEUR = [['km', 'm', 1000], ['m', 'cm', 100], ['m', 'mm', 1000], ['cm', 'mm', 10], ['dm', 'cm', 10], ['m', 'dm', 10], ['hm', 'm', 100]];
G5.push({ code: 'CON1', theme: 'grandeurs', chapitre: '5e-aires', nombre: 8, creer() {
  const [grande, petite, f] = choix(CONVERSIONS_LONGUEUR), x = choix([2, 3.5, 0.5, 1.25, 4.2, 0.75, 12, 0.08]);
  if (hasard() < 0.6) return { enonce: `Convertir ${fr(x)} ${grande} en ${petite}`, reponse: fr(x * f), variantes: [`${fr(x * f)} ${petite}`],
    correction: `1 ${grande} = ${fr(f)} ${petite}, donc ${fr(x)} ${grande} = ${fr(x)} × ${fr(f)} = ${fr(x * f)} ${petite}.` };
  return { enonce: `Convertir ${fr(x * f)} ${petite} en ${grande}`, reponse: fr(x), variantes: [`${fr(x)} ${grande}`],
    correction: `1 ${grande} = ${fr(f)} ${petite}, donc on divise par ${fr(f)} : ${fr(x * f)} ${petite} = ${fr(x)} ${grande}.` };
} });

reprendre5('4e', 'VOL1', 'VOL1', 'grandeurs', '5e-espace', 7);
reprendre5('4e', 'VOL2', 'VOL2', 'grandeurs', '5e-espace', 5);
reprendre5('4e', 'VOL5', 'VOL3', 'grandeurs', '5e-espace', 7);
reprendre5('4e', 'DUR1', 'DUR1', 'grandeurs', '5e-calcul', 4);

// =============================================================
// GÉOMÉTRIE — Triangles, angles et parallélisme
// =============================================================

G5.push({ code: 'TRI1', theme: 'geometrie', chapitre: '5e-triangles', nombre: 7, creer() {
  const a = ent(2, 9), b = ent(2, 9), possible = hasard() < 0.5;
  const c = possible ? ent(Math.abs(a - b) + 1, a + b - 1) : a + b + ent(0, 4);
  const cotes = melangeH([a, b, c]), max = Math.max(...cotes), autres = cotes.filter((_, i) => i !== cotes.indexOf(max));
  const ok = max < autres[0] + autres[1];
  return { enonce: `Peut-on construire un triangle dont les côtés mesurent ${cotes.join(' cm, ')} cm ?`, reponse: ok ? 'Oui' : 'Non', faux: [ok ? 'Non' : 'Oui'],
    correction: `Inégalité triangulaire : le plus grand côté (${max} cm) doit être plus petit que la somme des deux autres (${autres[0]} + ${autres[1]} = ${autres[0] + autres[1]} cm). ${ok ? 'C\'est le cas : le triangle est constructible.' : (max === autres[0] + autres[1] ? 'Ici il y a égalité : les trois points seraient alignés, le triangle est « aplati ».' : 'Ce n\'est pas le cas : impossible.')}` };
} });

reprendre5('4e', 'DEM3', 'TRI2', 'geometrie', '5e-triangles', 5);
reprendre5('4e', 'DEM1', 'ANG1', 'geometrie', '5e-angles', 6);

G5.push({ code: 'ANG2', theme: 'geometrie', chapitre: '5e-angles', nombre: 10, creer() {
  const theta = ent(35, 75);
  const valeur = (pos) => (pos === 'HD' || pos === 'BG') ? theta : 180 - theta;
  const p1 = choix(['HD', 'BD', 'BG', 'HG']), p2 = choix(['HD', 'BD', 'BG', 'HG']);
  const [point1, point2] = choix([['A', 'B'], ['B', 'A']]);
  // Nom de la relation entre les deux angles
  const haut = point1 === 'A' ? p1 : p2, bas = point1 === 'A' ? p2 : p1;
  let relation;
  if (p1 === p2) relation = 'correspondants : ils ont la même mesure';
  else if ((haut === 'BG' && bas === 'HD') || (haut === 'BD' && bas === 'HG')) relation = 'alternes-internes : ils ont la même mesure';
  else if ((haut === 'HG' && bas === 'BD') || (haut === 'HD' && bas === 'BG')) relation = 'alternes-externes : ils ont la même mesure';
  else relation = valeur(p1) === valeur(p2) ? 'de même mesure (l\'un est opposé par le sommet au correspondant de l\'autre)' : 'supplémentaires : leur somme vaut 180°';
  const v1 = valeur(p1), v2 = valeur(p2);
  return { enonce: 'Les droites (d) et (d\') sont parallèles. Combien mesure l\'angle marqué « ? » (en °) ?', reponse: String(v2), variantes: [`${v2}°`],
    svg: svgParalleles(theta, [{ point: point1, position: p1, texte: `${v1}°` }, { point: point2, position: p2, texte: '?' }]),
    correction: `Les deux angles marqués sont ${relation}. ${v1 === v2 ? `Donc ? = ${v2}°.` : `Donc ? = 180 − ${v1} = ${v2}°.`}` };
} });

G5.push({ code: 'ANG3', theme: 'geometrie', chapitre: '5e-angles', nombre: 4, creer() {
  const a = ent(20, 160);
  if (hasard() < 0.5) return { enonce: `Deux angles sont supplémentaires. L'un mesure ${a}°. Combien mesure l'autre (en °) ?`, reponse: String(180 - a), variantes: [`${180 - a}°`],
    correction: `Deux angles supplémentaires ont une somme de 180° : 180 − ${a} = ${180 - a}°.` };
  return { enonce: `Deux angles sont opposés par le sommet. L'un mesure ${a}°. Combien mesure l'autre (en °) ?`, reponse: String(a), variantes: [`${a}°`],
    correction: `Deux angles opposés par le sommet ont la même mesure : ${a}°.` };
} });

// =============================================================
// GÉOMÉTRIE — Symétrie centrale, parallélogrammes, démonstration
// =============================================================

reprendre5('4e', 'SYM1', 'SYM1', 'geometrie', '5e-symetrie-centrale', 7);

G5.push({ code: 'SYM2', theme: 'geometrie', chapitre: '5e-symetrie-centrale', nombre: 6, creer() {
  if (hasard() < 0.5) {
    const avec = choix(['S', 'N', 'Z', 'O', 'H', 'X', 'I']), sans = melangeH(['A', 'T', 'V', 'E', 'K', 'U', 'M', 'W', 'Y']).slice(0, 3);
    return { enonce: 'Laquelle de ces lettres (majuscules d\'imprimerie) a un centre de symétrie ?', reponse: avec, faux: sans,
      correction: `Si on fait faire un demi-tour à la lettre ${avec} autour de son centre, elle se superpose à elle-même. Ce n'est pas le cas de ${sans.join(', ')}.` };
  }
  const [question, bonne, faux] = choix([
    ['Laquelle de ces figures a toujours un centre de symétrie ?', 'un parallélogramme', ['un triangle équilatéral', 'un trapèze', 'un triangle isocèle']],
    ['La symétrie centrale conserve…', 'les longueurs, les angles et les aires', ['seulement les longueurs', 'seulement les angles', 'rien du tout']],
    ['Par une symétrie centrale, l\'image d\'une droite est…', 'une droite parallèle', ['une droite perpendiculaire', 'la même droite toujours', 'un point']],
    ['Le centre de symétrie d\'un parallélogramme est…', 'le point d\'intersection de ses diagonales', ['un de ses sommets', 'le milieu d\'un côté', 'il n\'en a pas']],
  ]);
  return { enonce: question, reponse: bonne, faux, correction: `${question.replace('…', '')} ${bonne}.` };
} });

reprendre5('4e', 'DEM2', 'PAR1', 'geometrie', '5e-parallelogramme', 6);

G5.push({ code: 'PAR2', theme: 'geometrie', chapitre: '5e-parallelogramme', nombre: 5, creer() {
  const a = ent(40, 140), [A, B, C, D] = choix(['ABCD', 'EFGH', 'MNPQ', 'RSTU']).split('');
  if (a === 90) return null;
  if (hasard() < 0.5) return { enonce: `${A}${B}${C}${D} est un parallélogramme et l'angle ${A}̂ mesure ${a}°. Combien mesure l'angle ${B}̂ (en °) ?`, reponse: String(180 - a), variantes: [`${180 - a}°`],
    correction: `Dans un parallélogramme, deux angles consécutifs sont supplémentaires : ${B}̂ = 180 − ${a} = ${180 - a}°.` };
  return { enonce: `${A}${B}${C}${D} est un parallélogramme et l'angle ${A}̂ mesure ${a}°. Combien mesure l'angle ${C}̂ (en °) ?`, reponse: String(a), variantes: [`${a}°`],
    correction: `Dans un parallélogramme, les angles opposés ont la même mesure : ${C}̂ = ${A}̂ = ${a}°.` };
} });

const CHAINONS = [
  ['On sait que (d) ⊥ (Δ) et (d\') ⊥ (Δ). Quelle propriété permet de conclure que (d) // (d\') ?', 'Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles.', ['Si deux droites sont parallèles, alors toute perpendiculaire à l\'une est perpendiculaire à l\'autre.', 'Si deux droites sont parallèles à une même droite, alors elles sont parallèles.', 'Deux droites sécantes ont un seul point commun.']],
  ['On sait que les diagonales de ABCD se coupent en leur milieu. On veut prouver que ABCD est un parallélogramme. Quelle propriété utiliser ?', 'Si les diagonales d\'un quadrilatère se coupent en leur milieu, alors c\'est un parallélogramme.', ['Si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu.', 'Si un quadrilatère a quatre angles droits, alors c\'est un rectangle.', 'Si un quadrilatère a quatre côtés égaux, alors c\'est un losange.']],
  ['Dans une démonstration, la phrase « Si un triangle a deux côtés de même longueur, alors il est isocèle » est…', 'une propriété (ou une définition) qu\'on utilise', ['une donnée de l\'énoncé', 'la conclusion', 'une hypothèse à vérifier sur la figure']],
  ['On sait que O est le milieu de [AA\']. Que peut-on en conclure ?', 'A\' est le symétrique de A par rapport à O.', ['A est le milieu de [OA\'].', 'OA = 2 × OA\'.', 'A, O et A\' ne sont pas alignés.']],
  ['On sait que deux angles alternes-internes formés par (d), (d\') et une sécante ont la même mesure. On peut en conclure que…', '(d) et (d\') sont parallèles.', ['(d) et (d\') sont perpendiculaires.', 'les angles mesurent 90°.', 'la sécante est parallèle à (d).']],
];
G5.push({ code: 'DEM1', theme: 'geometrie', chapitre: '5e-demonstration', nombre: 5, creer() {
  const [question, bonne, faux] = choix(CHAINONS);
  return { enonce: question, reponse: bonne, faux,
    correction: `Une démonstration enchaîne : données (ce que l'on sait) → propriété → conclusion. Ici : ${bonne}` };
} });

// =============================================================
// ALGORITHMIQUE ET TABLEUR (5e-algo, toute l'année)
// =============================================================

reprendre5('4e', 'ALG1', 'ALG1', 'algo', '5e-algo', 6);
reprendre5('4e', 'ALG2', 'ALG2', 'algo', '5e-algo', 5);
reprendre5('4e', 'ALG3', 'ALG3', 'algo', '5e-algo', 5);
reprendre5('4e', 'ALG4', 'ALG4', 'algo', '5e-algo', 6);
reprendre5('4e', 'ALG5', 'ALG5', 'algo', '5e-algo', 4);
reprendre5('4e', 'ALG6', 'ALG6', 'algo', '5e-algo', 4);
reprendre5('4e', 'ALG7', 'ALG7', 'algo', '5e-algo', 4);
reprendre5('4e', 'ALG10', 'ALG8', 'algo', '5e-algo', 5);
reprendre5('3e', 'TAB1', 'TAB1', 'algo', '5e-algo', 6);
reprendre5('3e', 'TAB2', 'TAB2', 'algo', '5e-algo', 4);
