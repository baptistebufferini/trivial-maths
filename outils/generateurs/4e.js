// =============================================================
// GÉNÉRATEURS DE QUESTIONS DE 4e
// Chaque générateur fabrique « nombre » questions d'un même type.
//   code     : sert à l'identifiant (ex. G4-REL1-03)
//   theme    : nombres, donnees, grandeurs, geometrie ou algo
//   chapitre : code de l'onglet Progressions
//   creer()  : renvoie { enonce, reponse, variantes?, faux?, correction, svg? }
//              (avec « faux » → QCM ; sans → réponse à taper)
// =============================================================

GENERATEURS['4e'] = [];
const G4 = GENERATEURS['4e'];

// =============================================================
// NOMBRES — Opérations sur les relatifs (4e-relatifs)
// =============================================================

G4.push({ code: 'REL1', theme: 'nombres', chapitre: '4e-relatifs', nombre: 6, creer() {
  const a = entNonNul(-20, 20), b = entNonNul(-20, 20);
  if (a > 0 && b > 0) return null;
  const s = a + b;
  const correction = (a < 0) === (b < 0)
    ? `Même signe : on ajoute les distances à zéro (${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(s)}) et on garde le signe. Résultat : ${fr(s)}.`
    : `Signes contraires : on soustrait les distances à zéro (${Math.max(Math.abs(a), Math.abs(b))} − ${Math.min(Math.abs(a), Math.abs(b))} = ${Math.abs(s)}) et on prend le signe du nombre le plus éloigné de zéro. Résultat : ${fr(s)}.`;
  return { enonce: `Calculer ${fr(a)} + ${par(b)}`, reponse: fr(s), correction };
} });

G4.push({ code: 'REL2', theme: 'nombres', chapitre: '4e-relatifs', nombre: 6, creer() {
  const a = entNonNul(-15, 15), b = entNonNul(-15, 15);
  if (b > 0 && a > 0) return null;
  return { enonce: `Calculer ${fr(a)} − ${par(b)}`, reponse: fr(a - b),
    correction: `Soustraire un nombre, c'est ajouter son opposé : ${fr(a)} − ${par(b)} = ${fr(a)} + ${par(-b)} = ${fr(a - b)}.` };
} });

G4.push({ code: 'REL3', theme: 'nombres', chapitre: '4e-relatifs', nombre: 6, creer() {
  const a = choix([-1, 1]) * ent(2, 12), b = choix([-1, 1]) * ent(2, 12);
  if (a > 0 && b > 0) return null;
  const p = a * b;
  return { enonce: `Calculer ${fr(a)} × ${par(b)}`, reponse: fr(p),
    correction: `Règle des signes : ${a < 0 && b < 0 ? 'deux facteurs négatifs donnent un produit positif' : 'un seul facteur négatif donne un produit négatif'}. ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}, donc le résultat est ${fr(p)}.` };
} });

G4.push({ code: 'REL4', theme: 'nombres', chapitre: '4e-relatifs', nombre: 5, creer() {
  const q = entNonNul(-10, 10), b = entNonNul(-9, 9);
  if (b === 1 || (q > 0 && b > 0)) return null;
  const a = q * b;
  return { enonce: `Calculer ${fr(a)} ÷ ${par(b)}`, reponse: fr(q),
    correction: `Même règle des signes que pour la multiplication : ${(a < 0) === (b < 0) ? 'signes identiques → quotient positif' : 'signes contraires → quotient négatif'}. ${Math.abs(a)} ÷ ${Math.abs(b)} = ${Math.abs(q)}, donc ${fr(q)}.` };
} });

G4.push({ code: 'REL5', theme: 'nombres', chapitre: '4e-relatifs', nombre: 4, creer() {
  const n = ent(3, 5);
  const facteurs = Array.from({ length: n }, () => entNonNul(-9, 9));
  const negatifs = facteurs.filter(f => f < 0).length;
  const bonne = negatifs % 2 === 0 ? 'positif' : 'négatif';
  return { enonce: `Sans calculer : le produit ${facteurs.map(par).join(' × ')} est…`, reponse: bonne,
    faux: qcm(bonne, ['positif', 'négatif', 'nul']),
    correction: `On compte les facteurs négatifs : il y en a ${negatifs}, un nombre ${negatifs % 2 === 0 ? 'pair' : 'impair'}. Le produit est donc ${bonne}.` };
} });

G4.push({ code: 'REL6', theme: 'nombres', chapitre: '4e-relatifs', nombre: 6, creer() {
  const a = entNonNul(-10, 10), b = entNonNul(-6, 6), c = entNonNul(-6, 6);
  if (b > 0 && c > 0) return null;
  const moins = hasard() < 0.4;
  const p = b * c, r = moins ? a - p : a + p;
  return { enonce: `Calculer ${fr(a)} ${moins ? '−' : '+'} ${par(b)} × ${par(c)}`, reponse: fr(r),
    correction: `La multiplication est prioritaire : ${par(b)} × ${par(c)} = ${fr(p)}. Puis ${fr(a)} ${moins ? '−' : '+'} ${par(p)} = ${fr(r)}.` };
} });

G4.push({ code: 'REL7', theme: 'nombres', chapitre: '4e-relatifs', nombre: 5, creer() {
  const termes = [choix([-1, 1]) * ent(2, 12), choix([-1, 1]) * ent(2, 12), choix([-1, 1]) * ent(2, 12)];
  const texte = poly(termes.map(t => [t, '']));
  const pos = termes.filter(t => t > 0), neg = termes.filter(t => t < 0);
  if (pos.length === 0 || neg.length === 0) return null;
  const sp = pos.reduce((s, t) => s + t, 0), sn = neg.reduce((s, t) => s + t, 0);
  return { enonce: `Calculer ${texte}`, reponse: fr(sp + sn),
    correction: `On regroupe les termes positifs (${pos.map(fr).join(' + ')} = ${fr(sp)}) et les termes négatifs (total ${fr(sn)}). Puis ${fr(sp)} − ${fr(-sn)} = ${fr(sp + sn)}.` };
} });

// Lire une abscisse sur une droite graduée (figure)
G4.push({ code: 'ABS1', theme: 'nombres', chapitre: '4e-relatifs', nombre: 7, creer() {
  const pas = choix([1, 1, 2, 0.5, 0.1, 5]);
  const debut = -ent(1, 3) * 5 * pas;
  let rang;
  do { rang = ent(1, 9); } while (rang % 5 === 0);
  const valeur = arrondi(debut + rang * pas);
  const base = Math.floor(rang / 5) * 5;
  return { enonce: 'Quelle est l\'abscisse du point A ?', reponse: fr(valeur),
    svg: svgDroiteGraduee(debut, pas, 10, 5, rang, 'A'),
    correction: `Entre deux nombres écrits, il y a 5 graduations pour un écart de ${fr(5 * pas)} : une graduation vaut ${fr(pas)}. A est ${rang - base} graduation(s) après ${fr(debut + base * pas)} : ${fr(debut + base * pas)} + ${rang - base} × ${fr(pas)} = ${fr(valeur)}.` };
} });

// =============================================================
// NOMBRES — Calcul littéral (4e-calcul-litteral-1 et -2)
// =============================================================

G4.push({ code: 'LIT1', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 7, creer() {
  const x = entNonNul(-5, 5), a = ent(2, 9), b = entNonNul(-12, 12);
  const forme = ent(1, 3);
  if (forme === 1) {
    const r = a * x + b;
    return { enonce: `Calculer ${poly([[a, 'x'], [b, '']])} pour x = ${fr(x)}`, reponse: fr(r),
      correction: `On remplace x par ${fr(x)} : ${a} × ${par(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(a * x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(r)}.` };
  }
  if (forme === 2) {
    const r = x * x + a * x;
    return { enonce: `Calculer x² + ${a}x pour x = ${fr(x)}`, reponse: fr(r),
      correction: `On remplace x par ${fr(x)} : ${par(x)}² + ${a} × ${par(x)} = ${fr(x * x)} + ${par(a * x)} = ${fr(r)}.` };
  }
  const r = a * (x + b);
  return { enonce: `Calculer ${a}(x ${b < 0 ? '−' : '+'} ${Math.abs(b)}) pour x = ${fr(x)}`, reponse: fr(r),
    correction: `On remplace x par ${fr(x)} : ${a} × (${fr(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}) = ${a} × ${par(x + b)} = ${fr(r)}.` };
} });

G4.push({ code: 'LIT2', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 5, creer() {
  const a = ent(2, 9), b = entNonNul(-9, 9), c = entNonNul(-9, 9), d = entNonNul(-9, 9);
  if (a + c === 0 || b + d === 0) return null;
  const enonce = poly([[a, 'x'], [b, ''], [c, 'x'], [d, '']]);
  const bonne = poly([[a + c, 'x'], [b + d, '']]);
  return { enonce: `Réduire ${enonce}`, reponse: bonne,
    faux: qcm(bonne, [poly([[a - c, 'x'], [b + d, '']]), poly([[a + c, 'x'], [b - d, '']]), poly([[a + b + c + d, 'x']]), poly([[a + c, 'x'], [-(b + d), '']])]),
    correction: `On regroupe les termes en x (${poly([[a, 'x'], [c, 'x']])} = ${poly([[a + c, 'x']])}) et les nombres (${poly([[b, ''], [d, '']])} = ${fr(b + d)}). Résultat : ${bonne}.` };
} });

G4.push({ code: 'LIT3', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 6, creer() {
  const k = choix([-1, 1]) * ent(2, 9), a = entNonNul(-9, 9);
  const bonne = poly([[k, 'x'], [k * a, '']]);
  return { enonce: `Développer ${fr(k)}(x ${a < 0 ? '−' : '+'} ${Math.abs(a)})`, reponse: bonne,
    faux: qcm(bonne, [poly([[k, 'x'], [a, '']]), poly([[1, 'x'], [k * a, '']]), poly([[k, 'x'], [-k * a, '']]), poly([[k + a, 'x']])]),
    correction: `On distribue ${fr(k)} sur chaque terme : ${fr(k)} × x + ${par(k)} × ${par(a)} = ${bonne}.` };
} });

G4.push({ code: 'LIT4', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 4, creer() {
  const c = ent(2, 15), a = ent(2, 9), b = ent(1, 9);
  const bonne = poly([[-a, 'x'], [c + b, '']]);
  return { enonce: `Simplifier ${c} − (${a}x − ${b})`, reponse: bonne,
    faux: qcm(bonne, [poly([[-a, 'x'], [c - b, '']]), poly([[a, 'x'], [c - b, '']]), poly([[a, 'x'], [c + b, '']])]),
    correction: `Un signe − devant une parenthèse change le signe de chaque terme : ${c} − (${a}x − ${b}) = ${c} − ${a}x + ${b} = ${bonne}.` };
} });

G4.push({ code: 'LIT5', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 5, creer() {
  const k = ent(2, 9), m = ent(1, 4), b = ent(1, 9);
  if (pgcd(m, b) !== 1) return null;
  const interieur = poly([[m, 'x'], [b, '']]);
  const bonne = `${k}(${interieur})`;
  return { enonce: `Factoriser ${poly([[k * m, 'x'], [k * b, '']])}`, reponse: bonne,
    faux: qcm(bonne, [`${k}(${poly([[m, 'x'], [k * b, '']])})`, `${k * m}(x + ${b})`, `${k}(${poly([[m, 'x'], [b + k, '']])})`, `x(${k * m} + ${k * b})`, `${m}(${poly([[k, 'x'], [b, '']])})`]),
    correction: `${k} est un facteur commun aux deux termes : ${k * m === k ? '' : k * m}x = ${k} × ${m === 1 ? 'x' : m + 'x'} et ${k * b} = ${k} × ${b}. Donc ${poly([[k * m, 'x'], [k * b, '']])} = ${bonne}.` };
} });

