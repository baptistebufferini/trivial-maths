# Trivial Maths (bêta)

Un Trivial Pursuit de mathématiques pour le collège, jouable dans un navigateur.
Site statique : HTML, CSS et JavaScript, sans serveur ni base de données.

## Organisation des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page : accueil, plateau, fenêtres de question |
| `css/style.css` | L'apparence (couleurs générales, tailles, téléphone) |
| `js/config.js` | **Les réglages** : thèmes, programme par niveau, profs |
| `js/jeu.js` | Le déroulement : accueil, dé, tours, questions, fin |
| `js/plateau.js` | Le plateau en roue et les déplacements |
| `js/banque.js` | Le choix des questions selon le niveau et les déblocages |
| `js/verification.js` | La vérification des réponses tapées |
| `js/csv.js` | La lecture des tableurs au format CSV |
| `data/questions-demo.js` | Les questions de démonstration (format de la banque) |
| `data/deblocages-demo.js` | Les déblocages de démonstration |
| `images/` | Les figures des questions |

## Tester sur son ordinateur

Le navigateur bloque certains fichiers ouverts par double-clic. Le plus sûr :
lancer le petit serveur fourni, puis ouvrir http://localhost:8080/

```
powershell -ExecutionPolicy Bypass -File .claude/serveur.ps1
```

Lien prof (déblocages) : http://localhost:8080/?prof=baptiste
