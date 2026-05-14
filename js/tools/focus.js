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
  var phaseEl   = document.getElementById('timer-phase');
  var startBtn  = document.getElementById('start-btn');
  var pauseBtn  = document.getElementById('pause-btn');
  var resetBtn  = document.getElementById('reset-btn');
  var soundBtn  = document.getElementById('sound-btn');
  var doneMsg   = document.getElementById('done-message');
  var taskEl    = document.getElementById('focus-task');
  var durationEl= document.getElementById('focus-duration');

  function updateDisplay() {
    if (display) {
      display.textContent = formatCountdown(remaining);
      display.className   = 'timer-display' + (remaining === 0 && totalSet > 0 ? ' timer-done' : '');
    }
    if (bar && totalSet > 0) bar.style.width = ((totalSet - remaining) / totalSet * 100) + '%';
    if (phaseEl && taskEl && taskEl.value.trim()) phaseEl.textContent = taskEl.value.trim();
  }

  function tick() {
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(itvId);
      running = false;
      if (startBtn) startBtn.disabled = false;
      if (pauseBtn) pauseBtn.disabled = true;
      if (doneMsg)  { doneMsg.hidden = false; doneMsg.textContent = 'Focus session complete. Take a break.'; }
      if (soundOn)  playDone();
    }
  }

  function start() {
    if (running) return;
    if (remaining === 0) {
      totalSet = (parseInt(durationEl && durationEl.value) || 90) * 60;
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
    if (display) { display.textContent = formatCountdown((parseInt(durationEl && durationEl.value) || 90) * 60); display.className = 'timer-display'; }
    if (bar)    bar.style.width = '0%';
    if (doneMsg) doneMsg.hidden = true;
    if (phaseEl) phaseEl.textContent = '';
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  document.querySelectorAll('[data-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mins = parseInt(btn.dataset.preset) || 90;
      if (durationEl) durationEl.value = mins;
      reset();
    });
  });

  durationEl && durationEl.addEventListener('change', reset);

  startBtn && startBtn.addEventListener('click', start);
  pauseBtn && pauseBtn.addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);
  soundBtn && soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔔 Sound On' : '🔕 Sound Off';
  });

  if (pauseBtn) pauseBtn.disabled = true;
  var initMins = parseInt(durationEl && durationEl.value) || 90;
  if (display) display.textContent = formatCountdown(initMins * 60);
})();
