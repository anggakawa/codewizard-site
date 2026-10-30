(function () {
  "use strict";

  var root = document.getElementById("daftar-isi");
  var products = window.CODEWIZARD_PRODUCTS;
  if (!root || !Array.isArray(products)) {
    return;
  }

  var fragment = document.createDocumentFragment();

  products.forEach(function (product) {
    if (!product || typeof product.name !== "string" || product.name === "") {
      return;
    }

    var isSoon = product.status === "segera";
    var href = typeof product.href === "string" ? product.href : "";
    var hasLink = !isSoon && href.indexOf("https://") === 0;

    var article = document.createElement("article");
    article.className = isSoon ? "produk produk-segera" : "produk";

    if (product.visual === "chart") {
      var visual = document.createElement("canvas");
      visual.className = "grafik";
      visual.setAttribute("aria-hidden", "true");
      article.appendChild(visual);
    }

    var body = document.createElement("div");
    body.className = "produk-isi";

    var heading = document.createElement("h3");
    heading.textContent = product.name;
    body.appendChild(heading);

    if (typeof product.summary === "string" && product.summary !== "") {
      var summary = document.createElement("p");
      summary.textContent = product.summary;
      body.appendChild(summary);
    }

    if (hasLink) {
      var link = document.createElement("a");
      link.className = "buka";
      link.href = href;
      var action = document.createElement("span");
      action.className = "buka-aksi garis";
      action.textContent = product.cta || product.name;
      link.appendChild(action);
      if (typeof product.domain === "string" && product.domain !== "") {
        var domain = document.createElement("span");
        domain.className = "buka-domain";
        domain.textContent = product.domain;
        link.appendChild(domain);
      }
      body.appendChild(link);
    } else if (isSoon) {
      var note = document.createElement("p");
      note.className = "kosong";
      note.textContent = product.note || "Segera hadir.";
      body.appendChild(note);
    }

    article.appendChild(body);

    if (!isSoon && Array.isArray(product.specs)) {
      var list = document.createElement("dl");
      list.className = "spesifikasi";
      product.specs.forEach(function (spec, i) {
        if (!spec || typeof spec.label !== "string" || typeof spec.value !== "string") {
          return;
        }
        var row = document.createElement("div");
        row.style.setProperty("--i", String(i));
        var term = document.createElement("dt");
        term.textContent = spec.label;
        var value = document.createElement("dd");
        value.textContent = spec.value;
        row.appendChild(term);
        row.appendChild(value);
        list.appendChild(row);
      });
      article.appendChild(list);
    }

    fragment.appendChild(article);
  });

  root.replaceChildren(fragment);
})();

(function () {
  "use strict";

  // The list arrives once: the hairline draws, then the words follow.
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  var section = document.getElementById("daftar");
  var targets = [];
  if (section) {
    targets.push(section);
  }
  Array.prototype.forEach.call(document.querySelectorAll(".produk"), function (row) {
    targets.push(row);
  });

  var watcher = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("tampak");
          watcher.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px" }
  );

  targets.forEach(function (target) {
    var box = target.getBoundingClientRect();
    // Anything already on screen at load is left alone.
    if (box.top < window.innerHeight * 0.88) {
      return;
    }
    target.classList.add("siap");
    watcher.observe(target);
  });
})();

