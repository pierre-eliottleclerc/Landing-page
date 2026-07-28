# Régénère data/legal.js depuis l'index.html de référence (seul exemplaire dont
# l'encodage est sain) et remplace le bloc « Hébergement du site ».
$ErrorActionPreference = 'Stop'

$srcHtml = 'C:\Users\pierr\OneDrive\Desktop\Claude output\florestan-im\index.html'
$outFile = 'G:\Drive partagés\Florestan Shared\0. Corporate\27. SIte Web\florestan-next\data\legal.js'

# Lecture explicite en UTF-8 : c'est l'omission de ce paramètre qui avait
# corrompu les accents lors de la conversion précédente.
$html = [IO.File]::ReadAllText($srcHtml, [Text.Encoding]::UTF8)

$blocks = [ordered]@{}
foreach ($pair in @(
    @('mentions', 'page-mentions'),
    @('confidentialite', 'page-confidentialite'),
    @('avertissement', 'page-avertissement')
)) {
    $name = $pair[0]; $id = $pair[1]
    $rx = '(?s)id="' + $id + '".*?<div class="legal rv">(.*?)\r?\n\s*</div>\s*\r?\n\s*</div>\s*\r?\n\s*</section>'
    $m = [regex]::Match($html, $rx)
    if (-not $m.Success) { throw "Bloc introuvable : $id" }
    $blocks[$name] = $m.Groups[1].Value.Trim()
}

# --- Mise à jour de l'hébergeur : Wix -> Vercel ---
$nouvelHebergeur = '<p>Raison sociale de l''hébergeur : Vercel Inc.<br>' +
    'Numéro de RCS de l''hébergeur : Non applicable (société de droit américain)<br>' +
    'Adresse de l''hébergeur : 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis<br>' +
    'Site de l''hébergeur : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a><br>' +
    'Contact de l''hébergeur : <a href="https://vercel.com/help" target="_blank" rel="noopener noreferrer">vercel.com/help</a></p>'

$rxHebergeur = "(?s)<p>Raison sociale de l'hébergeur.*?</p>"
if (-not [regex]::IsMatch($blocks['mentions'], $rxHebergeur)) { throw "Bloc hébergeur introuvable dans les mentions légales" }
$blocks['mentions'] = [regex]::Replace($blocks['mentions'], $rxHebergeur, { param($m) $nouvelHebergeur })

# --- Écriture du module ---
function Esc([string]$s) {
    # Échappement pour un template literal JS. On n'échappe que « ${ », pas tous
    # les « $ », afin de ne pas insérer de contre-obliques parasites.
    $s.Replace('\', '\\').Replace('`', '`' + '`') -replace '\$\{', '\$\{'
}

$sb = [Text.StringBuilder]::new()
[void]$sb.AppendLine('// Textes légaux, extraits de l''index.html de référence.')
[void]$sb.AppendLine('// Le corps reste en français (standard réglementaire AMF) ; seul le titre est traduit.')
[void]$sb.AppendLine('// Régénérer via scripts/regen-legal.ps1 en cas de modification de la source.')
[void]$sb.AppendLine('')
foreach ($k in $blocks.Keys) {
    [void]$sb.AppendLine("export const $k = ``" + (Esc $blocks[$k]) + "``")
    [void]$sb.AppendLine('')
}

[IO.File]::WriteAllText($outFile, $sb.ToString(), (New-Object Text.UTF8Encoding($false)))

# --- Contrôles ---
$check = [IO.File]::ReadAllText($outFile, [Text.Encoding]::UTF8)
"taille ecrite            : {0} caracteres" -f $check.Length
"mojibake (Ã / Â)         : {0}" -f ([regex]::Matches($check, 'Ã|Â')).Count
"accents corrects         : {0}" -f ($check -match 'société' -and $check -match 'Hébergement')
"Vercel present           : {0}" -f ($check -match 'Vercel Inc\.')
"Wix residuel             : {0}" -f ($check -match 'Wix')
"exports                  : {0}" -f (([regex]::Matches($check, 'export const (\w+)') | ForEach-Object { $_.Groups[1].Value }) -join ', ')
