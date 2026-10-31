// =============================================================
// GÉNÉRATEURS DE QUESTIONS DE 6e
// Même principe que 4e.js. Certains types des autres niveaux, qui
// relèvent aussi de la 6e, sont repris avec d'autres valeurs.
// =============================================================

GENERATEURS['6e'] = [];
const G6 = GENERATEURS['6e'];

function reprendre6(niveau, code, nouveauCode, theme, chapitre, nombre) {
  const g = GENERATEURS[niveau].find(x => x.code === code);
  G6.push({ code: nouveauCode, theme, chapitre, nombre, creer: g.creer });
}

const pad2 = (n) => String(n).padStart(2, '0');

// ---------- Nombres en lettres (jusqu'à 999 999) ----------
const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const DIZAINES = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
function moinsDeCent(n) {
  if (n < 17) return UNITES[n];
  if (n < 20) return 'dix-' + UNITES[n - 10];
  const d = Math.floor(n / 10), u = n % 10;
  if (d <= 6) return DIZAINES[d] + (u === 0 ? '' : u === 1 ? ' et un' : '-' + UNITES[u]);
  if (d === 7) return 'soixante' + (u === 1 ? ' et onze' : '-' + moinsDeCent(10 + u));
  if (n === 80) return 'quatre-vingts';
  return 'quatre-vingt-' + moinsDeCent(n - 80);
}
function moinsDeMille(n) {
  const c = Math.floor(n / 100), r = n % 100;
  let s = c === 1 ? 'cent' : c > 1 ? UNITES[c] + ' cent' + (r === 0 ? 's' : '') : '';
  if (r) s += (s ? ' ' : '') + moinsDeCent(r);
  return s;
}
function enLettres(n) {
  const m = Math.floor(n / 1000), r = n % 1000;
  // « mille » est invariable, et « cents » / « vingts » perdent leur s devant « mille »
  let s = m === 1 ? 'mille' : m > 1 ? moinsDeMille(m).replace(/(cent|vingt)s$/, '$1') + ' mille' : '';
  if (r) s += (s ? ' ' : '') + moinsDeMille(r);
  return s || 'zéro';
}

// ---------- Figures propres à la 6e ----------

// Horloge à aiguilles.
function svgHorloge(h, m) {
  const C = 110, R = 92;
  let s = enteteSVG(220, 220);
  s += `<circle cx="${C}" cy="${C}" r="${R}" fill="#ffffff" stroke="#222" stroke-width="4"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, long = i % 5 === 0 ? 10 : 4;
    s += trait(C + (R - long) * Math.sin(a), C - (R - long) * Math.cos(a), C + R * Math.sin(a), C - R * Math.cos(a), '#222', i % 5 === 0 ? 2.5 : 1);
  }
  for (let i = 1; i <= 12; i++) {
    const a = i * 30 * Math.PI / 180;
    s += texteSVG(C + 70 * Math.sin(a), C - 70 * Math.cos(a) + 6, String(i), 'text-anchor="middle" font-size="17" font-weight="bold"');
  }
  const ah = ((h % 12) + m / 60) * 30 * Math.PI / 180, am = m * 6 * Math.PI / 180;
  s += trait(C, C, C + 48 * Math.sin(ah), C - 48 * Math.cos(ah), '#222', 7, 'stroke-linecap="round"');
  s += trait(C, C, C + 78 * Math.sin(am), C - 78 * Math.cos(am), COULEUR_TRACE, 3.5, 'stroke-linecap="round"');
  s += `<circle cx="${C}" cy="${C}" r="6" fill="#222"/>`;
  return s + '</svg>';
}

// Figure faite de carreaux coloriés sur un quadrillage.
function svgCarreaux(L, H, cases) {
  const c = 28, marge = 14, W = L * c + 2 * marge, Ht = H * c + 2 * marge;
  let s = enteteSVG(W, Ht);
  for (const [x, y] of cases) s += `<rect x="${marge + x * c}" y="${marge + y * c}" width="${c}" height="${c}" fill="#7bb1f0"/>`;
  for (let x = 0; x <= L; x++) s += trait(marge + x * c, marge, marge + x * c, marge + H * c, '#bbbbbb', 1);
  for (let y = 0; y <= H; y++) s += trait(marge, marge + y * c, marge + L * c, marge + y * c, '#bbbbbb', 1);
  return s + '</svg>';
}

// Quadrillage avec un axe de symétrie (vertical en x = a, ou horizontal en y = a).
function svgSymetrie(L, H, points, vertical, a) {
  const c = 30, marge = 20, X = x => marge + x * c, Y = y => marge + (H - y) * c;
  const axe = vertical ? trait(X(a), Y(0) + 6, X(a), Y(H) - 6, COULEUR_TRACE, 3, 'stroke-dasharray="8 5"')
    : trait(X(0) - 6, Y(a), X(L) + 6, Y(a), COULEUR_TRACE, 3, 'stroke-dasharray="8 5"');
  return svgQuadrillage(L, H, points).replace('</svg>', axe + '</svg>');
}

// Polyomino au hasard : « n » carreaux qui se touchent par un côté.
function carreauxAuHasard(L, H, n) {
  const cases = [[ent(2, L - 3), ent(2, H - 3)]], cle = (p) => p.join(',');
  const pris = new Set([cle(cases[0])]);
  let essais = 0;
  while (cases.length < n && essais++ < 500) {
    const [x, y] = choix(cases), [dx, dy] = choix([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const p = [x + dx, y + dy];
    if (p[0] < 0 || p[1] < 0 || p[0] >= L || p[1] >= H || pris.has(cle(p))) continue;
    pris.add(cle(p)); cases.push(p);
  }
  let perimetre = 0;
  for (const [x, y] of cases) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!pris.has(cle([x + dx, y + dy]))) perimetre++;
  return { cases, perimetre };
}

// =============================================================
// NOMBRES — Nombres entiers (6e-entiers)
// =============================================================

const RANGS = ['unités', 'dizaines', 'centaines', 'unités de mille', 'dizaines de mille', 'centaines de mille'];
G6.push({ code: 'ENT1', theme: 'nombres', chapitre: '6e-entiers', nombre: 7, creer() {
  const n = ent(10000, 999999), chiffres = String(n), rang = ent(1, Math.min(4, chiffres.length - 1));
  if (hasard() < 0.5) {
    const c = chiffres[chiffres.length - 1 - rang];
    return { enonce: `Dans ${fr(n)}, quel est le chiffre des ${RANGS[rang]} ?`, reponse: c,
      correction: `On lit les rangs de droite à gauche : unités, dizaines, centaines, unités de mille… Le chiffre des ${RANGS[rang]} est ${c}.` };
  }
  const nombre = Math.floor(n / 10 ** rang), nom = { 1: 'dizaines', 2: 'centaines', 3: 'milliers', 4: 'dizaines de mille' }[rang];
  return { enonce: `Combien y a-t-il de ${nom} dans ${fr(n)} ?`, reponse: String(nombre), variantes: [fr(nombre)],
    correction: `Le nombre de ${nom}, c'est tout ce qui est écrit à gauche du chiffre des ${RANGS[rang]}, celui-ci compris : ${fr(nombre)}. (Ne pas confondre avec le chiffre des ${RANGS[rang]}, qui est ${chiffres[chiffres.length - 1 - rang]}.)` };
} });

