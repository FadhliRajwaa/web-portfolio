# Spec: Rombak Total Desain Portfolio — Studio Console (Putih + Dark Mode)

Status: menunggu review pemilik repo. Belum ada kode implementasi yang ditulis
dari spec ini. Persetujuan spec ini hanya mengizinkan penulisan rencana
implementasi via skill `writing-plans`, bukan eksekusi kode.

## 0. Ringkasan & konteks

Situs portfolio satu halaman Fadhli Rajwaa Rahmana
(`https://www.fadhliportfolio.my.id`) dirombak total dari bahasa visual
"reading-room ledger" (krem `#eeebe3`) menjadi **Studio Console**: putih bersih
sebagai warna kerja + dark mode penuh, dengan aksen signal blue yang sudah ada
(`--signal`) dipertahankan sebagai satu-satunya aksen.

Stack tetap: Next.js 16 App Router (static prerender), React 19, TypeScript,
Tailwind CSS v4, GSAP + ScrollTrigger (+ `@gsap/react`), Phosphor Icons.
Tidak ada dependensi runtime baru. Fokus: kualitas visual, responsivitas
penuh 320–1920px, dan aksesibilitas yang tidak regresi.

Cakupan perubahan:

1. Bahasa visual baru (token warna, radius, bayangan, tipografi display).
2. Tiga konten baru: proyek ke-8 `vibe2dev`, Section Skill AI, Section Cara
   Kerja (AI workflow).
3. Satu komponen interaktif baru: Command Palette (Ctrl+K), custom tanpa
   dependensi.
4. Nav diperluas (link section baru + tombol palette); `lib/i18n.ts` dan
   `lib/content-en.ts` diperluas untuk string baru ID/EN.
5. `app/opengraph-image.tsx` dan `app/icon.png` / `app/apple-icon.png`
   diselaraskan ke bahasa visual baru.

Yang TIDAK berubah (dipertahankan apa adanya, hanya kulit yang diganti bila
perlu): LiveEditor + timer guards-nya; HydrationGuard (inline script, bukan
effect); ThemeScript + `suppressHydrationWarning`; pola GSAP replay dua arah
(`play reverse play reverse`); pola `ScrollTrigger.refresh()` anti-strand;
struktur data `lib/content.ts` (hanya ditambah, tidak di-refactor);
`/cv` + komponen CV; `StackOrbit` boleh dipakai ulang atau dipensiunkan
(kedua opsi valid, lihat Bagian 3).

## 1. Bahasa visual: Studio Console

### 1.1 Peran warna

Putih adalah warna kerja, bukan warna kosong. Setiap section punya satu
pekerjaan visual yang berbeda; warna hanya mendukung, bukan menghias. Light
mode adalah default yang dirancang duluan; dark mode adalah cermin yang
disetarakan, bukan versi yang digelapkan asal.

### 1.2 Token (menggantikan nilai krem di `:root` dan `:root[data-theme=dark]`)

Light:

- `--paper: #FFFFFF` — latar kerja utama.
- `--paper-deep: #F2F4F6` — permukaan sekunder (strip, panel samping).
- `--paper-raised: #FFFFFF` — kartu di atas latar (dipisahkan border Shadow,
  bukan warna).
- `--ink: #101418` — teks utama.
- `--ink-soft: #3C444C` — teks sekunder.
- `--ink-mute: #5B646D` — teks tersier; wajib lolos 4.5:1 di atas paper
  maupun paper-deep (verifikasi di Bagian 7).
- `--rule: #E2E7EB` — garis hairline.
- `--rule-strong: #C3CCD3` — border kartu dan kontrol.
- `--signal` tetap `#0f4fd1`; `--signal-soft` tetap untuk wash.
- Status kecil (hanya badge console, bukan dekorasi): hijau `#0E7A4C`,
  amber `#9A6200`, merah `#C03535` — dipakai eksklusif di atas latar terang
  dengan teks putih, atau sebagai teks di atas putih bila lolos 4.5:1.

Dark (`:root[data-theme="dark"]`):

- `--paper: #0B0E12`, `--paper-deep: #11161C`, `--paper-raised: #151B22`.
- `--ink: #ECE9E1`, `--ink-soft: #B9B5AC`, `--ink-mute: #8B949B`.
- `--rule: #232C34`, `--rule-strong: #39434D`.
- `--signal` tetap `#6f97ff` (nilai yang sudah lolos audit sebelumnya).
- Status: hijau `#34D399`, amber `#FBBF24`, merah `#F87171` — hanya untuk
  badge/dot kecil di atas permukaan gelap.

Utilitas yang memakai token (`bg-paper`, `text-ink`, `border-rule`,
`bg-signal`, `text-signal`, dsb.) TIDAK diganti namanya; hanya nilai token
yang berubah. Ini menjaga diff tetap pada `globals.css` + sedikit
penyesuaian komponen, bukan rename massal.

