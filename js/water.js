/* Kunal.exe OS — water surface. A small wave simulation drawn as soft light/shadow
   over the wallpaper. Ripples follow the mouse/finger and rain softly on their own. */
(function () {
  "use strict";
  var cv = document.getElementById("waterCanvas");
  if (!cv || !cv.getContext) return;
  var mobile = window.matchMedia("(max-width: 980px)");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cv.style.display = "none"; return; }
  var ctx = cv.getContext("2d");
  var SCALE = window.innerWidth < 700 ? 4 : 5;     // screen pixels per simulation cell
  var DAMP = 0.986, W = 0, H = 0, cur, prev, img, data;
  var pointer = { x: -1, y: -1, px: -1, py: -1, moved: false };
  var nextRain = 0, raf = 0, active = false;

  function init() {
    var w = window.innerWidth, h = window.innerHeight;
    W = Math.max(60, Math.round(w / SCALE)); H = Math.max(40, Math.round(h / SCALE));
    cv.width = W; cv.height = H;
    cur = new Float32Array(W * H); prev = new Float32Array(W * H);
    img = ctx.createImageData(W, H); data = img.data;
  }

  function drop(x, y, r, s) {
    var x0 = Math.max(1, Math.floor(x - r)), x1 = Math.min(W - 2, Math.ceil(x + r));
    var y0 = Math.max(1, Math.floor(y - r)), y1 = Math.min(H - 2, Math.ceil(y + r));
    for (var j = y0; j <= y1; j++) for (var i = x0; i <= x1; i++) {
      var d = Math.sqrt((i - x) * (i - x) + (j - y) * (j - y));
      if (d < r) cur[j * W + i] += s * (0.5 + 0.5 * Math.cos(d / r * Math.PI));
    }
  }

  function toGrid(cx, cy) { return [cx / window.innerWidth * W, cy / window.innerHeight * H]; }

  function onMove(e) {
    var g = toGrid(e.clientX, e.clientY);
    if (pointer.x < 0) { pointer.px = g[0]; pointer.py = g[1]; }
    pointer.x = g[0]; pointer.y = g[1]; pointer.moved = true;
  }
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", function (e) { var g = toGrid(e.clientX, e.clientY); drop(g[0], g[1], 5, 70); }, { passive: true });
  window.addEventListener("pointerleave", function () { pointer.x = -1; pointer.moved = false; }, { passive: true });
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    active = false;
    cv.style.display = "none";
  }

  function start() {
    if (mobile.matches || document.hidden) { stop(); return; }
    cv.style.display = "block";
    init();
    active = true;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function resize() {
    if (mobile.matches) { stop(); return; }
    if (active) init();
    else start();
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  function step() {
    var i, y, x, n, t;
    for (y = 1; y < H - 1; y++) {
      for (x = 1; x < W - 1; x++) {
        i = y * W + x;
        n = ((cur[i - 1] + cur[i + 1] + cur[i - W] + cur[i + W]) * 0.5 - prev[i]) * DAMP;
        prev[i] = n;
      }
    }
    t = cur; cur = prev; prev = t;
  }

  function paint() {
    var x, y, i, o, s, a;
    for (y = 1; y < H - 1; y++) {
      for (x = 1; x < W - 1; x++) {
        i = y * W + x; o = i * 4;
        s = (cur[i + 1] - cur[i - 1] + cur[i + W] - cur[i - W]) * 9;
        if (s > 0) { a = s > 150 ? 150 : s; data[o] = 255; data[o + 1] = 255; data[o + 2] = 255; data[o + 3] = a; }
        else { a = -s * 0.8; if (a > 130) a = 130; data[o] = 20; data[o + 1] = 40; data[o + 2] = 110; data[o + 3] = a; }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function frame(now) {
    // pointer trail: small drops along the path since the last frame
    if (pointer.moved && pointer.x >= 0) {
      var dx = pointer.x - pointer.px, dy = pointer.y - pointer.py, dist = Math.sqrt(dx * dx + dy * dy);
      var steps = Math.max(1, Math.ceil(dist / 1.5)), power = Math.min(14, 3 + dist * 1.2);
      for (var k = 1; k <= steps; k++) drop(pointer.px + dx * k / steps, pointer.py + dy * k / steps, 2.4, power / steps * 2);
      pointer.px = pointer.x; pointer.py = pointer.y; pointer.moved = false;
    }
    // gentle rain so the water is alive even when the mouse is still
    if (now > nextRain) {
      drop(2 + Math.random() * (W - 4), 2 + Math.random() * (H - 4), 2 + Math.random() * 3, 14 + Math.random() * 26);
      nextRain = now + 900 + Math.random() * 1800;
    }
    step(); paint();
    raf = requestAnimationFrame(frame);
  }

  start();
})();
