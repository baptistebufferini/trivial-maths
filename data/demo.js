// =============================================================
// DONNÉES DE SECOURS
// Utilisées seulement si le fichier data/banque.xlsx ne peut pas
// être lu (par exemple si le jeu est ouvert par double-clic).
// La vraie banque, celle à modifier, est data/banque.xlsx.
//
// Les textes ci-dessous sont au format CSV :
//   - la 1re ligne donne le nom des colonnes ;
//   - une question par ligne ;
//   - chaque case est entre guillemets "..." (à cause des virgules
//     des nombres décimaux).
//
// Colonnes :
//   id, theme, niveau, programme, chapitre, enonce, type (qcm/saisie),
//   reponse, variantes (séparées par ;), faux1, faux2, faux3,
//   correction, image
//
// Remarque : toutes ces questions sont marquées « commun » (valables
// dans l'ancien et le nouveau programme). À ajuster dans la vraie banque.
// =============================================================

// Progressions : les chapitres de chaque niveau, dans l'ordre de l'année.
const PROGRESSIONS_DEMO = `
"niveau","chapitre","titre"
"6e","6e-decimaux","1. Nombres décimaux"
"6e","6e-angles","2. Angles"
"6e","6e-fractions","3. Fractions"
"6e","6e-symetrie-axiale","4. Symétrie axiale"
"6e","6e-perimetres-aires","5. Périmètres et aires"
"6e","6e-proportionnalite","6. Proportionnalité"
"6e","6e-durees","7. Durées"
"6e","6e-scratch","8. Programmation Scratch"
"5e","5e-algo","Algorithmique et tableur (toute l'année)"
"5e","5e-demonstration","Démonstration (toute l'année)"
"5e","5e-calcul","1. Règles de calcul"
"5e","5e-triangles","2. Triangles"
"5e","5e-relatifs","3. Nombres relatifs : ordre et repérage"
"5e","5e-divisibilite","4. Divisibilité"
"5e","5e-puissances","5. Puissances"
"5e","5e-symetrie-centrale","6. Symétrie centrale"
"5e","5e-fractions","7. Écritures fractionnaires"
"5e","5e-relatifs-addition","8. Addition et soustraction des relatifs"
"5e","5e-fractions-addition","9. Ajouter et soustraire des fractions"
"5e","5e-aires","10. Aires et périmètres"
"5e","5e-calcul-litteral","11. Calcul littéral"
"5e","5e-angles","12. Angles et parallélisme"
"5e","5e-proportionnalite","13. Proportionnalité et notion de fonction"
"5e","5e-parallelogramme","14. Parallélogrammes"
"5e","5e-equations","15. Initiation aux équations"
"5e","5e-espace","16. Espace et volumes"
"5e","5e-stats-probas","17. Statistique et probabilité"
"4e","4e-algo","Pensée informatique (toute l'année)"
"4e","4e-relatifs","1. Opérations sur les nombres relatifs"
"4e","4e-demonstration","2. Démonstration"
"4e","4e-calcul-litteral-1","3. Calcul littéral (1/2)"
"4e","4e-pythagore","4. Théorème de Pythagore"
"4e","4e-fractions-1","5. Écriture fractionnaire (1/2)"
"4e","4e-pythagore-reciproque","6. Réciproque de Pythagore"
"4e","4e-puissances","7. Puissances"
"4e","4e-fractions-2","8. Écriture fractionnaire (2/2)"
"4e","4e-proportionnalite","9. Proportionnalité, pourcentages, vitesses"
"4e","4e-calcul-litteral-2","10. Calcul littéral (2/2)"
"4e","4e-espace","11. Espace : pyramide, cône, volumes"
"4e","4e-equations","12. Équations"
"4e","4e-statistiques","13. Statistiques"
"4e","4e-translation","14. Translation"
"4e","4e-probabilites","15. Probabilités"
"3e","3e-algo","Scratch et tableur (toute l'année)"
"3e","3e-notion-fonction","1. Notion de fonction"
"3e","3e-expr-alg-1","2. Expressions algébriques (1)"
"3e","3e-espace","3. Les objets de l'espace"
"3e","3e-pythagore","4. Pythagore : révisions"
"3e","3e-arithmetique","5. Arithmétique"
"3e","3e-puissances","6. Puissances : révisions"
"3e","3e-thales","7. Triangles et parallèles (Thalès)"
"3e","3e-expr-alg-2","8. Expressions algébriques (2) : équations"
"3e","3e-sections","10. Sections de solides"
"3e","3e-expr-alg-3","11. Expressions algébriques (3) : factoriser"
"3e","3e-trigonometrie","12. Trigonométrie"
"3e","3e-proportionnalite","13. Proportionnalité : applications"
"3e","3e-fonctions-affines","14. Fonctions affines"
"3e","3e-expr-alg-4","15. Expressions algébriques (4) : produit nul"
"3e","3e-stats-probas","16. Statistiques et probabilités"
"3e","3e-transformations","17. Transformations du plan"
`;

