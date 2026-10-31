// =============================================================
// LECTURE D'UN TEXTE CSV
// Transforme le texte d'un tableur (CSV) en une liste d'objets.
// Exemple : la ligne d'en-tête "id","enonce" et la ligne "N6-01","Calculer…"
// donnent l'objet { id: 'N6-01', enonce: 'Calculer…' }.
// =============================================================

function lireCSV(texte) {
  // 1) On découpe le texte en lignes et en cases, caractère par caractère.
  //    Une case entre guillemets peut contenir des virgules ou des
  //    retours à la ligne ; "" à l'intérieur veut dire un guillemet.
  const lignes = [];
  let ligne = [];
  let champ = '';
  let dansGuillemets = false;

  for (let i = 0; i < texte.length; i++) {
    const c = texte[i];
    if (dansGuillemets) {
      if (c === '"' && texte[i + 1] === '"') { champ += '"'; i++; }
      else if (c === '"') dansGuillemets = false;
      else champ += c;
    } else if (c === '"') {
      dansGuillemets = true;
    } else if (c === ',') {
      ligne.push(champ); champ = '';
    } else if (c === '\n') {
      ligne.push(champ); lignes.push(ligne);
      ligne = []; champ = '';
    } else if (c !== '\r') {
      champ += c;
    }
  }
  ligne.push(champ);
  lignes.push(ligne);

  // 2) On enlève les lignes vides.
  const pleines = lignes.filter(l => l.some(c => c.trim() !== ''));
  if (pleines.length === 0) return [];

  // 3) La première ligne donne les noms des colonnes.
  const entetes = pleines.shift().map(e => e.trim().toLowerCase());
  return pleines.map(l => {
    const objet = {};
    entetes.forEach((nom, k) => { objet[nom] = (l[k] || '').trim(); });
    return objet;
  });
}