G6.push({ code: 'ENT2', theme: 'nombres', chapitre: '6e-entiers', nombre: 6, creer() {
  const n = choix([ent(1001, 9999), ent(10000, 99999), ent(100, 999), ent(70, 99) * 1000 + ent(0, 999)]);
  if (hasard() < 0.6) return { enonce: `Écrire en chiffres : ${enLettres(n)}`, reponse: String(n), variantes: [fr(n)],
    correction: `${enLettres(n)} s'écrit ${fr(n)}.` };
  const bonne = enLettres(n);
  const autre = enLettres(n + choix([10, 100, 1, 1000])), autre2 = enLettres(Math.max(1, n - choix([10, 100, 1]))), autre3 = enLettres(Number(String(n).split('').reverse().join('')) || n + 2);
  return { enonce: `Comment s'écrit ${fr(n)} en lettres ?`, reponse: bonne, faux: qcm(bonne, [autre, autre2, autre3]),
    correction: `${fr(n)} se lit « ${bonne} ».` };
} });

G6.push({ code: 'ENT3', theme: 'nombres', chapitre: '6e-entiers', nombre: 14, creer() {
  const forme = ent(1, 7);
  if (forme === 1) { const a = ent(11, 89); return { enonce: `Combien faut-il ajouter à ${a} pour obtenir 100 ?`, reponse: String(100 - a), correction: `${a} + ${100 - a} = 100 : on complète d'abord à la dizaine (${Math.ceil(a / 10) * 10}), puis à 100.` }; }
  if (forme === 2) { const a = ent(110, 890); return { enonce: `Combien faut-il ajouter à ${a} pour obtenir 1 000 ?`, reponse: String(1000 - a), variantes: [fr(1000 - a)], correction: `${a} + ${1000 - a} = 1 000.` }; }
  if (forme === 3) { const a = ent(3, 9), b = ent(3, 9); return { enonce: `Calculer ${a} × ${b}`, reponse: String(a * b), correction: `Table de ${a} : ${a} × ${b} = ${a * b}.` }; }
  if (forme === 4) { const a = 2 * ent(13, 99); return hasard() < 0.5 ? { enonce: `Quel est le double de ${a} ?`, reponse: String(2 * a), correction: `Le double, c'est × 2 : ${a} × 2 = ${2 * a}.` } : { enonce: `Quelle est la moitié de ${a} ?`, reponse: String(a / 2), correction: `La moitié, c'est ÷ 2 : ${a} ÷ 2 = ${a / 2}.` }; }
  if (forme === 5) { const a = ent(23, 180), b = choix([9, 99, 19]); return { enonce: `Calculer ${a} + ${b}`, reponse: String(a + b), correction: `Astuce : ajouter ${b}, c'est ajouter ${b + 1} puis retirer 1 : ${a} + ${b + 1} = ${a + b + 1}, puis − 1 = ${a + b}.` }; }
  if (forme === 6) { const a = ent(12, 60); return { enonce: `Calculer ${a} × 4`, reponse: String(4 * a), correction: `Multiplier par 4, c'est doubler deux fois : ${a} → ${2 * a} → ${4 * a}.` }; }
  const a = 2 * ent(6, 49);
  return { enonce: `Calculer ${a} × 5`, reponse: String(5 * a), correction: `Multiplier par 5, c'est multiplier par 10 puis diviser par 2 : ${a} × 10 = ${10 * a}, puis ÷ 2 = ${5 * a}.` };
} });

G6.push({ code: 'ENT4', theme: 'nombres', chapitre: '6e-entiers', nombre: 5, creer() {
  const n = ent(1012, 98987), [nom, p] = choix([['à la dizaine', 10], ['à la centaine', 100], ['au millier', 1000]]);
  const r = Math.round(n / p) * p;
  if (n % p === 0) return null;
  return { enonce: `Arrondir ${fr(n)} ${nom} près`, reponse: String(r), variantes: [fr(r)],
    correction: `${fr(n)} est entre ${fr(Math.floor(n / p) * p)} et ${fr(Math.ceil(n / p) * p)}. Il est plus proche de ${fr(r)}.` };
} });

// =============================================================
// NOMBRES — Nombres décimaux (6e-decimaux)
// =============================================================

G6.push({ code: 'DEC1', theme: 'nombres', chapitre: '6e-decimaux', nombre: 6, creer() {
  const forme = ent(1, 3);
  if (forme === 1) {
    const [q, unite, petite, f] = choix([['1 dixième', 'centièmes', 10], ['1 unité', 'dixièmes', 10], ['1 unité', 'centièmes', 100], ['1 dixième', 'millièmes', 100], ['1 centième', 'millièmes', 10], ['1 unité', 'millièmes', 1000]].map(([a, b, c]) => [a, b, b, c]));
    return { enonce: `Combien de ${unite} y a-t-il dans ${q} ?`, reponse: String(f),
      correction: `Chaque rang vaut 10 fois le rang à sa droite. ${q} = ${f} ${unite}.` };
  }
  const u = ent(0, 9), d = ent(0, 9), c = ent(1, 9);
  const v = arrondi(u + d / 10 + c / 100);
  if (forme === 2) return { enonce: `Écrire le nombre formé de ${u} unité${u > 1 ? 's' : ''}, ${d} dixième${d > 1 ? 's' : ''} et ${c} centième${c > 1 ? 's' : ''}`, reponse: fr(v),
    correction: `Unités avant la virgule, puis dixièmes, puis centièmes : ${fr(v)}.` };
  return { enonce: `Combien y a-t-il de centièmes dans ${fr(v)} ?`, reponse: String(Math.round(v * 100)),
    correction: `${fr(v)} = ${Math.round(v * 100)}/100 : il y a ${Math.round(v * 100)} centièmes.` };
} });

G6.push({ code: 'DEC2', theme: 'nombres', chapitre: '6e-decimaux', nombre: 9, creer() {
  const d = choix([10, 100, 1000]), n = ent(1, d === 10 ? 99 : 999);
  if (n % 10 === 0) return null;
  if (hasard() < 0.6) return { enonce: `Écrire ${n}/${fr(d)} sous forme décimale`, reponse: fr(n / d),
    correction: `Diviser par ${fr(d)}, c'est décaler la virgule de ${Math.log10(d)} rang${d > 10 ? 's' : ''} vers la gauche : ${n}/${fr(d)} = ${fr(n / d)}.` };
  return { enonce: `Écrire ${fr(n / d)} sous forme d'une fraction décimale`, reponse: `${n}/${d}`, variantes: [`${n}/${fr(d)}`],
    correction: `${fr(n / d)} a ${Math.log10(d)} chiffre${d > 10 ? 's' : ''} après la virgule : ${fr(n / d)} = ${n}/${fr(d)}.` };
} });

