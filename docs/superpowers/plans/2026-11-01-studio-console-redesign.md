# Studio Console Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rombak total landing page menjadi Studio Console (putih + dark mode) dengan proyek vibe2dev, Section Skill AI, Section Cara Kerja, dan Command Palette, tanpa regresi aksesibilitas, responsivitas, maupun performa.

**Architecture:** Satu plan berurutan dalam 7 fase bergerbang (tokens → data/i18n → hero/nav → work+vibe2dev → section AI baru → palette+metadata → verifikasi penuh). Setiap fase berakhir di halaman yang bisa dilihat dan diuji. Tidak ada dependensi runtime baru; pola yang sudah terbukti (expand-inline, replay dua arah, HydrationGuard, focus trap) dipakai ulang.

**Tech Stack:** Next.js 16.4.2 App Router (static), React 19.3.1, TypeScript strict, Tailwind CSS v4 (`@theme inline` + custom variant `dark`), GSAP 3.13 + ScrollTrigger + `@gsap/react`, Phosphor Icons. Verifikasi: Playwright 1.56.1 + `@axe-core/playwright`, skrip `scripts/*.mjs`.

**Spec:** `docs/superpowers/specs/2026-11-01-portfolio-redesign-design.md` — plan ini berargumen dari spec tersebut; eksekutor membaca keduanya.

## Global Constraints

- Tidak ada dependensi runtime baru (`package.json` tidak bertambah selain yang sudah ada).
- Semua string user-facing wajib ID + EN via pola `pick(lang, id, en)` di `lib/i18n.ts` + `lib/content-en.ts`.
- Hanya `transform` + `opacity` yang dianimasikan; easing `power3.out` (`EASE` di `lib/gsap.ts`).
- Replay dua arah: `toggleActions: "play reverse play reverse"` untuk semua reveal baru; dilarang `once: true` pada reveal konten.
- `prefers-reduced-motion` mematikan semua animasi baru dan menampilkan konten final.
- Tidak ada `Date.now()` / `Math.random()` / cabang server-klien di render; HydrationGuard + ThemeScript + `suppressHydrationWarning` tidak disentuh.
- Angka yang belum terverifikasi dari sumber live tidak ditulis di konten sama sekali.
- Halaman tetap berakhir di Kontak; tidak ada footer baru.
- Kontras teks minimal 4.5:1 di kedua tema; tap target minimal 44px; overflow 0px di 320–1920.

## Review Focus

- Command palette dibuka tapi focus trap bocor saat Tab di item terakhir → fokus harus kembali ke item pertama, bukan ke body.
- Reveal section baru strand di opacity 0 saat deep link / lompat scroll → backstop atau refresh harus menahannya.
- Kartu vibe2dev mengklaim angka modul yang belum terverifikasi → angka modul tidak boleh muncul di konten.
- Galeri `Gallery` di dalam kartu expand mewarisi `min-w-0` yang hilang → thumbnail tab bisa mendorong layout melebar di 320px.
- Toggle tema/lang di dalam palette menutup palette tapi fokus tidak kembali → fokus harus kembali ke tombol pemicu palette.

---

### Task 1: Token Studio Console + fondasi CSS (Spec 1.1, 1.2, 1.3)

**Files:**
- Modify: `app/globals.css` (blok `:root` light + `:root[data-theme="dark"]`)
- Modify: `app/layout.tsx` (`viewport.themeColor`)

**Interfaces:**
- Consumes: token `--signal` (`#0f4fd1` light / `#6f97ff` dark) — dipertahankan apa adanya.
- Produces: nilai token baru yang dipakai semua komponen tanpa rename class.

**Langkah dan nilai eksak (disalin verbatim dari Spec Bagian 1.2):**

Light — `--paper:#FFFFFF`, `--paper-deep:#F2F4F6`, `--paper-raised:#FFFFFF`, `--ink:#101418`, `--ink-soft:#3C444C`, `--ink-mute:#5B646D`, `--rule:#E2E7EB`, `--rule-strong:#C3CCD3`. Status: hijau `#0E7A4C`, amber `#9A6200`, merah `#C03535` (hanya badge dengan teks putih).

Dark — `--paper:#0B0E12`, `--paper-deep:#11161C`, `--paper-raised:#151B22`, `--ink:#ECE9E1`, `--ink-soft:#B9B5AC`, `--ink-mute:#8B949B`, `--rule:#232C34`, `--rule-strong:#39434D`. Status: hijau `#34D399`, amber `#FBBF24`, merah `#F87171` (hanya badge/dot kecil).

