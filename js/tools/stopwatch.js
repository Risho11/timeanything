(function () {
  'use strict';

  var running   = false;
  var startTime = null;
  var elapsed   = 0;
  var itvId     = null;
  var lapBase   = 0;
  var lapCount  = 0;

  var display   = document.getElementById('timer-display');
  var startBtn  = document.getElementById('start-btn');
  var pauseBtn  = document.getElementById('pause-btn');
  var resetBtn  = document.getElementById('reset-btn');
  var lapBtn    = document.getElementById('lap-btn');
  var lapList   = document.getElementById('lap-list');
  var lapSec    = document.getElementById('lap-section');

  function tick() {
    elapsed = Date.now() - startTime;
    if (display) display.textContent = formatMs(elapsed, true);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = Date.now() - elapsed;
    itvId = setInterval(tick, 50);
    if (startBtn) startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    if (lapBtn)   lapBtn.disabled   = false;
  }

  function pause() {
    if (!running) return;
    clearInterval(itvId);
    elapsed = Date.now() - startTime;
    running = false;
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
  }

  function reset() {
    clearInterval(itvId);
    running = false;
    elapsed = 0;
    lapBase = 0;
    lapCount = 0;
    if (display) display.textContent = '00:00.00';
    if (startBtn) startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    if (lapBtn)   lapBtn.disabled   = true;
    if (lapList)  lapList.innerHTML = '';
    if (lapSec)   lapSec.hidden = true;
  }

  function lap() {
    if (!running) return;
    lapCount++;
    var lapTime = elapsed - lapBase;
    lapBase = elapsed;
    if (lapList && lapSec) {
      lapSec.hidden = false;
      var li = document.createElement('li');
      li.innerHTML = '<span>Lap ' + lapCount + '</span><span class="lap-time">' + formatMs(lapTime, true) + '</span>';
      lapList.insertBefore(li, lapList.firstChild);
    }
  }

  startBtn && startBtn.addEventListener('click', start);
  pauseBtn && pauseBtn.addEventListener('click', pause);
  resetBtn && resetBtn.addEventListener('click', reset);
  lapBtn   && lapBtn.addEventListener('click', lap);

  if (pauseBtn) pauseBtn.disabled = true;
  if (lapBtn)   lapBtn.disabled   = true;
  if (display)  display.textContent = '00:00.00';
})();