G6.push({ code: 'DEC3', theme: 'nombres', chapitre: '6e-decimaux', nombre: 6, creer() {
  const u = ent(1, 9), base = [u + 0.5, u + 0.45, u + 0.405, u + 0.054, u + 0.5 - 0.04, u + 0.045].map(x => arrondi(x));
  if (hasard() < 0.5) {
    const nombres = melangeH([...new Set(base)]).slice(0, 4), plusGrand = hasard() < 0.5;
    const cible = plusGrand ? Math.max(...nombres) : Math.min(...nombres);
    return { enonce: `Quel est le plus ${plusGrand ? 'grand' : 'petit'} de ces nombres ?`, reponse: fr(cible), faux: nombres.filter(x => x !== cible).map(fr),
      correction: `On compare chiffre par chiffre, en commençant par les unités, puis les dixièmes, les centièmes… : ${[...nombres].sort((a, b) => a - b).map(fr).join(' < ')}.` };
  }
  const a = arrondi(ent(10, 99) / 10), b = arrondi(Math.floor(a) + ent(10, 99) / 100);
  if (a === b) return null;
  const bonne = a < b ? '<' : '>';
  return { enonce: `Compléter par < ou > :  ${fr(a)} … ${fr(b)}`, reponse: bonne, faux: [bonne === '<' ? '>' : '<'],
    correction: `Même partie entière : on compare les dixièmes, puis les centièmes. ${fr(a)} = ${fr(a).includes(',') ? fr(a) + '0' : fr(a) + ',00'} et ${fr(b)} : donc ${fr(a)} ${bonne} ${fr(b)}.` };
} });

G6.push({ code: 'DEC4', theme: 'nombres', chapitre: '6e-decimaux', nombre: 7, creer() {
  const pas = choix([0.1, 0.1, 0.2, 0.5, 0.01]), debut = arrondi(ent(0, 5) * pas * 5 + (pas === 0.01 ? ent(1, 3) : 0));
  let rang;
  do { rang = ent(1, 9); } while (rang % 5 === 0);
  const v = arrondi(debut + rang * pas), base = Math.floor(rang / 5) * 5;
  return { enonce: 'Quelle est l\'abscisse du point A ?', reponse: fr(v), svg: svgDroiteGraduee(debut, pas, 10, 5, rang, 'A'),
    correction: `Entre deux nombres écrits, il y a 5 graduations pour un écart de ${fr(arrondi(5 * pas))} : une graduation vaut ${fr(pas)}. A est ${rang - base} graduation(s) après ${fr(arrondi(debut + base * pas))} : ${fr(v)}.` };
} });

G6.push({ code: 'DEC5', theme: 'nombres', chapitre: '6e-decimaux', nombre: 5, creer() {
  const x = arrondi(ent(1001, 99999) / 1000), [nom, chiffres] = choix([['à l\'unité', 0], ['au dixième', 1], ['au centième', 2]]);
  const r = arrondi(Math.round(x * 10 ** chiffres) / 10 ** chiffres);
  return { enonce: `Arrondir ${fr(x)} ${nom}`, reponse: fr(r),
    correction: `On regarde le chiffre juste après le rang demandé : s'il vaut 5 ou plus, on arrondit au-dessus, sinon en dessous. ${fr(x)} ≈ ${fr(r)}.` };
} });

G6.push({ code: 'DEC6', theme: 'nombres', chapitre: '6e-decimaux', nombre: 4, creer() {
  const x = arrondi(ent(10001, 99999) / 1000), t = fr(x).split(',')[1].padEnd(3, '0');
  const [nom, i] = choix([['dixièmes', 0], ['centièmes', 1], ['millièmes', 2]]);
  return { enonce: `Dans ${fr(x)}, quel est le chiffre des ${nom} ?`, reponse: t[i],
    correction: `Après la virgule : 1er chiffre = dixièmes, 2e = centièmes, 3e = millièmes. Le chiffre des ${nom} est ${t[i]}.` };
} });

// =============================================================
// NOMBRES — Opérations (6e-operations)
// =============================================================

G6.push({ code: 'OPE1', theme: 'nombres', chapitre: '6e-operations', nombre: 10, creer() {
  const x = arrondi(ent(1, 9999) / choix([10, 100, 1000])), p = choix([10, 100, 1000]), fois = hasard() < 0.55;
  const r = fois ? arrondi(x * p) : arrondi(x / p, 9);
  if (r < 0.0001) return null;
  return { enonce: `Calculer ${fr(x)} ${fois ? '×' : '÷'} ${fr(p)}`, reponse: fr(r),
    correction: `${fois ? 'Multiplier' : 'Diviser'} par ${fr(p)}, c'est rendre chaque chiffre ${fr(p)} fois plus ${fois ? 'grand' : 'petit'} : la virgule se décale de ${Math.log10(p)} rang${p > 10 ? 's' : ''} vers la ${fois ? 'droite' : 'gauche'}. ${fr(x)} ${fois ? '×' : '÷'} ${fr(p)} = ${fr(r)}.` };
} });

G6.push({ code: 'OPE2', theme: 'nombres', chapitre: '6e-operations', nombre: 10, creer() {
  const forme = ent(1, 4);
  if (forme === 1) { const a = arrondi(ent(11, 99) / 10), b = arrondi(ent(101, 999) / 100); return { enonce: `Calculer ${fr(a)} + ${fr(b)}`, reponse: fr(arrondi(a + b)), correction: `On aligne les virgules (${fr(a)} = ${fr(a)}0) : ${fr(a)}0 + ${fr(b)} = ${fr(arrondi(a + b))}.` }; }
  if (forme === 2) { const a = ent(5, 20), b = arrondi(ent(11, 49) / 10); return { enonce: `Calculer ${a} − ${fr(b)}`, reponse: fr(arrondi(a - b)), correction: `${a} = ${a},0 ; on aligne les virgules : ${a},0 − ${fr(b)} = ${fr(arrondi(a - b))}.` }; }
  if (forme === 3) { const a = arrondi(ent(1, 99) / 100); return { enonce: `Compléter : ${fr(a)} + … = 1`, reponse: fr(arrondi(1 - a)), correction: `1 = 1,00 ; il manque ${fr(arrondi(1 - a))} pour aller de ${fr(a)} à 1.` }; }
  const a = arrondi(ent(21, 99) / 10), b = arrondi(ent(11, 99) / 10);
  if (b >= a) return null;
  return { enonce: `Calculer ${fr(a)} − ${fr(b)}`, reponse: fr(arrondi(a - b)), correction: `On aligne les virgules et on soustrait : ${fr(a)} − ${fr(b)} = ${fr(arrondi(a - b))}.` };
} });

