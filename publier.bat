@echo off
rem =============================================================
rem PUBLIER LES MODIFICATIONS EN LIGNE
rem Double-cliquer sur ce fichier apres avoir modifie banque.xlsx
rem (ou un autre fichier du jeu). Le site se met a jour en 1 a 2 minutes.
rem =============================================================
cd /d "%~dp0"
echo Envoi des modifications vers GitHub...
echo.
git add -A
git commit -m "Mise a jour du jeu"
git push
echo.
echo Termine. Le jeu en ligne sera a jour dans 1 a 2 minutes :
echo https://baptistebufferini.github.io/trivial-maths/
echo.
pause
