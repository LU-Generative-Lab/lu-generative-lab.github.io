// A very small space: hard disks moved by the Metropolis algorithm.
//
// The room is the unit square. Squeezing grows the disks (never past what the
// free space allows); the view rescales so disks stay the same size on screen
// and the walls appear to close in. People and projects come from the JSON
// block that Jekyll writes into the page from _people/ and _projects/.

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var data = JSON.parse($('lab-data').textContent);
  var canvas = $('box');
  var ctx = canvas.getContext('2d');
  var slider = $('squeeze');
  var caption = $('caption');
  var readout = $('readout');
  var panel = $('panel');
  var pauseBtn = $('pause');

  var N_BLANK = 150;
  var PHI_LOOSE = 0.30;   // coverage with the slider all the way left
  var PHI_TIGHT = 0.89;   // coverage the slider asks for all the way right
  var PAD = 2;            // px between canvas edge and the loosest walls
  var SWEEPS = 2;         // Metropolis sweeps per frame: higher is faster and jitterier
  var MAX_STEP = 0.08;    // largest nudge, as a fraction of a disk's radius
  var TAU = Math.PI * 2;

  // ---------- the disks ----------

  var disks = [];
  data.people.forEach(function (e, i) { disks.push({ kind: 'person', key: 'person-' + i, entry: e }); });
  data.projects.forEach(function (e, i) { disks.push({ kind: 'project', key: 'project-' + i, entry: e }); });
  var named = disks.length;
  for (var i = 0; i < N_BLANK; i++) disks.push({ kind: 'blank' });
  disks.forEach(function (d) { d.re = 0; d.im = 0; });

  var r0 = Math.sqrt(PHI_LOOSE / (disks.length * Math.PI));
  var sMax = Math.sqrt(PHI_TIGHT / PHI_LOOSE);
  function squeeze() { return 1 + (sMax - 1) * (slider.value / 1000); }

  var r = r0;                  // disk radius, in room units; starts loose, grows toward the slider
  var delta = r * MAX_STEP;    // Metropolis step size, adapted as we go
  var psiGlobal = 0, psiLocal = 0;

  function free(x, y, skip) {
    if (x < r || x > 1 - r || y < r || y > 1 - r) return false;
    var d2 = 4 * r * r;
    for (var j = 0; j < disks.length; j++) {
      var o = disks[j];
      if (o === skip || o.x === undefined) continue;
      var dx = o.x - x, dy = o.y - y;
      if (dx * dx + dy * dy < d2) return false;
    }
    return true;
  }

  function place(d, spread) {
    var lo = 0.5 - spread / 2;
    for (var t = 0; t < 5000; t++) {
      var x = lo + Math.random() * spread, y = lo + Math.random() * spread;
      if (free(x, y, d)) { d.x = x; d.y = y; return true; }
    }
    return false;
  }

  // Named disks go near the middle so they're easy to find; blanks anywhere.
  disks.forEach(function (d, k) { place(d, k < named ? 0.5 : 1); });
  disks = disks.filter(function (d) { return d.x !== undefined; });

  // ---------- physics ----------

  var drag = null, dragTarget = null;

  function sweep() {
    var n = disks.length, d2 = 4 * r * r, acc = 0;
    for (var k = 0; k < n; k++) {
      var i = (Math.random() * n) | 0, d = disks[i];
      if (d === drag) continue;
      var x = d.x + (Math.random() * 2 - 1) * delta;
      var y = d.y + (Math.random() * 2 - 1) * delta;
      if (x < r || x > 1 - r || y < r || y > 1 - r) continue;
      var ok = true;
      for (var j = 0; j < n; j++) {
        if (j === i) continue;
        var dx = disks[j].x - x, dy = disks[j].y - y;
        if (dx * dx + dy * dy < d2) { ok = false; break; }
      }
      if (ok) { d.x = x; d.y = y; acc++; }
    }
    return acc / n;
  }

  // Move r toward what the slider asks for. Shrinking is always safe; growing
  // goes halfway to the largest radius that still fits, so disks never overlap.
  function grow() {
    var target = r0 * squeeze();
    if (target <= r) { r = target; return; }
    var n = disks.length, wall = Infinity, pair = Infinity;
    for (var i = 0; i < n; i++) {
      var a = disks[i];
      wall = Math.min(wall, a.x, 1 - a.x, a.y, 1 - a.y);
      for (var j = i + 1; j < n; j++) {
        var dx = disks[j].x - a.x, dy = disks[j].y - a.y;
        var q = dx * dx + dy * dy;
        if (q < pair) pair = q;
      }
    }
    var room = Math.min(wall, Math.sqrt(pair) / 2);
    r = Math.min(target, r + (room - r) * 0.5);
  }

  // Bond-orientational order: psi_6 for each disk from neighbours within 1.4
  // diameters. Global = how much the room agrees on one orientation; local =
  // how hexagonal each disk's own neighbourhood is.
  function order() {
    var n = disks.length, rc2 = Math.pow(2.8 * r, 2), i, d;
    var nb = new Array(n).fill(0);
    for (i = 0; i < n; i++) { disks[i].re = 0; disks[i].im = 0; }
    for (i = 0; i < n; i++) {
      var a = disks[i];
      for (var j = i + 1; j < n; j++) {
        var b = disks[j], dx = b.x - a.x, dy = b.y - a.y;
        if (dx * dx + dy * dy < rc2) {
          var t = 6 * Math.atan2(dy, dx), c = Math.cos(t), s = Math.sin(t);
          a.re += c; a.im += s; b.re += c; b.im += s;   // +pi is the same bond to 6-fold symmetry
          nb[i]++; nb[j]++;
        }
      }
    }
    var R = 0, I = 0, L = 0;
    for (i = 0; i < n; i++) {
      d = disks[i];
      if (nb[i]) { d.re /= nb[i]; d.im /= nb[i]; }
      R += d.re; I += d.im; L += Math.hypot(d.re, d.im);
    }
    psiGlobal = Math.hypot(R, I) / n;
    psiLocal = L / n;
  }

  function phi() { return disks.length * Math.PI * r * r; }

  // Jammed: the slider wants more, but the room hasn't shrunk in a while.
  var jammed = false, rMark = 0;
  function checkJam() {
    var target = r0 * squeeze();
    jammed = phi() > 0.75 && target > r * 1.001 && r < rMark * 1.0005;
    rMark = r;
  }

  function stateName(p) {
    if (jammed) return 'jammed';
    if (p < 0.70) return 'fluid';
    if (p < 0.72) return 'hexatic, roughly';
    return psiLocal > 0.6 ? 'solid' : 'glassy (loosen it a little, then squeeze slowly)';
  }

  // ---------- drawing ----------

  var colors = {}, dpr = 1;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    ['paper', 'ink', 'muted', 'rule', 'spot'].forEach(function (k) {
      colors[k] = cs.getPropertyValue('--' + k).trim();
    });
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    var W = canvas.clientWidth;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(W * dpr);
  }

  function geometry(W) {
    var B = (W - 2 * PAD) * r0 / r;   // room size on screen
    return { B: B, o: (W - B) / 2, D: r * B };
  }

  function label(d) { return d.kind === 'you' ? 'you' : d.entry.short; }

  function draw() {
    var W = canvas.clientWidth;
    if (!W) return;
    var g = geometry(W), B = g.B, o = g.o, D = g.D;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // outside the room, then the room
    ctx.fillStyle = colors.paper; ctx.fillRect(0, 0, W, W);
    ctx.globalAlpha = 0.45; ctx.fillStyle = colors.rule; ctx.fillRect(0, 0, W, W);
    ctx.globalAlpha = 1; ctx.fillStyle = colors.paper; ctx.fillRect(o, o, B, B);
    ctx.strokeStyle = colors.ink; ctx.lineWidth = 2; ctx.strokeRect(o - 1, o - 1, B + 2, B + 2);

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

    for (var k = 0; k < disks.length; k++) {
      var d = disks[k], x = o + d.x * B, y = o + d.y * B;
      ctx.beginPath(); ctx.arc(x, y, D - 0.75, 0, TAU);

      if (d.kind === 'blank') {
        var m = Math.hypot(d.re, d.im);
        ctx.globalAlpha = 0.6 * m; ctx.fillStyle = colors.rule; ctx.fill();
        ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.strokeStyle = colors.muted; ctx.stroke();
        var a = Math.atan2(d.im, d.re) / 6, L = D * 0.65;
        ctx.globalAlpha = Math.min(1, m * 1.2);
        ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(a) * L, y - Math.sin(a) * L);
        ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        var fg;
        if (d.kind === 'person') { ctx.fillStyle = colors.spot; ctx.fill(); fg = colors.paper; }
        else if (d.kind === 'project') {
          ctx.fillStyle = colors.paper; ctx.fill();
          ctx.lineWidth = 2.5; ctx.strokeStyle = colors.spot; ctx.stroke(); fg = colors.spot;
        } else { ctx.fillStyle = colors.ink; ctx.fill(); fg = colors.paper; }
        var txt = label(d);
        ctx.fillStyle = fg;
        ctx.font = '500 ' + Math.max(8, D * (txt.length > 2 ? 0.62 : 0.8)) + 'px "IBM Plex Mono", ui-monospace, monospace';
        ctx.fillText(txt, x, y + 0.5);
      }

      if (d === selected || d === hover) {
        ctx.beginPath(); ctx.arc(x, y, D + 3.5, 0, TAU);
        ctx.lineWidth = 1.5; ctx.strokeStyle = d === selected ? colors.ink : colors.muted; ctx.stroke();
      }
    }
  }

  // ---------- words ----------

  var message = '', messageUntil = 0, saidFull = false;

  function say(text, ms) { message = text; messageUntil = performance.now() + (ms || 4000); }

  function updateText() {
    var p = phi();
    readout.textContent = 'φ = ' + p.toFixed(3) + ' · ψ₆ = ' + psiGlobal.toFixed(2) + ' · ' + stateName(p);
    if (jammed && !saidFull) { saidFull = true; say('Full. We may need a bigger room.', 6000); }
    if (p < 0.72) saidFull = false;
    var now = performance.now();
    if (now < messageUntil) caption.textContent = message;
    else if (hover) caption.textContent = hover.kind === 'blank' ? 'nobody yet' : hover.kind === 'you' ? 'you' : hover.entry.name;
    else caption.textContent = 'drag a disk · click one to read it';
  }

  // ---------- the panel ----------

  var selected = null, hover = null;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  function showPanel(fill, focus) {
    panel.innerHTML = '';
    var close = el('button', { type: 'button', 'class': 'close mono' }, 'close');
    close.addEventListener('click', function () { panel.hidden = true; selected = null; });
    panel.appendChild(close);
    fill(panel);
    panel.hidden = false;
    if (focus) panel.focus();
    else panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function fromTemplate(id) {
    return function (p) { p.appendChild(document.getElementById(id).content.cloneNode(true)); };
  }

  function open(d, focus) {
    selected = d;
    if (d.kind === 'blank') {
      showPanel(function (p) {
        fromTemplate('tpl-anon')(p);
        p.querySelector('.inline-join').addEventListener('click', join);
      }, focus);
    } else if (d.kind === 'you') {
      showPanel(fromTemplate('tpl-you'), focus);
    } else {
      var e = d.entry;
      showPanel(function (p) {
        var h = el('h3');
        if (e.link) h.appendChild(el('a', { href: e.link }, e.name)); else h.textContent = e.name;
        p.appendChild(h);
        p.appendChild(el('span', { 'class': 'entry-meta mono' }, e.meta));
        var body = el('div'); body.innerHTML = e.html; p.appendChild(body);
      }, focus);
    }
  }

  function join() {
    var you = disks.find(function (d) { return d.kind === 'you'; });
    if (you) { open(you); return; }
    you = { kind: 'you', re: 0, im: 0 };
    if (place(you, 1)) {
      disks.push(you);
      open(you);
      say("Welcome in. It's a little more crowded now.");
    } else {
      say('No room. This is the problem a lab has when it works.', 6000);
    }
  }

  // ---------- input ----------

  var downAt = null, moved = false;

  function toRoom(ev) {
    var rect = canvas.getBoundingClientRect(), g = geometry(rect.width);
    return { x: (ev.clientX - rect.left - g.o) / g.B, y: (ev.clientY - rect.top - g.o) / g.B };
  }

  function hit(u) {
    var best = null, bd = Math.pow(r * 1.2, 2);
    disks.forEach(function (d) {
      var q = Math.pow(d.x - u.x, 2) + Math.pow(d.y - u.y, 2);
      if (q < bd) { bd = q; best = d; }
    });
    return best;
  }

  canvas.addEventListener('pointerdown', function (ev) {
    var d = hit(toRoom(ev));
    if (!d) return;
    drag = d; dragTarget = toRoom(ev); downAt = { x: ev.clientX, y: ev.clientY }; moved = false;
    canvas.setPointerCapture(ev.pointerId);
    canvas.classList.add('dragging');
  });

  canvas.addEventListener('pointermove', function (ev) {
    var u = toRoom(ev);
    if (drag) {
      dragTarget = u;
      if (Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 4) moved = true;
    } else {
      hover = hit(u);
      canvas.style.cursor = hover ? 'grab' : '';
    }
  });

  function endDrag() {
    if (!drag) return;
    if (!moved) open(drag);
    drag = null; dragTarget = null;
    canvas.classList.remove('dragging');
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', function () { if (!drag) hover = null; });

  // The dragged disk walks toward the pointer but can't push through anyone.
  function dragStep() {
    if (!drag || !dragTarget) return;
    var tx = Math.min(1 - r, Math.max(r, dragTarget.x));
    var ty = Math.min(1 - r, Math.max(r, dragTarget.y));
    var dx = tx - drag.x, dy = ty - drag.y, dist = Math.hypot(dx, dy);
    if (dist < 1e-9) return;
    var step = Math.min(dist, r * 0.6);
    dx *= step / dist; dy *= step / dist;
    for (var k = 0; k < 5; k++) {
      if (free(drag.x + dx, drag.y + dy, drag)) { drag.x += dx; drag.y += dy; return; }
      dx /= 2; dy /= 2;
    }
  }

  $('join').addEventListener('click', join);
  $('about-btn').addEventListener('click', function () { selected = null; showPanel(fromTemplate('tpl-about'), true); });

  var running = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function setRunning(on) { running = on; pauseBtn.textContent = on ? 'pause' : 'play'; }
  pauseBtn.addEventListener('click', function () { setRunning(!running); });
  setRunning(running);

  document.querySelectorAll('.legend button').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = disks.find(function (x) { return x.key === b.dataset.key; });
      if (d) open(d, true);
    });
  });

  // ---------- go ----------

  readColors();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readColors);
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  var frame = 0;
  function tick() {
    frame++;
    for (var k = 0; k < 4; k++) dragStep();
    if (running) {
      var acc = 0;
      for (var S = 0; S < SWEEPS; S++) { acc += sweep(); grow(); }
      acc /= SWEEPS;
      delta = Math.min(r * MAX_STEP, Math.max(r * 1e-4, delta * (acc > 0.4 ? 1.08 : 0.92)));
    } else {
      grow();
    }
    if (frame % 3 === 0) order();
    if (frame % 120 === 0) checkJam();
    if (frame % 10 === 0) updateText();
    draw();
    requestAnimationFrame(tick);
  }
  order(); updateText();
  requestAnimationFrame(tick);
})();
