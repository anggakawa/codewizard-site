(function () {
  "use strict";

  var canvas = document.getElementById("bola");
  if (!canvas || !canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext("2d", { alpha: true });
  var hero = canvas.parentElement;
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wide = window.matchMedia("(min-width: 720px)");
  var reduce = motion.matches;
  var points = [];
  var links = [];
  var around = [];
  var proj = null;
  var order = null;
  var settle = null;
  var count = 0;
  var angle = 0.85;
  var running = false;
  var raf = 0;
  var last = 0;
  var visible = true;

  // Seconds since the first frame, on the wall clock so dropped frames do not
  // stretch the entrance. The entrance reads it; nothing else does.
  var clock = 0;
  var born = 0;
  var intro = reduce ? 0 : 1;
  var introLength = 1.5;

  // Extra spin that decays: fast at the start, and again after a scroll.
  var boost = reduce ? 0 : 1.1;
  var lastScroll = window.scrollY;

  // Pointer lean, eased toward the target every frame.
  var aimX = 0;
  var aimY = 0;
  var leanX = 0;
  var leanY = 0;

  // Signals that run along the links, and the rings they leave on arrival.
  var signals = [];
  var pings = [];
  var nextSignal = 0;

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
        // Where the point starts as dust, and when it leaves for the sphere.
        sx: Math.random(),
        sy: Math.random(),
        delay: (i / count) * 0.55 + Math.random() * 0.35,
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

    var nextAround = [];
    for (var p = 0; p < count; p++) {
      nextAround.push([]);
    }
    for (var l = 0; l < pairs.length; l += 2) {
      nextAround[pairs[l]].push(pairs[l + 1]);
      nextAround[pairs[l + 1]].push(pairs[l]);
    }

    points = next;
    links = pairs;
    around = nextAround;
    signals = [];
    pings = [];
    proj = new Float32Array(count * 3);
    settle = new Float32Array(count);
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

  function easeOutExpo(t) {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function smooth(edge0, edge1, x) {
    var t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  var dust = [];
  var dustW = 0;
  var dustH = 0;

  function ensureDust(w, h) {
    if (dust.length && Math.abs(w - dustW) < 48 && Math.abs(h - dustH) < 48) {
      return;
    }
    dustW = w;
    dustH = h;
    var n = w < 720 ? 70 : 120;
    dust = [];
    for (var i = 0; i < n; i++) {
      dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.7 ? 2 : 3,
        a: 0.28 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 7,
        vy: -(4 + Math.random() * 10),
      });
    }
  }

  function drawDust(w, h, dt, fadeIn) {
    ensureDust(w, h);
    var desktop = w >= 720;
    for (var i = 0; i < dust.length; i++) {
      var p = dust[i];
      if (dt) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.y < -6) {
          p.y = h + 4;
          p.x = Math.random() * w;
        }
        if (p.x < -6) {
          p.x = w + 4;
        }
        if (p.x > w + 6) {
          p.x = -4;
        }
      }
      var fade = fadeIn;
      if (desktop && p.x < w * 0.42) {
        fade *= 0.28;
      }
      if (!desktop && p.y > h * 0.55) {
        fade *= 0.22;
      }
      ctx.fillStyle = "rgba(36,36,36," + (p.a * fade).toFixed(3) + ")";
      ctx.fillRect((p.x + 0.5) | 0, (p.y + 0.5) | 0, p.s, p.s);
    }
  }

  function spawnSignal(from, hops) {
    var start = from;
    if (start === undefined) {
      // Start on the near side, where a signal can be seen.
      for (var tries = 0; tries < 12; tries++) {
        var pick = (Math.random() * count) | 0;
        if (proj[pick * 3 + 2] > 0.15) {
          start = pick;
          break;
        }
      }
      if (start === undefined) {
        return;
      }
    }
    var options = around[start];
    if (!options || !options.length) {
      return;
    }
    signals.push({
      a: start,
      b: options[(Math.random() * options.length) | 0],
      t: 0,
      speed: 1.1 + Math.random() * 0.7,
      hops: hops,
    });
  }

  function stepSignals(dt) {
    var limit = wide.matches ? 5 : 3;
    nextSignal -= dt;
    if (nextSignal <= 0 && signals.length < limit) {
      spawnSignal(undefined, 2 + ((Math.random() * 3) | 0));
      nextSignal = 0.35 + Math.random() * 0.6;
    }

    for (var i = signals.length - 1; i >= 0; i--) {
      var s = signals[i];
      s.t += s.speed * dt;
      if (s.t >= 1) {
        pings.push({ node: s.b, age: 0 });
        signals.splice(i, 1);
        if (s.hops > 0) {
          // Carry on to a neighbour, so a signal crosses a few links.
          spawnSignal(s.b, s.hops - 1);
        }
      }
    }

    for (var p = pings.length - 1; p >= 0; p--) {
      pings[p].age += dt;
      if (pings[p].age > 0.9) {
        pings.splice(p, 1);
      }
    }
  }

  function drawSignals() {
    for (var i = 0; i < signals.length; i++) {
      var s = signals[i];
      var a = s.a * 3;
      var b = s.b * 3;
      var front = ((proj[a + 2] + proj[b + 2]) * 0.5 + 1) * 0.5;
      if (front < 0.45) {
        continue;
      }
      var alpha = smooth(0.45, 0.75, front);
      var head = Math.min(1, s.t);
      var tail = Math.max(0, s.t - 0.4);
      var hx = proj[a] + (proj[b] - proj[a]) * head;
      var hy = proj[a + 1] + (proj[b + 1] - proj[a + 1]) * head;
      var tx = proj[a] + (proj[b] - proj[a]) * tail;
      var ty = proj[a + 1] + (proj[b + 1] - proj[a + 1]) * tail;
      ctx.strokeStyle = "rgba(18,18,18," + (0.85 * alpha).toFixed(3) + ")";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = "rgba(18,18,18," + alpha.toFixed(3) + ")";
      ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3);
    }

    ctx.lineWidth = 1;
    for (var p = 0; p < pings.length; p++) {
      var ping = pings[p];
      var o = ping.node * 3;
      var near = (proj[o + 2] + 1) * 0.5;
      if (near < 0.45) {
        continue;
      }
      var life = ping.age / 0.9;
      var r = 2 + easeOutExpo(life) * 13;
      ctx.strokeStyle = "rgba(18,18,18," + ((1 - life) * 0.45 * smooth(0.45, 0.75, near)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(proj[o], proj[o + 1], r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function draw(spin, dt) {
    var size = resize();
    var w = size.w;
    var h = size.h;
    ctx.clearRect(0, 0, w, h);

    var entering = intro > 0;
    drawDust(w, h, dt || 0, entering ? smooth(0, 0.6, clock) : 1);
    if (!points.length) {
      return;
    }

    var desktop = w >= 720;
    // As the hero scrolls away, the globe drifts up and settles back a little.
    var scrolled = Math.min(1, Math.max(0, window.scrollY / Math.max(1, h)));
    var radius = desktop ? Math.min(h, w * 0.55) * 0.42 : Math.min(w * 0.42, h * 0.2);
    radius *= 1 - scrolled * 0.08;
    var fov = 3.15;
    var cx = desktop ? w * 0.72 : w * 0.5;
    var cy = (desktop ? h * 0.52 : h * 0.34) - scrolled * h * 0.12;

    var yaw = spin + leanX;
    var cos = Math.cos(yaw);
    var sin = Math.sin(yaw);
    var pitchCos = Math.cos(leanY);
    var pitchSin = Math.sin(leanY);
    var allSettled = true;

    for (var i = 0; i < count; i++) {
      var p = points[i];
      var x = p.x * cos + p.z * sin;
      var z0 = -p.x * sin + p.z * cos;
      var y = p.y * pitchCos - z0 * pitchSin;
      var z = p.y * pitchSin + z0 * pitchCos;
      var scale = fov / (fov - z);
      var o = i * 3;
      var px = cx + x * radius * scale;
      var py = cy + y * radius * scale;

      var e = 1;
      if (entering) {
        e = easeOutExpo(Math.max(0, (clock - p.delay) / introLength));
        if (e < 1) {
          allSettled = false;
          px = p.sx * w + (px - p.sx * w) * e;
          py = p.sy * h + (py - p.sy * h) * e;
        }
      }
      settle[i] = e;
      proj[o] = px;
      proj[o + 1] = py;
      proj[o + 2] = z;
    }

    if (entering && allSettled) {
      intro = 0;
    }

    ctx.lineWidth = 1;
    for (var n = 0; n < links.length; n += 2) {
      var la = links[n];
      var lb = links[n + 1];
      var a = la * 3;
      var b = lb * 3;
      var grow = entering ? smooth(0.82, 1, Math.min(settle[la], settle[lb])) : 1;
      if (grow <= 0) {
        continue;
      }
      var depth = (proj[a + 2] + proj[b + 2]) * 0.5;
      var front = (depth + 1) * 0.5;
      ctx.strokeStyle = "rgba(26,26,26," + ((0.14 + front * 0.5) * grow).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(proj[a], proj[a + 1]);
      if (grow < 1) {
        // Links draw out from one end while the sphere closes.
        ctx.lineTo(proj[a] + (proj[b] - proj[a]) * grow, proj[a + 1] + (proj[b + 1] - proj[a + 1]) * grow);
      } else {
        ctx.lineTo(proj[b], proj[b + 1]);
      }
      ctx.stroke();
    }

    order.sort(function (a, b) {
      return proj[a * 3 + 2] - proj[b * 3 + 2];
    });
    for (var d = 0; d < count; d++) {
      var k = order[d];
      var oo = k * 3;
      var near = (proj[oo + 2] + 1) * 0.5;
      var s = settle[k];
      // Still dust: small and square. Settled: a round point with depth.
      var arrive = entering ? smooth(0, 0.5, clock) : 1;
      var alpha = (0.28 + near * 0.68) * arrive;
      ctx.fillStyle = "rgba(18,18,18," + alpha.toFixed(3) + ")";
      if (s < 0.6) {
        ctx.fillRect((proj[oo] + 0.5) | 0, (proj[oo + 1] + 0.5) | 0, 2, 2);
      } else {
        ctx.beginPath();
        ctx.arc(proj[oo], proj[oo + 1], 0.7 + near * 1.7 * s, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (!entering && !reduce) {
      drawSignals();
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
    if (!born) {
      born = now;
    }
    clock = (now - born) / 1000;

    var scroll = window.scrollY;
    boost += Math.min(0.5, Math.abs(scroll - lastScroll) * 0.0016);
    lastScroll = scroll;
    boost *= Math.exp(-dt * 1.1);
    angle += dt * (0.18 + boost);

    var ease = 1 - Math.exp(-dt * 2.6);
    leanX += (aimX - leanX) * ease;
    leanY += (aimY - leanY) * ease;

    if (!intro) {
      stepSignals(dt);
    }
    draw(angle, dt);
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
    intro = 0;
    leanX = 0;
    leanY = 0;
    draw(0.85, 0);
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

  build();
  if (reduce) {
    still();
  }

  window.addEventListener(
    "pointermove",
    function (event) {
      if (event.pointerType !== "mouse") {
        return;
      }
      aimX = ((event.clientX / window.innerWidth) * 2 - 1) * 0.32;
      aimY = ((event.clientY / window.innerHeight) * 2 - 1) * 0.2;
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", function () {
    aimX = 0;
    aimY = 0;
  });

  if ("IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    watcher.observe(hero || canvas);
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
      still();
    }
  });

  if (motion.addEventListener) {
    motion.addEventListener("change", applyMotion);
  }
  applyMotion();
})();