const QUESTIONS_DEMO = `
"id","theme","niveau","programme","chapitre","enonce","type","reponse","variantes","faux1","faux2","faux3","correction","image"
"N6-01","nombres","6e","commun","6e-decimaux","Calculer 2,5 + 0,75","saisie","3,25","","","","","On aligne les virgules : 2,50 + 0,75 = 3,25.",""
"N6-02","nombres","6e","commun","6e-fractions","Quelle fraction est égale à 0,5 ?","qcm","1/2","","1/5","2/5","5/2","0,5 = 5 dixièmes = 5/10 = 1/2.",""
"N6-03","nombres","6e","commun","6e-decimaux","Calculer 3,6 × 10","saisie","36","","","","","Multiplier par 10 rend chaque chiffre 10 fois plus grand : 3 unités deviennent 3 dizaines, 6 dixièmes deviennent 6 unités. 3,6 × 10 = 36.",""
"D6-01","donnees","6e","commun","6e-proportionnalite","3 cahiers coûtent 6 €. Combien coûtent 5 cahiers (en €) ?","saisie","10","","","","","1 cahier coûte 6 ÷ 3 = 2 €, donc 5 cahiers coûtent 5 × 2 = 10 €.",""
"D6-02","donnees","6e","commun","6e-proportionnalite","Combien font 10 % de 70 ?","qcm","7","","0,7","10","63","Prendre 10 %, c'est diviser par 10 : 70 ÷ 10 = 7.",""
"G6-01","grandeurs","6e","commun","6e-perimetres-aires","Aire d'un rectangle de 7 cm sur 4 cm (en cm²) ?","saisie","28","","","","","Aire du rectangle = longueur × largeur = 7 × 4 = 28 cm².",""
"G6-02","grandeurs","6e","commun","6e-durees","Combien de minutes dans 2 h 15 min ?","saisie","135","","","","","2 h = 2 × 60 = 120 min, puis 120 + 15 = 135 min.",""
"E6-01","geometrie","6e","commun","6e-angles","Un angle de 120° est…","qcm","obtus","","aigu","droit","plat","Un angle obtus mesure entre 90° et 180°. 120° est bien entre les deux.",""
"E6-02","geometrie","6e","commun","6e-symetrie-axiale","Combien d'axes de symétrie a un carré ?","qcm","4","","2","1","8","Les 2 droites qui passent par les milieux des côtés opposés, et les 2 diagonales : 4 axes.",""
"A6-01","algo","6e","commun","6e-scratch","x vaut 0. On répète 4 fois : « ajouter 10 à x ». Que vaut x à la fin ?","saisie","40","","","","","4 répétitions de + 10 : 0 + 4 × 10 = 40.",""
"A6-02","algo","6e","commun","6e-scratch","Pour tracer un carré avec Scratch, on répète 4 fois : avancer, puis tourner de…","qcm","90°","","45°","60°","360°","À chaque coin d'un carré, on tourne d'un angle droit : 90°. Quatre virages de 90° font un tour complet (360°).",""
"N5-01","nombres","5e","commun","5e-relatifs-addition","Calculer −7 + 3","saisie","-4","","","","","Signes contraires : on calcule 7 − 3 = 4 et on garde le signe du nombre le plus éloigné de zéro (−7). Résultat : −4.",""
"N5-02","nombres","5e","commun","5e-calcul","Calculer 2 + 3 × 4","qcm","14","","20","24","9","La multiplication est prioritaire : 3 × 4 = 12, puis 2 + 12 = 14.",""
"N5-03","nombres","5e","commun","5e-fractions","Calculer les 3/4 de 20","saisie","15","","","","","Un quart de 20 : 20 ÷ 4 = 5. Trois quarts : 3 × 5 = 15.",""
"D5-01","donnees","5e","commun","5e-stats-probas","Quelle est la moyenne de 8, 12 et 13 ?","saisie","11","","","","","On additionne les valeurs : 8 + 12 + 13 = 33, puis on divise par leur nombre : 33 ÷ 3 = 11.",""
"D5-02","donnees","5e","commun","5e-proportionnalite","Sur un plan à l'échelle 1/1000, 5 cm représentent…","qcm","50 m","","5 m","500 m","5 km","1 cm sur le plan représente 1 000 cm = 10 m en vrai. Donc 5 cm représentent 5 × 10 = 50 m.",""
"M5-01","grandeurs","5e","commun","5e-aires","Aire d'un triangle de base 6 cm et de hauteur 5 cm (en cm²) ?","saisie","15","","","","","Aire du triangle = base × hauteur ÷ 2 = 6 × 5 ÷ 2 = 15 cm².",""
"M5-02","grandeurs","5e","commun","5e-espace","Volume d'un pavé droit de 2 cm × 3 cm × 5 cm (en cm³) ?","saisie","30","","","","","Volume du pavé = longueur × largeur × hauteur = 2 × 3 × 5 = 30 cm³.",""
"E5-01","geometrie","5e","commun","5e-angles","Dans un triangle, deux angles mesurent 50° et 60°. Combien mesure le troisième (en °) ?","saisie","70","","","","","La somme des angles d'un triangle vaut 180° : 180 − 50 − 60 = 70°.",""
"E5-02","geometrie","5e","commun","5e-symetrie-centrale","Par une symétrie centrale, l'image d'un segment est…","qcm","un segment parallèle de même longueur","","un segment perpendiculaire de même longueur","un segment deux fois plus long","un point","La symétrie centrale conserve les longueurs, et l'image d'une droite est une droite parallèle.",""
"A5-01","algo","5e","commun","5e-algo","n vaut 5. On exécute « mettre n à n × 3 », puis « ajouter 4 à n ». Que vaut n ?","saisie","19","","","","","On suit les instructions dans l'ordre : 5 × 3 = 15, puis 15 + 4 = 19.",""
"A5-02","algo","5e","commun","5e-algo","Avec Scratch, de combien faut-il tourner à chaque coin pour tracer un triangle équilatéral ?","qcm","120°","","60°","90°","180°","Le lutin tourne de l'angle extérieur : 180° − 60° = 120°. Trois virages de 120° font un tour complet (360°).",""
"N4-01","nombres","4e","commun","4e-puissances","Écrire 10³ sous forme d'un nombre entier.","saisie","1000","","","","","10³ = 10 × 10 × 10 = 1 000.",""
"N4-02","nombres","4e","commun","4e-fractions-2","Calculer 2/3 × 3/5","saisie","2/5","","","","","On multiplie les numérateurs entre eux et les dénominateurs entre eux : (2 × 3)/(3 × 5) = 6/15 = 2/5.",""
"N4-03","nombres","4e","commun","4e-calcul-litteral-1","Développer 3(x + 4)","qcm","3x + 12","","3x + 4","3x + 7","x + 12","On distribue le 3 sur chaque terme : 3 × x + 3 × 4 = 3x + 12.",""
"D4-01","donnees","4e","commun","4e-probabilites","On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?","qcm","1/2","","1/6","1/3","2/3","3 issues favorables (2, 4 et 6) sur 6 issues possibles : 3/6 = 1/2.",""
"D4-02","donnees","4e","commun","4e-proportionnalite","Un prix de 80 € augmente de 25 %. Quel est le nouveau prix (en €) ?","saisie","100","","","","","25 %, c'est un quart : 80 ÷ 4 = 20 €. Nouveau prix : 80 + 20 = 100 €.",""
"M4-01","grandeurs","4e","commun","4e-proportionnalite","Une voiture roule à 90 km/h pendant 2 h 30 min. Quelle distance parcourt-elle (en km) ?","saisie","225","","","","","2 h 30 min = 2,5 h. Distance = vitesse × durée = 90 × 2,5 = 225 km.",""
"M4-02","grandeurs","4e","commun","4e-proportionnalite","36 km/h, c'est…","qcm","10 m/s","","36 m/s","3,6 m/s","100 m/s","36 km/h = 36 000 m en 3 600 s, soit 36 000 ÷ 3 600 = 10 m par seconde.",""
"E4-01","geometrie","4e","commun","4e-pythagore","ABC est rectangle en A, avec AB = 3 cm et AC = 4 cm. Combien mesure BC (en cm) ?","saisie","5","","","","","Théorème de Pythagore : BC² = AB² + AC² = 9 + 16 = 25, donc BC = √25 = 5 cm.","images/pythagore.svg"
"E4-02","geometrie","4e","commun","4e-pythagore-reciproque","Un triangle a des côtés de 6 cm, 8 cm et 10 cm. Est-il rectangle ?","qcm","Oui","","Non","On ne peut pas savoir","","Réciproque de Pythagore : 10² = 100 et 6² + 8² = 36 + 64 = 100. L'égalité est vraie, donc le triangle est rectangle.",""
"A4-01","algo","4e","commun","4e-algo","x vaut 1. On répète 5 fois : « mettre x à x × 2 ». Que vaut x à la fin ?","saisie","32","","","","","On double 5 fois : 1 → 2 → 4 → 8 → 16 → 32 (c'est 2⁵).",""
"A4-02","algo","4e","commun","4e-algo","« Si x > 10 alors dire Grand, sinon dire Petit ». Que dit le lutin si x = 10 ?","qcm","Petit","","Grand","Rien","Il affiche une erreur","10 > 10 est faux (10 n'est pas strictement plus grand que 10), donc le lutin exécute le « sinon » : Petit.",""
"N3-01","nombres","3e","commun","3e-arithmetique","Lequel de ces nombres est premier ?","qcm","29","","21","27","33","21 = 3 × 7, 27 = 3 × 9 et 33 = 3 × 11. 29 n'a que deux diviseurs, 1 et lui-même : il est premier.",""
"N3-02","nombres","3e","commun","3e-expr-alg-2","Résoudre 3x − 5 = 10","saisie","5","x = 5","","","","On ajoute 5 des deux côtés : 3x = 15. On divise par 3 : x = 5.",""
"N3-03","nombres","3e","commun","3e-arithmetique","Quel est le plus grand diviseur commun de 12 et 18 ?","saisie","6","","","","","Diviseurs de 12 : 1, 2, 3, 4, 6, 12. Diviseurs de 18 : 1, 2, 3, 6, 9, 18. Le plus grand en commun est 6.",""
"D3-01","donnees","3e","commun","3e-notion-fonction","f(x) = 2x − 3. Calculer f(4).","saisie","5","","","","","On remplace x par 4 : f(4) = 2 × 4 − 3 = 8 − 3 = 5.",""
"D3-02","donnees","3e","commun","3e-fonctions-affines","Laquelle de ces fonctions est linéaire ?","qcm","f(x) = 4x","","f(x) = 4x + 1","f(x) = x²","f(x) = 4","Une fonction linéaire s'écrit f(x) = ax. Seule f(x) = 4x a cette forme (avec a = 4).",""
"M3-01","grandeurs","3e","commun","3e-thales","On multiplie toutes les longueurs d'un cube par 2. Son volume est multiplié par…","qcm","8","","2","4","6","Si les longueurs sont multipliées par k, les volumes sont multipliés par k³. Ici 2³ = 8.",""
"M3-02","grandeurs","3e","commun","3e-espace","Volume d'une pyramide de base 9 cm² et de hauteur 5 cm (en cm³) ?","saisie","15","","","","","Volume de la pyramide = aire de la base × hauteur ÷ 3 = 9 × 5 ÷ 3 = 15 cm³.",""
"E3-01","geometrie","3e","commun","3e-trigonometrie","Dans un triangle rectangle, le cosinus d'un angle aigu est égal à…","qcm","côté adjacent ÷ hypoténuse","","côté opposé ÷ hypoténuse","côté opposé ÷ côté adjacent","hypoténuse ÷ côté adjacent","Moyen mnémotechnique CAH-SOH-TOA : Cosinus = Adjacent ÷ Hypoténuse.",""
"E3-02","geometrie","3e","commun","3e-trigonometrie","Un angle aigu a pour cosinus 0,5. Combien mesure-t-il (en °) ?","saisie","60","","","","","cos 60° = 0,5. À la calculatrice : arccos(0,5) = 60°.",""
"A3-01","algo","3e","commun","3e-algo","n vaut 0. « Répéter jusqu'à ce que n > 20 : ajouter 7 à n ». Que vaut n à la fin ?","saisie","21","","","","","n prend les valeurs 7, 14, puis 21. À 21, la condition n > 20 est vraie : la boucle s'arrête.",""
"A3-02","algo","3e","commun","3e-algo","On répète 3 fois : (répéter 4 fois : avancer de 10). Combien de fois le lutin avance-t-il ?","qcm","12","","7","3","4","Deux boucles imbriquées : 3 × 4 = 12 fois.",""
"EN-01","enigme","parents","commun","enigmes","Un escargot monte un mur de 10 m. Le jour il monte de 3 m, la nuit il redescend de 2 m. Au bout de combien de jours atteint-il le haut ?","saisie","8","","","","","Après 7 jours et 7 nuits, il est à 7 m. Le 8e jour, il monte de 3 m et atteint 10 m avant de pouvoir redescendre.",""
"EN-02","enigme","parents","commun","enigmes","Une raquette et une balle coûtent 1,10 € en tout. La raquette coûte 1 € de plus que la balle. Combien coûte la balle (en €) ?","saisie","0,05","","","","","Si la balle coûte b, la raquette coûte b + 1. Donc b + (b + 1) = 1,10, soit 2b = 0,10 et b = 0,05 €. Le piège : répondre 0,10 €.",""
"EN-03","enigme","parents","commun","enigmes","6 personnes se serrent toutes la main, une seule fois par paire. Combien de poignées de main en tout ?","saisie","15","","","","","Chacun serre 5 mains : 6 × 5 = 30. Mais chaque poignée de main est comptée deux fois (une par personne) : 30 ÷ 2 = 15.",""
"EN-04","enigme","parents","commun","enigmes","Je suis un nombre à deux chiffres divisible par 4. La somme de mes chiffres vaut 9, et mon chiffre des dizaines est plus petit que celui des unités. Qui suis-je ?","saisie","36","","","","","Somme des chiffres 9 : c'est un multiple de 9 (18, 27, 36, 45…). Ceux qui sont divisibles par 4 : 36 et 72. Dizaines plus petites que les unités : 36.",""
"EN-05","enigme","parents","commun","enigmes","5 machines fabriquent 5 objets en 5 minutes. Combien de temps faut-il à 100 machines pour fabriquer 100 objets ?","qcm","5 minutes","","100 minutes","20 minutes","1 minute","Chaque machine fabrique 1 objet en 5 minutes. 100 machines travaillent en même temps : 100 objets en 5 minutes.",""
`;
