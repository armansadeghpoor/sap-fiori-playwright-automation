param([string]$OutputDirectory = $PSScriptRoot)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
$manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'package.json') -Raw | ConvertFrom-Json
$outputFolder = [IO.Path]::GetFullPath($OutputDirectory)
[IO.Directory]::CreateDirectory($outputFolder) | Out-Null
$outputFile = Join-Path $outputFolder ("playwright-test-studio-{0}.vsix" -f $manifest.version)
$files = @('package.json', 'extension.cjs', 'studio.cjs', 'README.md', 'media/studio.svg', 'media/studio.html', 'media/studio.css', 'media/studio.js')
foreach ($file in $files) {
  if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot $file) -PathType Leaf)) { throw "Missing package file: $file" }
}
$vsixManifest = @"
<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="$($manifest.name)" Version="$($manifest.version)" Publisher="$($manifest.publisher)" />
    <DisplayName>Playwright Test Studio</DisplayName>
    <Description xml:space="preserve">Local sidebar for the project's existing test generator and recorder.</Description>
    <Categories>Testing</Categories>
    <Properties><Property Id="Microsoft.VisualStudio.Code.Engine" Value="$($manifest.engines.vscode)" /><Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true" /></Properties>
  </Metadata>
  <Installation><InstallationTarget Id="Microsoft.VisualStudio.Code" /></Installation>
  <Dependencies />
  <Assets><Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" /><Asset Type="Microsoft.VisualStudio.Services.Content.Details" Path="extension/README.md" Addressable="true" /></Assets>
</PackageManifest>
"@
$contentTypes = @'
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" /><Default Extension="cjs" ContentType="application/javascript" />
  <Default Extension="js" ContentType="application/javascript" /><Default Extension="css" ContentType="text/css" />
  <Default Extension="html" ContentType="text/html" /><Default Extension="svg" ContentType="image/svg+xml" />
  <Default Extension="md" ContentType="text/markdown" /><Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>
'@
$stream = [IO.File]::Open($outputFile, [IO.FileMode]::Create)
$archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($file in $files) {
    $entry = $archive.CreateEntry('extension/' + $file)
    $destination = $entry.Open()
    $source = [IO.File]::OpenRead((Join-Path $PSScriptRoot $file))
    try { $source.CopyTo($destination) } finally { $source.Dispose(); $destination.Dispose() }
  }
  foreach ($item in @(@{ Name='extension.vsixmanifest'; Text=$vsixManifest }, @{ Name='[Content_Types].xml'; Text=$contentTypes })) {
    $writer = [IO.StreamWriter]::new($archive.CreateEntry($item.Name).Open(), [Text.UTF8Encoding]::new($false))
    try { $writer.Write($item.Text) } finally { $writer.Dispose() }
  }
} finally { $archive.Dispose(); $stream.Dispose() }
Write-Output $outputFile