G4.push({ code: 'LIT6', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 5, creer() {
  const a = ent(1, 6), b = ent(2, 8);
  const longueur = `x + ${a}`;
  if (hasard() < 0.5) {
    const bonne = poly([[2, 'x'], [2 * a + 2 * b, '']]);
    return { enonce: 'Quel est le périmètre de ce rectangle (en cm) ?', reponse: bonne, svg: svgRectangle(`${longueur} (cm)`, `${b} cm`),
      faux: qcm(bonne, [poly([[1, 'x'], [a + b, '']]), poly([[2, 'x'], [a + b, '']]), poly([[b, 'x'], [a * b, '']]), poly([[2, 'x'], [2 * a + b, '']])]),
      correction: `Périmètre = 2 × (longueur + largeur) = 2 × (x + ${a} + ${b}) = 2x + ${2 * a + 2 * b}.` };
  }
  const bonne = poly([[b, 'x'], [a * b, '']]);
  return { enonce: 'Quelle est l\'aire de ce rectangle (en cm²) ?', reponse: bonne, svg: svgRectangle(`${longueur} (cm)`, `${b} cm`),
    faux: qcm(bonne, [poly([[b, 'x'], [a, '']]), poly([[1, 'x'], [a * b, '']]), poly([[2, 'x'], [2 * a + 2 * b, '']]), poly([[b, 'x'], [a + b, '']])]),
    correction: `Aire = longueur × largeur = ${b} × (x + ${a}) = ${b}x + ${a * b}.` };
} });

G4.push({ code: 'LIT7', theme: 'nombres', chapitre: '4e-calcul-litteral-1', nombre: 5, creer() {
  const x = ent(-4, 6), a = ent(2, 7), c = ent(2, 7);
  if (a === c) return null;
  const b = entNonNul(-9, 9);
  const vraie = hasard() < 0.5;
  const d = vraie ? a * x + b - c * x : a * x + b - c * x + entNonNul(-3, 3);
  const g = a * x + b, dr = c * x + d;
  const bonne = g === dr ? 'Oui' : 'Non';
  return { enonce: `L'égalité ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])} est-elle vraie pour x = ${fr(x)} ?`, reponse: bonne,
    faux: [bonne === 'Oui' ? 'Non' : 'Oui'],
    correction: `On calcule chaque membre pour x = ${fr(x)} : à gauche ${a} × ${par(x)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(g)} ; à droite ${c} × ${par(x)} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${fr(dr)}. ${bonne === 'Oui' ? 'Les deux résultats sont égaux : l\'égalité est vraie.' : 'Les résultats sont différents : l\'égalité est fausse.'}` };
} });

G4.push({ code: 'LIT8', theme: 'nombres', chapitre: '4e-calcul-litteral-2', nombre: 6, creer() {
  const a = entNonNul(-7, 7), b = entNonNul(-7, 7);
  const facteur = (n) => `(x ${n < 0 ? '−' : '+'} ${Math.abs(n)})`;
  const bonne = poly([[1, 'x²'], [a + b, 'x'], [a * b, '']]);
  return { enonce: `Développer et réduire ${facteur(a)}${facteur(b)}`, reponse: bonne,
    faux: qcm(bonne, [poly([[1, 'x²'], [a * b, '']]), poly([[1, 'x²'], [a + b, 'x'], [-a * b, '']]), poly([[1, 'x²'], [a * b, 'x'], [a + b, '']]), poly([[2, 'x'], [a * b, '']])]),
    correction: `Double distributivité : x × x + x × ${par(b)} + ${par(a)} × x + ${par(a)} × ${par(b)} = x² ${b < 0 ? '−' : '+'} ${poly([[Math.abs(b), 'x']])} ${a < 0 ? '−' : '+'} ${poly([[Math.abs(a), 'x']])} ${a * b < 0 ? '−' : '+'} ${Math.abs(a * b)} = ${bonne}.` };
} });

G4.push({ code: 'LIT9', theme: 'nombres', chapitre: '4e-calcul-litteral-2', nombre: 4, creer() {
  const a = ent(2, 6), b = ent(1, 8), c = entNonNul(-5, 5), d = entNonNul(-8, 8);
  if (a + c === 0 || b + d === 0) return null;
  const bonne = poly([[a + c, 'x²'], [b + d, 'x']]);
  return { enonce: `Réduire ${poly([[a, 'x²'], [b, 'x'], [c, 'x²'], [d, 'x']])}`, reponse: bonne,
    faux: qcm(bonne, [poly([[a + b + c + d, 'x²']]), poly([[a - c, 'x²'], [b + d, 'x']]), poly([[a + c, 'x²'], [b - d, 'x']]), poly([[a + c + b + d, 'x³']])]),
    correction: `On regroupe les termes en x² (${a} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${a + c}) et les termes en x (${b} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${b + d}). On ne peut pas ajouter des x² et des x. Résultat : ${bonne}.` };
} });

// =============================================================
// NOMBRES — Écriture fractionnaire, divisibilité (4e-fractions-1)
// =============================================================

G4.push({ code: 'FRA1', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 5, creer() {
  const a = ent(1, 9), b = ent(2, 12), k = ent(2, 9);
  if (pgcd(a, b) !== 1 || a === b) return null;
  const n = a * k, d = b * k, bonne = `${a}/${b}`;
  const autres = [`${b}/${a}`, `${a + 1}/${b}`, `${a}/${b + 1}`];
  if (k % 2 === 0) autres.unshift(`${n / 2}/${d / 2}`);
  return { enonce: `Quelle est la forme irréductible de ${n}/${d} ?`, reponse: bonne, faux: qcm(bonne, autres),
    correction: `On divise le numérateur et le dénominateur par leur plus grand diviseur commun, ${k} : ${n} ÷ ${k} = ${a} et ${d} ÷ ${k} = ${b}. Donc ${n}/${d} = ${bonne}.` };
} });

G4.push({ code: 'FRA2', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 4, creer() {
  const d = ent(3, 12), a = ent(1, d), b = ent(1, d);
  const r = frac(a + b, d);
  return { enonce: `Calculer ${a}/${d} + ${b}/${d}`, reponse: r,
    correction: `Même dénominateur : on additionne les numérateurs. ${a}/${d} + ${b}/${d} = ${a + b}/${d}${r !== `${a + b}/${d}` ? ` = ${r}` : ''}.` };
} });

G4.push({ code: 'FRA3', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 6, creer() {
  const b = ent(2, 6), k = ent(2, 4), a = ent(1, b + 2), c = ent(1, b * k);
  if (pgcd(a, b) !== 1) return null;
  const d = b * k, r = frac(a * k + c, d);
  return { enonce: `Calculer ${a}/${b} + ${c}/${d}`, reponse: r,
    correction: `On met au même dénominateur ${d} : ${a}/${b} = ${a * k}/${d}. Puis ${a * k}/${d} + ${c}/${d} = ${a * k + c}/${d}${r !== `${a * k + c}/${d}` ? ` = ${r}` : ''}.` };
} });

G4.push({ code: 'FRA4', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 4, creer() {
  const b = ent(2, 6), k = ent(2, 4), a = ent(1, b * 2), c = ent(1, b * k * 2);
  if (pgcd(a, b) !== 1) return null;
  const d = b * k, r = frac(a * k - c, d);
  return { enonce: `Calculer ${a}/${b} − ${c}/${d}`, reponse: r,
    correction: `On met au même dénominateur ${d} : ${a}/${b} = ${a * k}/${d}. Puis ${a * k}/${d} − ${c}/${d} = ${fracBrute(a * k - c, d)}${r !== fracBrute(a * k - c, d) ? ` = ${r}` : ''}.` };
} });

G4.push({ code: 'FRA5', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 5, creer() {
  const b = ent(2, 7), k = ent(2, 3), a = ent(1, 2 * b), c = ent(1, 2 * b * k);
  const d = b * k, g = a * k;
  const bonne = g < c ? '<' : g > c ? '>' : '=';
  return { enonce: `Compléter par <, > ou = :  ${a}/${b} … ${c}/${d}`, reponse: bonne, faux: qcm(bonne, ['<', '>', '=']),
    correction: `On écrit les deux fractions avec le même dénominateur ${d} : ${a}/${b} = ${g}/${d}. On compare les numérateurs ${g} et ${c} : ${a}/${b} ${bonne} ${c}/${d}.` };
} });

const PREMIERS = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const COMPOSES = [[21, '3 × 7'], [27, '3 × 9'], [33, '3 × 11'], [39, '3 × 13'], [49, '7 × 7'], [51, '3 × 17'], [57, '3 × 19'], [63, '7 × 9'], [69, '3 × 23'], [77, '7 × 11'], [81, '9 × 9'], [87, '3 × 29'], [91, '7 × 13'], [93, '3 × 31'], [95, '5 × 19'], [99, '9 × 11']];
G4.push({ code: 'FRA6', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 5, creer() {
  const p = choix(PREMIERS);
  const autres = melangeH(COMPOSES).slice(0, 3);
  return { enonce: 'Lequel de ces nombres est premier ?', reponse: String(p), faux: autres.map(c => String(c[0])),
    correction: `${autres.map(c => `${c[0]} = ${c[1]}`).join(' ; ')}. Ces nombres ont d'autres diviseurs que 1 et eux-mêmes. ${p} n'a que deux diviseurs, 1 et ${p} : il est premier.` };
} });

G4.push({ code: 'FRA7', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 5, creer() {
  const facteurs = Array.from({ length: ent(3, 4) }, () => choix([2, 2, 3, 3, 5, 7])).sort((x, y) => x - y);
  const n = facteurs.reduce((p, f) => p * f, 1);
  if (n > 300) return null;
  const ecrire = (liste) => {
    const compte = {};
    liste.forEach(f => { compte[f] = (compte[f] || 0) + 1; });
    return Object.keys(compte).map(Number).sort((x, y) => x - y).map(f => compte[f] > 1 ? f + sup(compte[f]) : String(f)).join(' × ');
  };
  const bonne = ecrire(facteurs);
  const remplace = [...facteurs]; remplace[remplace.length - 1] = remplace[remplace.length - 1] === 2 ? 3 : 2;
  const sansDernier = facteurs.slice(1);
  return { enonce: `Quelle est la décomposition de ${n} en produit de facteurs premiers ?`, reponse: bonne,
    faux: qcm(bonne, [`${facteurs[0] * facteurs[1]} × ${facteurs.slice(2).join(' × ')}`, ecrire(remplace), ecrire(sansDernier), ecrire([...facteurs, 2])]),
    correction: `On divise par les nombres premiers dans l'ordre : ${facteurs.map((f, i) => `${facteurs.slice(i).reduce((p, x) => p * x, 1)} ÷ ${f}`).join(', ')}. Donc ${n} = ${bonne}.` };
} });

G4.push({ code: 'FRA8', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 6, creer() {
  const diviseur = choix([2, 3, 4, 5, 9, 10]);
  const n = ent(100, 9999);
  const oui = n % diviseur === 0;
  const chiffres = String(n).split('').map(Number), somme = chiffres.reduce((s, c) => s + c, 0);
  const raisons = {
    2: `son chiffre des unités est ${n % 10}, ${oui ? 'qui est pair' : 'qui est impair'}`,
    3: `la somme de ses chiffres vaut ${somme}, ${oui ? 'qui est' : 'qui n\'est pas'} un multiple de 3`,
    9: `la somme de ses chiffres vaut ${somme}, ${oui ? 'qui est' : 'qui n\'est pas'} un multiple de 9`,
    4: `le nombre formé par ses deux derniers chiffres, ${n % 100}, ${oui ? 'est' : 'n\'est pas'} divisible par 4`,
    5: `son chiffre des unités est ${n % 10} (il faudrait 0 ou 5)`,
    10: `son chiffre des unités est ${n % 10} (il faudrait 0)`,
  };
  return { enonce: `Le nombre ${fr(n)} est-il divisible par ${diviseur} ?`, reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'],
    correction: `${oui ? 'Oui' : 'Non'} : ${raisons[diviseur]}.` };
} });

