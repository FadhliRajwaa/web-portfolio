# Portfolio Fadhli Rajwaa Rahmana

Situs portfolio satu halaman: tujuh sistem yang pernah dibangun, riwayat kerja,
keahlian, dan kontak. Hero menampilkan editor kode hidup yang mengetik kode C#
sungguhan lengkap dengan syntax highlighting, terminal, dan status bar.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

```bash
npm run build       # build produksi
npm run start       # jalankan hasil build
npm run typecheck   # cek tipe
```

## Stack

- Next.js 16 (App Router, static prerender) + React 19 + TypeScript
- Tailwind CSS v4, token warna di `app/globals.css`
- GSAP + ScrollTrigger untuk reveal dan progres gulir
- Archivo Variable + JetBrains Mono, self-host lewat `next/font/local`

## Struktur

```
app/
  layout.tsx           font, metadata
  page.tsx             susunan seksi
  globals.css          token warna light/dark, tipografi, scrollbar
  opengraph-image.tsx  kartu OG yang dirender saat build
components/
  Hero.tsx             judul, ringkasan, panel editor
  LiveEditor.tsx       editor kode hidup: mengetik C# dengan syntax highlighting
  Work.tsx             daftar proyek + modal detail dengan galeri screenshot
  Experience.tsx       riwayat kerja dengan garis progres
  Capabilities.tsx     keahlian per kategori
  Contact.tsx          ajakan kontak
  Nav.tsx              navigasi desktop dan menu seluler
lib/
  content.ts           SEMUA teks dan data proyek
  gsap.ts              registrasi plugin dan helper animasi
public/work/           screenshot asli tiap proyek
```

## Data proyek

Semua teks ada di `lib/content.ts`. Sumbernya:

| Proyek | Sumber data | Screenshot |
|---|---|---|
| Rikkes Berkala | CV + repo lokal, dijalankan ulang | Diambil dari aplikasi yang berjalan |
| SASTRO PACS | README repo + `docs/images` | Screenshot asli proyek |
| SYNVEA SIMRS | README repo + `docs/screenshots` | Screenshot asli proyek |
| Tilawah | Repo lokal + situs live | Diambil dari situs live |
| RadVault | README repo | Diambil dari aplikasi yang berjalan |
| SAMCO SLC | CV | Tidak ada, ditandai NDA |
| Wazuh ML-MISP | README repo | Tidak ada |

Untuk mengganti atau menambah proyek, sunting array `projects`. Setiap entri
punya `shots` berisi `src`, `alt`, dan `caption`. Jika `shots` kosong dan
`confidential: true`, modal menampilkan keterangan kerahasiaan.

## Aksesibilitas

- Kontras memenuhi WCAG AA di mode terang dan gelap (diuji axe, 0 pelanggaran).
- Modal mengunci fokus, menutup dengan Escape, dan mengembalikan fokus.
- `prefers-reduced-motion` menghentikan animasi GSAP dan menampilkan kode utuh.
- Ada tautan "Lompat ke konten".

## Catatan teknis

- Hero memakai editor teks asli, bukan gambar atau canvas. Teks tetap tajam di
  semua zoom, dan tidak ada beban render WebGL.
- Editor mengetik karakter per karakter. Saat satu berkas selesai, interval
  berhenti sendiri dan satu timeout memindahkan ke berkas berikutnya. Versi
  sebelumnya menjadwalkan timeout dari dalam state updater, sehingga puluhan
  timeout menumpuk dan meledak bersamaan. Itu penyebab glitch saat selesai.
- `typed` di-reset ke 0 setiap ganti berkas. Tanpa itu berkas berikutnya
  langsung dianggap selesai.
- Timer berhenti saat panel keluar dari viewport, dan seluruh berkas langsung
  tampil utuh bila `prefers-reduced-motion` aktif.
- Animasi GSAP memakai `once: true` dan `ScrollTrigger.refresh()` setelah font
  dan gambar selesai, agar konten tidak tertinggal transparan saat lompat
  posisi gulir.
