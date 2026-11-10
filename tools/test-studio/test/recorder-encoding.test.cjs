const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const studio = path.resolve(__dirname, '..');
// Unicode escapes keep expectations independent of the editor/shell encoding.
const formTitle = '\u0633\u0627\u062e\u062a \u062a\u0633\u062a \u062c\u062f\u06cc\u062f';
const heading = '\u0627\u0632 \u0627\u06cc\u062f\u0647 \u062a\u0627 \u0636\u0628\u0637 \u062a\u0633\u062a';
const utf8 = bytes => new TextDecoder('utf-8', {fatal:true}).decode(bytes);
function checkManifest(bytes) {
  const manifest = JSON.parse(utf8(bytes));
  const view = manifest.contributes.views.playwrightTestStudio.find(v => v.id === 'playwrightTestStudio.form');
  assert.equal(view.name, formTitle, 'VS Code view title is the original Persian string');
}
function checkHtml(bytes) {
  const html = utf8(bytes);
  assert.match(html, /<meta charset="UTF-8">/);
  assert.ok(html.includes('<h1>' + heading + '</h1>'));
  assert.ok(html.includes('PLAYWRIGHT TEST STUDIO'));
  assert.equal(html.includes('\uFFFD'), false, 'no Unicode replacement character');
}
test('Recorder view metadata and HTML retain exact Persian and English text', () => {
  checkManifest(fs.readFileSync(path.join(studio, 'package.json')));
  checkHtml(fs.readFileSync(path.join(studio, 'media/studio.html')));
});
test('actual VSIX packaging preserves UTF-8 metadata and Recorder HTML bytes', {skip:process.platform !== 'win32'}, () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-encoding-'));
  try {
    const powershell = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32/WindowsPowerShell/v1.0/powershell.exe');
    execFileSync(powershell, ['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',path.join(studio,'package.ps1'),'-OutputDirectory',output], {windowsHide:true,timeout:30000,stdio:'pipe'});
    const version = JSON.parse(fs.readFileSync(path.join(studio,'package.json'),'utf8')).version;
    const reader = path.join(output,'read.ps1');
    fs.writeFileSync(reader, `param([string]$Archive)
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead($Archive)
try {
  $result = @{}
  foreach ($name in @('package.json','media/studio.html')) {
    $stream = $zip.GetEntry('extension/' + $name).Open()
    $buffer = [IO.MemoryStream]::new()
    try { $stream.CopyTo($buffer); $result[$name] = [Convert]::ToBase64String($buffer.ToArray()) } finally { $buffer.Dispose(); $stream.Dispose() }
  }
  $result | ConvertTo-Json -Compress
} finally { $zip.Dispose() }
`, 'utf8');
    const encoded = JSON.parse(execFileSync(powershell, ['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',reader,'-Archive',path.join(output,'playwright-test-studio-'+version+'.vsix')], {windowsHide:true,encoding:'utf8',timeout:30000}).replace(/^\uFEFF/,''));
    const manifest = Buffer.from(encoded['package.json'],'base64'), html = Buffer.from(encoded['media/studio.html'],'base64');
    checkManifest(manifest); checkHtml(html);
    assert.deepEqual(manifest,fs.readFileSync(path.join(studio,'package.json')));
    assert.deepEqual(html,fs.readFileSync(path.join(studio,'media/studio.html')));
  } finally {
    const real = fs.realpathSync(output);
    assert.equal(path.dirname(real), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(real).startsWith('studio-encoding-'));
    fs.rmSync(real, {recursive:true});
  }
});