G6.push({ code: 'OPE3', theme: 'nombres', chapitre: '6e-operations', nombre: 6, creer() {
  const [a, b, astuce] = choix([[0.5, 2 * ent(2, 20), 'multiplier par 0,5, c\'est prendre la moitié'], [2.5, 4 * ent(1, 5), '2,5 × 4 = 10'], [0.1, ent(2, 99), 'multiplier par 0,1, c\'est diviser par 10'], [0.2, 5 * ent(1, 6), '0,2 × 5 = 1'], [1.5, 2 * ent(2, 10), '1,5 fois un nombre = ce nombre + sa moitié'], [0.3, 0.2, '3 × 2 = 6, et 1 + 1 = 2 chiffres après la virgule']]);
  return { enonce: `Calculer ${fr(a)} × ${fr(b)}`, reponse: fr(arrondi(a * b)), correction: `Astuce : ${astuce}. ${fr(a)} × ${fr(b)} = ${fr(arrondi(a * b))}.` };
} });

G6.push({ code: 'OPE4', theme: 'nombres', chapitre: '6e-operations', nombre: 4, creer() {
  const a = choix([19, 21, 29, 31, 39, 41, 49, 51, 99, 101]), b = choix([19, 21, 29, 31, 48, 52, 98, 102]);
  const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10, ordre = ra * rb;
  const bonne = fr(ordre);
  return { enonce: `Quel est l'ordre de grandeur de ${a} × ${b} ?`, reponse: bonne, faux: qcm(bonne, [fr(ordre * 10), fr(ordre / 10), fr(ra + rb), fr(ordre * 100)]),
    correction: `On arrondit : ${a} ≈ ${ra} et ${b} ≈ ${rb}. ${ra} × ${rb} = ${fr(ordre)}.` };
} });

// =============================================================
// NOMBRES — Division, multiples, diviseurs (6e-division)
// =============================================================

G6.push({ code: 'DIV1', theme: 'nombres', chapitre: '6e-division', nombre: 7, creer() {
  const forme = ent(1, 3);
  if (forme === 1) { const b = ent(3, 9), q = ent(3, 12), r = ent(1, b - 1), a = b * q + r; return { enonce: `Quel est le reste de la division euclidienne de ${a} par ${b} ?`, reponse: String(r), correction: `${b} × ${q} = ${b * q} et ${a} − ${b * q} = ${r} : ${a} = ${b} × ${q} + ${r}. Le reste est ${r}.` }; }
  if (forme === 2) {
    const places = choix([4, 5, 6, 8]), n = ent(20, 60);
    if (n % places === 0) return null;
    return { enonce: `${n} personnes doivent partir en voiture. Chaque voiture a ${places} places. Combien de voitures faut-il au minimum ?`, reponse: String(Math.ceil(n / places)),
      correction: `${n} = ${places} × ${Math.floor(n / places)} + ${n % places}. ${Math.floor(n / places)} voitures ne suffisent pas : il reste ${n % places} personne(s). Il faut ${Math.ceil(n / places)} voitures.` };
  }
  const taille = choix([6, 8, 10, 12]), n = ent(40, 120);
  return { enonce: `On range ${n} œufs dans des boîtes de ${taille}. Combien de boîtes sont complètement remplies ?`, reponse: String(Math.floor(n / taille)),
    correction: `${n} = ${taille} × ${Math.floor(n / taille)} + ${n % taille} : ${Math.floor(n / taille)} boîtes pleines${n % taille ? ` et ${n % taille} œuf(s) en plus` : ''}.` };
} });

reprendre6('5e', 'DIV1', 'DIV2', 'nombres', '6e-division', 6);
reprendre6('4e', 'FRA8', 'DIV3', 'nombres', '6e-division', 5);

G6.push({ code: 'DIV4', theme: 'nombres', chapitre: '6e-division', nombre: 5, creer() {
  const b = choix([2, 4, 5, 8]), a = ent(5, 40);
  if (a % b === 0) return null;
  if (hasard() < 0.5) return { enonce: `Calculer ${a} ÷ ${b} (résultat décimal)`, reponse: fr(a / b), correction: `${a} = ${b} × ${Math.floor(a / b)} + ${a % b}. On continue la division après la virgule : ${a} ÷ ${b} = ${fr(a / b)}.` };
  return { enonce: `On partage ${a} € équitablement entre ${b} personnes. Combien reçoit chacune (en €) ?`, reponse: fr(a / b), correction: `${a} ÷ ${b} = ${fr(a / b)} €.` };
} });

// =============================================================
// NOMBRES — Fractions (6e-fractions)
// =============================================================

reprendre6('5e', 'FRA6', 'FRA1', 'nombres', '6e-fractions', 6);
reprendre6('5e', 'FRA5', 'FRA2', 'nombres', '6e-fractions', 5);
reprendre6('4e', 'FRA9', 'FRA3', 'nombres', '6e-fractions', 5);
reprendre6('4e', 'FRA2', 'FRA4', 'nombres', '6e-fractions', 3);

G6.push({ code: 'FRA5', theme: 'nombres', chapitre: '6e-fractions', nombre: 6, creer() {
  const b = choix([2, 3, 4, 5, 6, 10]), a = ent(1, b - 1), k = ent(2, 8), q = b * k;
  if (pgcd(a, b) !== 1) return null;
  const enonce = choix([
    `Une boîte contient ${q} œufs. On en utilise les ${a}/${b}. Combien d'œufs utilise-t-on ?`,
    `Une classe compte ${q} élèves. Les ${a}/${b} sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?`,
    `Un sachet contient ${q} billes. On en donne les ${a}/${b}. Combien de billes donne-t-on ?`,
    `Combien font les ${a}/${b} de ${q} € ?`,
  ]);
  return { enonce, reponse: String(a * k), correction: `On partage en ${b} : ${q} ÷ ${b} = ${k}. Puis on en prend ${a} parts : ${a} × ${k} = ${a * k}.` };
} });

G6.push({ code: 'FRA6', theme: 'nombres', chapitre: '6e-fractions', nombre: 4, creer() {
  const b = ent(2, 9), a = choix([b - ent(1, b - 1), b, b + ent(1, 5)]);
  const bonne = a < b ? '<' : a > b ? '>' : '=';
  return { enonce: `Compléter par <, > ou = :  ${a}/${b} … 1`, reponse: bonne, faux: qcm(bonne, ['<', '>', '=']),
    correction: `1 = ${b}/${b}. On compare ${a} et ${b} : ${a}/${b} ${bonne} 1. (Une fraction est plus grande que 1 quand son numérateur est plus grand que son dénominateur.)` };
} });

