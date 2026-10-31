// =============================================================
// RÉGLAGES DU JEU
// C'est le fichier à modifier pour les réglages courants :
// couleurs, programme suivi par chaque niveau, adversaire virtuel.
// Les questions et les progressions, elles, sont dans data/banque.xlsx.
// =============================================================

// Les 5 thèmes (= les 5 couleurs du plateau), dans l'ordre autour de la roue.
// - id      : code court utilisé dans la colonne « theme » de la banque
// - nom     : nom affiché aux joueurs
// - couleur : couleur des cases (code hexadécimal)
// - icone   : petit symbole dessiné sur les cases (aide les daltoniens)
const THEMES = [
  { id: 'nombres',   nom: 'Nombres et calculs',                            couleur: '#1f6fd1', icone: '×' },
  { id: 'donnees',   nom: 'Organisation et gestion de données, fonctions', couleur: '#2a9d4b', icone: '%' },
  { id: 'grandeurs', nom: 'Grandeurs et mesures',                          couleur: '#ef7d00', icone: 'm²' },
  { id: 'geometrie', nom: 'Espace et géométrie',                           couleur: '#e0559a', icone: '△' },
  { id: 'algo',      nom: 'Algorithmique et programmation',                couleur: '#7b3fbf', icone: '</>' },
];

// Pour les joueurs « parents », le thème 'algo' est remplacé par les énigmes
// (même couleur sur le plateau, mais d'autres questions).
const THEME_ENIGME = { id: 'enigme', nom: 'Énigmes', couleur: '#7b3fbf', icone: '?' };

// Les niveaux élèves, du plus petit au plus grand.
// (Le niveau 'parents' est traité à part.)
const NIVEAUX = ['6e', '5e', '4e', '3e'];

// Quel programme suit chaque niveau CETTE année scolaire ?
// Chaque question de la banque est marquée 'ancien', 'nouveau' ou 'commun'.
// Un élève ne reçoit que les questions 'commun' + celles de son programme.
// À mettre à jour à chaque rentrée :
//   2026-2027 : 5e = nouveau ; 4e, 3e = ancien
//   2027-2028 : 5e, 4e = nouveau ; 3e = ancien
//   2028-2029 : tout le cycle 4 = nouveau
const PROGRAMME_PAR_NIVEAU = {
  '6e': 'nouveau',   // à vérifier selon le programme de cycle 3 en vigueur
  '5e': 'nouveau',
  '4e': 'ancien',
  '3e': 'ancien',
};

// Couleurs des pions proposées à l'accueil.
// - texte : couleur de l'initiale écrite sur le pion (pour rester lisible)
const COULEURS_PIONS = [
  { nom: 'Rouge',  couleur: '#d62828', texte: '#ffffff' },
  { nom: 'Jaune',  couleur: '#ffd166', texte: '#222222' },
  { nom: 'Noir',   couleur: '#222222', texte: '#ffffff' },
  { nom: 'Blanc',  couleur: '#ffffff', texte: '#222222' },
  { nom: 'Cyan',   couleur: '#00b4d8', texte: '#222222' },
  { nom: 'Marron', couleur: '#8d5524', texte: '#ffffff' },
];

// Comme au vrai Trivial Pursuit : une bonne réponse permet de rejouer.
// Mettre false pour que le tour passe toujours au joueur suivant.
const REJOUER_APRES_BONNE_REPONSE = true;

// Nombre maximum de déplacements d'affilée pour un même joueur
// (bonnes réponses et cases « Rejouer » comprises). Ensuite, la main
// passe au joueur suivant, pour que tout le monde joue.
const MAX_DEPLACEMENTS_AFFILEE = 3;

// L'adversaire virtuel, proposé quand un joueur est seul.
// - reussite : pourcentage de bonnes réponses de l'adversaire
const ADVERSAIRE_NOM = 'Calculo';
const NIVEAUX_ADVERSAIRE = [
  { nom: 'Facile', reussite: 50 },
  { nom: 'Moyen',  reussite: 65 },   // se trompe 35 % du temps
  { nom: 'Fort',   reussite: 90 },
];

// Le fichier Excel qui contient les questions (onglet « Questions »)
// et les progressions (onglet « Progressions »).
const FICHIER_BANQUE = 'data/banque.xlsx';
