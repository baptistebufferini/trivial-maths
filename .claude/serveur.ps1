# Petit serveur local pour tester le jeu sur http://localhost:8080
# (sert simplement les fichiers du dossier du projet)
$racine = Split-Path -Parent $PSScriptRoot
$ecoute = New-Object System.Net.HttpListener
$ecoute.Prefixes.Add('http://localhost:8080/')
$ecoute.Start()
Write-Host "Serveur pret sur http://localhost:8080/"
$types = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.csv'='text/csv; charset=utf-8' }
while ($ecoute.IsListening) {
  $ctx = $ecoute.GetContext()
  $chemin = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
  if ($chemin -eq '') { $chemin = 'index.html' }
  $fichier = Join-Path $racine $chemin
  if ((Test-Path $fichier -PathType Leaf) -and ([IO.Path]::GetFullPath($fichier).StartsWith($racine))) {
    $octets = [IO.File]::ReadAllBytes($fichier)
    $ext = [IO.Path]::GetExtension($fichier).ToLower()
    if ($types.ContainsKey($ext)) { $ctx.Response.ContentType = $types[$ext] }
    $ctx.Response.OutputStream.Write($octets, 0, $octets.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