G6.push({ code: 'FRA7', theme: 'nombres', chapitre: '6e-fractions', nombre: 5, creer() {
  const [f, d, astuce] = choix([['1/2', 0.5, '1 ÷ 2'], ['1/4', 0.25, '1 ÷ 4'], ['3/4', 0.75, '3 ÷ 4'], ['1/5', 0.2, '1 ÷ 5'], ['2/5', 0.4, '2 ÷ 5'], ['3/2', 1.5, '3 ÷ 2'], ['5/4', 1.25, '5 ÷ 4'], ['7/10', 0.7, '7 dixièmes']]);
  return { enonce: `Écrire ${f} sous forme décimale`, reponse: fr(d), correction: `${f} = ${astuce} = ${fr(d)}.` };
} });

// =============================================================
// GÉOMÉTRIE — Droites, cercles, angles, symétrie, figures
// =============================================================

const VOCABULAIRE = [
  ['La notation [AB] désigne…', 'le segment d\'extrémités A et B', ['la droite passant par A et B', 'la demi-droite d\'origine A', 'la longueur AB']],
  ['La notation (AB) désigne…', 'la droite passant par A et B', ['le segment d\'extrémités A et B', 'la demi-droite d\'origine A', 'la longueur AB']],
  ['La notation [AB) désigne…', 'la demi-droite d\'origine A passant par B', ['la droite passant par A et B', 'le segment [AB]', 'la demi-droite d\'origine B']],
  ['La notation AB (sans crochets ni parenthèses) désigne…', 'la longueur du segment [AB]', ['la droite (AB)', 'la demi-droite [AB)', 'le milieu de [AB]']],
  ['Deux droites qui se coupent en formant un angle droit sont…', 'perpendiculaires', ['parallèles', 'confondues', 'sécantes mais pas perpendiculaires']],
  ['Le point qui partage un segment en deux segments de même longueur est…', 'son milieu', ['son extrémité', 'son centre de gravité', 'son sommet']],
];
G6.push({ code: 'GEO1', theme: 'geometrie', chapitre: '6e-geometrie', nombre: 6, creer() {
  const [question, bonne, faux] = choix(VOCABULAIRE);
  return { enonce: question, reponse: bonne, faux, correction: `${question.replace('…', '')} ${bonne}.` };
} });

G6.push({ code: 'GEO2', theme: 'geometrie', chapitre: '6e-geometrie', nombre: 5, creer() {
  const r = choix([2, 3, 4, 5, 6, 2.5, 3.5, 7, 8]);
  if (hasard() < 0.5) return { enonce: `Un cercle a un rayon de ${fr(r)} cm. Quel est son diamètre (en cm) ?`, reponse: fr(2 * r), correction: `Le diamètre est le double du rayon : 2 × ${fr(r)} = ${fr(2 * r)} cm.` };
  return { enonce: `Un cercle a un diamètre de ${fr(2 * r)} cm. Quel est son rayon (en cm) ?`, reponse: fr(r), correction: `Le rayon est la moitié du diamètre : ${fr(2 * r)} ÷ 2 = ${fr(r)} cm.` };
} });

const DROITES = [
  ['(d₁) et (d₂) sont perpendiculaires à la même droite (d). Alors (d₁) et (d₂) sont…', 'parallèles', ['perpendiculaires', 'sécantes', 'on ne peut pas savoir']],
  ['(d₁) et (d₂) sont parallèles à la même droite (d). Alors (d₁) et (d₂) sont…', 'parallèles', ['perpendiculaires', 'sécantes', 'on ne peut pas savoir']],
  ['(d₁) et (d₂) sont parallèles, et (d) est perpendiculaire à (d₁). Alors (d) et (d₂) sont…', 'perpendiculaires', ['parallèles', 'confondues', 'on ne peut pas savoir']],
];
G6.push({ code: 'GEO3', theme: 'geometrie', chapitre: '6e-geometrie', nombre: 3, creer() {
  const [question, bonne, faux] = choix(DROITES);
  return { enonce: question, reponse: bonne, faux, correction: `C'est une propriété du cours : ${question.replace('…', '')} ${bonne}.` };
} });

G6.push({ code: 'ANG1', theme: 'geometrie', chapitre: '6e-angles', nombre: 6, creer() {
  const a = choix([ent(5, 85), ent(95, 175), 90, 180]);
  const bonne = a < 90 ? 'aigu' : a === 90 ? 'droit' : a < 180 ? 'obtus' : 'plat';
  return { enonce: `Un angle de ${a}° est…`, reponse: bonne, faux: qcm(bonne, ['aigu', 'droit', 'obtus', 'plat']),
    correction: `Aigu : moins de 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180°. ${a}° est donc un angle ${bonne}.` };
} });

G6.push({ code: 'ANG2', theme: 'geometrie', chapitre: '6e-angles', nombre: 5, creer() {
  if (hasard() < 0.5) { const a = ent(10, 80); return { enonce: `Un angle droit est partagé en deux angles. L'un mesure ${a}°. Combien mesure l'autre (en °) ?`, reponse: String(90 - a), correction: `Un angle droit mesure 90° : 90 − ${a} = ${90 - a}°.` }; }
  const a = ent(15, 165);
  return { enonce: `Un angle plat est partagé en deux angles. L'un mesure ${a}°. Combien mesure l'autre (en °) ?`, reponse: String(180 - a), correction: `Un angle plat mesure 180° : 180 − ${a} = ${180 - a}°.` };
} });

G6.push({ code: 'ANG3', theme: 'geometrie', chapitre: '6e-angles', nombre: 4, creer() {
  const h = choix([1, 2, 3, 4, 6]);
  return { enonce: `À ${h} h pile, quel angle forment les deux aiguilles d'une horloge (en °) ?`, reponse: String(h * 30), svg: svgHorloge(h, 0),
    correction: `Un tour complet (360°) est partagé en 12 heures : 360 ÷ 12 = 30° par heure. À ${h} h : ${h} × 30 = ${h * 30}°.` };
} });

G6.push({ code: 'SYM1', theme: 'geometrie', chapitre: '6e-symetrie-axiale', nombre: 8, creer() {
  const L = 11, H = 7, vertical = hasard() < 0.6;
  const a = vertical ? ent(4, L - 4) : ent(3, H - 3);
  const A = { x: ent(1, L - 1), y: ent(1, H - 1) };
  const symetrique = (p) => vertical ? { x: 2 * a - p.x, y: p.y } : { x: p.x, y: 2 * a - p.y };
  const image = symetrique(A);
  if ((vertical ? A.x === a : A.y === a) || !dansGrille(image, L, H)) return null;
  const pieges = vertical ? [{ x: image.x, y: H - A.y }, { x: image.x + 1, y: A.y }, { x: A.x, y: H - A.y }, { x: image.x - 1, y: A.y }]
    : [{ x: L - A.x, y: image.y }, { x: A.x, y: image.y + 1 }, { x: L - A.x, y: A.y }, { x: A.x, y: image.y - 1 }];
  const nommes = pointsQuadrillage(image, pieges, L, H).filter(p => !(p.x === A.x && p.y === A.y));
  if (nommes.length < 3 || nommes[0].x !== image.x || nommes[0].y !== image.y) return null;
  const bonne = nommes[0].nom, ecart = vertical ? Math.abs(A.x - a) : Math.abs(A.y - a);
  return { enonce: 'Quel point est le symétrique de A par rapport à l\'axe en pointillés ?', reponse: bonne, faux: nommes.slice(1).map(p => p.nom),
    svg: svgSymetrie(L, H, [{ ...A, nom: 'A' }, ...nommes], vertical, a),
    correction: `A est à ${ecart} carreau(x) de l'axe. Son symétrique est de l'autre côté, à la même distance (${ecart} carreau(x)), sur la perpendiculaire à l'axe : c'est le point ${bonne}.` };
} });

