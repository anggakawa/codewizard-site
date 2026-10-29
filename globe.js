(function () {
  "use strict";

  var canvas = document.getElementById("bola");
  if (!canvas || !canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true });
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wide = window.matchMedia("(min-width: 720px)");
  var reduce = motion.matches;
  var points = [];
  var links = [];
  var proj = null;
  var order = null;
  var count = 0;
  var angle = 0.85;
  var running = false;
  var raf = 0;
  var last = 0;
  var visible = true;

  // Fixed tilt so a still frame already reads as a globe, not a flat ring.
  var tilt = 0.38;
  var tiltCos = Math.cos(tilt);
  var tiltSin = Math.sin(tilt);

  function build() {
    count = wide.matches ? 148 : 88;
    var next = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < count; i++) {
      var y = 1 - (i / (count - 1)) * 2;
      var ring = Math.sqrt(Math.max(0, 1 - y * y));
      var theta = golden * i;
      var x = Math.cos(theta) * ring;
      var z = Math.sin(theta) * ring;
      next.push({
        x: x,
        y: y * tiltCos - z * tiltSin,
        z: y * tiltSin + z * tiltCos,
      });
    }

    var nearest = wide.matches ? 4 : 3;
    var seen = {};
    var pairs = [];
    for (var a = 0; a < count; a++) {
      var best = [];
      for (var b = 0; b < count; b++) {
        if (a === b) {
          continue;
        }
        var dx = next[a].x - next[b].x;
        var dy = next[a].y - next[b].y;
        var dz = next[a].z - next[b].z;
        var dist = dx * dx + dy * dy + dz * dz;
        if (dist > 0.62) {
          continue;
        }
        var slot = best.length;
        if (slot < nearest) {
          best.push({ j: b, dist: dist });
        } else if (dist < best[nearest - 1].dist) {
          best[nearest - 1] = { j: b, dist: dist };
        } else {
          continue;
        }
        var n = best.length;
        while (n > 1 && best[n - 1].dist < best[n - 2].dist) {
          var swap = best[n - 1];
          best[n - 1] = best[n - 2];
          best[n - 2] = swap;
          n -= 1;
        }
      }
      for (var n = 0; n < best.length; n++) {
        var left = a < best[n].j ? a : best[n].j;
        var right = a < best[n].j ? best[n].j : a;
        var key = left + ":" + right;
        if (!seen[key]) {
          seen[key] = true;
          pairs.push(left, right);
        }
      }
    }

    points = next;
    links = pairs;
    proj = new Float32Array(count * 3);
    order = new Uint16Array(count);
    for (var n = 0; n < count; n++) {
      order[n] = n;
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(1, rect.width);
    var cssH = Math.max(1, rect.height);
    var dprCap = cssW < 720 ? 1.5 : 2;
    var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    var bufW = Math.round(cssW * dpr);
    var bufH = Math.round(cssH * dpr);
    if (canvas.width !== bufW || canvas.height !== bufH) {
      canvas.width = bufW;
      canvas.height = bufH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: cssW, h: cssH };
  }

  function draw(spin) {
    var size = resize();
    var w = size.w;
    var h = size.h;
    ctx.clearRect(0, 0, w, h);
    if (!points.length) {
      return;
    }

    var cos = Math.cos(spin);
    var sin = Math.sin(spin);
    var radius = Math.min(w, h) * 0.44;
    var fov = 3.15;
    var cx = w * 0.5;
    var cy = h * 0.5;

    for (var i = 0; i < count; i++) {
      var p = points[i];
      var x = p.x * cos + p.z * sin;
      var z = -p.x * sin + p.z * cos;
      var scale = fov / (fov - z);
      var o = i * 3;
      proj[o] = cx + x * radius * scale;
      proj[o + 1] = cy + p.y * radius * scale;
      proj[o + 2] = z;
    }

    ctx.lineWidth = 1;
    for (var n = 0; n < links.length; n += 2) {
      var a = links[n] * 3;
      var b = links[n + 1] * 3;
      var depth = (proj[a + 2] + proj[b + 2]) * 0.5;
      var front = (depth + 1) * 0.5;
      ctx.strokeStyle = "rgba(255,255,255," + (0.05 + front * 0.28).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(proj[a], proj[a + 1]);
      ctx.lineTo(proj[b], proj[b + 1]);
      ctx.stroke();
    }

    order.sort(function (a, b) {
      return proj[a * 3 + 2] - proj[b * 3 + 2];
    });
    for (var d = 0; d < count; d++) {
      var o = order[d] * 3;
      var front = (proj[o + 2] + 1) * 0.5;
      ctx.fillStyle = "rgba(255,255,255," + (0.18 + front * 0.78).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(proj[o], proj[o + 1], 0.7 + front * 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    if (!running) {
      return;
    }
    if (!last) {
      last = now;
    }
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    angle += dt * 0.11;
    draw(angle);
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

  function applyMotion() {
    reduce = motion.matches;
    if (reduce) {
      stop();
      draw(0.85);
      return;
    }
    start();
  }

  build();
  draw(angle);

  if ("IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    watcher.observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener("resize", function () {
    var next = wide.matches ? 148 : 88;
    if (next !== count) {
      build();
    }
    if (reduce) {
      draw(0.85);
    }
  });

  if (motion.addEventListener) {
    motion.addEventListener("change", applyMotion);
  }
  applyMotion();
})();
