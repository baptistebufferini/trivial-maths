# Trivial Maths (bêta)

Un Trivial Pursuit de mathématiques pour le collège, jouable dans un navigateur.
Site statique : HTML, CSS et JavaScript, sans serveur ni base de données.

## Organisation des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page : accueil, plateau, fenêtres de question |
| `css/style.css` | L'apparence (couleurs générales, tailles, téléphone) |
| `data/banque.xlsx` | **Les questions et les progressions** (à modifier avec Excel) |
| `js/config.js` | **Les réglages** : thèmes, programme par niveau, adversaire |
| `js/jeu.js` | Le déroulement : accueil, dé, tours, questions, fin |
| `js/plateau.js` | Le plateau en roue et les déplacements |
| `js/banque.js` | Le choix des questions selon le niveau et le chapitre en cours |
| `js/verification.js` | La vérification des réponses tapées |
| `js/csv.js` | La lecture du fichier Excel (et des données de secours) |
| `data/demo.js` | Données de secours, si le fichier Excel est illisible |
| `images/` | Les figures des questions |

## Tester sur son ordinateur

Le navigateur bloque certains fichiers ouverts par double-clic. Le plus sûr :
lancer le petit serveur fourni, puis ouvrir http://localhost:8080/

```
powershell -ExecutionPolicy Bypass -File .claude/serveur.ps1
```

## Ajouter des questions

1. Ouvrir `data/banque.xlsx` avec Excel.
2. Onglet **Questions** : ajouter une ligne (l'onglet **Aide** explique chaque colonne).
3. Enregistrer (au format .xlsx, même nom), puis recharger la page du jeu.

Si une ligne est incomplète, le jeu l'ignore et la signale en orange sur l'accueil.

## Progressions

Onglet **Progressions** : les chapitres de chaque niveau, dans l'ordre de l'année.
Un élève choisit son chapitre en cours à l'accueil ; il reçoit les questions
des niveaux précédents et celles de son niveau jusqu'à ce chapitre.