### 1.3 Radius, bayangan, tipografi

- Radius: 16px (`rounded-2xl`) untuk kartu section, 12px (`rounded-xl`)
  untuk panel dalam, full (`rounded-full`) untuk pil, tombol, dan input.
  Tidak ada radius lain tanpa alasan yang ditulis di spec ini.
- Bayangan: satu pola — `shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)]`
  di light, `shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]` di dark. Dipakai untuk
  kartu terangkat dan dialog palette. Tidak ada glow berwarna.
- Display tetap Archivo condensed (`font-stretch`, `word-spacing` yang sudah
  ada dipertahankan karena itu perbaikan bug nyata, bukan gaya).
  Ukuran hero mengikuti pola `clamp()` agar tidak overflow di 360px
  (pelajaran dari audit vibe2dev: `clamp(2rem, 9vw, 6rem)`, bukan `vw` polos).
- Grain halus (`z-100`, `pointer-events: none`) dipertahankan dengan opacity
  saat ini; `prefers-reduced-transparency` tetap menyembunyikannya.

## 2. Struktur halaman

Urutan section (satu halaman, anchor stabil untuk SEO dan muscle memory):

1. Nav console (`#atas` jangkar atas).
2. Hero console (`#atas`).
3. Work index (`#kerja`) — 8 proyek; `vibe2dev` kartu unggulan pertama.
4. Skill AI (`#skill-ai`) — BARU.
5. Cara Kerja (`#cara-kerja`) — BARU.
6. Pengalaman (`#pengalaman`).
7. Keahlian (`#keahlian`).
8. Kontak (`#kontak`, elemen `<footer>`, halaman berakhir di sini; tidak ada
   footer terpisah — sesuai keputusan yang sudah dicatat di memori).

Setiap section memakai keluarga layout berbeda (hero split, work kartu,
skill grid, cara-kerja pipeline, pengalaman kartu alur + panel potret,
keahlian kartu, kontak footer gelap). Tidak ada dua section yang berbagi
pola visual yang sama.

Mobile (< 768px): semua grid collapse ke satu kolom; pipeline Cara Kerja
menjadi vertikal; command palette menjadi dialog full-screen; nav menjadi
drawer yang sudah ada (diperluas dengan link + aksi baru).

## 3. Komponen kunci

### 3.1 Nav console

Struktur `Nav.tsx` saat ini dipertahankan (pill mengambang, progress bar,
drawer mobile dengan focus trap). Perubahan:

- Tambah link `05 — Skill AI (#skill-ai)` dan `06 — Cara Kerja (#cara-kerja)`
  SETELAH Kontak? Tidak — Kontak harus tetap terakhir dan link lama tidak
  boleh digeser. Keputusan final: sisipkan 04 Skill AI dan 05 Cara Kerja
  sebelum Kontak, dan nomor lama ikut maju satu skema penuh.
  Final (berlaku untuk SEMUA link, lama maupun baru): 01 Proyek,
  02 Pengalaman, 03 Keahlian, 04 Skill AI, 05 Cara Kerja, 06 Kontak.
  Alasan: nomor ganda (dua link "04") lebih membingungkan daripada
  pergeseran satu angka; anchor `#kerja`/`#pengalaman`/dsb tidak berubah,
  hanya label angka.
- Tambah tombol pencarian (ikon Phosphor `MagnifyingGlass`, `aria-label`
  bilingual, hint kbd `Ctrl K` di desktop) yang membuka Command Palette.
- Status dot hijau "Terbuka" dipertahankan.

### 3.2 Hero console

Struktur `Hero.tsx` dipertahankan (badge, H1 dua baris, aside, strip dossier,
grid metrik). Perubahan kulit:

- Latar `bg-dots` blueprint dipertahankan (sudah ada, murah, khas).
- `StackOrbit` DIPENSIUNKAN dari hero dan diganti panel LiveEditor yang
  dibungkus jendela console putih: tab file + tombol copy + status bar di
  bawah. Alasan: orbit 3D CSS tidak komunikatif untuk recruiter; LiveEditor
  adalah bukti kerja yang sebenarnya dan timer guards-nya sudah terverifikasi
  bebas glitch. File `StackOrbit.tsx` dihapus dari tree (bukan dibiarkan
  mati). Jika pemilik repo keberatan saat review spec, fallback yang
  disetujui: StackOrbit pindah ke Section Skill AI sebagai visual "tumpukan
  yang dikendalikan agen".
- Foto potret di strip dossier dipertahankan (sudah terverifikasi di mobile).
- Metrik memakai pola count-up yang sudah ada.

### 3.3 Command Palette (Ctrl+K) — komponen baru `CommandPalette.tsx`

