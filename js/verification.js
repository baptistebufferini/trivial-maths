// =============================================================
// VÉRIFICATION DES RÉPONSES TAPÉES
// But : accepter toutes les écritures raisonnables d'une bonne réponse.
//   0,5 = 0.5 = 1/2 = 0,50     (même valeur numérique)
//   " 15 "  = 15               (espaces ignorés)
//   15 cm   = 15               (unité tapée en plus, ignorée)
//   Obtus   = obtus            (majuscules et accents ignorés)
// Les cas particuliers se mettent dans la colonne « variantes ».
// =============================================================

// Met un texte sous une forme « standard » pour pouvoir comparer.
function normaliser(texte) {
  return String(texte)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlève les accents
    .replace(/[\s  ]+/g, '')                // enlève tous les espaces
    .replace(/[−–—]/g, '-')                            // les différents « moins »
    .replace(/,/g, '.');                               // virgule → point
}

// Si le texte (déjà normalisé) est un nombre ou une fraction,
// renvoie sa valeur. Sinon renvoie null.
function valeurNumerique(texte) {
  const nombre = '[+-]?(?:\\d+\\.?\\d*|\\.\\d+)';
  if (new RegExp('^' + nombre + '$').test(texte)) return parseFloat(texte);
  const fraction = texte.match(new RegExp('^(' + nombre + ')/(' + nombre + ')$'));
  if (fraction) {
    const denominateur = parseFloat(fraction[2]);
    if (denominateur !== 0) return parseFloat(fraction[1]) / denominateur;
  }
  return null;
}

// Enlève une unité écrite après un nombre : "15cm²" → "15", "60°" → "60".
function sansUnite(texte) {
  return texte.replace(/^([+-]?[\d.\/]+)[a-zµ°²³/]+$/, '$1');
}

// Deux réponses (normalisées) sont-elles équivalentes ?
function equivalentes(a, b) {
  if (a === b) return true;
  const va = valeurNumerique(a), vb = valeurNumerique(b);
  if (va !== null && vb !== null) return Math.abs(va - vb) < 1e-9 * Math.max(1, Math.abs(vb));
  return false;
}

// Renvoie true si la saisie de l'élève correspond à la bonne réponse
// ou à une des variantes acceptées.
function estBonneReponse(saisie, question) {
  const tape = normaliser(saisie);
  if (tape === '') return false;
  const acceptees = [question.reponse, ...question.variantes].map(normaliser);
  return acceptees.some(attendue =>
    equivalentes(tape, attendue) ||
    equivalentes(sansUnite(tape), attendue)
  );
}
