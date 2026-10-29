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

    var old = Array.prototype.slice.call(el.children);
    var leaving = old.map(function (span, i) {
      return span.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(-110%)", opacity: 0 },
        ],
        { duration: 380, delay: i * 18, easing: "cubic-bezier(0.7, 0, 0.84, 0)", fill: "forwards" }
      ).finished;
    });

    Promise.all(leaving).then(function () {
      if (run !== token) {
        return;
      }
      index = (index + 1) % words.length;
      var spans = letters(words[index]);
      spans.forEach(function (span, i) {
        span.animate(
          [
            { transform: "translateY(110%)", opacity: 0 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          { duration: 760, delay: i * 26, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }
        );
      });
      mark(index);
      timer = window.setTimeout(function () {
        swap(run);
      }, hold);
    });
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
