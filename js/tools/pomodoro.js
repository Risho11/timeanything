(function () {
  'use strict';

  var PHASES = { work: 'Work', short: 'Short Break', long: 'Long Break' };
  var workMins  = 25, shortMins = 5, longMins = 15, sessionsPerLong = 4;
  var phase     = 'work';
  var session   = 0;
  var totalSec  = workMins * 60;
  var remaining = totalSec;
  var running   = false;
  var startTime = null;
  var startRem  = remaining;
  var itvId     = null;
  var soundOn   = true;

  var display    = document.getElementById('timer-display');
  var phaseEl    = document.getElementById('timer-phase');
  var bar        = document.getElementById('progress-bar');
  var dotsEl     = document.getElementById('session-dots');
  var sessionEl  = document.getElementById('session-info');
  var startBtn   = document.getElementById('start-btn');
  var pauseBtn   = document.getElementById('pause-btn');
  var resetBtn   = document.getElementById('reset-btn');
  var skipBtn    = document.getElementById('skip-btn');
  var soundBtn   = document.getElementById('sound-btn');
  var workEl     = document.getElementById('pomo-work');
  var shortEl    = document.getElementById('pomo-short');
  var longEl     = document.getElementById('pomo-long');
  var perLongEl  = document.getElementById('pomo-perlong');

  function phaseDuration() {
    if (phase === 'work')  return (parseInt(workEl && workEl.value) || workMins) * 60;
    if (phase === 'short') return (parseInt(shortEl && shortEl.value) || shortMins) * 60;
    return (parseInt(longEl && longEl.value) || longMins) * 60;
  }

  function updateDots() {
    if (!dotsEl) return;
    var per = parseInt(perLongEl && perLongEl.value) || sessionsPerLong;
    dotsEl.innerHTML = '';
    for (var i = 0; i < per; i++) {
      var d = document.createElement('span');
      d.className = 'session-dot' + (i < session % per ? ' done' : '');
      dotsEl.appendChild(d);
    }
    if (sessionEl) sessionEl.textContent = 'Session ' + (session + 1);
  }

  function updateDisplay() {
    if (display) {
      display.textContent = formatCountdown(remaining);
      display.className = 'timer-display' + (phase === 'work' ? '' : ' timer-break');
    }
    if (phaseEl) phaseEl.textContent = PHASES[phase] || '';
    var total = phaseDuration();
    if (bar) bar.style.width = (total > 0 ? ((total - remaining) / total * 100) : 0) + '%';
  }

  function nextPhase() {
    var per = parseInt(perLongEl && perLongEl.value) || sessionsPerLong;
    if (phase === 'work') {
      session++;
      phase = (session % per === 0) ? 'long' : 'short';
    } else {
      phase = 'work';
    }
    remaining = phaseDuration();
    totalSec  = remaining;
    updateDisplay();
    updateDots();
    if (soundOn) playDone();
  }

  function tick() {
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(itvId);
      running = false;
      if (startBtn) startBtn.disabled = false;
      if (pauseBtn) pauseBtn.disabled = true;
      setTimeout(nextPhase, 500);
    }
  }

  function start() {
    if (running) return;
    running = true;
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
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  function reset() {
    clearInterval(itvId);
    running   = false;
    phase     = 'work';
    session   = 0;
    remaining = phaseDuration();
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    updateDisplay();
    updateDots();
  }

  function skip() {
    clearInterval(itvId);
    running = false;
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    remaining = 0;
    nextPhase();
  }

  startBtn && startBtn.addEventListener('click', start);
  pauseBtn && pauseBtn.addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);
  skipBtn  && skipBtn.addEventListener('click', skip);
  soundBtn && soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔔 Sound On' : '🔕 Sound Off';
  });

  if (pauseBtn) pauseBtn.disabled = true;
  updateDisplay();
  updateDots();
})();