Radius/bayangan (Spec 1.3): kartu section `rounded-2xl`, panel dalam `rounded-xl`, pil/tombol/input `rounded-full`; satu pola shadow `shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)]` (light) dan `shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]` (dark).

- [ ] **Step 1: Ganti nilai token light di `app/globals.css`**

Ganti seluruh blok `:root { ... }` (baris color-scheme + paper/ink/rule/signal/instrument) dengan nilai light di atas. Nama variabel TIDAK berubah. `--signal`, `--signal-ink`, `--signal-soft`, dan seluruh `--instrument-*` dibiarkan apa adanya.

- [ ] **Step 2: Ganti nilai token dark di `app/globals.css`**

Ganti seluruh blok `:root[data-theme="dark"] { ... }` dengan nilai dark di atas. Nama variabel TIDAK berubah.

- [ ] **Step 3: Samakan `themeColor` dengan latar baru**

Di `app/layout.tsx`, ganti `themeColor: "#f2efe9"` menjadi `"#ffffff"`.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` — Expected: PASS (tidak ada error).
Run: `npm run build` — Expected: sukses, route `/`, `/cv`, `/_not-found`, icon, opengraph.

- [ ] **Step 5: Verifikasi visual baseline token**

Run: `node scripts/shoot.mjs .preview-tokens` (dev server harus jalan di `:3000`; bila mati, jalankan `npx next start -p 3000` dari hasil build).
Buka `.preview-tokens/hero.png`, `.preview-tokens/dark-hero.png`, `.preview-tokens/mobile-hero.png`. Expected: halaman putih bersih (light) / gelap pekat (dark), teks terbaca, tidak ada sisa krem `#eeebe3`.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "Token Studio Console: putih + dark mode"
```

---

### Task 2: Data vibe2dev + Skill AI + Cara Kerja, ID/EN (Spec Bagian 4)

**Files:**
- Modify: `lib/content.ts` (tambah 1 `Project` + 2 array baru)
- Modify: `lib/content-en.ts` (cermin EN, urutan dan slug sama)
- Modify: `lib/i18n.ts` (navLinks + string UI palette)

**Interfaces:**
- Consumes: tipe `Project` dari `lib/content.ts:1-19`; pola `pick(lang, id, en)`.
- Produces: `projects` (8 item, vibe2dev `index:"00"` pertama), `aiSkills`, `workflowSteps`, `navLinks` 6 item, string UI palette — dipakai Task 4, 5, 6.

**Data eksak (disalin dari bahan terverifikasi, bukan karangan):**

`vibe2dev` ID: slug `vibe2dev`, index `"00"`, name `"Vibe2Dev"`, category `"Edukasi"`, role `"Solo builder"`, period `"2026"`, tagline `"Platform belajar coding bilingual dengan 113 kursus dan gerbang JWT."`, summary `"Platform belajar coding bilingual Indonesia/Inggris dengan 113 kursus, gerbang kursus berbasis JWT, audit trail aktivitas, dan dashboard admin/user."`, problem `"Belajar coding dari AI tanpa fondasi membuat orang bisa menyalin tapi tidak memahami. Dibutuhkan jalur terstruktur dari nol sampai paham."`, built: `["113 kursus bilingual ID/EN dengan modul interaktif", "Gerbang kursus berbasis JWT", "Audit trail aktivitas belajar", "Dashboard admin dan user", "Dokumentasi bilingual"]`, outcome `"Live di vibe2dev.my.id dengan gaya brutalism putih yang konsisten."`, stack `["Next.js", "Prisma", "JWT", "CodeMirror", "Tailwind CSS"]`, live `"https://www.vibe2dev.my.id"`, shots: `home.jpg` ("Beranda Vibe2Dev dengan headline dan statistik kursus", caption "Beranda: headline, statistik, dan marquee stack."), `roadmap.jpg` ("Halaman roadmap jalur frontend/backend/fullstack", caption "Roadmap: jalur belajar terstruktur."), `courses.jpg` ("Katalog kursus platform", caption "Katalog: 113 kursus bilingual.").

EN mirror: category `"Education"`, tagline `"Bilingual coding learning platform with 113 courses and a JWT course gate."`, dan terjemahan setia untuk summary/problem/built/outcome/caption (tidak perlu kata-per-kata, tapi fakta sama).

`aiSkills` (ID): `claude-code` ("Claude Code", "Coding agent utama", "Situs ini dibangun dan diverifikasi dengannya: screenshot Playwright dan audit axe tiap perubahan."), `mcp` ("MCP", "Konektor tool untuk agen", "Riset repo dan screenshot vibe2dev dikerjakan langsung dari sesi kerja."), `router` ("9Router", "Gateway multi-model", "Routing antar model untuk efisiensi biaya."), `verifier` ("Playwright + axe", "Verifier otomatis", "0 pelanggaran WCAG AA di light+dark, overflow 0px di 320-1920.").

`workflowSteps` (ID): `paham` ("Pahami", "Brief, repo, dan data dibaca dulu sebelum satu baris kode ditulis.", "Spec tertulis sebelum implementasi"), `bangun` ("Bangun dengan agen", "Claude Code + MCP mengeksekusi per tugas kecil dengan review tiap langkah.", "Commit per tugas"), `verifikasi` ("Verifikasi otomatis", "Playwright screenshot dan audit axe tiap perubahan.", "0 pelanggaran, 0 overflow"), `rilis` ("Rilis", "Push ke main, Vercel deploy otomatis ke domain sendiri.", "fadhliportfolio.my.id").

- [ ] **Step 1: Tambah entri vibe2dev + array baru di `lib/content.ts`**

Sisipkan objek `vibe2dev` sebagai elemen PERTAMA array `projects` (sebelum rikkes). Tambahkan `export const aiSkills = [...]` dan `export const workflowSteps = [...]` setelah `stats`. Tipe: `export type AiSkill = { id: string; name: string; role: string; example: string }`, `export type WorkflowStep = { id: string; title: string; body: string; artifact: string }`. Angka "1.779 modul" DILARANG muncul di mana pun.

- [ ] **Step 2: Cerminkan ke `lib/content-en.ts`**

Tambah entri dan array yang sama dalam bahasa Inggris, urutan dan slug identik. Impor tipe dari `./content` (`import type { AiSkill, Project, WorkflowStep } from "./content"` — tiru pola `content-en.ts:1` yang sudah ada).

- [ ] **Step 3: Perluas `lib/i18n.ts`**

`navLinks`: 01 Proyek/Work, 02 Pengalaman/Experience, 03 Keahlian/Skills, 04 Skill AI/AI Skills (`#skill-ai`), 05 Cara Kerja/Workflow (`#cara-kerja`), 06 Kontak/Contact. Tambah string palette: `search` ("Cari aksi..." / "Search actions..."), `noResult` ("Tidak ada hasil" / "No results"), `hint` ("Panah untuk navigasi, Enter untuk jalankan" / "Arrows to navigate, Enter to run").

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit` — Expected: PASS.

- [ ] **Step 5: Verifikasi data ter-render tanpa merusak halaman**

Jalankan dev/prod lokal, buka console browser: Expected: tidak ada error. Cek cepat via Playwright: `document.querySelectorAll(".project-row").length` tetap 7 (kartu vibe2dev baru dirender Task 4).

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/content-en.ts lib/i18n.ts
git commit -m "Data: vibe2dev, skill AI, langkah workflow (ID/EN)"
```