G4.push({ code: 'FRA9', theme: 'nombres', chapitre: '4e-fractions-1', nombre: 5, creer() {
  const a = ent(1, 9), b = ent(2, 10), k = ent(2, 6);
  if (a === b) return null;
  const c = a * k, d = b * k;
  if (hasard() < 0.5) return { enonce: `Trouver x tel que ${a}/${b} = x/${d}`, reponse: String(c), variantes: [`x = ${c}`],
    correction: `${d} = ${b} × ${k}, donc on multiplie aussi le numérateur par ${k} : x = ${a} × ${k} = ${c}. (Ou par produit en croix : x = ${a} × ${d} ÷ ${b} = ${c}.)` };
  return { enonce: `Trouver x tel que ${a}/${b} = ${c}/x`, reponse: String(d), variantes: [`x = ${d}`],
    correction: `${c} = ${a} × ${k}, donc on multiplie aussi le dénominateur par ${k} : x = ${b} × ${k} = ${d}. (Ou par produit en croix : x = ${b} × ${c} ÷ ${a} = ${d}.)` };
} });

// =============================================================
// NOMBRES — Écriture fractionnaire 2/2 (4e-fractions-2)
// =============================================================

G4.push({ code: 'FRB1', theme: 'nombres', chapitre: '4e-fractions-2', nombre: 6, creer() {
  const a = ent(1, 9), b = ent(2, 9), c = ent(1, 9), d = ent(2, 9);
  if (pgcd(a, b) !== 1 || pgcd(c, d) !== 1) return null;
  const r = frac(a * c, b * d);
  return { enonce: `Calculer ${a}/${b} × ${c}/${d}`, reponse: r,
    correction: `On multiplie les numérateurs entre eux et les dénominateurs entre eux : (${a} × ${c})/(${b} × ${d}) = ${a * c}/${b * d}${r !== `${a * c}/${b * d}` ? ` = ${r}` : ''}.` };
} });

G4.push({ code: 'FRB2', theme: 'nombres', chapitre: '4e-fractions-2', nombre: 5, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const n = choix([2, 4, 5, 8, 10, 20, 25]);
    return { enonce: `Quel est l'inverse de ${n} ?`, reponse: `1/${n}`, variantes: [fr(1 / n)],
      correction: `L'inverse de ${n} est le nombre qui, multiplié par ${n}, donne 1 : c'est 1/${n} (= ${fr(1 / n)}).` };
  }
  if (forme === 2) {
    const a = ent(1, 9), b = ent(2, 9);
    if (a === b || pgcd(a, b) !== 1) return null;
    return { enonce: `Quel est l'inverse de ${a}/${b} ?`, reponse: frac(b, a),
      correction: `Pour inverser une fraction, on échange le numérateur et le dénominateur : l'inverse de ${a}/${b} est ${frac(b, a)}, car ${a}/${b} × ${b}/${a} = 1.` };
  }
  const x = choix([0.5, 0.25, 0.2, 0.1, 0.125]);
  return { enonce: `Quel est l'inverse de ${fr(x)} ?`, reponse: fr(1 / x),
    correction: `${fr(x)} = 1/${fr(1 / x)}, donc son inverse est ${fr(1 / x)} (en effet ${fr(x)} × ${fr(1 / x)} = 1).` };
} });

G4.push({ code: 'FRB3', theme: 'nombres', chapitre: '4e-fractions-2', nombre: 5, creer() {
  const a = ent(1, 9), b = ent(2, 9), c = ent(1, 9), d = ent(2, 9);
  const r = frac(a * d, b * c);
  return { enonce: `Calculer ${a}/${b} ÷ ${c}/${d}`, reponse: r,
    correction: `Diviser par une fraction, c'est multiplier par son inverse : ${a}/${b} × ${d}/${c} = ${a * d}/${b * c}${r !== `${a * d}/${b * c}` ? ` = ${r}` : ''}.` };
} });

G4.push({ code: 'FRB4', theme: 'nombres', chapitre: '4e-fractions-2', nombre: 5, creer() {
  const b = ent(2, 10), a = ent(1, b - 1), q = b * ent(2, 12);
  if (pgcd(a, b) !== 1) return null;
  return { enonce: `Calculer les ${a}/${b} de ${q}`, reponse: fr(a * q / b),
    correction: `On divise par ${b}, puis on multiplie par ${a} : ${q} ÷ ${b} = ${q / b}, puis ${a} × ${q / b} = ${a * q / b}.` };
} });

G4.push({ code: 'FRB5', theme: 'nombres', chapitre: '4e-fractions-2', nombre: 4, creer() {
  const a = ent(1, 4), b = ent(2, 6), c = ent(1, 6), d = ent(2, 8);
  if (a >= b || c >= d || pgcd(a, b) !== 1 || pgcd(c, d) !== 1) return null;
  const r = frac(a * c, b * d);
  return { enonce: `Combien valent les ${a}/${b} de ${c}/${d} ? (sous forme de fraction)`, reponse: r,
    correction: `Prendre les ${a}/${b} d'un nombre, c'est le multiplier par ${a}/${b} : ${a}/${b} × ${c}/${d} = ${a * c}/${b * d}${r !== `${a * c}/${b * d}` ? ` = ${r}` : ''}.` };
} });

// =============================================================
// NOMBRES — Puissances et racines carrées
// =============================================================

G4.push({ code: 'PUI1', theme: 'nombres', chapitre: '4e-puissances', nombre: 6, creer() {
  const base = choix([2, 3, -2, -3, 4, 5, -1, -5, 10]);
  const max = { 2: 6, 3: 4, '-2': 5, '-3': 4, 4: 3, 5: 3, '-1': 9, '-5': 3, 10: 5 }[base];
  const n = ent(2, max);
  const v = base ** n;
  return { enonce: `Calculer ${par(base)}${sup(n)}`, reponse: fr(v),
    correction: `${par(base)}${sup(n)} = ${Array(n).fill(par(base)).join(' × ')} = ${fr(v)}${base < 0 ? ` (${n} facteurs négatifs : nombre ${n % 2 === 0 ? 'pair, résultat positif' : 'impair, résultat négatif'})` : ''}.` };
} });

G4.push({ code: 'PUI2', theme: 'nombres', chapitre: '4e-puissances', nombre: 5, creer() {
  const n = choix([-4, -3, -2, -1, 2, 3, 4, 5, 6]);
  const v = 10 ** n;
  return { enonce: `Écrire 10${sup(n)} sous forme décimale`, reponse: fr(v),
    correction: n > 0 ? `10${sup(n)} = 1 suivi de ${n} zéros : ${fr(v)}.` : `10${sup(n)} = 1/10${sup(-n)} = ${fr(v)} : le chiffre 1 est en position ${-n} après la virgule.` };
} });

G4.push({ code: 'PUI3', theme: 'nombres', chapitre: '4e-puissances', nombre: 5, creer() {
  const a = entNonNul(-6, 8), b = entNonNul(-6, 8);
  if (hasard() < 0.6) return { enonce: `Compléter : 10${sup(a)} × 10${sup(b)} = 10 puissance …`, reponse: fr(a + b),
    correction: `Pour multiplier des puissances de 10, on additionne les exposants : ${fr(a)} + ${par(b)} = ${fr(a + b)}. Donc 10${sup(a)} × 10${sup(b)} = 10${sup(a + b)}.` };
  return { enonce: `Compléter : 10${sup(a)} ÷ 10${sup(b)} = 10 puissance …`, reponse: fr(a - b),
    correction: `Pour diviser des puissances de 10, on soustrait les exposants : ${fr(a)} − ${par(b)} = ${fr(a - b)}. Donc 10${sup(a)} ÷ 10${sup(b)} = 10${sup(a - b)}.` };
} });

G4.push({ code: 'PUI4', theme: 'nombres', chapitre: '4e-puissances', nombre: 5, creer() {
  const m = ent(11, 99) / 10, n = choix([-5, -4, -3, 3, 4, 5, 6]);
  const valeur = arrondi(m * 10 ** n, 10);
  const bonne = `${fr(m)} × 10${sup(n)}`;
  return { enonce: `Quelle est l'écriture scientifique de ${fr(valeur)} ?`, reponse: bonne,
    faux: qcm(bonne, [`${fr(m * 10)} × 10${sup(n - 1)}`, `${fr(m)} × 10${sup(n + 1)}`, `${fr(m)} × 10${sup(-n)}`, `${fr(m / 10)} × 10${sup(n + 1)}`]),
    correction: `En écriture scientifique, le premier facteur est compris entre 1 et 10 (exclu) : ${fr(m)}. On a décalé la virgule de ${Math.abs(n)} rang(s) ${n > 0 ? 'vers la gauche, donc l\'exposant est ' + n : 'vers la droite, donc l\'exposant est ' + n}. ${fr(valeur)} = ${bonne}.` };
} });

const PREFIXES = [['giga', 9], ['méga', 6], ['kilo', 3], ['milli', -3], ['micro', -6], ['nano', -9]];
G4.push({ code: 'PUI5', theme: 'nombres', chapitre: '4e-puissances', nombre: 5, creer() {
  const [nom, n] = choix(PREFIXES);
  const unite = choix([['mètre', 'm'], ['gramme', 'g'], ['octet', 'o'], ['watt', 'W']]);
  const bonne = `10${sup(n)} ${unite[1]}`;
  return { enonce: `Combien vaut 1 ${nom}${unite[0]} ?`, reponse: bonne,
    faux: qcm(bonne, [`10${sup(-n)} ${unite[1]}`, `10${sup(n > 0 ? n + 3 : n - 3)} ${unite[1]}`, `10${sup(n > 0 ? n - 3 || 1 : n + 3 || -1)} ${unite[1]}`, `${Math.abs(n)} ${unite[1]}`]),
    correction: `Le préfixe « ${nom} » signifie × 10${sup(n)}. Donc 1 ${nom}${unite[0]} = ${bonne}.` };
} });

G4.push({ code: 'PUI6', theme: 'nombres', chapitre: '4e-pythagore', nombre: 6, creer() {
  const n = ent(2, 15);
  if (hasard() < 0.5) return { enonce: `Calculer √${n * n}`, reponse: String(n),
    correction: `On cherche le nombre positif dont le carré vaut ${n * n} : ${n} × ${n} = ${n * n}, donc √${n * n} = ${n}.` };
  return { enonce: `Quel est le carré de ${n} ?`, reponse: String(n * n),
    correction: `Le carré de ${n}, c'est ${n} × ${n} = ${n * n}.` };
} });

G4.push({ code: 'PUI7', theme: 'nombres', chapitre: '4e-puissances', nombre: 4, creer() {
  const base = -ent(2, 9), n = ent(2, 9);
  const bonne = n % 2 === 0 ? 'positif' : 'négatif';
  return { enonce: `Sans calculer : le nombre (${fr(base)})${sup(n)} est…`, reponse: bonne, faux: qcm(bonne, ['positif', 'négatif', 'nul']),
    correction: `(${fr(base)})${sup(n)} est un produit de ${n} facteurs négatifs. ${n} est ${n % 2 === 0 ? 'pair : le résultat est positif' : 'impair : le résultat est négatif'}.` };
} });

G4.push({ code: 'RAC1', theme: 'nombres', chapitre: '4e-pythagore', nombre: 4, creer() {
  const k = ent(2, 11), n = k * k + ent(1, 2 * k);
  const bonne = `${k} et ${k + 1}`;
  return { enonce: `√${n} est compris entre…`, reponse: bonne,
    faux: qcm(bonne, [`${k - 1} et ${k}`, `${k + 1} et ${k + 2}`, `${Math.floor(n / 2)} et ${Math.floor(n / 2) + 1}`]),
    correction: `${k}² = ${k * k} et ${k + 1}² = ${(k + 1) ** 2}. Comme ${k * k} < ${n} < ${(k + 1) ** 2}, on a ${k} < √${n} < ${k + 1}.` };
} });

// =============================================================
// NOMBRES — Équations (4e-equations)
// =============================================================

