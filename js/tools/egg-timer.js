(function () {
  'use strict';

  var remaining = 0;
  var running   = false;
  var startTime = null;
  var startRem  = 0;
  var itvId     = null;
  var soundOn   = true;
  var totalSet  = 0;

  var display   = document.getElementById('timer-display');
  var bar       = document.getElementById('progress-bar');
  var startBtn  = document.getElementById('start-btn');
  var pauseBtn  = document.getElementById('pause-btn');
  var resetBtn  = document.getElementById('reset-btn');
  var soundBtn  = document.getElementById('sound-btn');
  var doneMsg   = document.getElementById('done-message');
  var minsEl    = document.getElementById('egg-mins');
  var secsEl    = document.getElementById('egg-secs');

  function updateDisplay() {
    if (display) {
      display.textContent = formatCountdown(remaining);
      display.className = 'timer-display' + (remaining === 0 && totalSet > 0 ? ' timer-done' : '');
    }
    if (bar && totalSet > 0) bar.style.width = ((totalSet - remaining) / totalSet * 100) + '%';
  }

  function tick() {
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(itvId);
      running = false;
      if (startBtn) startBtn.disabled = false;
      if (pauseBtn) pauseBtn.disabled = true;
      if (doneMsg)  { doneMsg.hidden = false; }
      if (soundOn)  playDone();
    }
  }

  function getSeconds() {
    var m = parseInt(minsEl && minsEl.value) || 0;
    var s = parseInt(secsEl && secsEl.value) || 0;
    return m * 60 + s;
  }

  function start() {
    if (running) return;
    if (remaining === 0) {
      totalSet = getSeconds();
      if (totalSet === 0) return;
      remaining = totalSet;
    }
    if (doneMsg) doneMsg.hidden = true;
    running   = true;
    startRem  = remaining;
    startTime = Date.now();
    itvId = setInterval(tick, 250);
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
  }

  function pause() {
    if (!running) return;
    clearInterval(itvId);
    running = false;
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  function reset() {
    clearInterval(itvId);
    running = false; remaining = 0; totalSet = 0;
    if (display) { display.textContent = '00:00'; display.className = 'timer-display'; }
    if (bar)    bar.style.width = '0%';
    if (doneMsg) doneMsg.hidden = true;
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (minsEl)  minsEl.value = 0;
    if (secsEl)  secsEl.value = 0;
  }

  document.querySelectorAll('[data-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var secs = parseInt(btn.dataset.preset) || 0;
      reset();
      if (minsEl) minsEl.value = Math.floor(secs / 60);
      if (secsEl) secsEl.value = secs % 60;
      totalSet = secs;
      remaining = secs;
      updateDisplay();
    });
  });

  startBtn && startBtn.addEventListener('click', start);
  pauseBtn && pauseBtn.addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);
  soundBtn && soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔔 Sound On' : '🔕 Sound Off';
  });

  if (pauseBtn) pauseBtn.disabled = true;
  updateDisplay();
})();
