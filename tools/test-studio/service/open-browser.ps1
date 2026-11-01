param([Parameter(Mandatory=$true)][string]$Url)
$ErrorActionPreference='Stop'
try {
 $uri = [Uri]::new($Url)
 if ($uri.Scheme -ne 'http' -or $uri.Host -ne '127.0.0.1' -or $uri.Port -lt 1 -or $uri.AbsolutePath -ne '/' -or $uri.Query -or $uri.Fragment -notmatch '^#bootstrap=[a-f0-9]{64}$') { throw 'Invalid local browser handoff.' }
 $info = [Diagnostics.ProcessStartInfo]::new()
 $info.FileName = $Url
 $info.UseShellExecute = $true
 $info.Verb = 'open'
 $info.WindowStyle = [Diagnostics.ProcessWindowStyle]::Normal
 $browser = [Diagnostics.Process]::Start($info)
 if ($browser) { $browser.Dispose() }
} catch { exit 1 }