G4.push({ code: 'EQU1', theme: 'nombres', chapitre: '4e-equations', nombre: 4, creer() {
  const x = entNonNul(-12, 15), a = entNonNul(-15, 15);
  const b = x + a;
  return { enonce: `Résoudre ${poly([[1, 'x'], [a, '']])} = ${fr(b)}`, reponse: fr(x), variantes: [`x = ${fr(x)}`],
    correction: `On ${a > 0 ? 'soustrait ' + a : 'ajoute ' + (-a)} aux deux membres : x = ${fr(b)} ${a > 0 ? '−' : '+'} ${Math.abs(a)} = ${fr(x)}.` };
} });

G4.push({ code: 'EQU2', theme: 'nombres', chapitre: '4e-equations', nombre: 5, creer() {
  const x = entNonNul(-10, 10), a = entNonNul(-9, 9);
  if (a === 1) return null;
  return { enonce: `Résoudre ${fr(a)}x = ${fr(a * x)}`, reponse: fr(x), variantes: [`x = ${fr(x)}`],
    correction: `On divise les deux membres par ${fr(a)} : x = ${fr(a * x)} ÷ ${par(a)} = ${fr(x)}.` };
} });

G4.push({ code: 'EQU3', theme: 'nombres', chapitre: '4e-equations', nombre: 6, creer() {
  const x = entNonNul(-8, 10), a = choix([-1, 1]) * ent(2, 9), b = entNonNul(-15, 15);
  const c = a * x + b;
  return { enonce: `Résoudre ${poly([[a, 'x'], [b, '']])} = ${fr(c)}`, reponse: fr(x), variantes: [`x = ${fr(x)}`],
    correction: `On ${b > 0 ? 'soustrait ' + b : 'ajoute ' + (-b)} : ${fr(a)}x = ${fr(c - b)}. Puis on divise par ${fr(a)} : x = ${fr(c - b)} ÷ ${par(a)} = ${fr(x)}.` };
} });

G4.push({ code: 'EQU4', theme: 'nombres', chapitre: '4e-equations', nombre: 5, creer() {
  const x = entNonNul(-6, 8), a = ent(2, 9), c = ent(1, 8), b = entNonNul(-12, 12);
  if (a === c) return null;
  const d = a * x + b - c * x;
  return { enonce: `Résoudre ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}`, reponse: fr(x), variantes: [`x = ${fr(x)}`],
    correction: `On regroupe les x d'un côté : ${a}x − ${c === 1 ? '' : c}x = ${fr(d)} ${b < 0 ? '+' : '−'} ${Math.abs(b)}, soit ${fr(a - c)}x = ${fr(d - b)}. Donc x = ${fr(d - b)} ÷ ${par(a - c)} = ${fr(x)}.` };
} });

G4.push({ code: 'EQU5', theme: 'nombres', chapitre: '4e-equations', nombre: 4, creer() {
  const solution = entNonNul(-6, 6), a = ent(2, 7), b = entNonNul(-10, 10), c = a * solution + b;
  const teste = hasard() < 0.5 ? solution : solution + entNonNul(-2, 2);
  const g = a * teste + b, oui = g === c;
  return { enonce: `${fr(teste)} est-il solution de l'équation ${poly([[a, 'x'], [b, '']])} = ${fr(c)} ?`, reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'],
    correction: `On remplace x par ${fr(teste)} : ${a} × ${par(teste)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fr(g)}. ${oui ? `On trouve bien ${fr(c)} : c'est une solution.` : `On trouve ${fr(g)} et non ${fr(c)} : ce n'est pas une solution.`}` };
} });

// =============================================================
// DONNÉES — Proportionnalité et pourcentages (4e-proportionnalite)
// =============================================================

// [objet, nom court, prix unitaire minimum et maximum en €] : des prix réalistes
const CONTEXTES_PRIX = [['kg de pommes', 'kg', 1.5, 4], ['litres de jus', 'litres', 1, 3], ['cahiers', 'cahiers', 1, 4], ['baguettes', 'baguettes', 0.9, 1.5], ['m de tissu', 'm', 5, 15]];
G4.push({ code: 'PRO1', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 7, creer() {
  const [objet, court, min, max] = choix(CONTEXTES_PRIX);
  const prix = ent(min * 10, max * 10) / 10;
  const a = ent(2, 6), b = ent(2, 12);
  if (a === b) return null;
  const pa = arrondi(a * prix), pb = arrondi(b * prix);
  return { enonce: `${a} ${objet} coûtent ${fr(pa)} €. Combien coûtent ${b} ${court} (en €) ?`, reponse: fr(pb),
    correction: `Prix d'un seul : ${fr(pa)} ÷ ${a} = ${fr(prix)} €. Pour ${b} : ${b} × ${fr(prix)} = ${fr(pb)} €.` };
} });

G4.push({ code: 'PRO2', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 4, creer() {
  const k = choix([1.5, 2.5, 3, 4, 0.5, 1.2, 6]), x = ent(2, 10);
  return { enonce: `Dans un tableau de proportionnalité, ${x} correspond à ${fr(k * x)}. Quel est le coefficient de proportionnalité ?`, reponse: fr(k),
    correction: `Le coefficient est le nombre par lequel on multiplie : ${fr(k * x)} ÷ ${x} = ${fr(k)}.` };
} });

G4.push({ code: 'PRO3', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 7, creer() {
  const sorte = choix(['proportionnel', 'proportionnel', 'affine', 'courbe']);
  const k = ent(1, 3);
  let options = { xmin: 0, xmax: 8, ymin: 0, ymax: 8 * k + (sorte === 'affine' ? 4 : 0), grilleY: k, etiquettesY: 2 * k, etiquettesX: 2, uniteY: 210 / ((8 * k + 4)), nomX: 'x', nomY: 'y' };
  if (sorte === 'proportionnel') options.droites = [{ a: k, b: 0 }];
  if (sorte === 'affine') options.droites = [{ a: k, b: ent(1, 3) * k }];
  if (sorte === 'courbe') options.courbes = [{ points: Array.from({ length: 33 }, (_, i) => [i / 4, (i / 4) ** 2 * k / 8]) }];
  const oui = sorte === 'proportionnel';
  return { enonce: 'Ce graphique représente-t-il une situation de proportionnalité ?', reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'], svg: svgRepere(options),
    correction: oui ? 'Oui : les points sont sur une droite qui passe par l\'origine du repère.'
      : sorte === 'affine' ? 'Non : c\'est bien une droite, mais elle ne passe pas par l\'origine du repère.'
        : 'Non : les points ne sont pas alignés (ce n\'est pas une droite).' };
} });

G4.push({ code: 'PRO4', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 6, creer() {
  const k = ent(2, 5), x = ent(2, 9);
  return { enonce: `Ce graphique donne le prix (en €) selon la masse (en kg). Quel est le prix de ${x} kg ?`, reponse: String(k * x),
    svg: svgRepere({ xmin: 0, xmax: 10, ymin: 0, ymax: 10 * k, grilleY: k, etiquettesY: 2 * k, etiquettesX: 1, uniteY: 240 / (10 * k), nomX: 'kg', nomY: '€', droites: [{ a: k, b: 0 }] }),
    correction: `On part de ${x} sur l'axe horizontal, on monte jusqu'à la droite, puis on lit sur l'axe vertical : ${k * x} €. (Ici 1 kg coûte ${k} €, donc ${x} kg coûtent ${x} × ${k} = ${k * x} €.)` };
} });

G4.push({ code: 'PRO5', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 7, creer() {
  const t = choix([10, 20, 25, 50, 75, 5, 15, 30, 1, 40]);
  const q = choix([20, 40, 60, 80, 120, 200, 300, 500, 36, 48, 160]);
  const r = t * q / 100;
  if (r !== Math.round(r * 10) / 10) return null;
  const methode = { 10: `10 %, c'est diviser par 10`, 50: `50 %, c'est la moitié`, 25: `25 %, c'est le quart`, 1: `1 %, c'est diviser par 100`, 75: `75 %, ce sont les trois quarts` }[t];
  return { enonce: `Calculer ${t} % de ${q}`, reponse: fr(r),
    correction: methode ? `${methode} : ${fr(r)}.` : `${t} % de ${q} = ${t} × ${q} ÷ 100 = ${fr(r)}.` };
} });

G4.push({ code: 'PRO6', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 6, creer() {
  const prix = choix([20, 40, 50, 60, 80, 120, 150, 200, 30]), t = choix([10, 20, 25, 50, 5, 30]);
  const hausse = hasard() < 0.5, ecart = prix * t / 100;
  const r = hausse ? prix + ecart : prix - ecart;
  return { enonce: `Un article coûte ${prix} €. Son prix ${hausse ? 'augmente' : 'baisse'} de ${t} %. Quel est son nouveau prix (en €) ?`, reponse: fr(r),
    correction: `${t} % de ${prix} = ${fr(ecart)} €. Nouveau prix : ${prix} ${hausse ? '+' : '−'} ${fr(ecart)} = ${fr(r)} €.` };
} });

G4.push({ code: 'PRO7', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 5, creer() {
  const total = choix([20, 25, 40, 50, 200, 80, 30]), t = choix([10, 20, 25, 50, 75, 40, 30, 60]);
  const partie = total * t / 100;
  if (partie !== Math.round(partie)) return null;
  const [groupe, sous] = choix([['élèves', 'font du foot'], ['spectateurs', 'sont venus en bus'], ['candidats', 'ont réussi'], ['pommes', 'sont abîmées']]);
  return { enonce: `Sur ${total} ${groupe}, ${partie} ${sous}. Quel pourcentage cela représente-t-il ?`, reponse: String(t), variantes: [`${t} %`, `${t}%`],
    correction: `On calcule la proportion ${partie}/${total}, puis on la ramène sur 100 : ${partie} ÷ ${total} × 100 = ${t} %.` };
} });

G4.push({ code: 'PRO8', theme: 'donnees', chapitre: '4e-proportionnalite', nombre: 4, creer() {
  const echelle = choix([100, 200, 500, 1000, 10000, 50000]), cm = ent(2, 9);
  const reelCm = cm * echelle, reelM = reelCm / 100;
  const enKm = reelM >= 1000;
  return { enonce: `Sur un plan à l'échelle 1/${fr(echelle)}, une longueur mesure ${cm} cm. Que mesure-t-elle en réalité (en ${enKm ? 'km' : 'm'}) ?`, reponse: fr(enKm ? reelM / 1000 : reelM),
    correction: `1 cm sur le plan représente ${fr(echelle)} cm en réalité. ${cm} cm représentent donc ${cm} × ${fr(echelle)} = ${fr(reelCm)} cm, soit ${fr(reelM)} m${enKm ? ` = ${fr(reelM / 1000)} km` : ''}.` };
} });

// =============================================================
// DONNÉES — Statistiques (4e-statistiques)
// =============================================================

G4.push({ code: 'STA1', theme: 'donnees', chapitre: '4e-statistiques', nombre: 6, creer() {
  const n = ent(3, 5), valeurs = Array.from({ length: n }, () => ent(4, 20));
  const somme = valeurs.reduce((s, v) => s + v, 0), moyenne = somme / n;
  if (moyenne * 10 !== Math.round(moyenne * 10)) return null;
  return { enonce: `Quelle est la moyenne de ${valeurs.slice(0, -1).join(' ; ')} et ${valeurs[n - 1]} ?`, reponse: fr(moyenne),
    correction: `On additionne les valeurs : ${valeurs.join(' + ')} = ${somme}. Puis on divise par leur nombre : ${somme} ÷ ${n} = ${fr(moyenne)}.` };
} });

G4.push({ code: 'STA2', theme: 'donnees', chapitre: '4e-statistiques', nombre: 6, creer() {
  const n = choix([5, 7, 4, 6]), valeurs = Array.from({ length: n }, () => ent(1, 30));
  const tri = [...valeurs].sort((a, b) => a - b);
  const mediane = n % 2 ? tri[(n - 1) / 2] : (tri[n / 2 - 1] + tri[n / 2]) / 2;
  return { enonce: `Quelle est la médiane de la série : ${valeurs.join(' ; ')} ?`, reponse: fr(mediane),
    correction: `On range les valeurs dans l'ordre : ${tri.join(' ; ')}. ${n % 2 ? `Il y a ${n} valeurs : la médiane est la ${(n + 1) / 2}e, soit ${fr(mediane)}.` : `Il y a ${n} valeurs (nombre pair) : la médiane est entre la ${n / 2}e et la ${n / 2 + 1}e : (${tri[n / 2 - 1]} + ${tri[n / 2]}) ÷ 2 = ${fr(mediane)}.`}` };
} });

