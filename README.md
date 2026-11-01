# Portfolio Fadhli Rajwaa Rahmana

Situs portfolio satu halaman: delapan sistem yang pernah dibangun (termasuk
Vibe2Dev sebagai unggulan), Skill AI, Cara Kerja, riwayat kerja, keahlian, dan
kontak. Bahasa visual "Studio Console": putih sebagai warna kerja + dark mode
penuh, satu aksen biru. Hero menampilkan editor kode hidup yang mengetik kode
C# sungguhan lengkap dengan syntax highlighting, terminal, dan status bar, di
dalam jendela console putih. Ada Command Palette (Ctrl/Cmd+K) untuk lompat ke
section, buka proyek, ganti tema/bahasa, dan salin surel.

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

Verifikasi (butuh server produksi di `:3000`, mis. `npx next start -p 3000`):

```bash
node scripts/a11y.mjs    # axe WCAG 2.2 AA, light + dark — harus 0 pelanggaran
node scripts/audit.mjs    # overflow 320–1920 + row strand + console — harus bersih
node scripts/perf.mjs    # LCP via port 3140 — tidak boleh regresi dari ~456ms
node scripts/modal.mjs   # smoke test expand kartu proyek
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
  Hero.tsx             judul, ringkasan, jendela console berisi editor
  LiveEditor.tsx       editor kode hidup: mengetik C# dengan syntax highlighting
  Work.tsx             indeks 8 proyek, expand-inline + galeri (vibe2dev unggulan)
  AiSkills.tsx         section "04 — Skill AI", 4 kartu + spot-card
  Workflow.tsx         section "05 — Cara Kerja", pipeline 4 langkah + rail scrub
  CommandPalette.tsx   palette Ctrl+K: anchor, proyek, tema, bahasa, surel, tautan
  Experience.tsx       riwayat kerja dengan kartu alur + panel potret
  Capabilities.tsx     keahlian per kategori
  Contact.tsx          ajakan kontak (footer, "06 — Kontak")
  Nav.tsx              navigasi 6 link + tombol palette, drawer seluler
lib/
  content.ts           SEMUA teks dan data proyek ID (termasuk aiSkills, workflowSteps)
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
| Vibe2Dev | Situs live vibe2dev.my.id | 3, dari situs live (badge Baru + link live) |
| Tilawah | Repo lokal + situs live | Diambil dari situs live |
| RadVault | README repo | Diambil dari aplikasi yang berjalan |
| SAMCO SLC | CV | Tidak ada, ditandai NDA |
| Wazuh ML-MISP | README repo | Tidak ada |

Untuk mengganti atau menambah proyek, sunting array `projects`. Setiap entri
punya `shots` berisi `src`, `alt`, dan `caption`. Jika `shots` kosong dan
`confidential: true`, kartu menampilkan placeholder NDA. Entri `vibe2dev`
selalu dirender pertama (sort `FEATURED_SLUG` di `Work.tsx`). Angka yang belum
terverifikasi dari sumber live (mis. klaim jumlah modul) DILARANG ditulis di
konten.

## Aksesibilitas

- Kontras memenuhi WCAG AA di mode terang dan gelap (diuji axe, 0 pelanggaran).
- Command Palette dan drawer menu mengunci fokus, menutup dengan Escape atau
  klik backdrop, dan mengembalikan fokus ke pemicu.
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
- Reveal section baru (Skill AI, Cara Kerja) memakai
  `toggleActions: "play reverse play reverse"` agar animasi terputar ulang
  dua arah. `ScrollTrigger.refresh()` setelah font dan gambar selesai, plus
  backstop CSS `reveal-backstop`, menjaga konten tidak strand di opacity 0
  saat lompat posisi gulir. (`once: true` masih dipakai reveal lama di
  Work/Capabilities/Contact — warisan yang belum dimigrasi.)
