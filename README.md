# codewizard-site

Halaman payung **Codewizard**, studio produk kecil, untuk domain `codewizard.id`.

Situs ini statis: HTML, CSS, dan sedikit JavaScript. Tidak ada langkah build. GitHub Pages menyajikan berkas di root cabang bawaan. `CNAME` berisi `codewizard.id`.

Bahasa halaman adalah Bahasa Indonesia. Tombol bahasa Inggris tidak dipasang supaya halamannya tetap longgar.

Sistem visualnya — warna, huruf, jarak, radius, dan gerak — ada di `DESIGN.md` dan sebagai custom property di `styles.css`. `PRODUCT.md` mencatat produk dan ikatan mereknya.

## Menambah produk

Daftar produk ada di `products.js`. Entri terakhir berstatus `segera` adalah slot “Segera hadir”.

1. Sisipkan objek baru **di atas** entri `segera`.
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

`href` harus diawali `https://`. Kartu `segera` tidak punya tautan: isi `name`, `summary`, dan `note`.

Biarkan satu slot `segera` di akhir daftar sampai produk berikutnya benar-benar punya subdomain.

## Berkas

- `index.html` — beranda, plus kartu cadangan bila JavaScript mati
- `404.html` — halaman tidak ditemukan
- `products.js` — satu-satunya daftar produk untuk peramban yang menjalankan skrip
- `site.js` — menggambar kartu dari daftar itu
- `styles.css`, `fonts/` — tampilan; huruf Schibsted Grotesk berlisensi OFL (`fonts/OFL.txt`)
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og.png` — ikon dan gambar pratinjau
