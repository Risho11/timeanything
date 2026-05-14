(function () {
  'use strict';

  var display  = document.getElementById('clock-display');
  var dateEl   = document.getElementById('clock-date');
  var dayEl    = document.getElementById('clock-day');
  var fmt24El  = document.getElementById('clock-24h');
  var tzEl     = document.getElementById('clock-tz');

  var DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    var now  = new Date();
    var use24 = fmt24El && fmt24El.checked;
    var h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    var timeStr;
    if (use24) {
      timeStr = pad(h) + ':' + pad(m) + ':' + pad(s);
    } else {
      var period = h < 12 ? 'AM' : 'PM';
      var h12    = h % 12 || 12;
      timeStr = pad(h12) + ':' + pad(m) + ':' + pad(s) + ' ' + period;
    }
    if (display) display.textContent = timeStr;
    if (dateEl)  dateEl.textContent  = MONTHS[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
    if (dayEl)   dayEl.textContent   = DAYS[now.getDay()];
    if (tzEl)    tzEl.textContent    = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  }

  update();
  setInterval(update, 1000);
  fmt24El && fmt24El.addEventListener('change', update);
})();