G4.push({ code: 'STA3', theme: 'donnees', chapitre: '4e-statistiques', nombre: 5, creer() {
  const valeurs = Array.from({ length: ent(5, 7) }, () => ent(-5, 40));
  const max = Math.max(...valeurs), min = Math.min(...valeurs);
  return { enonce: `Quelle est l'étendue de la série : ${valeurs.map(fr).join(' ; ')} ?`, reponse: fr(max - min),
    correction: `Étendue = plus grande valeur − plus petite valeur = ${fr(max)} − ${par(min)} = ${fr(max - min)}.` };
} });

G4.push({ code: 'STA4', theme: 'donnees', chapitre: '4e-statistiques', nombre: 5, creer() {
  const total = choix([20, 25, 50, 40, 10]), t = choix([10, 20, 30, 40, 60, 5, 15]);
  const effectif = total * t / 100;
  if (effectif !== Math.round(effectif)) return null;
  return { enonce: `Dans une classe de ${total} élèves, ${effectif} ont les yeux verts. Quelle est la fréquence des yeux verts, en pourcentage ?`, reponse: String(t), variantes: [`${t} %`],
    correction: `Fréquence = effectif ÷ effectif total = ${effectif} ÷ ${total} = ${fr(effectif / total)}, soit ${t} %.` };
} });

G4.push({ code: 'STA5', theme: 'donnees', chapitre: '4e-statistiques', nombre: 7, creer() {
  const cats = choix(CATEGORIES), valeurs = cats.map(() => ent(1, 12));
  const i = ent(0, cats.length - 1);
  const total = valeurs.reduce((s, v) => s + v, 0);
  if (hasard() < 0.5) return { enonce: `D'après le diagramme, combien d'élèves ont choisi « ${cats[i]} » ?`, reponse: String(valeurs[i]), svg: svgBarres(cats, valeurs, 'effectif'),
    correction: `On lit la hauteur de la barre « ${cats[i]} » sur l'axe vertical : ${valeurs[i]}.` };
  return { enonce: 'D\'après le diagramme, combien d\'élèves ont répondu en tout ?', reponse: String(total), svg: svgBarres(cats, valeurs, 'effectif'),
    correction: `On lit chaque barre puis on additionne : ${valeurs.join(' + ')} = ${total}.` };
} });

G4.push({ code: 'STA6', theme: 'donnees', chapitre: '4e-statistiques', nombre: 4, creer() {
  const cats = choix(CATEGORIES).slice(0, 4), valeurs = cats.map(() => ent(2, 12));
  const i = ent(0, 3), total = valeurs.reduce((s, v) => s + v, 0);
  const connus = cats.map((c, k) => k === i ? `${c} : ?` : `${c} : ${valeurs[k]}`).join(' ; ');
  return { enonce: `${total} élèves ont répondu. ${connus}. Quel est l'effectif manquant ?`, reponse: String(valeurs[i]),
    correction: `On retire au total les effectifs connus : ${total} − ${valeurs.filter((_, k) => k !== i).join(' − ')} = ${valeurs[i]}.` };
} });

// =============================================================
// DONNÉES — Probabilités (4e-probabilites)
// =============================================================

G4.push({ code: 'PRB1', theme: 'donnees', chapitre: '4e-probabilites', nombre: 7, creer() {
  const r = ent(1, 8), b = ent(1, 8), v = ent(0, 6), total = r + b + v;
  const [couleur, n] = choix([['rouge', r], ['bleue', b], ...(v ? [['verte', v]] : [])]);
  return { enonce: `Une urne contient ${r} boules rouges, ${b} bleues${v ? ` et ${v} vertes` : ''}. On tire une boule au hasard. Quelle est la probabilité qu'elle soit ${couleur} ?`, reponse: frac(n, total),
    correction: `Il y a ${n} boule(s) ${couleur}(s) sur ${total} boules en tout : la probabilité est ${n}/${total}${frac(n, total) !== `${n}/${total}` ? ` = ${frac(n, total)}` : ''}.` };
} });

const EVENEMENTS_DE = [['un nombre pair', [2, 4, 6]], ['un multiple de 3', [3, 6]], ['un nombre supérieur ou égal à 5', [5, 6]], ['un nombre premier', [2, 3, 5]], ['un 6', [6]], ['un nombre inférieur à 3', [1, 2]], ['un diviseur de 6', [1, 2, 3, 6]]];
G4.push({ code: 'PRB2', theme: 'donnees', chapitre: '4e-probabilites', nombre: 6, creer() {
  const [texte, issues] = choix(EVENEMENTS_DE);
  return { enonce: `On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir ${texte} ?`, reponse: frac(issues.length, 6),
    correction: `Issues favorables : ${issues.join(', ')}, soit ${issues.length} sur 6 issues possibles. Probabilité : ${issues.length}/6${frac(issues.length, 6) !== `${issues.length}/6` ? ` = ${frac(issues.length, 6)}` : ''}.` };
} });

G4.push({ code: 'PRB3', theme: 'donnees', chapitre: '4e-probabilites', nombre: 5, creer() {
  const p = ent(5, 95) / 100;
  const [evt, contraire] = choix([['qu\'il pleuve demain', 'qu\'il ne pleuve pas'], ['de gagner à un jeu', 'de ne pas gagner'], ['que le bus soit en retard', 'qu\'il ne soit pas en retard']]);
  return { enonce: `La probabilité ${evt} est ${fr(p)}. Quelle est la probabilité ${contraire} ?`, reponse: fr(1 - p),
    correction: `Un événement et son contraire ont des probabilités dont la somme vaut 1 : 1 − ${fr(p)} = ${fr(arrondi(1 - p))}.` };
} });

const VOCABULAIRE_PROBA = [
  ['Obtenir 7 avec un dé à 6 faces est un événement…', 'impossible'],
  ['Obtenir un nombre entre 1 et 6 avec un dé à 6 faces est un événement…', 'certain'],
  ['Tirer une boule rouge dans une urne qui ne contient que des boules rouges est un événement…', 'certain'],
  ['Tirer une boule verte dans une urne de boules rouges et bleues est un événement…', 'impossible'],
  ['Un événement de probabilité 0,5 a autant de chances de se produire que de…', 'ne pas se produire'],
  ['Une probabilité est toujours comprise entre…', '0 et 1'],
];
G4.push({ code: 'PRB4', theme: 'donnees', chapitre: '4e-probabilites', nombre: 5, creer() {
  const [question, bonne] = choix(VOCABULAIRE_PROBA);
  const faux = bonne === '0 et 1' ? ['0 et 100', '−1 et 1', '1 et 10'] : bonne === 'ne pas se produire' ? ['se produire deux fois', 'être certain', 'être impossible'] : qcm(bonne, ['certain', 'impossible', 'probable', 'équiprobable']);
  return { enonce: question, reponse: bonne, faux,
    correction: { impossible: 'Il ne peut jamais se produire : sa probabilité est 0.', certain: 'Il se produit à coup sûr : sa probabilité est 1.', '0 et 1': 'Une probabilité vaut 0 pour un événement impossible, 1 pour un événement certain, et entre les deux sinon.', 'ne pas se produire': '0,5 = 1/2 : une chance sur deux.' }[bonne] };
} });

G4.push({ code: 'PRB5', theme: 'donnees', chapitre: '4e-probabilites', nombre: 4, creer() {
  const [texte, n, explication] = choix([['un cœur', 13, '13 cœurs'], ['un as', 4, '4 as'], ['une carte rouge', 26, '26 cartes rouges'], ['une figure (valet, dame ou roi)', 12, '3 figures dans chacune des 4 couleurs, soit 12'], ['le roi de pique', 1, 'un seul roi de pique']]);
  return { enonce: `On tire une carte au hasard dans un jeu de 52 cartes. Quelle est la probabilité de tirer ${texte} ?`, reponse: frac(n, 52),
    correction: `Il y a ${explication} sur 52 cartes : ${n}/52${frac(n, 52) !== `${n}/52` ? ` = ${frac(n, 52)}` : ''}.` };
} });

// =============================================================
// GRANDEURS — Vitesses, durées (4e-proportionnalite)
// =============================================================

const DUREES = [[0.5, '30 min'], [0.25, '15 min'], [0.75, '45 min'], [1.5, '1 h 30 min'], [2, '2 h'], [3, '3 h'], [1.25, '1 h 15 min'], [2.5, '2 h 30 min'], [1 / 3, '20 min'], [4, '4 h']];
G4.push({ code: 'VIT1', theme: 'grandeurs', chapitre: '4e-proportionnalite', nombre: 7, creer() {
  const [t, texte] = choix(DUREES), v = choix([12, 15, 20, 30, 40, 50, 60, 80, 90, 100, 120]);
  const d = v * t;
  if (d !== Math.round(d)) return null;
  const vehicule = v <= 20 ? 'Un cycliste roule' : v <= 50 ? 'Un scooter roule' : 'Une voiture roule';
  const enHeures = t === 1 / 3 ? '1/3' : fr(t);
  return { enonce: `${vehicule} à ${v} km/h pendant ${texte}. Quelle distance est parcourue (en km) ?`, reponse: fr(d),
    correction: `${texte.includes('min') ? `${texte} = ${enHeures} h. ` : ''}Distance = vitesse × durée = ${v} × ${enHeures} = ${fr(d)} km.` };
} });

G4.push({ code: 'VIT2', theme: 'grandeurs', chapitre: '4e-proportionnalite', nombre: 6, creer() {
  const [t, texte] = choix(DUREES), v = choix([10, 12, 15, 20, 30, 40, 60, 80, 90, 100]);
  const d = v * t;
  if (d !== Math.round(d)) return null;
  return { enonce: `Un trajet de ${d} km dure ${texte}. Quelle est la vitesse moyenne (en km/h) ?`, reponse: String(v),
    correction: `${texte.includes('min') ? `${texte} = ${t === 1 / 3 ? '1/3' : fr(t)} h. ` : ''}Vitesse = distance ÷ durée = ${d} ÷ ${t === 1 / 3 ? '1/3' : fr(t)} = ${v} km/h.` };
} });

G4.push({ code: 'VIT3', theme: 'grandeurs', chapitre: '4e-proportionnalite', nombre: 5, creer() {
  const v = choix([30, 60, 90, 120, 20, 40]), minutes = choix([10, 15, 20, 30, 40, 45, 90]);
  const d = v * minutes / 60;
  if (d !== Math.round(d)) return null;
  return { enonce: `À ${v} km/h, combien de minutes faut-il pour parcourir ${d} km ?`, reponse: String(minutes),
    correction: `À ${v} km/h, on parcourt ${v} km en 60 min, donc 1 km en ${fr(60 / v)} min. Pour ${d} km : ${d} × ${fr(60 / v)} = ${minutes} min.` };
} });

G4.push({ code: 'VIT4', theme: 'grandeurs', chapitre: '4e-proportionnalite', nombre: 4, creer() {
  const ms = choix([5, 10, 15, 20, 25, 30]), kmh = ms * 3.6;
  if (hasard() < 0.5) return { enonce: `Convertir ${fr(kmh)} km/h en m/s`, reponse: String(ms),
    correction: `${fr(kmh)} km/h = ${fr(kmh * 1000)} m en 3 600 s. ${fr(kmh * 1000)} ÷ 3 600 = ${ms} m/s. (Raccourci : on divise par 3,6.)` };
  return { enonce: `Convertir ${ms} m/s en km/h`, reponse: fr(kmh),
    correction: `${ms} m/s = ${ms} × 3 600 = ${fr(ms * 3600)} m par heure, soit ${fr(kmh)} km/h. (Raccourci : on multiplie par 3,6.)` };
} });

