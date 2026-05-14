(function () {
  'use strict';

  var itvId   = null;
  var targetEl = document.getElementById('cd-target');
  var labelEl  = document.getElementById('cd-label');
  var startBtn = document.getElementById('start-btn');
  var stopBtn  = document.getElementById('stop-btn');
  var daysEl   = document.getElementById('cd-days');
  var hoursEl  = document.getElementById('cd-hours-val');
  var minsEl   = document.getElementById('cd-mins-val');
  var secsEl   = document.getElementById('cd-secs-val');
  var titleEl  = document.getElementById('cd-event-title');
  var messageEl= document.getElementById('cd-message');
  var gridEl   = document.getElementById('countdown-grid');

  function update() {
    if (!targetEl || !targetEl.value) return;
    var target = new Date(targetEl.value).getTime();
    var now    = Date.now();
    var diff   = target - now;

    if (diff <= 0) {
      clearInterval(itvId);
      if (daysEl)  daysEl.textContent  = '0';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl)  minsEl.textContent  = '00';
      if (secsEl)  secsEl.textContent  = '00';
      if (messageEl) {
        messageEl.hidden = false;
        messageEl.textContent = (labelEl && labelEl.value ? labelEl.value : 'The event') + ' has arrived!';
      }
      if (gridEl) gridEl.hidden = true;
      return;
    }

    var totalSec = Math.floor(diff / 1000);
    var d = Math.floor(totalSec / 86400);
    var h = Math.floor((totalSec % 86400) / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var pad = function (n) { return String(n).padStart(2, '0'); };

    if (daysEl)  daysEl.textContent  = d;
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl)  minsEl.textContent  = pad(m);
    if (secsEl)  secsEl.textContent  = pad(s);
    if (titleEl && labelEl) titleEl.textContent = labelEl.value || 'Countdown';
    if (messageEl) messageEl.hidden = true;
    if (gridEl)   gridEl.hidden = false;
  }

  function start() {
    if (!targetEl || !targetEl.value) return;
    clearInterval(itvId);
    update();
    itvId = setInterval(update, 1000);
    if (startBtn) startBtn.disabled = true;
    if (stopBtn)  stopBtn.disabled  = false;
  }

  function stop() {
    clearInterval(itvId);
    if (startBtn) startBtn.disabled = false;
    if (stopBtn)  stopBtn.disabled  = true;
  }

  startBtn && startBtn.addEventListener('click', start);
  stopBtn  && stopBtn.addEventListener('click', stop);
  if (stopBtn) stopBtn.disabled = true;
  if (gridEl)  gridEl.hidden    = true;

  // Set default target to 30 days from now
  if (targetEl && !targetEl.value) {
    var d = new Date(Date.now() + 30 * 86400 * 1000);
    targetEl.value = d.toISOString().slice(0, 16);
  }
})();
