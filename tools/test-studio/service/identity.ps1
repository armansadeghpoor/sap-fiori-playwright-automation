param([Parameter(Mandatory=$true)][int]$ProcessId)
$ErrorActionPreference='Stop'
$process = [Diagnostics.Process]::GetProcessById($ProcessId)
if (-not $process.MainModule.FileName) { throw 'Cannot verify process executable.' }
@{pid=$process.Id;exe=$process.MainModule.FileName;startTicks=$process.StartTime.ToUniversalTime().Ticks.ToString()} | ConvertTo-Json -Compress