Fungsi: lompat ke section (7 anchor), buka/tutup proyek (8 slug), ganti tema,
ganti bahasa, salin email, buka GitHub/LinkedIn/CV. Total ~20 aksi dari data
yang sudah ada (`useUi`, `useContent`) — tidak ada sumber data baru.

Spesifikasi perilaku:

- Trigger: `Ctrl+K` / `Cmd+K`, tombol nav, dan tombol di drawer mobile.
  Menutup: `Escape`, klik backdrop, atau pilih aksi.
- Daftar difilter substring case-insensitive terhadap label ID + EN +
  keywords (mis. "tema", "theme", "dark", "email", "github", "cv").
- Navigasi panah atas/bawah dengan `aria-activedescendant`; Enter
  mengeksekusi; focus trap penuh seperti modal yang sudah ada; fokus kembali
  ke pemicu saat tutup. Empty state: "Tidak ada hasil" / "No results".
- `prefers-reduced-motion`: tanpa animasi buka/tutup.
- Render: backdrop blur + panel `bg-paper-raised` + input + list; hasil
  memakai ikon Phosphor per tipe aksi (panah, tema, bahasa, salin, tautan).
- Tidak ada dependensi baru (±150 baris, pola modal `Work.tsx` dipakai ulang).

### 3.4 Work: kartu + vibe2dev unggulan

Pola expand-inline `ProjectCard` dipertahankan (lebih baik dari modal untuk
SEO dan mobile; pelajaran dari riwayat repo). Perubahan kulit:

- Kartu: thumbnail screenshot asli di kiri/atas, konten di kanan/bawah;
  badge stack sebagai pil; tombol expand lingkaran dipertahankan.
- `vibe2dev` SELALU dirender pertama dengan badge "Baru" + tautan live ke
  `https://www.vibe2dev.my.id`. Urutan lain tetap (Rikkes, PACS, SIMRS,
  Tilawah, RadVault, SAMCO, Wazuh).
- Galeri `Gallery` + placeholder NDA dipakai ulang tanpa perubahan logika.
- Data `vibe2dev` (ID + EN): stack dari `package.json` aslinya
  (Next.js, Prisma, JWT, CodeMirror, Tailwind); angka "113 kursus" dan
  "bilingual ID/EN" dari screenshot live situsnya; `live` + 3 `shots` yang
  sudah ada di `public/work/vibe2dev/`. Klaim "1.779 modul" dari deskripsi
  repo GitHub TIDAK dipakai sampai terverifikasi dari sumber live (ditandai
  eksplisit di implementasi: angka modul TIDAK ditulis di konten sama sekali
  sampai ada yang memverifikasinya dari sumber live dan men-commit buktinya).

### 3.5 Skill AI — section baru `AiSkills.tsx`

Empat kartu grid (2×2 desktop, 1 kolom mobile):

1. **Claude Code** — coding agent utama; contoh konkret: situs ini dibangun
   dan diverifikasi dengannya (screenshot Playwright + audit axe tiap
   perubahan).
2. **MCP** — konektor tool (GitHub, Postgres, Playwright); contoh: riset
   repo dan screenshot vibe2dev langsung dari sesi kerja.
3. **9Router** — gateway multi-model untuk routing dan efisiensi biaya.
4. **Playwright + axe** — verifier otomatis; contoh: 0 pelanggaran WCAG AA
   di light+dark, overflow 0px di 320–1920.

Setiap kartu: ikon Phosphor, nama, satu kalimat fungsi, satu contoh konkret
dari repo ini (bukan klaim generik). Kartu memakai pola `spot-card` +
reveal yang sudah ada.

### 3.6 Cara Kerja — section baru `Workflow.tsx`

Pipeline 4 langkah horizontal (desktop) / vertikal (mobile):

1. Pahami (brief, repo, data) → 2. Bangun dengan agen (Claude Code + MCP) →
   3. Verifikasi otomatis (Playwright + axe) → 4. Rilis (Vercel + domain).