---

### Task 3: Hero console + Nav console (Spec 3.1, 3.2)

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `components/Nav.tsx`
- Delete: `components/StackOrbit.tsx` (di akhir task, setelah hero tidak lagi mengimpornya)

**Interfaces:**
- Consumes: `useUi`, `useContent` (navLinks, profile, stats); token baru Task 1.
- Produces: hero dengan panel LiveEditor berkulit console putih; nav dengan 6 link + tombol palette (`data-command-palette-trigger`).

**Detail eksak:**

Hero: struktur dipertahankan (badge, H1 dua baris, aside, strip dossier, metrik count-up, timeline GSAP + safety timeout — JANGAN disentuh logikanya). Perubahan: (a) hapus impor dan pemakaian `<StackOrbit />`, ganti dengan panel LiveEditor DALAM jendela console putih: header tab (nama file + tombol copy yang menyalin kode yang sedang tampil + status "typing/saved"), badan LiveEditor, status bar bawah. LiveEditor sendiri TIDAK diubah. (b) `bg-dots` dipertahankan. (c) Tombol copy memakai `navigator.clipboard.writeText` dengan fallback yang sama seperti `Contact.tsx:39-47`.

Nav: struktur pill + progress + drawer dipertahankan. Perubahan: (a) render 6 `navLinks` dari `useUi()` (bukan hardcode), (b) tambah tombol kaca pembesar di grup kanan (desktop + drawer) dengan `aria-label` bilingual "Cari / Search" dan hint `Ctrl K`, yang memicu event `window.dispatchEvent(new CustomEvent("open-command-palette"))`, (c) tombol kirim surel dan status dot dipertahankan.