G4.push({ code: 'DUR1', theme: 'grandeurs', chapitre: '4e-proportionnalite', nombre: 5, creer() {
  const h = choix([0.25, 0.5, 0.75, 1.5, 1.25, 2.5, 0.1, 0.2, 1.75, 3.5]);
  if (hasard() < 0.6) return { enonce: `Combien de minutes dans ${fr(h)} h ?`, reponse: fr(h * 60),
    correction: `1 h = 60 min, donc ${fr(h)} h = ${fr(h)} × 60 = ${fr(h * 60)} min.` };
  return { enonce: `Écrire ${fr(h * 60)} min en heures (nombre décimal)`, reponse: fr(h), variantes: [`${fr(h)} h`],
    correction: `${fr(h * 60)} min = ${fr(h * 60)} ÷ 60 h = ${fr(h)} h.` };
} });

// =============================================================
// GRANDEURS — Espace : volumes, aires, conversions (4e-espace)
// =============================================================

G4.push({ code: 'VOL1', theme: 'grandeurs', chapitre: '4e-espace', nombre: 6, creer() {
  if (hasard() < 0.3) {
    const c = ent(2, 10);
    return { enonce: `Quel est le volume d'un cube d'arête ${c} cm (en cm³) ?`, reponse: String(c ** 3),
      correction: `Volume du cube = arête × arête × arête = ${c} × ${c} × ${c} = ${c ** 3} cm³.` };
  }
  const L = ent(2, 12), l = ent(2, 8), h = ent(2, 10);
  return { enonce: `Quel est le volume d'un pavé droit de ${L} cm × ${l} cm × ${h} cm (en cm³) ?`, reponse: String(L * l * h),
    correction: `Volume du pavé = longueur × largeur × hauteur = ${L} × ${l} × ${h} = ${L * l * h} cm³.` };
} });

G4.push({ code: 'VOL2', theme: 'grandeurs', chapitre: '4e-espace', nombre: 5, creer() {
  const a = ent(2, 8), b = ent(2, 8), h = ent(2, 10);
  if ((a * b) % 2) return null;
  const aire = a * b / 2;
  return { enonce: `Un prisme droit a pour base un triangle rectangle dont les côtés de l'angle droit mesurent ${a} cm et ${b} cm. Sa hauteur est ${h} cm. Quel est son volume (en cm³) ?`, reponse: String(aire * h),
    correction: `Aire de la base = ${a} × ${b} ÷ 2 = ${aire} cm². Volume = aire de la base × hauteur = ${aire} × ${h} = ${aire * h} cm³.` };
} });

G4.push({ code: 'VOL3', theme: 'grandeurs', chapitre: '4e-espace', nombre: 5, creer() {
  const r = ent(1, 6), h = ent(2, 10), k = r * r * h;
  const bonne = `${k}π cm³`;
  return { enonce: `Quel est le volume exact d'un cylindre de rayon ${r} cm et de hauteur ${h} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${2 * r * h}π cm³`, `${r * h}π cm³`, `${k * 2}π cm³`, `${r * r + h}π cm³`]),
    correction: `Volume du cylindre = π × rayon² × hauteur = π × ${r}² × ${h} = ${k}π cm³.` };
} });

G4.push({ code: 'VOL4', theme: 'grandeurs', chapitre: '4e-espace', nombre: 6, creer() {
  if (hasard() < 0.5) {
    const c = ent(2, 9), h = 3 * ent(1, 5);
    return { enonce: `Une pyramide a pour base un carré de côté ${c} cm et pour hauteur ${h} cm. Quel est son volume (en cm³) ?`, reponse: String(c * c * h / 3),
      correction: `Volume de la pyramide = aire de la base × hauteur ÷ 3 = ${c * c} × ${h} ÷ 3 = ${c * c * h / 3} cm³.` };
  }
  const r = ent(1, 6), h = 3 * ent(1, 4), k = r * r * h / 3;
  const bonne = `${k}π cm³`;
  return { enonce: `Quel est le volume exact d'un cône de rayon ${r} cm et de hauteur ${h} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${r * r * h}π cm³`, `${r * h / 3}π cm³`, `${2 * r * h / 3}π cm³`, `${k * 2}π cm³`]),
    correction: `Volume du cône = π × rayon² × hauteur ÷ 3 = π × ${r * r} × ${h} ÷ 3 = ${k}π cm³.` };
} });

// [écriture de départ, unité d'arrivée, facteur, rappel]
const CONVERSIONS_VOLUME = [
  [(x) => `${fr(x)} L`, 'cm³', 1000, '1 L = 1 dm³ = 1 000 cm³'],
  [(x) => `${fr(x)} m³`, 'L', 1000, '1 m³ = 1 000 dm³ = 1 000 L'],
  [(x) => `${fr(x)} dm³`, 'L', 1, '1 dm³ = 1 L'],
  [(x) => `${fr(x)} cL`, 'mL', 10, '1 cL = 10 mL'],
  [(x) => `${fr(x)} cm³`, 'mL', 1, '1 cm³ = 1 mL'],
  [(x) => `${fr(x)} mL`, 'L', 0.001, '1 000 mL = 1 L'],
  [(x) => `${fr(x)} L`, 'cL', 100, '1 L = 100 cL'],
];
G4.push({ code: 'VOL5', theme: 'grandeurs', chapitre: '4e-espace', nombre: 7, creer() {
  const [ecrire, cible, facteur, rappel] = choix(CONVERSIONS_VOLUME);
  const x = facteur < 1 ? choix([250, 500, 750, 1500, 2000, 330]) : choix([2, 1.5, 2.5, 0.5, 3, 0.25, 4, 1.2]);
  const r = arrondi(x * facteur);
  return { enonce: `Convertir ${ecrire(x)} en ${cible}`, reponse: fr(r), variantes: [`${fr(r)} ${cible}`],
    correction: `On sait que ${rappel}. Donc ${ecrire(x)} = ${fr(r)} ${cible}.` };
} });

G4.push({ code: 'AIR1', theme: 'grandeurs', chapitre: '4e-espace', nombre: 7, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const b = ent(2, 12), h = ent(2, 10);
    if ((b * h) % 2) return null;
    return { enonce: `Aire d'un triangle de base ${b} cm et de hauteur ${h} cm (en cm²) ?`, reponse: String(b * h / 2),
      correction: `Aire du triangle = base × hauteur ÷ 2 = ${b} × ${h} ÷ 2 = ${b * h / 2} cm².` };
  }
  if (forme === 2) {
    const b = ent(2, 12), h = ent(2, 10);
    return { enonce: `Aire d'un parallélogramme de base ${b} cm et de hauteur ${h} cm (en cm²) ?`, reponse: String(b * h),
      correction: `Aire du parallélogramme = base × hauteur = ${b} × ${h} = ${b * h} cm².` };
  }
  const r = ent(1, 10), bonne = `${r * r}π cm²`;
  return { enonce: `Quelle est l'aire exacte d'un disque de rayon ${r} cm ?`, reponse: bonne,
    faux: qcm(bonne, [`${2 * r}π cm²`, `${r}π cm²`, `${4 * r * r}π cm²`, `${2 * r * r}π cm²`]),
    correction: `Aire du disque = π × rayon² = π × ${r}² = ${r * r}π cm².` };
} });

G4.push({ code: 'AIR2', theme: 'grandeurs', chapitre: '4e-espace', nombre: 5, creer() {
  const c = ent(2, 12);
  const forme = ent(1, 3);
  if (forme === 1) return { enonce: `Un carré a un périmètre de ${4 * c} cm. Quelle est son aire (en cm²) ?`, reponse: String(c * c),
    correction: `Côté = périmètre ÷ 4 = ${4 * c} ÷ 4 = ${c} cm. Aire = ${c} × ${c} = ${c * c} cm².` };
  if (forme === 2) return { enonce: `Un carré a une aire de ${c * c} cm². Quel est son périmètre (en cm) ?`, reponse: String(4 * c),
    correction: `Le côté est le nombre dont le carré vaut ${c * c} : ${c} cm. Périmètre = 4 × ${c} = ${4 * c} cm.` };
  return { enonce: `Un carré a une aire de ${c * c} cm². Quelle est la longueur de son côté (en cm) ?`, reponse: String(c),
    correction: `On cherche le nombre dont le carré vaut ${c * c} : √${c * c} = ${c} cm.` };
} });

const CONVERSIONS_AIRE = [['m²', 'dm²', 100], ['dm²', 'cm²', 100], ['m²', 'cm²', 10000], ['cm²', 'mm²', 100], ['km²', 'ha', 100], ['ha', 'm²', 10000]];
G4.push({ code: 'AIR3', theme: 'grandeurs', chapitre: '4e-espace', nombre: 5, creer() {
  const [de, vers, facteur] = choix(CONVERSIONS_AIRE);
  const x = choix([1, 2, 3, 5, 1.5, 0.5, 2.5, 0.2]);
  const inverse = hasard() < 0.4;
  if (inverse) {
    const y = x * facteur;
    return { enonce: `Convertir ${fr(y)} ${vers} en ${de}`, reponse: fr(x),
      correction: `1 ${de} = ${fr(facteur)} ${vers}, donc on divise par ${fr(facteur)} : ${fr(y)} ${vers} = ${fr(x)} ${de}.` };
  }
  return { enonce: `Convertir ${fr(x)} ${de} en ${vers}`, reponse: fr(x * facteur),
    correction: `1 ${de} = ${fr(facteur)} ${vers}, donc ${fr(x)} ${de} = ${fr(x)} × ${fr(facteur)} = ${fr(x * facteur)} ${vers}.` };
} });

G4.push({ code: 'AGR1', theme: 'grandeurs', chapitre: '4e-espace', nombre: 6, creer() {
  const k = choix([2, 3, 4, 10, 0.5]);
  const forme = ent(1, 3);
  if (forme === 1) return { enonce: `On ${k > 1 ? 'agrandit' : 'réduit'} une figure en multipliant ses longueurs par ${fr(k)}. Par combien son aire est-elle multipliée ?`, reponse: fr(k * k),
    correction: `Les aires sont multipliées par le carré du coefficient : ${fr(k)}² = ${fr(k * k)}.` };
  if (forme === 2) return { enonce: `On ${k > 1 ? 'agrandit' : 'réduit'} un solide en multipliant ses longueurs par ${fr(k)}. Par combien son volume est-il multiplié ?`, reponse: fr(k ** 3),
    correction: `Les volumes sont multipliés par le cube du coefficient : ${fr(k)}³ = ${fr(k ** 3)}.` };
  const v = choix([8, 12, 20, 5, 10]);
  return { enonce: `Un solide de ${v} cm³ est agrandi : ses longueurs sont multipliées par ${k > 1 ? fr(k) : 2}. Quel est son nouveau volume (en cm³) ?`, reponse: fr(v * (k > 1 ? k : 2) ** 3),
    correction: `Volume multiplié par ${k > 1 ? fr(k) : 2}³ = ${fr((k > 1 ? k : 2) ** 3)} : ${v} × ${fr((k > 1 ? k : 2) ** 3)} = ${fr(v * (k > 1 ? k : 2) ** 3)} cm³.` };
} });

// =============================================================
// GÉOMÉTRIE — Repérage (4e-relatifs)
// =============================================================

G4.push({ code: 'COO1', theme: 'geometrie', chapitre: '4e-relatifs', nombre: 7, creer() {
  const x = entNonNul(-5, 5), y = entNonNul(-4, 4);
  const ecrire = (a, b) => `(${fr(a)} ; ${fr(b)})`;
  const bonne = ecrire(x, y);
  return { enonce: 'Quelles sont les coordonnées du point A ?', reponse: bonne,
    faux: qcm(bonne, [ecrire(y, x), ecrire(-x, y), ecrire(x, -y), ecrire(x + 1, y), ecrire(-y, -x)]),
    svg: svgRepere({ xmin: -6, xmax: 6, ymin: -5, ymax: 5, unite: 26, points: [{ x, y, nom: 'A' }] }),
    correction: `On lit d'abord l'abscisse sur l'axe horizontal (${fr(x)}), puis l'ordonnée sur l'axe vertical (${fr(y)}) : A${bonne}.` };
} });

