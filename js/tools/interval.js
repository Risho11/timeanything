(function () {
  'use strict';

  var WORK  = 'Work';
  var REST  = 'Rest';
  var PREP  = 'Get Ready';

  var phase     = PREP;
  var phaseIdx  = -1;
  var setsDone  = 0;
  var remaining = 3;
  var running   = false;
  var startTime = null;
  var startRem  = 0;
  var itvId     = null;
  var soundOn   = true;
  var totalSets = 0;
  var schedule  = [];

  var display   = document.getElementById('timer-display');
  var phaseEl   = document.getElementById('timer-phase');
  var bar       = document.getElementById('progress-bar');
  var setsEl    = document.getElementById('sets-done');
  var startBtn  = document.getElementById('start-btn');
  var pauseBtn  = document.getElementById('pause-btn');
  var resetBtn  = document.getElementById('reset-btn');
  var workEl    = document.getElementById('itv-work');
  var restEl    = document.getElementById('itv-rest');
  var setsInput = document.getElementById('itv-sets');
  var prepEl    = document.getElementById('itv-prep');
  var soundBtn  = document.getElementById('sound-btn');

  function buildSchedule() {
    var workSec = parseInt(workEl && workEl.value) || 20;
    var restSec = parseInt(restEl && restEl.value) || 10;
    var sets    = parseInt(setsInput && setsInput.value) || 8;
    var prepSec = parseInt(prepEl && prepEl.value) || 3;
    totalSets = sets;
    schedule  = [{ phase: PREP, dur: prepSec }];
    for (var i = 0; i < sets; i++) {
      schedule.push({ phase: WORK, dur: workSec, set: i + 1 });
      if (i < sets - 1) schedule.push({ phase: REST, dur: restSec });
    }
    schedule.push({ phase: 'Done!', dur: 0 });
  }

  function updateDisplay() {
    if (display) {
      display.textContent = formatCountdown(remaining);
      display.className = 'timer-display' + (phase === WORK ? '' : ' timer-break');
    }
    if (phaseEl) phaseEl.textContent = phase + (schedule[phaseIdx] && schedule[phaseIdx].set ? ' — Set ' + schedule[phaseIdx].set + '/' + totalSets : '');
    var dur = schedule[phaseIdx] ? schedule[phaseIdx].dur : 1;
    if (bar && dur > 0) bar.style.width = ((dur - remaining) / dur * 100) + '%';
    if (setsEl) setsEl.textContent = setsDone + '/' + totalSets + ' sets';
  }

  function nextPhase() {
    phaseIdx++;
    if (phaseIdx >= schedule.length - 1) {
      clearInterval(itvId);
      running = false;
      phase = 'Done!';
      remaining = 0;
      if (display) { display.textContent = 'Done!'; display.className = 'timer-display timer-break'; }
      if (phaseEl) phaseEl.textContent = 'Workout complete';
      if (startBtn) startBtn.disabled = false;
      if (pauseBtn) pauseBtn.disabled = true;
      if (soundOn) playDone();
      return;
    }
    var cur = schedule[phaseIdx];
    phase     = cur.phase;
    remaining = cur.dur;
    startRem  = remaining;
    startTime = Date.now();
    if (cur.phase === WORK) setsDone = cur.set;
    if (soundOn && phaseIdx > 0) playBeep(phase === WORK ? 1100 : 660, 0.3);
    updateDisplay();
  }

  function tick() {
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    updateDisplay();
    if (remaining <= 0) {
      nextPhase();
    }
  }

  function start() {
    if (running) return;
    if (phaseIdx < 0) { buildSchedule(); setsDone = 0; phaseIdx = -1; nextPhase(); }
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
    remaining = Math.max(0, startRem - Math.floor((Date.now() - startTime) / 1000));
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  function reset() {
    clearInterval(itvId);
    running = false; phaseIdx = -1; setsDone = 0; remaining = 0;
    buildSchedule();
    phase = PREP;
    remaining = schedule[0] ? schedule[0].dur : 3;
    if (display) { display.textContent = formatCountdown(remaining); display.className = 'timer-display'; }
    if (phaseEl) phaseEl.textContent = '';
    if (bar)    bar.style.width = '0%';
    if (setsEl) setsEl.textContent = '0/' + totalSets + ' sets';
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  startBtn && startBtn.addEventListener('click', start);
  pauseBtn && pauseBtn.addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);
  soundBtn && soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔔 Sound On' : '🔕 Sound Off';
  });

  if (pauseBtn) pauseBtn.disabled = true;
  buildSchedule();
  if (display) display.textContent = formatCountdown(schedule[0] ? schedule[0].dur : 3);
  if (setsEl)  setsEl.textContent = '0/' + totalSets + ' sets';
})();
