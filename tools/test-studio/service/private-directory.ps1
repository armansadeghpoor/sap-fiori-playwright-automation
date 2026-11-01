param([Parameter(Mandatory=$true)][string]$Directory)
$ErrorActionPreference='Stop'
$full = [IO.Path]::GetFullPath($Directory)
[IO.Directory]::CreateDirectory($full) | Out-Null
if (([IO.DirectoryInfo]::new($full)).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Private directory cannot be a reparse point.' }
$user = [Security.Principal.WindowsIdentity]::GetCurrent().User
$system = [Security.Principal.SecurityIdentifier]::new('S-1-5-18')
$acl = [Security.AccessControl.DirectorySecurity]::new()
$acl.SetOwner($user)
$acl.SetAccessRuleProtection($true,$false)
foreach ($sid in @($user,$system)) {
 $rule = [Security.AccessControl.FileSystemAccessRule]::new($sid,'FullControl','ContainerInherit,ObjectInherit','None','Allow')
 $acl.AddAccessRule($rule)
}
([IO.DirectoryInfo]::new($full)).SetAccessControl($acl)
$verified = ([IO.DirectoryInfo]::new($full)).GetAccessControl()
if (-not $verified.AreAccessRulesProtected) { throw 'Private directory ACL verification failed.' }
foreach ($rule in $verified.Access) {
 $sid = $rule.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value
 if ($sid -notin @($user.Value,$system.Value) -or $rule.AccessControlType -ne 'Allow') { throw 'Unexpected private directory access rule.' }
}