// =============================================================
// GÉOMÉTRIE — Pythagore et sa réciproque
// =============================================================

G4.push({ code: 'PYT1', theme: 'geometrie', chapitre: '4e-pythagore', nombre: 8, creer() {
  const [a, b, c] = choix(TRIPLETS), [R, P, Q] = choix(LETTRES_TRIANGLES).split('');
  const inverse = hasard() < 0.5;
  const [h, v] = inverse ? [b, a] : [a, b];
  return { enonce: `Le triangle ${R}${P}${Q} est rectangle en ${R}. Combien mesure ${P}${Q} (en cm) ?`, reponse: fr(c),
    svg: svgTriangleRectangle(h, v, [R, P, Q], [`${fr(h)} cm`, `${fr(v)} cm`, '?']),
    correction: `D'après le théorème de Pythagore, ${P}${Q}² = ${R}${P}² + ${R}${Q}² = ${fr(h)}² + ${fr(v)}² = ${fr(h * h)} + ${fr(v * v)} = ${fr(c * c)}. Donc ${P}${Q} = √${fr(c * c)} = ${fr(c)} cm.` };
} });

G4.push({ code: 'PYT2', theme: 'geometrie', chapitre: '4e-pythagore', nombre: 7, creer() {
  const [a, b, c] = choix(TRIPLETS), [R, P, Q] = choix(LETTRES_TRIANGLES).split('');
  const inverse = hasard() < 0.5;
  const [h, v] = inverse ? [b, a] : [a, b];
  return { enonce: `Le triangle ${R}${P}${Q} est rectangle en ${R}. Combien mesure ${R}${Q} (en cm) ?`, reponse: fr(v),
    svg: svgTriangleRectangle(h, v, [R, P, Q], [`${fr(h)} cm`, '?', `${fr(c)} cm`]),
    correction: `D'après le théorème de Pythagore, ${P}${Q}² = ${R}${P}² + ${R}${Q}², donc ${R}${Q}² = ${fr(c)}² − ${fr(h)}² = ${fr(c * c)} − ${fr(h * h)} = ${fr(v * v)}. Donc ${R}${Q} = √${fr(v * v)} = ${fr(v)} cm.` };
} });

G4.push({ code: 'PYT3', theme: 'geometrie', chapitre: '4e-pythagore', nombre: 5, creer() {
  const [A, B, C] = choix(LETTRES_TRIANGLES).split('');
  const sommets = [A, B, C], droit = choix(sommets);
  const autres = sommets.filter(s => s !== droit);
  const hyp = autres.join(''), c1 = droit + autres[0], c2 = droit + autres[1];
  const bonne = `${hyp}² = ${c1}² + ${c2}²`;
  return { enonce: `Le triangle ${A}${B}${C} est rectangle en ${droit}. Quelle égalité est vraie ?`, reponse: bonne,
    faux: qcm(bonne, [`${c1}² = ${hyp}² + ${c2}²`, `${c2}² = ${c1}² + ${hyp}²`, `${hyp} = ${c1} + ${c2}`]),
    correction: `L'hypoténuse est le côté opposé à l'angle droit, ici [${hyp}]. Son carré est égal à la somme des carrés des deux autres côtés : ${bonne}.` };
} });

G4.push({ code: 'REC1', theme: 'geometrie', chapitre: '4e-pythagore-reciproque', nombre: 8, creer() {
  const [a, b, c] = choix(TRIPLETS);
  const rectangle = hasard() < 0.5;
  const cotes = rectangle ? [a, b, c] : [a, b, arrondi(c + choix([-1, 1]) * (c >= 5 ? 1 : 0.1))];
  const [x, y, z] = cotes, [A, B, C] = choix(LETTRES_TRIANGLES).split('');
  const somme = arrondi(x * x + y * y), carre = arrondi(z * z);
  const oui = somme === carre;
  return { enonce: `Un triangle ${A}${B}${C} a pour côtés ${A}${B} = ${fr(x)} cm, ${B}${C} = ${fr(y)} cm et ${A}${C} = ${fr(z)} cm. Est-il rectangle ?`, reponse: oui ? 'Oui' : 'Non', faux: [oui ? 'Non' : 'Oui'],
    correction: `Le plus grand côté est [${A}${C}] : ${A}${C}² = ${fr(carre)}. Et ${A}${B}² + ${B}${C}² = ${fr(x * x)} + ${fr(y * y)} = ${fr(somme)}. ${oui ? 'L\'égalité est vraie : d\'après la réciproque du théorème de Pythagore, le triangle est rectangle en ' + B + '.' : 'L\'égalité est fausse : le triangle n\'est pas rectangle.'}` };
} });

// =============================================================
// GÉOMÉTRIE — Démonstration : triangles, parallélogrammes (4e-demonstration)
// =============================================================

