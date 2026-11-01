const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { within } = require('./history.cjs');

function safeSpec(root, filename) {
  root = fs.realpathSync(root);
  const base = path.join(root, 'TestCases');
  if (typeof filename !== 'string' || !path.isAbsolute(filename) || !/\.spec\.ts$/iu.test(filename) ||
      !within(base, filename) || path.relative(base, filename).includes(':')) throw Error('مسیر Spec خارج از TestCases یا نامعتبر است.');
  let current = root;
  for (const part of path.relative(root, filename).split(path.sep)) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw Error('Symlink/Junction در مسیر Source مجاز نیست.');
  }
  const real = fs.realpathSync(filename), stat = fs.statSync(real);
  if (!within(fs.realpathSync(base), real) || !stat.isFile() || stat.size > 1024 * 1024) throw Error('Spec موجود یا مجاز نیست.');
  return real;
}

// Shared by source preview, the existing Extension view and the native bridge.
function location(test, result, content, real = test.file) {
  const lines = content.split(/\r?\n/u);
  const valid = line => Number.isSafeInteger(line) && line > 0 && line <= lines.length;
  const same = file => typeof file === 'string' && path.isAbsolute(file) &&
    (path.relative(test.file, file) === '' || path.relative(real, file) === '');
  let target;
  if (result?.outcome === 'failed') for (const error of result.attempts?.at(-1)?.errors || []) {
    if (typeof error.location?.file === 'string' && path.isAbsolute(error.location.file)) {
      if (same(error.location.file) && valid(error.location.line)) target = error.location;
      break;
    }
    const stack = String(error.stack || '').replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, '');
    const match = stack.split(/\r?\n/u).map(frame => frame.match(/(?:^|\s|\()((?:[A-Za-z]:[\\/]|\/)[^\r\n]*):(\d+):(\d+)\)?\s*$/u)).find(Boolean);
    if (match) { if (same(match[1]) && valid(Number(match[2]))) target = { line: Number(match[2]), column: Number(match[3]) }; break; }
  }
  const historicalLine = target?.line || test.line, validLine = valid(historicalLine), line = validLine ? historicalLine : 1;
  const column = Math.min(lines[line - 1].length + 1, Math.max(1, validLine && Number.isSafeInteger(target?.column ?? test.column) ? (target?.column ?? test.column) : 1));
  return { line, column, historicalLine, validLine, kind: target ? 'failure' : 'definition' };
}
const digest = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
module.exports = { safeSpec, location, digest };
