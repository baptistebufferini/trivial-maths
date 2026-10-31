// =============================================================
// ÉNIGMES POUR LES JOUEURS « PARENTS »
// Écrites à la main (pas tirées au hasard) : chaque énigme a son idée.
// Elles sortent sur les cases violettes quand un parent joue.
// Format : [énoncé, réponse, correction, mauvaises réponses (QCM) ou rien]
// =============================================================

GENERATEURS['parents'] = [];

const ENIGMES = [
  ['Un nénuphar double de surface chaque jour. Il recouvre tout l\'étang au bout de 30 jours. Au bout de combien de jours en recouvrait-il la moitié ?', '29', 'Il double chaque jour : la veille du 30e jour, il couvrait la moitié de l\'étang, donc au bout de 29 jours.'],
  ['Dans un tiroir, il y a 10 chaussettes noires et 10 blanches, mêlées, dans le noir. Combien faut-il en prendre au minimum pour être sûr d\'avoir deux chaussettes de la même couleur ?', '3', 'Avec 2 chaussettes, on peut avoir une noire et une blanche. La 3e est forcément de la couleur d\'une des deux premières.'],
  ['Combien de fois écrit-on le chiffre 1 en écrivant tous les nombres de 1 à 20 ?', '12', '1 (une fois), 10 (une fois), 11 (deux fois), puis 12 à 19 (huit fois) : 1 + 1 + 2 + 8 = 12.'],
  ['Un père a 4 fois l\'âge de son fils. Dans 20 ans, il n\'aura plus que le double. Quel âge a le fils aujourd\'hui ?', '10', 'Si le fils a x ans, le père a 4x ans. Dans 20 ans : 4x + 20 = 2(x + 20), donc 2x = 20 et x = 10. (Le père a 40 ans ; dans 20 ans : 60 et 30.)'],
  ['Combien y a-t-il de carrés, de toutes tailles, dans un quadrillage de 3 cases sur 3 ?', '14', '9 petits carrés (1 × 1), 4 carrés de 2 × 2 et 1 grand carré de 3 × 3 : 9 + 4 + 1 = 14.'],
  ['3 chats attrapent 3 souris en 3 minutes. Combien de chats faut-il pour attraper 100 souris en 100 minutes ?', '3', 'Les 3 chats attrapent ensemble 1 souris par minute. En 100 minutes, ils en attrapent 100 : il suffit des 3 mêmes chats.'],
  ['Le produit de trois nombres entiers consécutifs vaut 120. Quelle est leur somme ?', '15', '4 × 5 × 6 = 120. Leur somme : 4 + 5 + 6 = 15.'],
  ['Je suis un nombre à 3 chiffres et un multiple de 5. La somme de mes chiffres vaut 6 et mon chiffre des centaines est le double de mon chiffre des dizaines. Qui suis-je ?', '420', 'Mon chiffre des unités est 0 ou 5. Avec 5, il resterait 1 pour les deux autres chiffres : impossible avec « le double ». Avec 0 : centaines + dizaines = 6 et centaines = 2 × dizaines, donc dizaines = 2 et centaines = 4 : 420.'],
  ['Un train de 100 m roule à 50 m par seconde et traverse un tunnel de 400 m. Combien de secondes s\'écoulent entre l\'entrée de la locomotive et la sortie du dernier wagon ?', '10', 'L\'avant du train doit parcourir le tunnel (400 m) plus la longueur du train (100 m) : 500 m. À 50 m/s : 500 ÷ 50 = 10 s.'],
  ['Une horloge sonne 6 coups en 5 secondes à 6 h. Combien de secondes lui faut-il pour sonner 12 coups à midi ?', '11', '6 coups, c\'est 5 intervalles, donc 1 seconde par intervalle. 12 coups font 11 intervalles : 11 secondes.'],
  ['Combien de jours y a-t-il dans 4 années consécutives, dont une bissextile ?', '1461', '3 × 365 + 366 = 1 095 + 366 = 1 461 jours.'],
  ['On coupe une baguette en 6 morceaux. Combien de coups de couteau faut-il ?', '5', 'Chaque coup ajoute un morceau : avec 1 coup on a 2 morceaux… avec 5 coups on en a 6.'],
  ['Un rectangle a un périmètre de 20 cm, et sa longueur vaut 4 fois sa largeur. Quelle est son aire (en cm²) ?', '16', 'Longueur + largeur = 10 cm, soit 5 largeurs. Largeur = 2 cm, longueur = 8 cm. Aire = 8 × 2 = 16 cm².'],
  ['Après 4 contrôles, la moyenne de Léa est de 12. Quelle note doit-elle avoir au 5e pour que sa moyenne passe à 13 ?', '17', 'Total actuel : 4 × 12 = 48. Pour une moyenne de 13 sur 5 notes, il faut 5 × 13 = 65 points. 65 − 48 = 17.'],
  ['Un prix augmente de 10 %, puis le nouveau prix baisse de 10 %. Par rapport au prix de départ, il a…', 'baissé de 1 %', 'Multiplier par 1,1 puis par 0,9 revient à multiplier par 0,99 : le prix a baissé de 1 %. (Les 10 % de baisse portent sur un prix plus grand.)', ['n\'a pas changé', 'augmenté de 1 %', 'baissé de 10 %']],
  ['Par combien de zéros se termine le produit 1 × 2 × 3 × … × 10 ?', '2', 'Un zéro final vient d\'une paire 2 × 5. Dans ce produit, il y a deux facteurs 5 (5 et 10) : 2 zéros. En effet, le produit vaut 3 628 800.'],
  ['Je pense à un nombre. Je lui ajoute sa moitié et j\'obtiens 45. Quel est ce nombre ?', '30', 'Le nombre plus sa moitié, c\'est une fois et demie le nombre : 45 ÷ 1,5 = 30. (30 + 15 = 45.)'],
  ['Une mère et sa fille ont 50 ans à elles deux. La mère a 26 ans de plus que sa fille. Quel âge a la fille ?', '12', 'Sans l\'écart, il resterait 50 − 26 = 24 ans à partager en deux âges égaux : la fille a 12 ans (et la mère 38).'],
  ['On plante un poteau tous les 10 m le long d\'une clôture droite de 100 m, y compris aux deux bouts. Combien de poteaux faut-il ?', '11', '100 ÷ 10 = 10 intervalles, mais il faut un poteau de plus que d\'intervalles : 11.'],
  ['Pendant une course, tu dépasses le deuxième. Quelle est maintenant ta place ?', '2e', 'Tu prends la place de celui que tu dépasses : tu es deuxième (et non premier).', ['1er', '3e', 'on ne peut pas savoir']],
  ['Combien de mois de l\'année ont 28 jours ?', '12', 'Tous les mois ont au moins 28 jours !', ['1', '2', '0']],
  ['Un berger a 17 moutons. Tous sauf 9 s\'enfuient. Combien lui en reste-t-il ?', '9', '« Tous sauf 9 » s\'enfuient : il en reste donc 9.'],
  ['Combien vaut 2 + 2 × 2 − 2 ÷ 2 ?', '5', 'Multiplications et divisions d\'abord : 2 × 2 = 4 et 2 ÷ 2 = 1. Puis 2 + 4 − 1 = 5.'],
  ['Quel nombre continue la suite : 1 ; 1 ; 2 ; 3 ; 5 ; 8 ; 13 ; … ?', '21', 'Chaque nombre est la somme des deux précédents (suite de Fibonacci) : 8 + 13 = 21.'],
  ['Quel nombre continue la suite : 2 ; 6 ; 12 ; 20 ; 30 ; … ?', '42', 'Les écarts augmentent de 2 : +4, +6, +8, +10, puis +12. 30 + 12 = 42. (Ce sont aussi 1×2, 2×3, 3×4… et 6×7 = 42.)'],
  ['Quel nombre continue la suite : 1 ; 4 ; 9 ; 16 ; 25 ; … ?', '36', 'Ce sont les carrés : 1², 2², 3², 4², 5², puis 6² = 36.'],
  ['Quelle est la somme de tous les nombres entiers de 1 à 100 ?', '5050', 'On regroupe par paires : 1 + 100, 2 + 99, 3 + 98… Chaque paire vaut 101 et il y a 50 paires : 50 × 101 = 5 050.'],
  ['Un cube de 3 cm d\'arête, peint en rouge, est découpé en 27 petits cubes de 1 cm. Combien de petits cubes ont exactement deux faces peintes ?', '12', 'Ce sont les cubes du milieu de chaque arête : une arête en a 1, et un cube a 12 arêtes. (Les 8 coins ont trois faces peintes.)'],
  ['Un cube de 3 cm d\'arête, peint en rouge, est découpé en 27 petits cubes de 1 cm. Combien de petits cubes n\'ont aucune face peinte ?', '1', 'Seul le cube du centre ne touche aucune face extérieure : 1 cube.'],
  ['Combien de diagonales a un hexagone (6 côtés) ?', '9', 'De chaque sommet partent 3 diagonales (vers les sommets non voisins) : 6 × 3 = 18, mais chaque diagonale est comptée deux fois : 9.'],
  ['Quelle est la somme des angles d\'un pentagone (en degrés) ?', '540', 'Depuis un sommet, on découpe le pentagone en 3 triangles : 3 × 180 = 540°.'],
  ['Avec les chiffres 1, 2, 3 et 4, utilisés chacun une seule fois, combien de nombres de 4 chiffres peut-on écrire ?', '24', '4 choix pour le 1er chiffre, puis 3, puis 2, puis 1 : 4 × 3 × 2 × 1 = 24.'],
  ['Un tournoi de tennis à élimination directe réunit 32 joueurs. Combien de matchs faut-il jouer pour connaître le vainqueur ?', '31', 'Chaque match élimine un joueur. Il faut éliminer 31 joueurs : 31 matchs.'],
  ['On lance deux dés équilibrés. Quelle est la probabilité d\'obtenir au moins un 6 ?', '11/36', 'Il est plus simple de compter le contraire : aucun 6, c\'est 5 × 5 = 25 issues sur 36. Donc au moins un 6 : 36 − 25 = 11 issues, soit 11/36.'],
  ['Un verre plein d\'eau pèse 400 g. À moitié plein, il pèse 250 g. Combien pèse le verre vide (en g) ?', '100', 'La moitié de l\'eau pèse 400 − 250 = 150 g, donc toute l\'eau pèse 300 g. Le verre vide : 400 − 300 = 100 g.'],
  ['Pour numéroter les pages d\'un livre de 100 pages, combien de chiffres écrit-on en tout ?', '192', 'Pages 1 à 9 : 9 chiffres. Pages 10 à 99 : 90 × 2 = 180 chiffres. Page 100 : 3 chiffres. Total : 9 + 180 + 3 = 192.'],
  ['Il est 15 h. Quelle heure sera-t-il dans 100 heures ?', '19 h', '100 h = 4 jours (96 h) + 4 h. Dans 4 jours, il sera de nouveau 15 h ; 4 h plus tard, il sera 19 h.', ['15 h', '7 h', '23 h']],
  ['Combien y a-t-il de secondes dans une journée ?', '86400', '24 h × 60 min × 60 s = 86 400 s.'],
  ['Quel nombre positif, multiplié par lui-même, donne 2,25 ?', '1,5', '1,5 × 1,5 = 2,25 (comme 15 × 15 = 225).'],
  ['3 robinets identiques remplissent une cuve en 6 heures. Combien d\'heures faut-il à 9 robinets identiques ?', '2', '3 fois plus de robinets remplissent la cuve 3 fois plus vite : 6 ÷ 3 = 2 heures.'],
  ['Une brique pèse 1 kg plus une demi-brique. Combien pèse une brique (en kg) ?', '2', 'Si l\'on retire une demi-brique des deux côtés, une demi-brique pèse 1 kg. La brique entière pèse donc 2 kg.'],
  ['Quel est le plus petit nombre entier non nul divisible à la fois par 2, 3, 4, 5 et 6 ?', '60', 'Il doit être multiple de 4, de 3 et de 5 (cela suffit pour 2 et 6) : 4 × 3 × 5 = 60.'],
  ['Quel est le chiffre des unités de 2¹⁰ ?', '4', 'Les chiffres des unités des puissances de 2 se répètent : 2, 4, 8, 6, 2, 4, 8, 6… 2¹⁰ = 1 024 : le chiffre des unités est 4.'],
  ['Il faut 3 minutes pour scier un tronc d\'un trait. Combien de minutes pour le couper en 4 morceaux ?', '9', '4 morceaux demandent 3 traits de scie : 3 × 3 = 9 minutes.'],
  ['Combien de coupes droites passant par le centre faut-il au minimum pour partager une pizza en 8 parts égales ?', '4', 'Chaque coupe passant par le centre traverse toute la pizza et crée 2 bords de parts : 4 coupes donnent 8 parts.'],
  ['Aujourd\'hui, nous sommes mercredi. Quel jour serons-nous dans 100 jours ?', 'vendredi', '100 = 14 × 7 + 2. Dans 98 jours, ce sera de nouveau mercredi ; 2 jours plus tard : vendredi.', ['mercredi', 'jeudi', 'samedi']],
  ['Quel est le plus grand nombre à 3 chiffres divisible par 7 ?', '994', '7 × 142 = 994, et 7 × 143 = 1 001 a 4 chiffres. Réponse : 994.'],
  ['Combien de nombres entiers de 1 à 100 sont divisibles par 3 ou par 5 ?', '47', 'Multiples de 3 : 33. Multiples de 5 : 20. Mais les multiples de 15 (6 nombres) sont comptés deux fois : 33 + 20 − 6 = 47.'],
  ['Un carré a la même aire qu\'un rectangle de 4 cm sur 9 cm. Combien mesure le côté du carré (en cm) ?', '6', 'Aire du rectangle : 4 × 9 = 36 cm². Le côté du carré est le nombre dont le carré vaut 36 : 6 cm.'],
  ['Une montre retarde de 2 minutes par heure. Combien de minutes de retard a-t-elle au bout d\'une journée ?', '48', '24 heures × 2 minutes = 48 minutes de retard.'],
  ['Paul a autant de frères que de sœurs. Sa sœur Julie a deux fois plus de frères que de sœurs. Combien d\'enfants y a-t-il dans cette famille ?', '7', 'Il y a 4 garçons et 3 filles : Paul a 3 frères et 3 sœurs ; Julie a 4 frères et 2 sœurs. En tout : 7 enfants.'],
  ['On écrit tous les nombres de 1 à 50. Combien de fois écrit-on le chiffre 5 ?', '6', '5, 15, 25, 35 et 45 (5 fois), plus 50 (1 fois) : 6.'],
];

let rangEnigme = 0;
GENERATEURS['parents'].push({ code: 'ENI', theme: 'enigme', chapitre: 'enigmes', nombre: ENIGMES.length, creer() {
  const [enonce, reponse, correction, faux] = ENIGMES[rangEnigme++ % ENIGMES.length];
  return faux ? { enonce, reponse, correction, faux } : { enonce, reponse, correction };
} });