- [ ] **Step 1: Ganti panel hero menjadi jendela console**

Di `components/Hero.tsx`: hapus `import StackOrbit from "./StackOrbit"`, ganti blok `<StackOrbit />` dengan jendela console putih berisi LiveEditor + tab + tombol copy + status bar. Timeline GSAP, safety timeout, dan count-up TIDAK diubah.

- [ ] **Step 2: Perluas nav 6 link + tombol palette**

Di `components/Nav.tsx`: render `navLinks` dari `useUi()`; tambah tombol pemicu palette (desktop dan drawer) yang dispatch `open-command-palette`. Focus trap drawer tetap mencakup tombol baru (otomatis via `querySelectorAll`, tidak perlu logika baru).

- [ ] **Step 3: Hapus StackOrbit**

Run: `git rm components/StackOrbit.tsx`. Pastikan tidak ada impor tersisa: `grep -rn "StackOrbit" app components lib` — Expected: kosong.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` — Expected: PASS. Run: `npm run build` — Expected: sukses.

- [ ] **Step 5: Verifikasi visual hero + nav**

Run: `node scripts/shoot.mjs .preview-hero`. Buka `hero.png`, `mobile-hero.png`, `dark-hero.png`. Expected: panel console putih (light) / gelap (dark) berisi kode mengetik; nav menampilkan 6 link di desktop dan tombol kaca pembesar; tidak ada sisa orbit.

- [ ] **Step 6: Commit**

```bash
git add components/Hero.tsx components/Nav.tsx
git rm components/StackOrbit.tsx
git commit -m "Hero console + nav 6 link + tombol palette"
```

---

### Task 4: Work index 8 proyek, vibe2dev unggulan (Spec 3.4 + Bagian 4 data)

**Files:**
- Modify: `components/Work.tsx` (kulit kartu + badge "Baru" + data dari `useContent()`)

**Interfaces:**
- Consumes: `projects` (8 item, dari Task 2), pola expand-inline + `Gallery` + NDA (tidak diubah).
- Produces: kartu vibe2dev pertama dengan badge dan link live; 7 kartu lama berkulit baru.

**Detail eksak:** Pola `ProjectCard` + `Gallery` + `expand-grid` dipertahankan 100% logikanya. Perubahan: (a) ambil `projects` dari `useContent()` (bukan impor langsung) agar EN ikut, (b) kartu pertama (`slug === "vibe2dev"`) mendapat badge pil "Baru"/"New" berwarna signal + tautan "Buka situs"/"Visit site" ke `project.live` di dalam area expand, (c) kulit kartu: `rounded-2xl`, thumbnail `rounded-xl`, pil kategori, tombol expand lingkaran — mengikuti token baru otomatis, (d) heading section "01 — Proyek" tetap, sublabel kanan menjadi "08 sistem".

- [ ] **Step 1: Alihkan Work ke data i18n + badge vibe2dev**

Edit `components/Work.tsx` sesuai detail di atas. Logika expand, galeri, NDA, dan `ScrollTrigger.refresh()` TIDAK diubah.

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit` — Expected: PASS. Run: `npm run build` — Expected: sukses.

- [ ] **Step 3: Verifikasi visual + interaksi kartu baru**

Run: `node scripts/modal.mjs` (skrip modal yang ada — memastikan expand pertama tetap berfungsi). Buka screenshot: Expected: kartu vibe2dev pertama dengan badge, 3 thumbnail (home/roadmap/courses) bisa diklik, link live membuka tab baru.

- [ ] **Step 4: Commit**

```bash
git add components/Work.tsx
git commit -m "Work index 8 proyek, vibe2dev unggulan"
```

---

### Task 5: Section Skill AI + Section Cara Kerja, baru (Spec 3.5, 3.6 + Bagian 4 data)

**Files:**
- Create: `components/AiSkills.tsx`
- Create: `components/Workflow.tsx`
- Modify: `app/page.tsx` (sisipkan `<AiSkills />` dan `<Workflow />` antara `<Work />` dan `<Experience />`)

**Interfaces:**
- Consumes: `aiSkills`, `workflowSteps` dari `useContent()`; `EASE`, `prefersReducedMotion`, `useGSAP` dari `lib/gsap.ts`; pola `spot-card` dan rail-fill.
- Produces: section `#skill-ai` dan `#cara-kerja` yang di-anchor nav dan palette.

