# =============================================================
# IMPORT DES QUESTIONS GÉNÉRÉES DANS data/banque.xlsx
# Usage : powershell -ExecutionPolicy Bypass -File outils/importer.ps1 -Niveau 4e
#  1. lance outils/generer.html dans Edge (sans fenêtre) ;
#  2. enregistre les figures dans images/gen/<niveau>/ ;
#  3. remplace dans l'onglet Questions les lignes « G4-… » par les nouvelles.
# Excel doit être fermé pendant l'import.
# =============================================================
param([string]$Niveau = '4e')
$ErrorActionPreference = 'Stop'
$projet = Split-Path -Parent $PSScriptRoot
$prefixe = "G$($Niveau.Substring(0,1))-"

# ---------- 1. Génération dans Edge ----------
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw "Microsoft Edge introuvable." }
$page = 'file:///' + ((Join-Path $projet 'outils\generer.html') -replace '\\', '/') + "?niveau=$Niveau"
$profil = Join-Path $env:TEMP 'trivial-maths-edge'
$sortie = Join-Path $env:TEMP 'trivial-maths-generation.html'
# Edge est une application « à fenêtre » : on récupère sa sortie dans un fichier.
Start-Process -FilePath $edge -Wait -WindowStyle Hidden -RedirectStandardOutput $sortie `
  -ArgumentList @('--headless', '--disable-gpu', '--no-first-run', "--user-data-dir=$profil", '--virtual-time-budget=30000', '--dump-dom', $page)
$html = [IO.File]::ReadAllText($sortie, [Text.Encoding]::UTF8)
$m = [regex]::Match($html, '(?s)<script id="resultat" type="application/json">(.*?)</script>')
if (-not $m.Success -or $m.Groups[1].Value.Trim() -eq '') { throw "La page de génération n'a rien produit." }
$resultat = $m.Groups[1].Value | ConvertFrom-Json
$questions = @($resultat.questions)
Write-Host "$($questions.Count) questions générées."
$resultat.bilan | Where-Object { $_ -match 'ERREUR' } | ForEach-Object { Write-Host $_ -ForegroundColor Red }

# ---------- 2. Figures ----------
$dossier = Join-Path $projet "images\gen\$Niveau"
if (Test-Path $dossier) { Remove-Item $dossier -Recurse -Force }
New-Item -ItemType Directory -Force $dossier | Out-Null
$utf8 = New-Object Text.UTF8Encoding $false
foreach ($p in $resultat.images.PSObject.Properties) {
  [IO.File]::WriteAllText((Join-Path $projet ($p.Name -replace '/', '\')), $p.Value, $utf8)
}
Write-Host "$(@($resultat.images.PSObject.Properties).Count) figures enregistrées dans images\gen\$Niveau."

# ---------- 3. Excel ----------
$colonnes = @('id','theme','niveau','programme','chapitre','enonce','type','reponse','variantes','faux1','faux2','faux3','correction','image')
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
  $classeur = $excel.Workbooks.Open((Join-Path $projet 'data\banque.xlsx'))
  $f = $classeur.Worksheets.Item('Questions')
  $f.Range('A2:N6000').NumberFormat = '@'     # tout en Texte (sinon « 3/4 » deviendrait une date)
  # Listes déroulantes sur toute la hauteur utile
  $listes = @{ 'B' = 'nombres,donnees,grandeurs,geometrie,algo,enigme'; 'C' = '6e,5e,4e,3e,parents'; 'D' = 'commun,ancien,nouveau'; 'G' = 'saisie,qcm' }
  foreach ($col in $listes.Keys) { $v = $f.Range("$($col)2:$($col)6000").Validation; $v.Delete(); $v.Add(3, 1, 1, $listes[$col]); $v.IgnoreBlank = $true }

  # Suppression des anciennes questions générées de ce niveau
  $derniere = $f.Cells($f.Rows.Count, 1).End(-4162).Row
  $supprimees = 0
  for ($r = $derniere; $r -ge 2; $r--) {
    # Seulement les identifiants générés : « G6- » suivi de lettres (ex. G6-ENT1-03).
    # Les questions écrites à la main, comme G6-01, ne sont jamais touchées.
    if ([string]$f.Cells($r, 1).Value2 -cmatch "^$prefixe[A-Z]") { [void]$f.Rows($r).Delete(); $supprimees++ }
  }
  # Ajout des nouvelles à la suite
  $debut = $f.Cells($f.Rows.Count, 1).End(-4162).Row + 1
  $n = $questions.Count
  $tableau = New-Object 'object[,]' $n, $colonnes.Count
  for ($i = 0; $i -lt $n; $i++) {
    for ($c = 0; $c -lt $colonnes.Count; $c++) { $tableau[$i, $c] = [string]$questions[$i].($colonnes[$c]) }
  }
  $f.Range($f.Cells($debut, 1), $f.Cells($debut + $n - 1, $colonnes.Count)).Value2 = $tableau
  $f.Range("F2:F$($debut + $n)").WrapText = $true
  $f.Range("M2:M$($debut + $n)").WrapText = $true
  $classeur.Save()
  $classeur.Close($false)
  Write-Host "Excel : $supprimees anciennes lignes $prefixe retirées, $n ajoutées (lignes $debut à $($debut + $n - 1))."
} finally {
  $excel.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
}
