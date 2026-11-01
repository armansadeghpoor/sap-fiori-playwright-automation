const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const native = require('../service/native.cjs');
const { within } = require('../regression/history.cjs');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
const directory = root => path.join(native.privatePath(root), 'bridges');
const equal = (a, b) => { const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || '')); return x.length === y.length && crypto.timingSafeEqual(x, y); };
function read(root, file) {
  native.noLinks(path.dirname(file));
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || !stat.ino || stat.size > 8192) throw Error('Invalid bridge registration');
  const bytes = fs.readFileSync(file);
  const v = JSON.parse(bytes);
  if (Object.keys(v).sort().join(',') !== 'identity,label,pid,port,projectKey,protocolVersion,token,windowId' ||
      v.protocolVersion !== 1 || v.projectKey !== native.key(root) || !uuid.test(v.windowId) || path.basename(file) !== v.windowId + '.json' ||
      !Number.isSafeInteger(v.pid) || v.pid < 1 || !Number.isInteger(v.port) || v.port < 1 || v.port > 65535 ||
      !/^[0-9a-f]{64}$/u.test(v.token) || typeof v.label !== 'string' || v.label.length > 256 ||
      v.identity?.pid !== v.pid || typeof v.identity.exe !== 'string' || !/^\d{15,20}$/u.test(v.identity.startTicks)) throw Error('Invalid bridge registration');
  const after = fs.lstatSync(file);
  if (after.ino !== stat.ino || after.mtimeMs !== stat.mtimeMs || after.size !== stat.size || !within(path.dirname(file), fs.realpathSync(file))) throw Error('Bridge registration changed');
  return v;
}
function records(root, folder = directory(root)) {
  native.noLinks(folder);
  if (!fs.existsSync(folder)) return [];
  return fs.readdirSync(folder).filter(name => uuid.test(name.slice(0, -5)) && name.endsWith('.json')).slice(0, 64)
    .flatMap(name => { try { return [read(root, path.join(folder, name))]; } catch { return []; } });
}
function identity(pid) {
  return new Promise((resolve, reject) => execFile(path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe'),
    ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', path.join(__dirname, '..', 'service', 'identity.ps1'), '-ProcessId', String(pid)],
    { encoding: 'utf8', windowsHide: true, timeout: 5000 }, (error, output) => { if (error) { reject(Error('Bridge process identity unavailable')); return; } try { resolve(JSON.parse(output.replace(/^\uFEFF/u, ''))); } catch { reject(Error('Invalid Bridge identity')); } }));
}
module.exports = { directory, records, read, equal, uuid, identity };