**Detail eksak:**

`AiSkills.tsx`: section `id="skill-ai"`, heading "04 — Skill AI". Grid `sm:grid-cols-2`, 4 kartu `rounded-2xl border border-rule bg-paper-raised` dengan pola `spot-card` (pointermove seperti `Capabilities.tsx:43-63`, JANGAN ciptakan pola baru). Tiap kartu: ikon Phosphor (`Robot`, `PlugsConnected`, `ArrowsSplit`, `ShieldCheck`), nama, role (label), contoh konkret. Reveal `play reverse play reverse`, `start: "top 88%"`.

`Workflow.tsx`: section `id="cara-kerja"`, heading "05 — Cara Kerja". Desktop: 4 langkah horizontal dengan garis penghubung yang scrub `scaleX` (pola rail-fill `Experience.tsx:24-37`, sumbu X bukan Y); mobile: vertikal dengan `scaleY`. Tiap langkah: nomor readout, judul, 1–2 kalimat, artefak dalam `code` chip. Replay dua arah.

`page.tsx`: urutan `<Hero /> <Ticker /> <Work /> <AiSkills /> <Workflow /> <Experience /> <Capabilities />`.

- [ ] **Step 1: Buat `components/AiSkills.tsx`**

Sesuai detail di atas, bilingual via `pick`. Ikon: `Robot`, `PlugsConnected`, `ArrowsSplit` (atau `GitBranch` bila tidak ada), `ShieldCheck`.

- [ ] **Step 2: Buat `components/Workflow.tsx`**

Sesuai detail di atas. Rail scrub horizontal desktop / vertikal mobile via `matchMedia("(min-width: 1024px)")` di dalam `useGSAP` (bukan dua ScrollTrigger yang berebut).

- [ ] **Step 3: Daftarkan di `app/page.tsx`**

Sisipkan kedua section di antara Work dan Experience sesuai urutan di atas.

- [ ] **Step 4: Typecheck + build**

Run: `npx tsc --noEmit` — Expected: PASS. Run: `npm run build` — Expected: sukses.

- [ ] **Step 5: Verifikasi visual + replay dua arah section baru**

Run skrip shoot yang ada; buka section baru di desktop + mobile + dark. Uji replay: scroll lewat lalu kembali — Expected: animasi maju lagi (bukan strand). Uji `prefers-reduced-motion`: konten langsung final.

- [ ] **Step 6: Commit**

```bash
git add components/AiSkills.tsx components/Workflow.tsx app/page.tsx
git commit -m "Section Skill AI + Cara Kerja"
```

---

### Task 6: Command Palette + kulit section lama + metadata (Spec 3.3, 3.7 + Bagian 8 batasan)

**Files:**
- Create: `components/CommandPalette.tsx`
- Modify: `components/Nav.tsx` (render tombol sudah ada dari Task 3 — pastikan handler terhubung; bila Task 3 sudah dispatch event, task ini hanya mendengarkan)
- Modify: `components/Experience.tsx`, `components/Capabilities.tsx`, `components/Contact.tsx` (penomoran section + kulit minor)
- Modify: `app/opengraph-image.tsx`, `app/icon.png`, `app/apple-icon.png`, `app/layout.tsx` (metadataBase bila domain berubah — default tetap)

**Interfaces:**
- Consumes: `useUi` (navLinks, aksi tema/bahasa/email), `useContent` (projects, profile); event `open-command-palette`.
- Produces: palette global terpasang di `page.tsx`; Experience "02", Capabilities "03", Kontak "06" konsisten dengan nav.

**Detail eksak palette:** state `open`, `query`, `activeIndex`. Aksi dibangun dari data: 6 anchor nav, 8 proyek (scroll ke kartu + buka expand-nya via klik DOM `button[aria-controls*="slug"]` bila tertutup), toggle tema, toggle bahasa, salin email, buka GitHub/LinkedIn/CV. Filter substring atas label ID+EN+keywords. `role="dialog" aria-modal`, `role="listbox"` + `aria-activedescendant`, focus trap + restore fokus (tiru `Nav.tsx:42-78`), Escape menutup, backdrop menutup. Render `null` saat tutup (tidak ada di DOM). Tanpa animasi bila reduced-motion.

Experience: heading "02 — Jalur waktu" tetap; hanya kulit token + pastikan tidak ada nomor hardcode yang bentrok. Capabilities: "03 — Perkakas" tetap. Kontak: "06 — Kontak" (SEBELUMNYA "04" — ini perubahan yang disengaja mengikuti skema nav baru).

