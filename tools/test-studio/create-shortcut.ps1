param([Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference='Stop'
$target = [IO.Path]::GetFullPath($Destination)
if ([IO.Path]::GetExtension($target) -ne '.lnk') { throw 'Destination must be an explicit .lnk path.' }
if (Test-Path -LiteralPath $target) { throw 'Shortcut already exists; it was not overwritten.' }
if (-not (Test-Path -LiteralPath ([IO.Path]::GetDirectoryName($target)))) { throw 'Destination folder does not exist.' }
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($target)
$shortcut.TargetPath = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$shortcut.Arguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + (Join-Path $PSScriptRoot 'launch.ps1') + '"'
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.Description = 'Open Playwright Test Studio'
$shortcut.Save()
Write-Output $target
