// Completed lines only: credentials split across stdout chunks cannot escape redaction.
class CliLog {
  constructor(secrets = () => []) { this.secrets = secrets; this.pending = { stdout: '', stderr: '' }; this.dropping = {}; this.text = ''; }
  redact(value) {
    let text = String(value).replace(/\x1b\[[0-?]*[ -/]*[@-~]/gu, '');
    for (const secret of this.secrets()) if (typeof secret === 'string' && secret.length >= 8) text = text.split(secret).join('[REDACTED]');
    return text.replace(/\b(Bearer|Basic)\s+[^\s"',;]+/giu, '$1 [REDACTED]')
      .replace(/((?:password|passwd|pwd|token|secret|authorization|cookie|api[_-]?key|session|csrf)[\w-]*["']?\s*[:=]\s*)[^\r\n]+/giu, '$1[REDACTED]')
      .replace(/(https?:\/\/)[^/\s:@]+:[^/@\s]+@/giu, '$1[REDACTED]@')
      .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/gu, '[REDACTED]')
      .replace(/\b(?:gh[pousr]_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+|[a-f0-9]{64})\b/giu, '[REDACTED]');
  }
  line(value, stream) { this.text = (this.text + `[${stream}] ` + this.redact(value) + '\n').slice(-16000); }
  append(chunk, stream) {
    if (!(stream in this.pending)) throw Error('Invalid CLI stream');
    // Never retain a giant unterminated line, including its suffix.
    const lines = String(chunk).split(/\r\n|\n|\r/u);
    for (let i = 0; i < lines.length; i++) {
      if (!this.dropping[stream]) {
        this.pending[stream] += lines[i];
        if (this.pending[stream].length > 8192) { this.pending[stream] = ''; this.dropping[stream] = true; }
      }
      if (i < lines.length - 1) {
        this.line(this.dropping[stream] ? '[overlong CLI line omitted]' : this.pending[stream], stream);
        this.pending[stream] = ''; this.dropping[stream] = false;
      }
    }
  }
  flush() { for (const stream of ['stdout','stderr']) if (this.pending[stream] || this.dropping[stream]) { this.line(this.dropping[stream] ? '[overlong CLI line omitted]' : this.pending[stream], stream); this.pending[stream] = ''; this.dropping[stream] = false; } }
}
module.exports = { CliLog };