const AXES = [['un carré', '4'], ['un rectangle (non carré)', '2'], ['un losange (non carré)', '2'], ['un triangle équilatéral', '3'], ['un triangle isocèle (non équilatéral)', '1'], ['un parallélogramme quelconque', '0'], ['un hexagone régulier', '6'], ['un cercle', 'une infinité']];
G6.push({ code: 'SYM2', theme: 'geometrie', chapitre: '6e-symetrie-axiale', nombre: 7, creer() {
  const [figure, bonne] = choix(AXES);
  return { enonce: `Combien d'axes de symétrie a ${figure} ?`, reponse: bonne, faux: qcm(bonne, ['0', '1', '2', '3', '4', '6', 'une infinité'].sort(() => hasard() - 0.5)),
    correction: `${figure.charAt(0).toUpperCase() + figure.slice(1)} a ${bonne === 'une infinité' ? 'une infinité d\'axes de symétrie : toutes les droites qui passent par son centre' : `${bonne} axe${bonne === '0' || bonne === '1' ? '' : 's'} de symétrie`}.` };
} });

const FIGURES = [
  ['Un quadrilatère qui a quatre angles droits est…', 'un rectangle', ['un losange', 'un trapèze', 'un triangle']],
  ['Un quadrilatère qui a quatre côtés de même longueur est…', 'un losange', ['un rectangle', 'un trapèze', 'un cerf-volant']],
  ['Un quadrilatère qui a quatre côtés de même longueur et quatre angles droits est…', 'un carré', ['un rectangle', 'un losange', 'un parallélogramme']],
  ['Un triangle qui a trois côtés de même longueur est…', 'équilatéral', ['isocèle seulement', 'rectangle', 'quelconque']],
  ['Un triangle qui a deux côtés de même longueur est…', 'isocèle', ['équilatéral', 'rectangle', 'quelconque']],
  ['Un triangle qui a un angle droit est…', 'rectangle', ['isocèle', 'équilatéral', 'obtus']],
  ['Sur une figure, un petit carré dans un angle signifie que l\'angle est…', 'droit', ['aigu', 'plat', 'obtus']],
  ['Sur une figure, deux segments marqués du même petit trait (codage) ont…', 'la même longueur', ['la même direction', 'un point commun', 'un angle droit entre eux']],
];
G6.push({ code: 'FIG1', theme: 'geometrie', chapitre: '6e-figures', nombre: 8, creer() {
  const [question, bonne, faux] = choix(FIGURES);
  return { enonce: question, reponse: bonne, faux, correction: `${question.replace('…', '')} ${bonne}.` };
} });

const SOLIDES_6E = [
  ['Un solide dont les six faces sont des carrés est…', 'un cube', ['un pavé non cubique', 'une pyramide', 'un prisme triangulaire']],
  ['Un solide formé de deux disques et d\'une surface courbe est…', 'un cylindre', ['un cône', 'une boule', 'un prisme']],
  ['Un solide qui a une base polygonale et des faces triangulaires qui se rejoignent en un sommet est…', 'une pyramide', ['un prisme', 'un cube', 'un cylindre']],
  ['Un solide qui a un disque pour base et un sommet est…', 'un cône', ['un cylindre', 'une pyramide', 'une boule']],
  ['Un solide parfaitement rond, sans face plane, est…', 'une boule', ['un cylindre', 'un cône', 'un cube']],
];
G6.push({ code: 'SOL1', theme: 'geometrie', chapitre: '6e-espace', nombre: 5, creer() {
  const [question, bonne, faux] = choix(SOLIDES_6E);
  return { enonce: question, reponse: bonne, faux, correction: `${question.replace('…', '')} ${bonne}.` };
} });
reprendre6('4e', 'SOL1', 'SOL2', 'geometrie', '6e-espace', 4);

// =============================================================
// GRANDEURS — Heures et durées (6e-durees)
// =============================================================

G6.push({ code: 'DUR1', theme: 'grandeurs', chapitre: '6e-durees', nombre: 10, creer() {
  const h = ent(1, 12), m = 5 * ent(0, 11);
  const heure = (hh, mm) => `${hh} h ${pad2(mm)}`;
  const bonne = heure(h, m);
  const pieges = [heure(m === 0 ? 12 : m / 5, (h * 5) % 60), heure(h % 12 + 1, m), heure(h, (m + 30) % 60), heure(h === 1 ? 12 : h - 1, m), heure(h, m / 5)];
  return { enonce: 'Quelle heure indique cette horloge ?', reponse: bonne, faux: qcm(bonne, pieges), svg: svgHorloge(h, m),
    correction: `La petite aiguille (noire) indique les heures : elle est ${m >= 30 ? `entre ${h} et ${h % 12 + 1}` : `sur ou juste après le ${h}`}. La grande aiguille (rose) indique les minutes : elle pointe sur le ${m === 0 ? 12 : m / 5}, soit ${m} min. Il est ${bonne}.` };
} });

G6.push({ code: 'DUR2', theme: 'grandeurs', chapitre: '6e-durees', nombre: 7, creer() {
  const forme = ent(1, 4);
  if (forme === 1) { const h = ent(1, 4), m = ent(1, 59); return { enonce: `Combien de minutes dans ${h} h ${m} min ?`, reponse: String(60 * h + m), correction: `${h} h = ${h} × 60 = ${60 * h} min, puis ${60 * h} + ${m} = ${60 * h + m} min.` }; }
  if (forme === 2) { const t = ent(65, 250), bonne = `${Math.floor(t / 60)} h ${pad2(t % 60)} min`; return { enonce: `Combien font ${t} minutes en heures et minutes ?`, reponse: bonne, faux: qcm(bonne, [`${Math.floor(t / 100)} h ${pad2(t % 100)} min`, `${Math.floor(t / 60) + 1} h ${pad2(t % 60)} min`, `${Math.floor(t / 60)} h ${pad2((t % 60 + 10) % 60)} min`, `${fr(arrondi(t / 60, 2))} h`]), correction: `60 min = 1 h. ${t} = 60 × ${Math.floor(t / 60)} + ${t % 60}, donc ${t} min = ${bonne}.` }; }
  if (forme === 3) { const n = ent(2, 9); return { enonce: `Combien de secondes dans ${n} minutes ?`, reponse: String(60 * n), correction: `1 min = 60 s, donc ${n} min = ${n} × 60 = ${60 * n} s.` }; }
  const [question, r, explication] = choix([['Combien d\'heures dans une journée ?', '24', 'Une journée dure 24 h.'], ['Combien d\'années dans un siècle ?', '100', 'Un siècle = 100 ans.'], ['Combien d\'années dans un millénaire ?', '1000', 'Un millénaire = 1 000 ans.'], ['Combien de jours dans une année non bissextile ?', '365', '365 jours (366 les années bissextiles).'], ['Combien de jours dans une semaine ?', '7', '7 jours.'], ['Combien d\'heures dans 3 jours ?', '72', '3 × 24 = 72 h.']]);
  return { enonce: question, reponse: r, correction: explication };
} });

