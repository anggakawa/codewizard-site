(function () {
  "use strict";

  var root = document.getElementById("daftar");
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

    var body = document.createElement("div");
    body.className = "produk-isi";

    var heading = document.createElement("h2");
    heading.textContent = product.name;
    body.appendChild(heading);

    if (typeof product.summary === "string" && product.summary !== "") {
      var summary = document.createElement("p");
      summary.textContent = product.summary;
      body.appendChild(summary);
    }

    article.appendChild(body);

    var meta = document.createElement("div");
    meta.className = "produk-meta";

    if (!isSoon && Array.isArray(product.specs)) {
      var list = document.createElement("dl");
      list.className = "spesifikasi";
      product.specs.forEach(function (spec) {
        if (!spec || typeof spec.label !== "string" || typeof spec.value !== "string") {
          return;
        }
        var row = document.createElement("div");
        var term = document.createElement("dt");
        term.textContent = spec.label;
        var value = document.createElement("dd");
        value.textContent = spec.value;
        row.appendChild(term);
        row.appendChild(value);
        list.appendChild(row);
      });
      meta.appendChild(list);
    }

    if (hasLink) {
      var link = document.createElement("a");
      link.className = "buka";
      link.href = href;
      var action = document.createElement("span");
      action.className = "buka-aksi";
      action.textContent = product.cta || product.name;
      link.appendChild(action);
      if (typeof product.domain === "string" && product.domain !== "") {
        var domain = document.createElement("span");
        domain.className = "buka-domain";
        domain.textContent = product.domain;
        link.appendChild(domain);
      }
      meta.appendChild(link);
    } else if (isSoon) {
      var note = document.createElement("p");
      note.className = "kosong";
      note.textContent = product.note || "Segera hadir.";
      meta.appendChild(note);
    }

    article.appendChild(meta);
    fragment.appendChild(article);
  });

  root.replaceChildren(fragment);
})();
