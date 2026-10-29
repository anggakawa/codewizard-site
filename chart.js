(function () {
  "use strict";

  // The Chartwizard row's band: the globe's dust and signals, told as a chart.
  // Dust gathers into candles, the average line draws out, a scan sweeps the
  // window and boxes the turns it finds. Abstract on purpose: no prices, no
  // axis labels, nothing that reads as a capture of the app.
  var canvas = document.querySelector(".grafik");
  if (!canvas || !canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true });
  var row = canvas.closest(".produk") || canvas.parentElement;
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = motion.matches;

  var running = false;
  var visible = false;
  var raf = 0;
  var last = 0;
  var born = 0;
  var clock = 0;
  var intro = !reduce;
  var introLength = 1.3;

  var candles = [];
  var nextId = 0;
  var offset = 0;
  var lo = 0;
  var hi = 0;
  var scaled = false;

  var scanX = -1;
  var scanWait = 1.2;
  var scanned = -1;
  var boxes = [];

  var cross = { on: false, x: 0, y: 0, alpha: 0 };

  // Seeded, so the chart has the same shape on every visit.
  var seed = 7;
  function random() {
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  var price = 100;
  var drift = 0;

  function candle() {
    drift = drift * 0.78 + (random() - 0.5) * 1.3;
    var open = price;
    var close = open + drift + (random() - 0.5) * 3.4;
    close += (100 - close) * 0.05;
    var high = Math.max(open, close) + random() * 1.9;
    var low = Math.min(open, close) - random() * 1.9;
    price = close;
    return {
      id: nextId++,
      o: open,
      c: close,
      h: high,
      l: low,
      sx: random(),
      sy: random(),
      delay: 0,
    };
  }

  function spacing(w) {
    return w < 560 ? 13 : 18;
  }

  function fill(w) {
    var need = Math.ceil(w / spacing(w)) + 3;
    while (candles.length < need) {
      candles.push(candle());
    }
    while (candles.length > need) {
      candles.shift();
    }
    for (var i = 0; i < candles.length; i++) {
      candles[i].delay = (i / candles.length) * 0.7 + candles[i].sx * 0.3;
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(1, rect.width);
    var cssH = Math.max(1, rect.height);
    var dpr = Math.min(window.devicePixelRatio || 1, cssW < 720 ? 1.5 : 2);
    var bufW = Math.round(cssW * dpr);
    var bufH = Math.round(cssH * dpr);
    if (canvas.width !== bufW || canvas.height !== bufH) {
      canvas.width = bufW;
      canvas.height = bufH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: cssW, h: cssH };
  }

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function smooth(edge0, edge1, x) {
    var t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // Soft ends, so candles slide in and out instead of popping at the edge.
  function edge(x, w) {
    var band = Math.min(56, w * 0.08);
    return smooth(0, band, x) * smooth(0, band, w - x);
  }

  var dust = [];

  function ensureDust(w, h) {
    if (dust.length) {
      return;
    }
    var n = w < 560 ? 18 : 34;
    for (var i = 0; i < n; i++) {
      dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.7 ? 2 : 3,
        a: 0.18 + Math.random() * 0.3,
        vx: -(3 + Math.random() * 6),
        vy: (Math.random() - 0.5) * 3,
      });
    }
  }

  function turn(i) {
    // A low or a high that holds for five candles on each side.
    if (i < 5 || i > candles.length - 6) {
      return 0;
    }
    var isLow = true;
    var isHigh = true;
    for (var k = i - 5; k <= i + 5; k++) {
      if (k === i) {
        continue;
      }
      if (candles[k].l < candles[i].l) {
        isLow = false;
      }
      if (candles[k].h > candles[i].h) {
        isHigh = false;
      }
    }
    return isLow ? -1 : isHigh ? 1 : 0;
  }

  function draw(dt) {
    var size = resize();
    var w = size.w;
    var h = size.h;
    ctx.clearRect(0, 0, w, h);
    fill(w);

    var gap = spacing(w);
    var body = gap < 18 ? 6 : 8;
    var top = h * 0.12;
    var bottom = h * 0.88;

    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < candles.length; i++) {
      min = Math.min(min, candles[i].l);
      max = Math.max(max, candles[i].h);
    }
    var pad = (max - min) * 0.08;
    if (!scaled) {
      lo = min - pad;
      hi = max + pad;
      scaled = true;
    } else {
      var ease = 1 - Math.exp(-(dt || 0) * 2.5);
      lo += (min - pad - lo) * ease;
      hi += (max + pad - hi) * ease;
    }
    var span = Math.max(0.0001, hi - lo);
    function y(v) {
      return top + ((hi - v) / span) * (bottom - top);
    }
    function x(i) {
      return gap * 0.5 + i * gap - offset;
    }

    // Grid: four faint rules, the only furniture.
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(26,26,26,0.07)";
    ctx.beginPath();
    for (var g = 0; g < 4; g++) {
      var gy = Math.round(top + ((bottom - top) * (g + 0.5)) / 4) + 0.5;
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
    }
    ctx.stroke();

    ensureDust(w, h);
    for (var d = 0; d < dust.length; d++) {
      var p = dust[d];
      if (dt) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -6) {
          p.x = w + 4;
          p.y = Math.random() * h;
        }
      }
      ctx.fillStyle = "rgba(36,36,36," + (p.a * edge(p.x, w) * (intro ? smooth(0, 0.5, clock) : 1)).toFixed(3) + ")";
      ctx.fillRect((p.x + 0.5) | 0, (p.y + 0.5) | 0, p.s, p.s);
    }

    var allSettled = true;
    for (var c = 0; c < candles.length; c++) {
      var k = candles[c];
      var cx = x(c);
      var fade = edge(cx, w);
      if (fade <= 0) {
        continue;
      }
      var e = 1;
      if (intro) {
        e = easeOutExpo(Math.max(0, (clock - k.delay) / introLength));
        if (e < 1) {
          allSettled = false;
        }
      }
      var mid = y((k.o + k.c) * 0.5);
      var px = intro ? k.sx * w + (cx - k.sx * w) * e : cx;
      var py = intro ? k.sy * h + (mid - k.sy * h) * e : mid;
      var arrive = intro ? smooth(0, 0.5, clock) : 1;

      if (e < 0.55) {
        // Still dust on its way in.
        ctx.fillStyle = "rgba(26,26,26," + (0.5 * fade * arrive).toFixed(3) + ")";
        ctx.fillRect((px + 0.5) | 0, (py + 0.5) | 0, 2, 2);
        continue;
      }

      var grow = intro ? smooth(0.55, 1, e) : 1;
      var yh = py + (y(k.h) - mid) * grow;
      var yl = py + (y(k.l) - mid) * grow;
      var yo = py + (y(k.o) - mid) * grow;
      var yc = py + (y(k.c) - mid) * grow;
      var bx = Math.round(px - body / 2) + 0.5;
      var bt = Math.min(yo, yc);
      var bh = Math.max(1, Math.abs(yc - yo));
      var up = k.c >= k.o;
      var alpha = (0.85 * fade).toFixed(3);

      ctx.strokeStyle = "rgba(26,26,26," + alpha + ")";
      ctx.beginPath();
      ctx.moveTo(Math.round(px) + 0.5, yh);
      ctx.lineTo(Math.round(px) + 0.5, bt);
      ctx.moveTo(Math.round(px) + 0.5, bt + bh);
      ctx.lineTo(Math.round(px) + 0.5, yl);
      ctx.stroke();

      // Rising candles hollow, falling candles solid: chart print in one ink.
      if (up) {
        // Cleared, not painted, so the row's hover wash shows through.
        ctx.clearRect(bx, bt, body - 1, bh);
        ctx.strokeRect(bx, bt, body - 1, bh);
      } else {
        ctx.fillStyle = "rgba(26,26,26," + alpha + ")";
        ctx.fillRect(bx - 0.5, bt, body, bh);
      }
    }

    if (intro && allSettled) {
      intro = false;
    }

    // Moving average, drawn out from the left once the candles land.
    var reveal = intro ? smooth(0.9, 2.1, clock) : 1;
    if (reveal > 0) {
      var period = 7;
      var limit = gap * 0.5 + (w + gap) * reveal;
      ctx.strokeStyle = "rgba(26,26,26,0.42)";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      var started = false;
      for (var m = period - 1; m < candles.length; m++) {
        var mx = x(m);
        if (mx > limit) {
          break;
        }
        var sum = 0;
        for (var q = m - period + 1; q <= m; q++) {
          sum += candles[q].c;
        }
        var my = y(sum / period);
        if (!started) {
          ctx.moveTo(mx, my);
          started = true;
        } else {
          ctx.lineTo(mx, my);
        }
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    if (!intro && !reduce) {
      drawScan(w, h, x, y, gap, top, bottom);
      drawCross(w, h, x, gap);
    }
  }

  function drawScan(w, h, x, y, gap, top, bottom) {
    if (scanX >= 0) {
      var fade = edge(scanX, w);
      ctx.strokeStyle = "rgba(26,26,26," + (0.28 * fade).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(Math.round(scanX) + 0.5, top - 6);
      ctx.lineTo(Math.round(scanX) + 0.5, bottom + 6);
      ctx.stroke();
      ctx.fillStyle = "rgba(26,26,26," + (0.8 * fade).toFixed(3) + ")";
      ctx.fillRect(Math.round(scanX) - 1, top - 8, 3, 3);
    }

    // Each turn the scan found: corner brackets around five candles.
    for (var b = 0; b < boxes.length; b++) {
      var box = boxes[b];
      var at = box.id - candles[0].id;
      if (at < 2 || at > candles.length - 3) {
        continue;
      }
      var life = box.age / 2.2;
      var appear = easeOutExpo(Math.min(1, box.age / 0.35));
      var alpha = (1 - smooth(0.55, 1, life)) * edge(x(at), w) * 0.7;
      if (alpha <= 0) {
        continue;
      }
      var high = -Infinity;
      var low = Infinity;
      for (var k = at - 2; k <= at + 2; k++) {
        high = Math.max(high, candles[k].h);
        low = Math.min(low, candles[k].l);
      }
      var inset = (1 - appear) * 8;
      var left = x(at - 2) - gap * 0.5 - 2 + inset;
      var right = x(at + 2) + gap * 0.5 + 2 - inset;
      var upper = y(high) - 7 + inset;
      var lower = y(low) + 7 - inset;
      var tick = 6;
      ctx.strokeStyle = "rgba(26,26,26," + alpha.toFixed(3) + ")";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(left, upper + tick);
      ctx.lineTo(left, upper);
      ctx.lineTo(left + tick, upper);
      ctx.moveTo(right - tick, upper);
      ctx.lineTo(right, upper);
      ctx.lineTo(right, upper + tick);
      ctx.moveTo(right, lower - tick);
      ctx.lineTo(right, lower);
      ctx.lineTo(right - tick, lower);
      ctx.moveTo(left + tick, lower);
      ctx.lineTo(left, lower);
      ctx.lineTo(left, lower - tick);
      ctx.stroke();
      ctx.lineWidth = 1;

      // The turn itself: a small square at the extreme it found.
      var mark = box.kind < 0 ? y(candles[at].l) + 4 : y(candles[at].h) - 7;
      ctx.fillStyle = "rgba(26,26,26," + alpha.toFixed(3) + ")";
      ctx.fillRect(Math.round(x(at)) - 1, Math.round(mark), 3, 3);
    }
  }

  function drawCross(w, h, x, gap) {
    if (cross.alpha <= 0.01) {
      return;
    }
    var index = Math.round((cross.x + offset - gap * 0.5) / gap);
    index = Math.max(0, Math.min(candles.length - 1, index));
    var cx = Math.round(x(index)) + 0.5;
    var cy = Math.round(Math.max(0, Math.min(h, cross.y))) + 0.5;
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "rgba(26,26,26," + (0.4 * cross.alpha).toFixed(3) + ")";
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "rgba(26,26,26," + (0.9 * cross.alpha).toFixed(3) + ")";
    ctx.fillRect(cx - 2.5, cy - 2.5, 5, 5);
  }

  function step(dt, w) {
    var gap = spacing(w);
    // The tape moves left; a new candle enters on the right.
    offset += dt * 9;
    while (offset >= gap) {
      offset -= gap;
      candles.shift();
      candles.push(candle());
      scanned -= 1;
    }

    if (scanX < 0) {
      scanWait -= dt;
      if (scanWait <= 0) {
        scanX = 0;
        scanned = -1;
      }
    } else {
      scanX += dt * (w / 4.2);
      var under = Math.floor((scanX + offset) / gap);
      while (scanned < under && scanned < candles.length - 1) {
        scanned += 1;
        var kind = turn(scanned);
        if (kind && boxes.length < 3) {
          boxes.push({ id: candles[scanned].id, kind: kind, age: 0 });
        }
      }
      if (scanX > w) {
        scanX = -1;
        scanWait = 1.4;
      }
    }

    for (var b = boxes.length - 1; b >= 0; b--) {
      boxes[b].age += dt;
      if (boxes[b].age > 2.2) {
        boxes.splice(b, 1);
      }
    }

    var target = cross.on ? 1 : 0;
    cross.alpha += (target - cross.alpha) * (1 - Math.exp(-dt * 10));
  }

  function frame(now) {
    if (!running) {
      return;
    }
    if (!last) {
      last = now;
    }
    if (!born) {
      born = now;
    }
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock = (now - born) / 1000;
    if (!intro) {
      step(dt, canvas.getBoundingClientRect().width);
    }
    draw(dt);
    raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce || document.hidden || !visible) {
      return;
    }
    running = true;
    last = 0;
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    window.cancelAnimationFrame(raf);
  }

  function still() {
    intro = false;
    draw(0);
  }

  function applyMotion() {
    reduce = motion.matches;
    if (reduce) {
      stop();
      still();
      return;
    }
    start();
  }

  row.addEventListener(
    "pointermove",
    function (event) {
      if (event.pointerType !== "mouse") {
        return;
      }
      var rect = canvas.getBoundingClientRect();
      cross.x = event.clientX - rect.left;
      cross.y = event.clientY - rect.top;
      cross.on = cross.y >= 0 && cross.y <= rect.height && cross.x >= 0 && cross.x <= rect.width;
    },
    { passive: true }
  );

  row.addEventListener("pointerleave", function () {
    cross.on = false;
  });

  if ("IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) {
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    watcher.observe(canvas);
  } else {
    visible = true;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener("resize", function () {
    if (reduce || !running) {
      draw(0);
    }
  });

  if (motion.addEventListener) {
    motion.addEventListener("change", applyMotion);
  }

  if (reduce) {
    still();
  }
  applyMotion();
})();
