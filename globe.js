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
  var settle = null;
  var glow = null;
  var count = 0;
  var angle = 0.85;
  var running = false;
  var raf = 0;
  var last = 0;
  var visible = true;

  // Canvas size in CSS pixels, read on resize rather than every frame.
  var cssW = 1;
  var cssH = 1;
  var dpr = 1;

  // Seconds since the first frame, on the wall clock so dropped frames do not
  // stretch the entrance.
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

  // Signals that run along the links. A node they reach brightens briefly.
  var signals = [];
  var nextSignal = 0;

  // Fixed tilt so a still frame already reads as a globe, not a flat ring.
  var tilt = 0.38;
  var tiltCos = Math.cos(tilt);
  var tiltSin = Math.sin(tilt);

  // Depth layers. Everything (links, waves, points) is bucketed by how far it
  // faces the viewer, then drawn back to front, so the back of the sphere is
  // thin and pale and the front is crisp. One path per layer keeps it cheap.
  var LAYERS = 8;

  function linkAlpha(f) {
    return 0.05 + Math.pow(f, 1.7) * 0.5;
  }
  function linkWidth(f) {
    return 0.45 + f * 0.5;
  }
  function waveAlpha(f) {
    return 0.03 + Math.pow(f, 2) * 0.34;
  }
  function waveWidth(f) {
    return 0.5 + f * 0.55;
  }

  // Wave accents: a few bands that wrap the sphere like latitudes, drawn from
  // the emblem's Sasirangan lines. Slow, uneven swells with now and then a
  // tall, narrow, rounded peak. Seeded, so the bands keep one shape on every
  // load. They turn with the mesh and stay lighter than it.
  var waves = [];
  var waveProj = null;
  var waveSteps = 0;

  function seeded(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildWaves() {
    var rand = seeded(58);
    var bases = wide.matches ? [-0.6, -0.22, 0.16, 0.52] : [-0.42, 0.04, 0.46];
    waveSteps = wide.matches ? 420 : 280;
    waves = [];
    for (var b = 0; b < bases.length; b++) {
      var swell = [];
      var freqs = [2, 3, 5];
      for (var f = 0; f < freqs.length; f++) {
        swell.push({ k: freqs[f], amp: (0.07 - f * 0.02) * (0.7 + rand() * 0.6), phase: rand() * Math.PI * 2 });
      }
      var peaks = [];
      var peakCount = 2 + ((rand() * 2) | 0);
      for (var q = 0; q < peakCount; q++) {
        peaks.push({
          at: ((q + rand() * 0.6) / peakCount) * Math.PI * 2,
          height: 0.11 + rand() * 0.08,
          width: 0.06 + rand() * 0.03,
        });
      }
      var lean = (rand() - 0.5) * 0.24;
      var leanCos = Math.cos(lean);
      var leanSin = Math.sin(lean);
      var line = new Float32Array(waveSteps * 3);
      for (var i = 0; i < waveSteps; i++) {
        var theta = (i / waveSteps) * Math.PI * 2;
        var lat = bases[b];
        for (var w = 0; w < swell.length; w++) {
          lat += swell[w].amp * Math.sin(swell[w].k * theta + swell[w].phase);
        }
        for (var r = 0; r < peaks.length; r++) {
          var d = theta - peaks[r].at;
          d -= Math.round(d / (Math.PI * 2)) * Math.PI * 2;
          // A faster rise than fall, with a round top.
          var width = peaks[r].width * (d < 0 ? 0.8 : 1.25);
          lat -= peaks[r].height * Math.exp(-(d * d) / (width * width));
        }
        var ring = Math.cos(lat);
        var x = Math.cos(theta) * ring;
        var y = Math.sin(lat);
        var z = Math.sin(theta) * ring;
        // A small lean of its own, so the bands are not quite parallel.
        var x1 = x * leanCos - y * leanSin;
        var y1 = x * leanSin + y * leanCos;
        line[i * 3] = x1;
        line[i * 3 + 1] = y1 * tiltCos - z * tiltSin;
        line[i * 3 + 2] = y1 * tiltSin + z * tiltCos;
      }
      waves.push(line);
    }
    waveProj = new Float32Array(waveSteps * 3);
  }

  // The mesh is the Delaunay triangulation of evenly spread points: on a
  // sphere that is the convex hull, so a triangle is kept when no other point
  // lies outside its plane. Every link then has about the same length.
  function triangulate(pts) {
    var n = pts.length;
    var near = [];
    for (var i = 0; i < n; i++) {
      var list = [];
      for (var j = 0; j < n; j++) {
        if (i === j) {
          continue;
        }
        var dx = pts[i].x - pts[j].x;
        var dy = pts[i].y - pts[j].y;
        var dz = pts[i].z - pts[j].z;
        list.push({ j: j, d: dx * dx + dy * dy + dz * dz });
      }
      list.sort(function (a, b) {
        return a.d - b.d;
      });
      near.push(list.slice(0, 10).map(function (e) {
        return e.j;
      }));
    }
    var seen = {};
    var pairs = [];
    function add(a, b) {
      var lo = a < b ? a : b;
      var hi = a < b ? b : a;
      var key = lo * 4096 + hi;
      if (!seen[key]) {
        seen[key] = true;
        pairs.push(lo, hi);
      }
    }
    for (var a = 0; a < n; a++) {
      var ns = near[a];
      var pa = pts[a];
      for (var u = 0; u < ns.length; u++) {
        var b = ns[u];
        if (b < a) {
          continue;
        }
        for (var v = 0; v < ns.length; v++) {
          var c = ns[v];
          if (c <= b) {
            continue;
          }
          var pb = pts[b];
          var pc = pts[c];
          var ux = pb.x - pa.x, uy = pb.y - pa.y, uz = pb.z - pa.z;
          var vx = pc.x - pa.x, vy = pc.y - pa.y, vz = pc.z - pa.z;
          var nx = uy * vz - uz * vy;
          var ny = uz * vx - ux * vz;
          var nz = ux * vy - uy * vx;
          if (nx * pa.x + ny * pa.y + nz * pa.z < 0) {
            nx = -nx;
            ny = -ny;
            nz = -nz;
          }
          var ok = true;
          for (var m = 0; m < n && ok; m++) {
            if (m === a || m === b || m === c) {
              continue;
            }
            var pm = pts[m];
            if (nx * (pm.x - pa.x) + ny * (pm.y - pa.y) + nz * (pm.z - pa.z) > 1e-9) {
              ok = false;
            }
          }
          if (ok) {
            add(a, b);
            add(b, c);
            add(a, c);
          }
        }
      }
    }
    return pairs;
  }

  function build() {
    count = wide.matches ? 132 : 84;
    var next = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < count; i++) {
      // Offset by half a step so no point sits on a pole.
      var y = 1 - ((i + 0.5) / count) * 2;
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

    var pairs = triangulate(next);
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
    proj = new Float32Array(count * 3);
    settle = new Float32Array(count);
    glow = new Float32Array(count);
    buildWaves();
  }

  function measure() {
    var rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    var dprCap = cssW < 720 ? 1.5 : 2;
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    var bufW = Math.round(cssW * dpr);
    var bufH = Math.round(cssH * dpr);
    if (canvas.width !== bufW || canvas.height !== bufH) {
      canvas.width = bufW;
      canvas.height = bufH;
    }
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
    var n = w < 720 ? 44 : 76;
    dust = [];
    for (var i = 0; i < n; i++) {
      dust.push({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.75 ? 1.5 : 2,
        a: 0.18 + Math.random() * 0.32,
        vx: (Math.random() - 0.5) * 5,
        vy: -(3 + Math.random() * 7),
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
      ctx.fillStyle = "rgba(42,42,42," + (p.a * fade).toFixed(3) + ")";
      // Snap to device pixels so specks stay square and sharp.
      var sx = Math.round(p.x * dpr) / dpr;
      var sy = Math.round(p.y * dpr) / dpr;
      ctx.fillRect(sx, sy, p.s, p.s);
    }
  }

  function spawnSignal(from, hops) {
    var start = from;
    if (start === undefined) {
      // Start on the near side, where a signal can be seen.
      for (var tries = 0; tries < 12; tries++) {
        var pick = (Math.random() * count) | 0;
        if (proj[pick * 3 + 2] > 0.3) {
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
      speed: 0.9 + Math.random() * 0.5,
      hops: hops,
    });
  }

  function stepSignals(dt) {
    var limit = wide.matches ? 4 : 2;
    nextSignal -= dt;
    if (nextSignal <= 0 && signals.length < limit) {
      spawnSignal(undefined, 2 + ((Math.random() * 3) | 0));
      nextSignal = 0.5 + Math.random() * 0.8;
    }

    for (var i = signals.length - 1; i >= 0; i--) {
      var s = signals[i];
      s.t += s.speed * dt;
      if (s.t >= 1) {
        glow[s.b] = 1;
        signals.splice(i, 1);
        if (s.hops > 0) {
          // Carry on to a neighbour, so a signal crosses a few links.
          spawnSignal(s.b, s.hops - 1);
        }
      }
    }

    for (var g = 0; g < count; g++) {
      if (glow[g] > 0) {
        glow[g] = Math.max(0, glow[g] - dt * 1.4);
      }
    }
  }

  function drawSignals() {
    ctx.lineCap = "round";
    for (var i = 0; i < signals.length; i++) {
      var s = signals[i];
      var a = s.a * 3;
      var b = s.b * 3;
      var front = ((proj[a + 2] + proj[b + 2]) * 0.5 + 1) * 0.5;
      if (front < 0.5) {
        continue;
      }
      var alpha = smooth(0.5, 0.8, front);
      // Ease along the link, so a signal leaves and lands softly.
      var t = Math.min(1, s.t);
      var head = t * t * (3 - 2 * t);
      var tail = Math.max(0, head - 0.45);
      var hx = proj[a] + (proj[b] - proj[a]) * head;
      var hy = proj[a + 1] + (proj[b + 1] - proj[a + 1]) * head;
      var tx = proj[a] + (proj[b] - proj[a]) * tail;
      var ty = proj[a + 1] + (proj[b + 1] - proj[a + 1]) * tail;
      var grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, "rgba(26,26,26,0)");
      grad.addColorStop(1, "rgba(26,26,26," + (0.85 * alpha).toFixed(3) + ")");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();
      ctx.fillStyle = "rgba(26,26,26," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.lineCap = "butt";
  }

  // Path buffers, one per depth layer, reused every frame.
  function layerOf(front) {
    var k = (front * LAYERS) | 0;
    return k < 0 ? 0 : k >= LAYERS ? LAYERS - 1 : k;
  }

  var linkLayers = [];
  var waveLayers = [];
  var dotLayers = [];

  function draw(spin, dt) {
    var w = cssW;
    var h = cssH;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    var k;
    var arrive = entering ? smooth(0, 0.5, clock) : 1;
    var closed = reduce ? 1 : smooth(1.2, 2.6, clock);

    // The limb: one faint hairline on the sphere's silhouette, so the globe
    // reads as a body and not only as lines. It arrives once the sphere closes.
    if (closed > 0) {
      var limb = radius * fov / Math.sqrt(fov * fov - 1);
      ctx.strokeStyle = "rgba(26,26,26," + (0.11 * closed).toFixed(3) + ")";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(cx, cy, limb + 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Sort links into depth layers.
    for (k = 0; k < LAYERS; k++) {
      linkLayers[k] = new Path2D();
      waveLayers[k] = null;
      dotLayers[k] = new Path2D();
    }
    var anyGrowing = false;
    for (var n = 0; n < links.length; n += 2) {
      var la = links[n];
      var lb = links[n + 1];
      var a = la * 3;
      var b = lb * 3;
      var grow = entering ? smooth(0.82, 1, Math.min(settle[la], settle[lb])) : 1;
      if (grow <= 0) {
        continue;
      }
      if (grow < 1) {
        anyGrowing = true;
      }
      var front = ((proj[a + 2] + proj[b + 2]) * 0.5 + 1) * 0.5;
      var path = linkLayers[layerOf(front)];
      path.moveTo(proj[a], proj[a + 1]);
      if (grow < 1) {
        // Links draw out from one end while the sphere closes.
        path.lineTo(proj[a] + (proj[b] - proj[a]) * grow, proj[a + 1] + (proj[b + 1] - proj[a + 1]) * grow);
      } else {
        path.lineTo(proj[b], proj[b + 1]);
      }
    }

    // Waves, projected and split into the same layers.
    var reveal = reduce ? 1 : smooth(1.6, 3.6, clock);
    var waveFade = Math.min(1, reveal * 1.6);
    if (waves.length && reveal > 0) {
      for (k = 0; k < LAYERS; k++) {
        waveLayers[k] = new Path2D();
      }
      var shown = Math.min(waveSteps, Math.ceil(reveal * waveSteps));
      for (var wb = 0; wb < waves.length; wb++) {
        var line = waves[wb];
        for (var s = 0; s < waveSteps; s++) {
          var wo = s * 3;
          var wx = line[wo] * cos + line[wo + 2] * sin;
          var wz0 = -line[wo] * sin + line[wo + 2] * cos;
          var wy = line[wo + 1] * pitchCos - wz0 * pitchSin;
          var wz = line[wo + 1] * pitchSin + wz0 * pitchCos;
          var ws = fov / (fov - wz);
          waveProj[wo] = cx + wx * radius * ws;
          waveProj[wo + 1] = cy + wy * radius * ws;
          waveProj[wo + 2] = wz;
        }
        var end = shown >= waveSteps ? waveSteps : shown - 1;
        var prevLayer = -1;
        for (var q = 0; q < end; q++) {
          var qa = q * 3;
          var qc = ((q + 1) % waveSteps) * 3;
          var layer = layerOf(((waveProj[qa + 2] + waveProj[qc + 2]) * 0.5 + 1) * 0.5);
          var wp = waveLayers[layer];
          if (layer !== prevLayer) {
            wp.moveTo(waveProj[qa], waveProj[qa + 1]);
            prevLayer = layer;
          }
          wp.lineTo(waveProj[qc], waveProj[qc + 1]);
        }
      }
    }

    // Points, also by layer. Back points are specks; front points are round.
    for (var d = 0; d < count; d++) {
      var oo = d * 3;
      var near = (proj[oo + 2] + 1) * 0.5;
      if (settle[d] < 0.6) {
        continue;
      }
      var r = (0.5 + near * near * 1.6) * settle[d] + glow[d] * 1.2;
      var dp = dotLayers[layerOf(near)];
      dp.moveTo(proj[oo] + r, proj[oo + 1]);
      dp.arc(proj[oo], proj[oo + 1], r, 0, Math.PI * 2);
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (k = 0; k < LAYERS; k++) {
      var fl = (k + 0.5) / LAYERS;
      if (waveLayers[k]) {
        ctx.strokeStyle = "rgba(26,26,26," + (waveAlpha(fl) * waveFade).toFixed(3) + ")";
        ctx.lineWidth = waveWidth(fl);
        ctx.stroke(waveLayers[k]);
      }
      ctx.strokeStyle = "rgba(26,26,26," + (linkAlpha(fl) * arrive).toFixed(3) + ")";
      ctx.lineWidth = linkWidth(fl);
      ctx.stroke(linkLayers[k]);
      ctx.fillStyle = "rgba(26,26,26," + ((0.18 + Math.pow(fl, 1.4) * 0.8) * arrive).toFixed(3) + ")";
      ctx.fill(dotLayers[k]);
    }
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";

    // Points still travelling in as dust: small squares, like the dust.
    if (entering) {
      ctx.fillStyle = "rgba(26,26,26," + (0.5 * arrive).toFixed(3) + ")";
      for (var t = 0; t < count; t++) {
        if (settle[t] < 0.6) {
          ctx.fillRect(Math.round(proj[t * 3] * dpr) / dpr, Math.round(proj[t * 3 + 1] * dpr) / dpr, 1.5, 1.5);
        }
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

    var ease = 1 - Math.exp(-dt * 2.2);
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
    measure();
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

  measure();
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
      aimX = ((event.clientX / window.innerWidth) * 2 - 1) * 0.24;
      aimY = ((event.clientY / window.innerHeight) * 2 - 1) * 0.14;
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

  function onResize() {
    measure();
    var next = wide.matches ? 132 : 84;
    if (next !== count) {
      build();
    }
    if (reduce) {
      still();
    }
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(onResize).observe(canvas);
  } else {
    window.addEventListener("resize", onResize);
  }

  if (motion.addEventListener) {
    motion.addEventListener("change", applyMotion);
  }
  applyMotion();
})();
