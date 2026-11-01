$ErrorActionPreference='Stop'
try {
 $node = (Get-Command node.exe -ErrorAction Stop).Source
 $result = & $node (Join-Path $PSScriptRoot 'service\launcher.cjs') 2>&1
 if ($LASTEXITCODE -ne 0) { throw ($result -join [Environment]::NewLine) }
} catch {
 Add-Type -AssemblyName PresentationFramework
 [System.Windows.MessageBox]::Show("Playwright Test Studio could not open.`n`n$($_.Exception.Message)`n`nNo unknown process was stopped and no descriptor was removed.",'Playwright Test Studio','OK','Error') | Out-Null
 exit 1
}
