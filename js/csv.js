// =============================================================
// LECTURE DES FICHIERS DE DONNÉES
// - lireExcel : lit les onglets du fichier data/banque.xlsx
// - lireCSV   : lit un texte CSV (données de secours de data/demo.js)
// Les deux renvoient une liste d'objets, un par ligne du tableau.
// Exemple : les colonnes « id » et « enonce » et la ligne « N6-01 », « Calculer… »
// donnent l'objet { id: 'N6-01', enonce: 'Calculer…' }.
// =============================================================

// Télécharge le fichier Excel et renvoie ses onglets :
// { Questions: [...], Progressions: [...] }
// En cas de problème, déclenche une erreur avec un message clair.
async function lireExcel(url, delaiMax = 8000) {
  // La bibliothèque SheetJS (chargée dans index.html) sait lire l'Excel.
  if (typeof XLSX === 'undefined') throw new Error("l'outil de lecture Excel n'a pas pu être chargé (pas d'Internet ?)");

  // On abandonne si le fichier met plus de 8 secondes à arriver.
  const controle = new AbortController();
  const minuterie = setTimeout(() => controle.abort(), delaiMax);
  let octets;
  try {
    const reponse = await fetch(url, { signal: controle.signal, cache: 'no-store' });
    if (!reponse.ok) throw new Error(`fichier introuvable (erreur ${reponse.status})`);
    octets = await reponse.arrayBuffer();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('pas de réponse après 8 secondes');
    if (e instanceof TypeError) throw new Error('fichier inaccessible (jeu ouvert par double-clic ?)');
    throw e;
  } finally {
    clearTimeout(minuterie);
  }

  const classeur = XLSX.read(octets, { type: 'array' });
  const onglets = {};
  for (const nom of classeur.SheetNames) {
    // raw: false → on récupère le texte tel qu'Excel l'affiche.
    const lignes = XLSX.utils.sheet_to_json(classeur.Sheets[nom], { defval: '', raw: false });
    onglets[nom] = lignes.map(nettoyerLigne).filter(l => Object.values(l).some(v => v !== ''));
  }
  return onglets;
}

// Met les noms de colonnes en minuscules et enlève les espaces en trop.
function nettoyerLigne(ligne) {
  const propre = {};
  for (const [nom, valeur] of Object.entries(ligne)) {
    propre[nom.trim().toLowerCase()] = String(valeur).trim();
  }
  return propre;
}

// Transforme un texte CSV en liste d'objets.
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
  const entetes = pleines.shift();
  return pleines.map(l => {
    const objet = {};
    entetes.forEach((nom, k) => { objet[nom] = l[k] || ''; });
    return nettoyerLigne(objet);
  });
}