G4.push({ code: 'DEM1', theme: 'geometrie', chapitre: '4e-demonstration', nombre: 6, creer() {
  if (hasard() < 0.5) {
    const a = ent(20, 90), b = ent(20, 150 - a);
    return { enonce: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Combien mesure le troisième (en °) ?`, reponse: String(180 - a - b),
      correction: `La somme des angles d'un triangle vaut 180° : 180 − ${a} − ${b} = ${180 - a - b}°.` };
  }
  const sommet = 2 * ent(10, 70);
  return { enonce: `Un triangle est isocèle et son angle au sommet principal mesure ${sommet}°. Combien mesure chacun des deux autres angles (en °) ?`, reponse: String((180 - sommet) / 2),
    correction: `Les deux angles à la base d'un triangle isocèle sont égaux. Ils se partagent 180 − ${sommet} = ${180 - sommet}°, soit ${(180 - sommet) / 2}° chacun.` };
} });

const PARALLELOGRAMMES = [
  ['Un quadrilatère dont les diagonales se coupent en leur milieu est…', 'un parallélogramme'],
  ['Un quadrilatère dont les côtés opposés sont parallèles deux à deux est…', 'un parallélogramme'],
  ['Un parallélogramme qui a un angle droit est…', 'un rectangle'],
  ['Un parallélogramme dont les diagonales ont la même longueur est…', 'un rectangle'],
  ['Un parallélogramme qui a deux côtés consécutifs de même longueur est…', 'un losange'],
  ['Un parallélogramme dont les diagonales sont perpendiculaires est…', 'un losange'],
  ['Un rectangle qui a deux côtés consécutifs de même longueur est…', 'un carré'],
  ['Un losange qui a un angle droit est…', 'un carré'],
];
G4.push({ code: 'DEM2', theme: 'geometrie', chapitre: '4e-demonstration', nombre: 8, creer() {
  const [question, bonne] = choix(PARALLELOGRAMMES);
  return { enonce: question, reponse: bonne, faux: qcm(bonne, melangeH(['un parallélogramme', 'un rectangle', 'un losange', 'un carré', 'un trapèze'])),
    correction: `C'est une propriété caractéristique : ${question.charAt(0).toLowerCase() + question.slice(1).replace('…', '')} ${bonne}.` };
} });

const DROITES_REMARQUABLES = [
  ['La droite qui passe par un sommet d\'un triangle et qui est perpendiculaire au côté opposé est…', 'une hauteur'],
  ['La droite qui passe par un sommet d\'un triangle et par le milieu du côté opposé est…', 'une médiane'],
  ['La droite perpendiculaire à un côté d\'un triangle en son milieu est…', 'une médiatrice'],
  ['La droite qui partage un angle en deux angles de même mesure est…', 'une bissectrice'],
  ['Le centre du cercle circonscrit à un triangle est le point de concours des…', 'médiatrices'],
];
G4.push({ code: 'DEM3', theme: 'geometrie', chapitre: '4e-demonstration', nombre: 5, creer() {
  const [question, bonne] = choix(DROITES_REMARQUABLES);
  const pluriel = bonne === 'médiatrices';
  return { enonce: question, reponse: bonne,
    faux: qcm(bonne, pluriel ? ['hauteurs', 'médianes', 'bissectrices'] : melangeH(['une hauteur', 'une médiane', 'une médiatrice', 'une bissectrice'])),
    correction: `${question.replace('…', '')} ${bonne}.` };
} });

// =============================================================
// GÉOMÉTRIE — Translation (4e-translation) et symétries
// =============================================================

G4.push({ code: 'TRA1', theme: 'geometrie', chapitre: '4e-translation', nombre: 8, creer() {
  const L = 11, H = 7;
  const v = [entNonNul(-4, 4), entNonNul(-3, 3)];
  const M = { x: ent(1, L - 1), y: ent(1, H - 1) }, N = { x: M.x + v[0], y: M.y + v[1] };
  const A = { x: ent(1, L - 1), y: ent(1, H - 1) }, image = { x: A.x + v[0], y: A.y + v[1] };
  if (!dansGrille(N, L, H) || !dansGrille(image, L, H)) return null;
  if ((A.x === M.x && A.y === M.y) || (A.x === N.x && A.y === N.y)) return null;
  const pieges = [{ x: A.x - v[0], y: A.y - v[1] }, { x: A.x + v[1], y: A.y + v[0] }, { x: A.x - v[0], y: A.y + v[1] }, { x: A.x + v[0], y: A.y - v[1] }];
  const nommes = pointsQuadrillage(image, pieges, L, H).filter(p => !(p.x === M.x && p.y === M.y) && !(p.x === N.x && p.y === N.y) && !(p.x === A.x && p.y === A.y));
  if (nommes.length < 3 || nommes[0].x !== image.x || nommes[0].y !== image.y) return null;
  const tous = [{ ...M, nom: 'M' }, { ...N, nom: 'N' }, { ...A, nom: 'A' }, ...nommes];
  const bonne = nommes[0].nom;
  return { enonce: 'Quelle est l\'image du point A par la translation qui transforme M en N ?', reponse: bonne,
    faux: nommes.slice(1).map(p => p.nom), svg: svgQuadrillage(L, H, tous, [[M.x, M.y], [N.x, N.y]]),
    correction: `Pour aller de M à N, on se déplace de ${Math.abs(v[0])} carreau(x) vers la ${v[0] > 0 ? 'droite' : 'gauche'} et de ${Math.abs(v[1])} vers le ${v[1] > 0 ? 'haut' : 'bas'}. On fait le même déplacement à partir de A : on arrive en ${bonne}.` };
} });

const TRANSLATION_PROPRIETES = [
  ['Une translation conserve…', 'les longueurs, les angles et les aires', ['seulement les longueurs', 'seulement les angles', 'rien du tout']],
  ['Par une translation, l\'image d\'une droite est…', 'une droite parallèle', ['une droite perpendiculaire', 'un segment', 'un point']],
  ['Si la translation qui transforme A en B transforme aussi C en D, alors ABDC est…', 'un parallélogramme', ['un triangle', 'un trapèze rectangle', 'un cercle']],
];
G4.push({ code: 'TRA2', theme: 'geometrie', chapitre: '4e-translation', nombre: 3, creer() {
  const [question, bonne, faux] = choix(TRANSLATION_PROPRIETES);
  return { enonce: question, reponse: bonne, faux,
    correction: `${question.replace('…', '')} ${bonne}. C'est un « glissement » : la figure ne change ni de forme, ni de taille, ni d'orientation.` };
} });

G4.push({ code: 'SYM1', theme: 'geometrie', chapitre: '4e-translation', nombre: 6, creer() {
  const L = 11, H = 7;
  const O = { x: ent(3, L - 3), y: ent(2, H - 2) }, A = { x: ent(1, L - 1), y: ent(1, H - 1) };
  const image = { x: 2 * O.x - A.x, y: 2 * O.y - A.y };
  if (!dansGrille(image, L, H) || (A.x === O.x && A.y === O.y)) return null;
  const pieges = [{ x: 2 * O.x - A.x, y: A.y }, { x: A.x, y: 2 * O.y - A.y }, { x: (A.x + O.x) % (L + 1), y: (A.y + O.y) % (H + 1) }, { x: image.x + 1, y: image.y }];
  const nommes = pointsQuadrillage(image, pieges, L, H).filter(p => !(p.x === O.x && p.y === O.y) && !(p.x === A.x && p.y === A.y));
  if (nommes.length < 3 || nommes[0].x !== image.x) return null;
  const bonne = nommes[0].nom;
  return { enonce: 'Quel point est le symétrique de A par rapport au point O ?', reponse: bonne,
    faux: nommes.slice(1).map(p => p.nom), svg: svgQuadrillage(L, H, [{ ...O, nom: 'O' }, { ...A, nom: 'A' }, ...nommes]),
    correction: `O doit être le milieu du segment joignant A à son symétrique. De A à O : ${Math.abs(O.x - A.x)} carreau(x) en largeur et ${Math.abs(O.y - A.y)} en hauteur. On refait le même trajet au-delà de O : on arrive en ${bonne}.` };
} });

const SOLIDES = [['un cube', 6, 12, 8], ['un pavé droit', 6, 12, 8], ['un prisme droit à base triangulaire', 5, 9, 6], ['une pyramide à base carrée', 5, 8, 5], ['une pyramide à base triangulaire', 4, 6, 4], ['un prisme droit à base hexagonale', 8, 18, 12]];
G4.push({ code: 'SOL1', theme: 'geometrie', chapitre: '4e-espace', nombre: 6, creer() {
  const [nom, faces, aretes, sommets] = choix(SOLIDES);
  const [quoi, n] = choix([['faces', faces], ['arêtes', aretes], ['sommets', sommets]]);
  return { enonce: `Combien de ${quoi} a ${nom} ?`, reponse: String(n),
    correction: `${nom.charAt(0).toUpperCase() + nom.slice(1)} a ${faces} faces, ${aretes} arêtes et ${sommets} sommets.` };
} });

// =============================================================
// ALGORITHMIQUE ET PROGRAMMATION (4e-algo)
// =============================================================

G4.push({ code: 'ALG1', theme: 'algo', chapitre: '4e-algo', nombre: 5, creer() {
  const x0 = ent(-10, 10), n = ent(3, 8), k = entNonNul(-6, 9);
  return { enonce: `x vaut ${fr(x0)}. On répète ${n} fois : « ajouter ${fr(k)} à x ». Que vaut x à la fin ?`, reponse: fr(x0 + n * k),
    correction: `On ajoute ${n} fois ${fr(k)}, soit ${n} × ${par(k)} = ${fr(n * k)} en tout : ${fr(x0)} + ${par(n * k)} = ${fr(x0 + n * k)}.` };
} });

G4.push({ code: 'ALG2', theme: 'algo', chapitre: '4e-algo', nombre: 7, creer() {
  const depart = entNonNul(-6, 9);
  const etapes = melangeH([['multiplier par', ent(2, 5)], ['ajouter', ent(1, 9)], ['soustraire', ent(1, 9)], ['élever au carré', null]]).slice(0, 3);
  let v = depart;
  const trace = [fr(depart)];
  for (const [action, n] of etapes) {
    if (action === 'multiplier par') v *= n;
    if (action === 'ajouter') v += n;
    if (action === 'soustraire') v -= n;
    if (action === 'élever au carré') v *= v;
    trace.push(fr(v));
  }
  if (Math.abs(v) > 500) return null;
  const texte = etapes.map(([a, n]) => n === null ? a : `${a} ${n}`).join(', puis ');
  return { enonce: `Programme : choisir un nombre, ${texte}. Quel résultat obtient-on en choisissant ${fr(depart)} ?`, reponse: fr(v),
    correction: `On suit les étapes dans l'ordre : ${trace.join(' → ')}.` };
} });

G4.push({ code: 'ALG3', theme: 'algo', chapitre: '4e-algo', nombre: 6, creer() {
  const seuil = ent(5, 20), n = seuil + choix([-2, -1, 0, 0, 1, 3]), a = ent(2, 9), b = ent(2, 9);
  const op = choix(['>', '<']);
  const vrai = op === '>' ? n > seuil : n < seuil;
  const r = vrai ? n - a : n + b;
  return { enonce: `n vaut ${n}. « Si n ${op} ${seuil} alors mettre r à n − ${a}, sinon mettre r à n + ${b} ». Que vaut r ?`, reponse: fr(r),
    correction: `${n} ${op} ${seuil} est ${vrai ? 'vrai' : 'faux'}${n === seuil ? ` (${n} n'est pas strictement ${op === '>' ? 'plus grand' : 'plus petit'} que ${seuil})` : ''}, donc on exécute ${vrai ? `« alors » : r = ${n} − ${a} = ${r}` : `« sinon » : r = ${n} + ${b} = ${r}`}.` };
} });

G4.push({ code: 'ALG4', theme: 'algo', chapitre: '4e-algo', nombre: 6, creer() {
  const n = choix([3, 4, 5, 6, 8, 9, 10, 12]);
  const noms = { 3: 'triangle équilatéral', 4: 'carré', 5: 'pentagone régulier', 6: 'hexagone régulier', 8: 'octogone régulier', 9: 'polygone régulier à 9 côtés', 10: 'décagone régulier', 12: 'dodécagone régulier' };
  if (hasard() < 0.6) return { enonce: `Pour tracer un ${noms[n]}, le lutin répète ${n} fois : avancer, puis tourner de combien de degrés ?`, reponse: String(360 / n), variantes: [`${360 / n}°`],
    correction: `Après ${n} virages, le lutin a fait un tour complet (360°). Chaque virage vaut donc 360 ÷ ${n} = ${360 / n}°.` };
  return { enonce: `Le lutin répète : avancer de 50, tourner de ${360 / n}°, jusqu'à revenir à son point de départ. Combien de côtés a la figure ?`, reponse: String(n),
    correction: `Il faut faire un tour complet (360°) : 360 ÷ ${360 / n} = ${n} virages, donc ${n} côtés.` };
} });

G4.push({ code: 'ALG5', theme: 'algo', chapitre: '4e-algo', nombre: 4, creer() {
  const a = ent(2, 6), b = ent(2, 6), pas = choix([10, 20, 5]);
  if (hasard() < 0.5) return { enonce: `« Répéter ${a} fois : (répéter ${b} fois : avancer de ${pas}) ». Combien de fois le lutin avance-t-il ?`, reponse: String(a * b),
    correction: `La boucle intérieure (${b} fois) est elle-même répétée ${a} fois : ${a} × ${b} = ${a * b}.` };
  return { enonce: `« Répéter ${a} fois : (répéter ${b} fois : avancer de ${pas}) ». Quelle distance totale le lutin parcourt-il ?`, reponse: String(a * b * pas),
    correction: `Il avance ${a} × ${b} = ${a * b} fois de ${pas} : ${a * b} × ${pas} = ${a * b * pas}.` };
} });

G4.push({ code: 'ALG6', theme: 'algo', chapitre: '4e-algo', nombre: 5, creer() {
  const depart = ent(0, 5), pas = ent(3, 9), limite = ent(15, 40);
  let n = depart;
  const valeurs = [];
  while (!(n > limite)) { n += pas; valeurs.push(n); }
  return { enonce: `n vaut ${depart}. « Répéter jusqu'à ce que n > ${limite} : ajouter ${pas} à n ». Que vaut n à la fin ?`, reponse: String(n),
    correction: `n prend les valeurs ${valeurs.join(', ')}. La boucle s'arrête dès que n > ${limite}, c'est-à-dire à ${n}.` };
} });

G4.push({ code: 'ALG7', theme: 'algo', chapitre: '4e-algo', nombre: 5, creer() {
  const x0 = ent(-100, 100) * 1, y0 = ent(-100, 100), a = entNonNul(-50, 50), n = ent(2, 4), c = choix([10, 20, 30, -10, -20]);
  const xf = x0 + a + n * c;
  return { enonce: `Le lutin est en x = ${fr(x0)}, y = ${fr(y0)}. Il exécute : « ajouter ${fr(a)} à x », puis « répéter ${n} fois : ajouter ${fr(c)} à x ». Quelle est son abscisse x à la fin ?`, reponse: fr(xf),
    correction: `Seul x change : ${fr(x0)} + ${par(a)} + ${n} × ${par(c)} = ${fr(x0 + a)} + ${par(n * c)} = ${fr(xf)}.` };
} });

G4.push({ code: 'ALG8', theme: 'algo', chapitre: '4e-algo', nombre: 6, creer() {
  const x = ent(0, 20), a = ent(1, 19), b = ent(1, 19);
  const forme = ent(1, 3);
  let texte, vrai, explication;
  if (forme === 1) { texte = `x > ${a} et x < ${b}`; vrai = x > a && x < b; explication = `« et » est vrai seulement si les deux conditions sont vraies : ${x} > ${a} est ${x > a ? 'vrai' : 'faux'}, ${x} < ${b} est ${x < b ? 'vrai' : 'faux'}.`; }
  if (forme === 2) { texte = `x < ${a} ou x > ${b}`; vrai = x < a || x > b; explication = `« ou » est vrai dès qu'une des deux conditions est vraie : ${x} < ${a} est ${x < a ? 'vrai' : 'faux'}, ${x} > ${b} est ${x > b ? 'vrai' : 'faux'}.`; }
  if (forme === 3) { texte = `non (x > ${a})`; vrai = !(x > a); explication = `${x} > ${a} est ${x > a ? 'vrai' : 'faux'}, et « non » inverse le résultat.`; }
  return { enonce: `x vaut ${x}. La condition « ${texte} » est-elle vraie ?`, reponse: vrai ? 'Vraie' : 'Fausse', faux: [vrai ? 'Fausse' : 'Vraie'],
    correction: `${explication} La condition est donc ${vrai ? 'vraie' : 'fausse'}.` };
} });

G4.push({ code: 'ALG9', theme: 'algo', chapitre: '4e-algo', nombre: 5, creer() {
  const a = ent(1, 9), b = ent(1, 9);
  const forme = ent(1, 2);
  if (forme === 1) {
    const na = a + b, nb = na - b;
    return { enonce: `a vaut ${a} et b vaut ${b}. On exécute « mettre a à a + b », puis « mettre b à a − b ». Que vaut b ?`, reponse: String(nb),
      correction: `Après la 1re instruction, a = ${a} + ${b} = ${na}. Après la 2e, b = ${na} − ${b} = ${nb} (on utilise la nouvelle valeur de a).` };
  }
  const nb = a * 2, na = nb + a;
  return { enonce: `a vaut ${a} et b vaut ${b}. On exécute « mettre b à a × 2 », puis « mettre a à b + a ». Que vaut a ?`, reponse: String(na),
    correction: `Après la 1re instruction, b = ${a} × 2 = ${nb}. Après la 2e, a = ${nb} + ${a} = ${na}.` };
} });

G4.push({ code: 'ALG10', theme: 'algo', chapitre: '4e-algo', nombre: 5, creer() {
  const a = ent(2, 9), b = ent(2, 9), c = ent(2, 5);
  const forme = ent(1, 3);
  if (forme === 1) return { enonce: `Le lutin exécute « dire ((${a} + ${b}) × ${c}) ». Que dit-il ?`, reponse: String((a + b) * c),
    correction: `On calcule d'abord le bloc le plus intérieur : ${a} + ${b} = ${a + b}, puis × ${c} : ${(a + b) * c}.` };
  if (forme === 2) return { enonce: `Le lutin exécute « dire (${a} + (${b} × ${c})) ». Que dit-il ?`, reponse: String(a + b * c),
    correction: `On calcule d'abord le bloc intérieur : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${a + b * c}.` };
  return { enonce: `Le lutin exécute « dire ((${a * c} − ${b}) − ${c}) ». Que dit-il ?`, reponse: String(a * c - b - c),
    correction: `Bloc intérieur d'abord : ${a * c} − ${b} = ${a * c - b}, puis − ${c} : ${a * c - b - c}.` };
} });