Garis penghubung memakai pola rail-fill `Experience` (scrub `scaleY`/`scaleX`)
yang sudah terbukti. Setiap langkah: nomor, judul, 1–2 kalimat, dan contoh
artefak dari repo ini (mis. "axe 0 pelanggaran", "LCP ~456ms", "auto deploy
Vercel"). Replay dua arah seperti section lain.

### 3.7 Pengalaman, Keahlian, Kontak

- `Experience.tsx`: pola `FlowCard` + panel potret dipertahankan; hanya kulit
  (token baru otomatis) + penomoran section diperbarui.
- `Capabilities.tsx`: pola kartu + ikon dipertahankan; hanya kulit.
- `Contact.tsx` (= `<footer>`): struktur dipertahankan termasuk tombol
  FIXED `#eeebe3` (pelajaran kontras yang sudah dicatat); hanya kulit.
  Tidak ada footer terpisah baru.

## 4. Data (semua di `lib/content.ts` + `lib/content-en.ts` via `lib/i18n.ts`)

Tambahan baru, tidak ada refactor struktur yang ada:

- 1 entri `Project` `vibe2dev` di kedua bahasa, `index: "00"`, indeks lama
  TIDAK digeser (01–07 tetap; "00" menandakan unggulan dan menghindari
  renumbering + risiko inkonsistensi ID/EN).
- 1 array `aiSkills` (4 item: `{ id, name, role, example }` bilingual via
  pola `pick` yang sudah ada).
- 1 array `workflow` (4 langkah: `{ index, title, body, artifact }` bilingual).
- `navLinks` di `lib/i18n.ts` ditambah Skill AI + Cara Kerja; string UI
  palette (placeholder, empty state, hint) bilingual di file yang sama.
- `stats` boleh ditambah 1 metrik vibe2dev ("113 kursus") HANYA karena
  terverifikasi dari screenshot live; klaim modul ditahan (lihat 3.4).

Semua string baru wajib ID + EN. Tidak ada angka karangan; angka yang belum
terverifikasi tidak ditulis di konten sama sekali (bukan TODO di kode).

## 5. Motion & interaksi

- GSAP `play reverse play reverse` dipertahankan untuk SEMUA section baru
  (pola replay dua arah yang sudah disetujui pemilik).
- `ScrollTrigger.refresh()` setelah font/gambar + backstop CSS
  `reveal-backstop` dipertahankan untuk section baru.
- Palette, expand kartu, dan pipeline memakai `EASE = power3.out` yang sama;
  hanya `transform` + `opacity` yang dianimasikan.
- `prefersReducedMotion()` mematikan: reveal, ticker, pipeline scrub
  (tampil penuh), palette (instan), LiveEditor (tampil utuh — sudah ada).
- Tidak ada animasi dekoratif baru: reveal = hierarki, pipeline = storytelling,
  palette = feedback.

## 6. Error & edge case

- Proyek tanpa screenshot (SAMCO, Wazuh) tetap placeholder NDA; tidak ada
  gambar karangan.
- Gambar gagal load: `alt` + caption tetap menjelaskan; layout kartu tidak
  runtuh (thumbnail punya `aspect-[16/10]` + `bg-paper-deep`).
- Palette tanpa hasil: empty state bilingual; palette dengan JS mati: tombol
  nav tetap berfungsi sebagai anchor biasa (progressive enhancement —
  palette adalah peningkatan, bukan satu-satunya jalan).
- LiveEditor guards dipertahankan (interval self-clear, reset `typed`,
  preview 6 baris, pause off-screen).
- HydrationGuard + ThemeScript + `suppressHydrationWarning` dipertahankan;
  struktur DOM berubah total tapi tidak ada sumber mismatch baru (tidak ada
  `Date.now`/`Math.random` di render, tidak ada cabang server/klien).

## 7. Testing & definisi selesai

Gerbang yang semuanya harus hijau sebelum merge:

1. `npm run typecheck` lolos.
2. `npm run build` statis sukses (3 route + icon + OG).
3. axe via `scripts/a11y.mjs`: **0 pelanggaran** di light + dark, termasuk
   palette terbuka dan dua section baru.
4. `scripts/audit.mjs`: overflow **0px** di 320, 360, 390, 414, 768, 1024,
   1440, 1920; console clean; tidak ada elemen reveal yang strand.
5. Replay dua arah terverifikasi untuk section baru (pola `scripts/replay.mjs`:
   1 → 0 → naik lagi → 1).
6. Keyboard palette diuji manual dieną skrip: buka (Ctrl+K), panah, Enter,
   Escape, focus trap, fokus kembali ke pemicu.
7. Screenshot visual: hero + work + skill + workflow di desktop 1440,
   mobile 390, dan dark mode; dibaca manusia sebelum merge.
8. LCP produksi tidak regresi dari ~456ms (diukur via `scripts/perf.mjs`);
   tidak ada dependensi runtime baru, jadi ini gerbang penjaga, bukan target
   optimasi.
9. OG image + favicon dicek ulang karena kulit berubah (warna latar kartu
   mengikuti token baru; monogram FR tetap).

## 8. Yang disengaja TIDAK dilakukan (anti-scope-creep)

- Tidak ada Three.js/WebGL baru (pelajaran 9 iterasi gagal; orbit CSS yang
  ada boleh pensiun, tidak diganti WebGL).
- Tidak ada library UI (shadcn, MUI, dsb.) — kulit ditulis di token + komponen
  yang ada.
- Tidak ada perubahan `/cv`, autentikasi, backend, atau API.
- Tidak ada i18n di luar ID/EN; tidak ada refactor `content.ts` di luar
  penambahan di Bagian 4.
- Tidak ada footer baru; halaman tetap berakhir di Kontak.
