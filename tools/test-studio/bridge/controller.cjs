const path = require('node:path');
const { BridgeHost } = require('./host.cjs');
class BridgeController {
  constructor(vscode, root) {
    this.vscode = vscode; this.root = root; this.ready = Promise.resolve(); this.closed = false;
    this.status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10);
    this.status.command = 'playwrightTestStudio.bridge.status';
    this.status.show();
  }
  refresh() {
    this.ready = this.ready.then(async () => {
      await this.host?.close(); this.host = null;
      if (this.closed) return;
      this.status.text = '$(plug) Studio Bridge…';
      let host;
      try {
        const root = this.root(); host = new BridgeHost(this.vscode, this.root); await host.start();
        if (this.closed) { await host.close(); return; }
        this.host = host;
        this.status.text = '$(plug) Studio Bridge #' + host.windowId.slice(0, 6);
        this.status.tooltip = path.basename(root) + '\nWindow: ' + host.windowId + '\nDashboard → VS Code (source, editor safety, report/trace)';
      } catch {
        await host?.close(); this.status.text = '$(debug-disconnect) Studio Bridge unavailable';
        this.status.tooltip = 'Open one trusted compatible project in this window, then use Studio Bridge: Reconnect.';
      }
    });
    return this.ready;
  }
  async describe() {
    await this.ready;
    await this.vscode.window.showInformationMessage(this.host ? `${this.host.root}\nStudio Bridge window #${this.host.windowId.slice(0, 6)} (${this.host.windowId})` : 'Bridge در دسترس نیست؛ یک پروژهٔ سازگار و Trusted را باز کنید و Reconnect بزنید.');
  }
  async close() { this.closed = true; await this.ready; await this.host?.close(); this.status.dispose(); }
}
module.exports = { BridgeController };