Metadata: OG image latar mengikuti token baru (`#FFFFFF` + aksen), teks tetap; favicon monogram FR tetap (tidak digambar ulang kecuali kontras gagal diuji).

- [ ] **Step 1: Buat `components/CommandPalette.tsx`**

Sesuai detail di atas. Dengar event `open-command-palette` + shortcut `Ctrl/Cmd+K` (abaikan saat fokus di input/textarea). ±150 baris, tanpa dependensi baru.

- [ ] **Step 2: Pasang di `app/page.tsx` + hubungkan tombol nav**

Render `<CommandPalette />` di dalam `LangProvider` (sebelah `Nav`). Pastikan tombol Task 3 membuka palette (event atau state bersama — pilih satu, event `open-command-palette` yang sudah dipakai Task 3).

- [ ] **Step 3: Perbarui penomoran Experience/Capabilities/Contact**

Experience "02" (tetap), Capabilities "03" (tetap), Kontak "06" (diubah dari "04"). Hanya label; anchor tidak berubah.

- [ ] **Step 4: Selaraskan OG + ikon + metadata**

`app/opengraph-image.tsx`: latar token baru. `app/layout.tsx`: `themeColor` Task 1 sudah putih; pastikan `metadataBase`/canonical tetap domain sendiri. Regenerasi `icon.png`/`apple-icon.png` HANYA bila uji kontras di Step 5 gagal.

- [ ] **Step 5: Typecheck + build + uji keyboard palette**

Run: `npx tsc --noEmit` — Expected: PASS. Run: `npm run build` — Expected: sukses. Uji manual/skrip: buka via Ctrl+K, ketik filter, panah atas/bawah, Enter mengeksekusi, Escape menutup, fokus kembali ke pemicu. Catat hasil di commit message bila anomali.

- [ ] **Step 6: Commit**

```bash
git add components/CommandPalette.tsx app/page.tsx components/Nav.tsx components/Experience.tsx components/Capabilities.tsx components/Contact.tsx app/opengraph-image.tsx app/layout.tsx
git commit -m "Command palette + penomoran section + metadata selaras"
```

---

### Task 7: Verifikasi penuh + deploy (Spec Bagian 5 motion, Bagian 6 edge, Bagian 7 gerbang)

**Files:** (tidak ada perubahan kode kecuali perbaikan temuan; bila ada, commit terpisah per temuan)

**Gerbang (SEMUA harus hijau, sesuai Spec Bagian 7):**

- [ ] **Step 1: Typecheck + build**

Run: `npx tsc --noEmit` — Expected: PASS. Run: `npm run build` — Expected: sukses 6+ route (tambah `/cv` yang sudah ada).

- [ ] **Step 2: Axe light + dark**

Run: `node scripts/a11y.mjs` — Expected: `violations: 0` di kedua tema, termasuk palette terbuka dan dua section baru. Bila gagal: perbaiki, JANGAN lanjut.

- [ ] **Step 3: Audit overflow + console**

Run: `node scripts/audit.mjs` — Expected: `overflow=0` di 320, 360, 390, 414, 768, 1024, 1440, 1920; console clean.

- [ ] **Step 4: Replay dua arah section baru**

Pola `scripts/replay.mjs` untuk `.ai-skill-card` dan `.workflow-step`: Expected: 1 → 0 (keluar) → naik lagi → 1.

- [ ] **Step 5: Screenshot visual manusia**

Run: `node scripts/shoot.mjs .preview-final`. Baca: hero, work, skill-ai, cara-kerja di desktop 1440 + mobile 390 + dark. Expected: tidak ada teks terpotong, tidak ada kartu kosong, tidak ada section kembar.

- [ ] **Step 6: LCP tidak regresi**

Run: `node scripts/perf.mjs` — Expected: tidak lebih buruk dari ~456ms secara material; tidak ada dependensi runtime baru di bundle.

- [ ] **Step 7: Push + deploy**

```bash
git push origin main
vercel --prod --yes
```

Expected: Production URL 200; verifikasi `title`, `h1`, foto, 8 `.project-row`, overflow 0, tanpa console error (pola `scripts/live.mjs`).

- [ ] **Step 8: Update memory + README**

Update `~/.claude/projects/<project>/memory/*.md` (keputusan, state, pelajaran) dan `README.md` (struktur + stack + perintah verifikasi). Commit terpisah: `git commit -m "Docs: memory + README pasca Studio Console"`.