(function () {
  "use strict";

  var header = document.getElementById("kepala");
  if (!header) {
    return;
  }

  var ticking = false;

  function update() {
    ticking = false;
    header.classList.toggle("tergulir", window.scrollY > 8);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
})();

(function () {
  "use strict";

  var el = document.getElementById("kata");
  if (!el) {
    return;
  }

  var words = ["build", "deploy", "make it happen"];
  var marks = document.querySelectorAll("#jejak span");
  var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hold = 2800;
  var index = 0;
  var timer = 0;
  var token = 0;

  document.documentElement.style.setProperty("--tahan", hold + "ms");

  function letters(word) {
    el.textContent = "";
    var spans = [];
    for (var i = 0; i < word.length; i++) {
      var span = document.createElement("span");
      span.className = "huruf";
      span.textContent = word.charAt(i);
      el.appendChild(span);
      spans.push(span);
    }
    return spans;
  }

  function mark(active) {
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      m.classList.remove("aktif");
      m.classList.toggle("selesai", i < active);
    }
    if (marks[active]) {
      // Restart the fill even when the same mark is active again.
      void marks[active].offsetWidth;
      marks[active].classList.add("aktif");
    }
  }

  function swap(run) {
    if (run !== token) {
      return;
    }
    if (document.hidden) {
      timer = window.setTimeout(function () {
        swap(run);
      }, 400);
      return;
    }

    glitch(words[(index + 1) % words.length], run, function () {
      index = (index + 1) % words.length;
      mark(index);
      timer = window.setTimeout(function () {
        swap(run);
      }, hold);
    });
  }

  // The change is a short monochrome glitch: the old word jitters and two
  // bands of it slip sideways, then the new word arrives as scrambled glyphs
  // that settle left to right. Steps every ~45ms, so it reads as digital, not
  // as easing. About 420ms in all. Ink and one grey; no colour split.
  var GLYPHS = "#/\\<>_=+*01x";
  var GLITCH = 420;
  var SWAP_AT = 130;
  var STEP = 45;

  function glitch(word, run, done) {
    var begin = 0;
    var lastStep = -STEP;
    var swapped = false;
    var spans = null;
    var slices = [makeSlice("kata-iris"), makeSlice("kata-iris kata-iris-abu")];

    function makeSlice(cls) {
      var s = document.createElement("span");
      s.className = cls;
      s.setAttribute("aria-hidden", "true");
      return s;
    }

    function text() {
      var t = "";
      for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].className === "huruf") {
          t += el.children[i].textContent;
        }
      }
      return t;
    }

    function rand(a, b) {
      return a + Math.random() * (b - a);
    }

    function tick(now) {
      if (run !== token) {
        cleanup();
        return;
      }
      if (!begin) {
        begin = now;
      }
      var t = now - begin;
      if (t >= GLITCH) {
        cleanup();
        done();
        return;
      }
      if (t - lastStep >= STEP) {
        lastStep = t;
        if (!swapped && t >= SWAP_AT) {
          swapped = true;
          spans = letters(word);
        }
        if (swapped) {
          var span = GLITCH - SWAP_AT - 70;
          for (var i = 0; i < spans.length; i++) {
            var ch = word.charAt(i);
            var settleAt = SWAP_AT + ((i + 1) / spans.length) * span;
            spans[i].textContent = ch === " " || t >= settleAt ? ch : GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
          }
        }
        var k = 1 - t / GLITCH;
        el.style.transform = "translateX(" + (rand(-2.5, 2.5) * k).toFixed(1) + "px)";
        var shown = text();
        for (var s = 0; s < slices.length; s++) {
          var sl = slices[s];
          if (sl.parentNode !== el) {
            el.appendChild(sl);
          }
          sl.textContent = shown;
          var on = Math.random() < 0.8;
          var top = rand(5, 75);
          var height = rand(10, 26);
          sl.style.opacity = on ? "1" : "0";
          sl.style.clipPath = "inset(" + top.toFixed(0) + "% -12px " + Math.max(0, 100 - top - height).toFixed(0) + "% -12px)";
          sl.style.transform = "translateX(" + (rand(3, 9) * k * (Math.random() < 0.5 ? -1 : 1)).toFixed(1) + "px)";
        }
      }
      window.requestAnimationFrame(tick);
    }

    function cleanup() {
      el.style.transform = "";
      for (var s = 0; s < slices.length; s++) {
        if (slices[s].parentNode) {
          slices[s].parentNode.removeChild(slices[s]);
        }
      }
      if (spans) {
        for (var i = 0; i < spans.length; i++) {
          spans[i].textContent = word.charAt(i);
        }
      }
    }

    window.requestAnimationFrame(tick);
  }

  function start() {
    token += 1;
    window.clearTimeout(timer);
    index = 0;

    if (motion.matches || typeof el.animate !== "function") {
      el.textContent = motion.matches ? "build, deploy, make it happen" : words[0];
      if (!motion.matches) {
        // No Web Animations: a plain swap on the same clock.
        var run = token;
        var plain = function () {
          if (run !== token) {
            return;
          }
          index = (index + 1) % words.length;
          el.textContent = words[index];
          timer = window.setTimeout(plain, hold);
        };
        timer = window.setTimeout(plain, hold);
      }
      return;
    }

    letters(words[0]);
    var current = token;
    // Let the hero entrance finish before the first mark starts to fill.
    timer = window.setTimeout(function () {
      mark(0);
      timer = window.setTimeout(function () {
        swap(current);
      }, hold);
    }, 1100);
  }

  if (motion.addEventListener) {
    motion.addEventListener("change", start);
  }
  start();
})();
