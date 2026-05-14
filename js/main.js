/* TimeAnything — Shared JS */

(function () {
  'use strict';
  var toggle  = document.querySelector('.sidebar-toggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
  }
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(function (a) {
    if (a.getAttribute('href') === page) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });
  document.querySelectorAll('.advanced-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls') || 'adv-panel');
      if (!panel) return;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });
})();

function padTwo(n) { return String(Math.floor(n)).padStart(2, '0'); }
function formatMs(ms, showMs) {
  var totalSec = Math.floor(ms / 1000), h = Math.floor(totalSec / 3600), m = Math.floor((totalSec % 3600) / 60), s = totalSec % 60;
  var base = (h > 0 ? padTwo(h) + ':' : '') + padTwo(m) + ':' + padTwo(s);
  if (showMs) base += '.' + String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return base;
}
function formatCountdown(totalSec) {
  if (totalSec < 0) totalSec = 0;
  var h = Math.floor(totalSec / 3600), m = Math.floor((totalSec % 3600) / 60), s = totalSec % 60;
  if (h > 0) return padTwo(h) + ':' + padTwo(m) + ':' + padTwo(s);
  return padTwo(m) + ':' + padTwo(s);
}
function playBeep(freq, duration, vol) {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine'; osc.frequency.value = freq || 880;
    gain.gain.setValueAtTime(vol || 0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.6));
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + (duration || 0.6));
  } catch (e) {}
}
function playDone() { playBeep(880, 0.3, 0.4); setTimeout(function () { playBeep(1100, 0.4, 0.35); }, 350); }
