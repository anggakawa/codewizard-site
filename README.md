# codewizard-site

Halaman payung **Codewizard**, studio produk kecil, untuk domain `codewizard.id`.

Situs ini statis: HTML, CSS, dan sedikit JavaScript. Tidak ada langkah build. GitHub Pages menyajikan berkas di root cabang bawaan. `CNAME` berisi `codewizard.id`.

Bahasa halaman adalah Bahasa Indonesia. Tombol bahasa Inggris tidak dipasang supaya halamannya tetap longgar.

Sistem visualnya — warna, huruf, jarak, radius, dan gerak — ada di `DESIGN.md` dan sebagai custom property di `styles.css`. `PRODUCT.md` mencatat produk dan ikatan mereknya.

## Menambah produk

Daftar produk ada di `products.js`. Saat ini isinya hanya Chartwizard.

1. Tambah objek baru di array.
2. Salin pola `<article class="produk">` di `index.html` supaya pengunjung tanpa JavaScript melihat produk yang sama.
3. Commit. Tidak perlu membangun ulang.

Contoh objek:

```js
{
  name: "Nama produk",
  status: "tersedia",
  summary: "Satu atau dua kalimat tentang apa yang dilakukan aplikasi ini.",
  specs: [
    { label: "Platform", value: "Windows" },
    { label: "Pasar", value: "IDX/BEI" },
    { label: "Paket", value: "Pro, lewat Lynk" },
    { label: "Bulanan", value: "sekitar Rp19.000" },
    { label: "Tahunan", value: "sekitar Rp150.000" },
  ],
  href: "https://nama.codewizard.id",
  cta: "Buka Nama produk",
  domain: "nama.codewizard.id",
}
```

`href` harus diawali `https://`. Objek `status: "segera"` tidak punya tautan: isi `name`, `summary`, dan `note`. Jangan menambahkannya sebelum produknya benar-benar diumumkan.

## Berkas

- `index.html` — beranda: hero, lalu daftar produk, plus kartu cadangan bila JavaScript mati
- `globe.js` — bola garis di hero. Berhenti saat tab disembunyikan, saat keluar layar, dan saat pengunjung meminta gerak dikurangi
- `404.html` — halaman tidak ditemukan
- `products.js` — satu-satunya daftar produk untuk peramban yang menjalankan skrip
- `site.js` — menggambar kartu dari daftar itu
- `styles.css`, `fonts/` — tampilan; huruf Schibsted Grotesk berlisensi OFL (`fonts/OFL.txt`)
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og.png` — ikon dan gambar pratinjau