G6.push({ code: 'DUR3', theme: 'grandeurs', chapitre: '6e-durees', nombre: 6, creer() {
  const debut = ent(8, 20) * 60 + 5 * ent(0, 11), duree = 5 * ent(5, 40), fin = debut + duree;
  if (fin >= 24 * 60) return null;
  const ecrire = (t) => `${Math.floor(t / 60)} h ${pad2(t % 60)}`;
  const [quoi] = choix([['Un film'], ['Un match'], ['Un trajet en train'], ['Un cours de danse']]);
  return { enonce: `${quoi} commence à ${ecrire(debut)} et se termine à ${ecrire(fin)}. Combien de temps dure-t-il (en minutes) ?`, reponse: String(duree),
    correction: `De ${ecrire(debut)} à ${ecrire(Math.ceil(debut / 60) * 60)} : ${Math.ceil(debut / 60) * 60 - debut} min, puis jusqu'à ${ecrire(fin)} : ${fin - Math.ceil(debut / 60) * 60} min. Total : ${duree} min.` };
} });

G6.push({ code: 'DUR4', theme: 'grandeurs', chapitre: '6e-durees', nombre: 4, creer() {
  const [texte, m] = choix([['un quart d\'heure', 15], ['une demi-heure', 30], ['trois quarts d\'heure', 45], ['un tiers d\'heure', 20], ['une heure et quart', 75], ['une heure et demie', 90]]);
  return { enonce: `Combien de minutes dans ${texte} ?`, reponse: String(m), correction: `1 h = 60 min. ${texte.charAt(0).toUpperCase() + texte.slice(1)} = ${m} min.` };
} });

reprendre6('4e', 'DUR1', 'DUR5', 'grandeurs', '6e-durees', 3);

// =============================================================
// GRANDEURS — Périmètres, aires, conversions (6e-perimetres-aires)
// =============================================================

G6.push({ code: 'AIR1', theme: 'grandeurs', chapitre: '6e-perimetres-aires', nombre: 10, creer() {
  const { cases, perimetre } = carreauxAuHasard(9, 6, ent(5, 14));
  const svg = svgCarreaux(9, 6, cases);
  if (hasard() < 0.6) return { enonce: 'Quelle est l\'aire de la figure coloriée, en carreaux ?', reponse: String(cases.length), svg,
    correction: `On compte les carreaux coloriés : il y en a ${cases.length}. L'aire est ${cases.length} carreaux.` };
  return { enonce: 'Quel est le périmètre de la figure coloriée, en côtés de carreau ?', reponse: String(perimetre), svg,
    correction: `On fait le tour de la figure en comptant les côtés de carreau sur le bord : ${perimetre}.` };
} });

G6.push({ code: 'AIR2', theme: 'grandeurs', chapitre: '6e-perimetres-aires', nombre: 6, creer() {
  const forme = ent(1, 3);
  if (forme === 1) { const L = ent(3, 15), l = ent(2, L); return { enonce: `Quelle est l'aire d'un rectangle de ${L} cm sur ${l} cm (en cm²) ?`, reponse: String(L * l), correction: `Aire du rectangle = longueur × largeur = ${L} × ${l} = ${L * l} cm².` }; }
  if (forme === 2) { const c = ent(2, 12); return { enonce: `Quelle est l'aire d'un carré de côté ${c} cm (en cm²) ?`, reponse: String(c * c), correction: `Aire du carré = côté × côté = ${c} × ${c} = ${c * c} cm².` }; }
  const a = ent(2, 10), b = ent(2, 10);
  if ((a * b) % 2) return null;
  return { enonce: `Un triangle rectangle a des côtés de l'angle droit de ${a} cm et ${b} cm. Quelle est son aire (en cm²) ?`, reponse: String(a * b / 2), correction: `C'est la moitié d'un rectangle de ${a} cm sur ${b} cm : ${a} × ${b} ÷ 2 = ${a * b / 2} cm².` };
} });

reprendre6('5e', 'PER1', 'PER1', 'grandeurs', '6e-perimetres-aires', 6);
reprendre6('5e', 'AIR1', 'AIR3', 'grandeurs', '6e-perimetres-aires', 4);
reprendre6('5e', 'CON1', 'CON1', 'grandeurs', '6e-perimetres-aires', 7);
reprendre6('4e', 'AIR3', 'CON2', 'grandeurs', '6e-perimetres-aires', 4);

const CONVERSIONS_MASSE = [['kg', 'g', 1000], ['g', 'mg', 1000], ['t', 'kg', 1000], ['L', 'mL', 1000], ['L', 'cL', 100], ['cL', 'mL', 10]];
G6.push({ code: 'CON3', theme: 'grandeurs', chapitre: '6e-perimetres-aires', nombre: 5, creer() {
  const [grande, petite, f] = choix(CONVERSIONS_MASSE), x = choix([2, 1.5, 0.5, 0.25, 3.2, 0.75, 4]);
  return { enonce: `Convertir ${fr(x)} ${grande} en ${petite}`, reponse: fr(x * f), variantes: [`${fr(x * f)} ${petite}`],
    correction: `1 ${grande} = ${fr(f)} ${petite}, donc ${fr(x)} ${grande} = ${fr(x)} × ${fr(f)} = ${fr(x * f)} ${petite}.` };
} });

// =============================================================
// GRANDEURS — Volumes (6e-espace)
// =============================================================

reprendre6('4e', 'VOL1', 'VOL1', 'grandeurs', '6e-espace', 5);
G6.push({ code: 'VOL2', theme: 'grandeurs', chapitre: '6e-espace', nombre: 4, creer() {
  const L = ent(2, 6), l = ent(2, 5), h = ent(2, 4);
  return { enonce: `Un pavé est formé de petits cubes : ${L} dans la longueur, ${l} dans la largeur et ${h} dans la hauteur. Combien de petits cubes en tout ?`, reponse: String(L * l * h),
    correction: `Une couche contient ${L} × ${l} = ${L * l} cubes, et il y a ${h} couches : ${L * l} × ${h} = ${L * l * h} cubes.` };
} });

