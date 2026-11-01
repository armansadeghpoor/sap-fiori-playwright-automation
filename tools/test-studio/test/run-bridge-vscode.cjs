const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { fixture, cleanup } = require('./fixture.cjs');
const { History, hashFile } = require('../regression/history.cjs');
const code = process.argv[2]; if (!code || !path.isAbsolute(code)) throw Error('Pass Code.exe absolute path.');
(async () => {
  const root = fixture(), control = path.join(root, 'bridge-control'); fs.mkdirSync(control);
  const source = path.join(root, 'TestCases', 'فایل فارسی (مشابه).spec.ts');
  fs.writeFileSync(source, ['// synthetic source; never imported', '// test A definition', '// failed assertion', '// test B definition', '// skipped definition', '// end'].join('\n'));
  const tests = ['A', 'B', 'C'].map((id, i) => ({ id, title: 'similar title', titles: ['group ' + id, 'similar title'], file: source, listFile: path.relative(root, source).split(path.sep).join('/'), project: 'Fixture', line: [2, 4, 5][i], column: 1, sourceHash: hashFile(source) }));
  const history = new History(root), run = history.create({ scope: 'fixture', tests }); history.finalize(run, { status: 'failed', complete: true, tests: tests.map((v, i) => ({ ...v, outcome: ['failed', 'passed', 'skipped'][i], attempts: i ? [] : [{ errors: [{ stack: 'Error\n at ' + source + ':3:1' }] }] })) });
  fs.writeFileSync(path.join(control, 'seed.json'), JSON.stringify({ source, tests, runId: run.manifest.id }));
  fs.writeFileSync(path.join(control, 'archive-before.json'), JSON.stringify(['manifest.json', 'summary.json'].map(name => { const file = path.relative(root, path.join(run.folder, name)); return [file, fs.readFileSync(path.join(root, file)).toString('base64')]; })));
  const launch = role => new Promise((resolve, reject) => {
    const env = { ...process.env, STUDIO_BRIDGE_ROLE: role }; delete env.ELECTRON_RUN_AS_NODE;
    const child = spawn(code, ['--new-window', '--disable-workspace-trust', '--skip-welcome', '--skip-release-notes', '--user-data-dir=' + path.join(root, 'profile-' + role), '--extensions-dir=' + path.join(root, 'extensions-' + role), '--extensionDevelopmentPath=' + (process.argv[3] ? path.resolve(process.argv[3]) : path.resolve(__dirname, '..')), '--extensionTestsPath=' + path.join(__dirname, 'bridge-vscode.cjs'), root], { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { output += chunk; }); child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(Error(role + ' Extension Host failed:\n' + output)));
  });
  try { const results = await Promise.allSettled([launch('secondary'), launch('driver')]); for (const result of results) if (result.status === 'rejected') throw result.reason; const result = path.join(control, 'driver-result.json'); if (!fs.existsSync(result)) throw Error('No actual Extension Host result'); console.log(fs.readFileSync(result, 'utf8')); }
  finally { fs.writeFileSync(path.join(control, 'finish'), '1'); try { cleanup(root); } catch { console.error('Retained isolated fixture: ' + root); } }
})().catch(error => { console.error(error); process.exitCode = 1; });
