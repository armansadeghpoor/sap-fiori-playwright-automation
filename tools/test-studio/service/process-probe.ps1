param([Parameter(Mandatory=$true)][int]$ProcessId,[int]$Port=0)
$ErrorActionPreference='Stop'
$state = @{state='unknown'}
try {
 $process = [Diagnostics.Process]::GetProcessById($ProcessId)
 try {
  $state = @{state='alive';pid=$process.Id;exe=$process.MainModule.FileName;startTicks=$process.StartTime.ToUniversalTime().Ticks.ToString()}
  if (-not $state.exe) { $state = @{state='unknown'} }
 } catch { $state = @{state='unknown'} }
} catch [ArgumentException] { $state = @{state='absent'} } catch { $state = @{state='unknown'} }
$endpoint = 'unknown'
if ($Port -eq 0) { $endpoint='unassigned' }
elseif ($Port -gt 0 -and $Port -le 65535) {
 try {
  $found = @([Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners() | Where-Object { $_.Port -eq $Port })
  if ($found.Count -eq 0) { $endpoint='free' } else { $endpoint='listening' }
 } catch { $endpoint='unknown' }
}
@{process=$state;endpoint=$endpoint} | ConvertTo-Json -Depth 4 -Compress