// =============================================================
// DONNÉES — Proportionnalité (6e-proportionnalite)
// =============================================================

reprendre6('4e', 'PRO1', 'PRO1', 'donnees', '6e-proportionnalite', 6);
reprendre6('4e', 'PRO5', 'PRO2', 'donnees', '6e-proportionnalite', 5);
reprendre6('5e', 'PRO1', 'PRO3', 'donnees', '6e-proportionnalite', 5);

G6.push({ code: 'PRO4', theme: 'donnees', chapitre: '6e-proportionnalite', nombre: 9, creer() {
  const p1 = choix([2, 4, 6, 3]), k = choix([1.5, 2, 3, 0.5, 2.5]), p2 = p1 * k;
  if (p2 !== Math.round(p2)) return null;
  const [ingredient, q1] = choix([['g de farine', 50 * ent(2, 8)], ['œufs', ent(2, 4)], ['cL de lait', 10 * ent(2, 10)], ['g de sucre', 25 * ent(2, 8)]]);
  const q2 = q1 * k;
  if (q2 !== Math.round(q2)) return null;
  return { enonce: `Une recette pour ${p1} personnes demande ${q1} ${ingredient}. Combien en faut-il pour ${p2} personnes ?`, reponse: fr(q2),
    correction: `On passe de ${p1} à ${p2} personnes en multipliant par ${fr(k)}. Donc ${q1} × ${fr(k)} = ${fr(q2)} ${ingredient}.` };
} });

G6.push({ code: 'PRO5', theme: 'donnees', chapitre: '6e-proportionnalite', nombre: 6, creer() {
  const a = ent(3, 9), b = ent(3, 9);
  if (hasard() < 0.5) return { enonce: `${a * b} est combien de fois plus grand que ${a} ?`, reponse: String(b), correction: `${a} × ${b} = ${a * b} : c'est ${b} fois plus.` };
  return { enonce: `Un objet coûte ${a} €. Un autre coûte ${b} fois plus cher. Combien coûte-t-il (en €) ?`, reponse: String(a * b), correction: `« ${b} fois plus », c'est × ${b} : ${a} × ${b} = ${a * b} €.` };
} });

// =============================================================
// DONNÉES — Tableaux et graphiques (6e-donnees)
// =============================================================

reprendre6('4e', 'STA5', 'DON1', 'donnees', '6e-donnees', 9);
reprendre6('4e', 'STA6', 'DON2', 'donnees', '6e-donnees', 4);

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'], JOURS_LONGS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
G6.push({ code: 'DON3', theme: 'donnees', chapitre: '6e-donnees', nombre: 10, creer() {
  const valeurs = JOURS.map(() => ent(5, 40));
  if (new Set(valeurs).size < 5) return null;
  const svg = svgTableau('Jour', JOURS, 'Livres', valeurs.map(String));
  const forme = ent(1, 3), i = ent(0, 4), j = (i + ent(1, 4)) % 5;
  if (forme === 1) return { enonce: `Ce tableau donne le nombre de livres prêtés au CDI. Combien de livres le ${JOURS_LONGS[i]} ?`, reponse: String(valeurs[i]), svg,
    correction: `On lit la colonne « ${JOURS[i]} » : ${valeurs[i]} livres.` };
  if (forme === 2) {
    const max = valeurs.indexOf(Math.max(...valeurs));
    return { enonce: 'D\'après le tableau, quel jour a-t-on prêté le plus de livres au CDI ?', reponse: JOURS_LONGS[max], faux: JOURS_LONGS.filter((_, k) => k !== max).slice(0, 3), svg,
      correction: `La plus grande valeur du tableau est ${valeurs[max]}, le ${JOURS_LONGS[max]}.` };
  }
  return { enonce: `D'après le tableau, combien de livres de plus a-t-on prêtés le ${JOURS_LONGS[valeurs[i] > valeurs[j] ? i : j]} que le ${JOURS_LONGS[valeurs[i] > valeurs[j] ? j : i]} ?`, reponse: String(Math.abs(valeurs[i] - valeurs[j])), svg,
    correction: `${Math.max(valeurs[i], valeurs[j])} − ${Math.min(valeurs[i], valeurs[j])} = ${Math.abs(valeurs[i] - valeurs[j])} livres.` };
} });

G6.push({ code: 'DON4', theme: 'donnees', chapitre: '6e-donnees', nombre: 9, creer() {
  const heures = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
  let t = 2 * ent(2, 5);
  const temps = heures.map((h, i) => { if (i > 0) t = Math.max(0, Math.min(28, t + (h <= 14 ? choix([0, 2, 2, 4]) : choix([-4, -2, -2, 0])))); return t; });
  const k = ent(2, 11), h = heures[k];
  return { enonce: `Cette courbe montre la température (en °C) au cours d'une journée. Quelle température faisait-il à ${h} h ?`, reponse: String(temps[k]), variantes: [`${temps[k]} °C`],
    svg: svgRepere({ xmin: 0, xmax: 24, ymin: 0, ymax: 30, unite: 14, uniteY: 7.5, grilleX: 2, etiquettesX: 4, grilleY: 2, etiquettesY: 4, nomX: 'h', nomY: '°C', courbes: [{ points: courbeLisse(heures.map((x, i) => [x, temps[i]])) }] }),
    correction: `On part de ${h} h sur l'axe horizontal, on monte jusqu'à la courbe, puis on lit sur l'axe vertical : ${temps[k]} °C.` };
} });

// =============================================================
// ALGORITHMIQUE — Scratch (6e-scratch, toute l'année)
// =============================================================

reprendre6('4e', 'ALG1', 'ALG1', 'algo', '6e-scratch', 8);
reprendre6('4e', 'ALG4', 'ALG2', 'algo', '6e-scratch', 8);
reprendre6('4e', 'ALG5', 'ALG3', 'algo', '6e-scratch', 7);
reprendre6('4e', 'ALG10', 'ALG4', 'algo', '6e-scratch', 5);
reprendre6('4e', 'ALG7', 'ALG5', 'algo', '6e-scratch', 4);
reprendre6('4e', 'ALG3', 'ALG6', 'algo', '6e-scratch', 6);
reprendre6('4e', 'ALG9', 'ALG7', 'algo', '6e-scratch', 5);

G6.push({ code: 'SCR1', theme: 'algo', chapitre: '6e-scratch', nombre: 4, creer() {
  const [angle, bonne] = choix([[90, 'vers la droite'], [0, 'vers le haut'], [180, 'vers le bas'], [-90, 'vers la gauche']]);
  return { enonce: `Dans Scratch, après « s'orienter à ${angle} », le lutin regarde…`, reponse: bonne, faux: qcm(bonne, ['vers la droite', 'vers le haut', 'vers le bas', 'vers la gauche']),
    correction: `Dans Scratch : 0 = vers le haut, 90 = vers la droite, 180 = vers le bas, −90 = vers la gauche. Donc ${angle} → ${bonne}.` };
} });
