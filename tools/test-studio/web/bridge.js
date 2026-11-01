(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let api, write, reading = false, busy = false, chosen = '', status = { windows: [] };
  function render() {
    const select = $('bridge-window'); select.replaceChildren();
    const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = status.windows.length > 1 ? 'پنجرهٔ مقصد را انتخاب کنید' : 'پنجرهٔ VS Code'; select.append(placeholder);
    for (const window of status.windows) { const option = document.createElement('option'); option.value = window.windowId; option.textContent = window.label; select.append(option); }
    if (chosen && !status.windows.some(w => w.windowId === chosen)) {
      const absent = document.createElement('option'); absent.value = chosen; absent.textContent = 'پنجرهٔ انتخاب‌شده قطع شده است'; select.append(absent);
    }
    if (!chosen && status.windows.length === 1) chosen = status.windows[0].windowId;
    select.value = chosen; select.disabled = busy || !status.windows.length;
    $('bridge-status').textContent = status.message || '';
    $('bridge-status').dataset.state = status.connected ? 'connected' : 'disconnected';
  }
  async function refresh() {
    if (!api || reading) return; reading = true;
    try { status = await api('/api/bridge'); render(); }
    catch { status = { connected: false, windows: [], message: 'اتصال Bridge تأیید نشد؛ Source Preview مستقل باقی است.' }; render(); }
    finally { reading = false; }
  }
  $('bridge-window').onchange = () => { chosen = $('bridge-window').value; $('bridge-result').textContent = ''; };
  $('bridge-refresh').onclick = () => void refresh();
  async function open(selection) {
    if (busy || !write) return; busy = true; $('bridge-result').textContent = 'در حال بازکردن کد…';
    try {
      if (!chosen && status.windows.length > 1) throw Error('چند پنجرهٔ VS Code متصل است؛ مقصد را از بالای Dashboard انتخاب کنید.');
      const result = await write('/api/bridge/open', { windowId: chosen || null, selection });
      $('bridge-result').textContent = `${result.message} · خط ${result.line} · #${result.windowId.slice(0, 6)}`;
    } catch (e) { $('bridge-result').textContent = e.message + ' Source Preview داخل Dashboard قابل استفاده است.'; void refresh(); }
    finally { busy = false; $('bridge-window').disabled = !status.windows.length; }
  }
  window.StudioBridge = { open, async connect(read, mutate) { const first = !api; api = read; write = mutate; if (first) await refresh(); } };
  setInterval(() => void refresh(), 5000);
})();
