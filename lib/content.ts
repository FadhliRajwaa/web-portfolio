export type Shot = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  index: string;
  name: string;
  category: string;
  role: string;
  period: string;
  confidential?: boolean;
  tagline: string;
  summary: string;
  problem: string;
  built: string[];
  outcome: string;
  stack: string[];
  shots: Shot[];
  live?: string;
};

export const projects: Project[] = [
  {
    slug: "rikkes-berkala",
    index: "01",
    name: "Rikkes Berkala",
    category: "Pemerintahan",
    role: "Fullstack Developer",
    period: "Des 2025 - Jan 2026",
    tagline: "Sistem manajemen pemeriksaan kesehatan berkala untuk kepolisian daerah.",
    summary:
      "Aplikasi pengelolaan hasil pemeriksaan kesehatan (rikkes) anggota dan ASN. Menggantikan konsolidasi manual dengan alur import, pengiriman hasil lewat WhatsApp, dan laporan PDF otomatis.",
    problem:
      "Rekap hasil pemeriksaan dikumpulkan dari banyak berkas dan dikirim satu per satu. Tidak ada satu tempat untuk melihat status kirim, riwayat, atau hasil per peserta.",
    built: [
      "Alur import data peserta dari WhatsApp dan Excel, dengan validasi duplikat NRP/NIP",
      "Pengiriman hasil PDF bertanda tangan URL, sehingga penerima tanpa akun tetap bisa membuka berkas",
      "Role-based access control dengan Spatie Permission untuk admin, operator, dan instansi",
      "Generator laporan PDF dan integrasi Google Drive serta Sheets untuk distribusi dokumen",
      "Gateway WhatsApp dengan status per peserta, bukan per pesan",
    ],
    outcome:
      "Dipakai di Polda Jawa Timur, Polda Banten, dan Mako Brimob. Status pengiriman hasil terlihat dalam satu dashboard.",
    stack: ["Laravel", "Livewire", "Flux", "MySQL", "Spatie", "DomPDF", "WhatsApp API"],
    live: "https://biddokkespoldajabar.net",
    shots: [
      {
        src: "/work/rikkes/dashboard.jpg",
        alt: "Dashboard Rikkes Berkala menampilkan total peserta, pesan terkirim, dan riwayat aktivitas",
        caption: "Dashboard: ringkasan peserta, status kirim, dan linimasa aktivitas.",
      },
      {
        src: "/work/rikkes/peserta.jpg",
        alt: "Tabel data peserta dengan kolom NRP, pangkat, satuan kerja, dan status",
        caption: "Data peserta: filter, pencarian, dan ekspor.",
      },
      {
        src: "/work/rikkes/login.jpg",
        alt: "Halaman login Rikkes Berkala dengan latar gedung Mapolda Jawa Timur",
        caption: "Halaman masuk dengan identitas instansi.",
      },
    ],
  },
  {
    slug: "sastro-pacs",
    index: "02",
    name: "SASTRO PACS",
    category: "Kesehatan",
    role: "Fullstack Developer",
    period: "2026",
    tagline: "PACS radiologi dengan viewer DICOM 2D, MPR, dan rekonstruksi 3D.",
    summary:
      "Sistem arsip dan komunikasi citra medis untuk rumah sakit tipe C/D dan klinik utama. Mencakup worklist modalitas, viewer radiologi, pelaporan, dan integrasi server DICOM.",
    problem:
      "Rumah sakit kecil sering hanya punya citra di workstation modalitas. Tidak ada arsip terpusat, tidak ada viewer untuk membaca ulang, dan laporan ditulis terpisah dari citranya.",
    built: [
      "Viewer DICOM berbasis Cornerstone3D dengan window/level, zoom, pan, measurement, dan layout multi-frame",
      "Rekonstruksi MPR dan volume 3D dari seri CT, termasuk preset jaringan",
      "Modality Worklist dan integrasi DCM4CHEE Archive maupun Orthanc lewat Docker",
      "Sistem lisensi RSA dengan aktivasi HWID dan masa uji 30 hari",
      "Dual-mode database: SQLite untuk klinik kecil, PostgreSQL untuk rumah sakit",
      "Editor laporan radiologi dengan tanda tangan digital dan addendum",
    ],
    outcome:
      "Berjalan sebagai produk dengan mode instalasi Lite dan Pro, serta dokumentasi deployment untuk kedua profil runtime.",
    stack: [
      "Cornerstone3D",
      "Three.js",
      "Python",
      "Flask",
      "PostgreSQL",
      "Docker",
      "DCM4CHEE",
      "Tailwind CSS",
    ],
    shots: [
      {
        src: "/work/pacs/3d.jpg",
        alt: "Viewer 3D PACS menampilkan rekonstruksi volume CT kepala dengan preset jaringan",
        caption: "Rekonstruksi volume 3D dari seri CT.",
      },
      {
        src: "/work/pacs/mpr.jpg",
        alt: "Tampilan MPR dengan potongan axial, coronal, dan sagittal",
        caption: "MPR: tiga bidang potong dari satu volume.",
      },
      {
        src: "/work/pacs/dashboard.jpg",
        alt: "Dashboard operasional PACS menampilkan antrean studi, worklist, dan status modalitas",
        caption: "Dashboard operasional: antrean, worklist, dan status modalitas.",
      },
      {
        src: "/work/pacs/viewer.jpg",
        alt: "Viewer DICOM 2D dengan toolbar pengukuran dan panel seri",
        caption: "Viewer 2D dengan alat ukur radiologi.",
      },
    ],
  },
  {
    slug: "simrs",
    index: "03",
    name: "SYNVEA SIMRS",
    category: "Kesehatan",
    role: "Fullstack Developer",
    period: "2026",
    tagline: "Sistem informasi rumah sakit dengan 33 modul dan rekam medis elektronik.",
    summary:
      "SIMRS untuk rumah sakit tipe C. Mencakup pendaftaran, rekam medis elektronik, farmasi, billing, laboratorium, radiologi, dan dashboard eksekutif.",
    problem:
      "Rumah sakit tipe C sering memakai aplikasi terpisah per unit, sehingga data pasien berpindah tangan tanpa jejak dan rekam medis tidak pernah lengkap di satu tempat.",
    built: [
      "Rekam medis elektronik dengan alur SOAP, diagnosis ICD-10, tindakan ICD-9, dan tanda tangan digital",
      "33 modul dalam batas domain terpisah, dijaga architecture test agar tidak saling bocor",
      "Audit trail append-only empat lapis untuk setiap perubahan rekam medis",
      "Pendaftaran dengan Master Patient Index dan penomoran rekam medis otomatis tanpa duplikasi",
      "Layar antrean TV, kiosk tablet, dan tampilan mobile untuk alur pasien",
      "Billing, tarif, farmasi, dan resep elektronik terhubung ke satu kunjungan",
    ],
    outcome:
      "Fondasi .NET 10 dan React 19 berjalan dengan 16 test backend, migrasi EF Core, dan dokumentasi blueprint 33 modul.",
    stack: [
      ".NET",
      "C#",
      "React",
      "Vite",
      "Tailwind CSS",
      "PostgreSQL",
      "Entity Framework Core",
    ],
    shots: [
      {
        src: "/work/simrs/emr.jpg",
        alt: "Workspace rekam medis elektronik dengan form SOAP dan diagnosis ICD-10",
        caption: "Rekam medis elektronik: SOAP, ICD-10, dan tanda tangan digital.",
      },
      {
        src: "/work/simrs/registrasi.jpg",
        alt: "Formulir pendaftaran pasien baru dengan Master Patient Index",
        caption: "Pendaftaran dengan MPI dan nomor rekam medis otomatis.",
      },
      {
        src: "/work/simrs/farmasi.jpg",
        alt: "Halaman resep dan stok farmasi",
        caption: "Farmasi: resep dan stok dalam satu alur.",
      },
      {
        src: "/work/simrs/billing.jpg",
        alt: "Halaman billing dan tarif rumah sakit",
        caption: "Billing dan tarif terhubung ke kunjungan.",
      },
    ],
  },
  {
    slug: "tilawah",
    index: "04",
    name: "Tilawah",
    category: "Produk publik",
    role: "Solo builder",
    period: "2026",
    tagline: "Al-Qur'an digital dengan mushaf standar Indonesia, tafsir, dan enam qari.",
    summary:
      "Aplikasi Al-Qur'an lengkap 114 surat dan 30 juz, mengikuti Mushaf Standar Indonesia. Tersedia tafsir Kemenag, murottal enam qari, dan jadwal sholat.",
    problem:
      "Banyak aplikasi Al-Qur'an memakai Mushaf Madinah, yang berbeda dari mushaf cetak yang dipakai di masjid dan pesantren Indonesia.",
    built: [
      "Teks 114 surat dan 30 juz mengikuti Mushaf Standar Indonesia, dengan penanda lanjutan surah",
      "Pemutar murottal enam qari dengan waveform per ayat dan pergantian qari tanpa kehilangan posisi",
      "Tafsir Kemenag per ayat dalam modal, plus Asmaul Husna dan doa harian",
      "Jadwal sholat per kota dan fitur ayat tersimpan",
      "Rendering teks Arab dengan tipografi mushaf, bukan font Arab biasa",
    ],
    outcome:
      "Terbit dan bisa diakses publik di tilawahsurah.my.id.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    live: "https://www.tilawahsurah.my.id",
    shots: [
      {
        src: "/work/tilawah/home.jpg",
        alt: "Beranda Tilawah menampilkan judul, ayat hari ini, dan ringkasan 114 surat",
        caption: "Beranda dengan ayat harian dan ringkasan mushaf.",
      },
    ],
  },
  {
    slug: "radvault",
    index: "05",
    name: "RadVault",
    category: "Infrastruktur",
    role: "Solo builder",
    period: "2026",
    tagline: "Konsol manajemen infrastruktur PACS dengan enkripsi zero-knowledge.",
    summary:
      "Konsol hybrid (web, desktop, CLI, dan MCP server) untuk menyimpan konfigurasi instalasi PACS, kredensial SSH, topologi jaringan, dan lisensi faskes.",
    problem:
      "Tim lapangan menyimpan kredensial SSH dan konfigurasi PACS di catatan tersebar. Saat instalasi bermasalah, tidak ada satu sumber yang bisa dipercaya.",
    built: [
      "Enkripsi AES-256-GCM per kolom dengan kunci dari PBKDF2-SHA512 600.000 iterasi",
      "Auto-lock sesi dan zeroization buffer untuk kredensial di memori",
      "Implementasi protokol DICOM Upper Layer murni di Node, termasuk C-ECHO, C-FIND, C-STORE, C-MOVE, dan C-GET",
      "Generator runbook darurat per faskes dalam Markdown dan HTML siap cetak",
      "Backup terenkripsi dengan format arsip sendiri dan restorasi transaksional",
      "26 tool MCP agar asisten AI bisa mengaudit kesiapan deployment",
    ],
    outcome:
      "Berjalan sebagai monorepo dengan web console, aplikasi desktop, CLI operator, dan MCP server.",
    stack: ["React", "Vite", "Node.js", "SQLite", "AES-256-GCM", "DICOM", "MCP"],
    shots: [
      {
        src: "/work/radvault/console.jpg",
        alt: "Konsol RadVault dengan panel fasilitas, fleet radar, dan status vault terkunci",
        caption: "Konsol presisi dengan status vault dan diagnostik port.",
      },
    ],
  },
  {
    slug: "samco-slc",
    index: "06",
    name: "SAMCO SLC",
    category: "Perbankan",
    role: "Backend Developer",
    period: "Apr - Okt 2026",
    confidential: true,
    tagline: "43 modul parameter master data untuk platform manajemen aset khusus.",
    summary:
      "Platform manajemen aset khusus untuk restrukturisasi, litigasi, dan penjualan aset, dipakai institusi keuangan. Dikerjakan sebagai backend developer melalui PT Intikom Berlian Mustika, ditempatkan di PT Skyworx Indonesia.",
    problem:
      "Parameter kredit tersebar di banyak tabel dan alur persetujuan. Setiap perubahan data kritikal harus punya jejak audit dan kontrol ganda.",
    built: [
      "43 modul parameter master data dalam C# dan ASP.NET Core: agunan, fasilitas kredit, mata uang, kurs, produk, dan data referensi wilayah",
      "Alur Maker-Checker untuk create, approve, reject, update dengan diff sebelum-sesudah, aktivasi, dan soft delete",
      "Batch dan cascade approval untuk parameter bertingkat seperti tiering kode RM dan kondisi jenis agunan",
      "448 route REST di belakang gateway KrakenD",
      "Optimasi sorting dan filtering di 45 repository, plus perbaikan duplikasi INSERT dan pembuatan kode parameter menjadi immutable",
      "Migrasi DDL/DML dan seed untuk UAT serta staging di PostgreSQL",
    ],
    outcome:
      "Kontrak enam bulan selesai dengan modul dan dokumentasi diserahkan ke tim permanen sebelum masa kontrak berakhir.",
    stack: [
      ".NET",
      "C#",
      "ASP.NET Core",
      "Entity Framework Core",
      "Dapper",
      "PostgreSQL",
      "KrakenD",
    ],
    shots: [],
  },
  {
    slug: "wazuh-ml",
    index: "07",
    name: "Wazuh ML-MISP",
    category: "Keamanan",
    role: "Solo builder",
    period: "2026",
    tagline: "Pipeline machine learning untuk menekan false positive alert SIEM.",
    summary:
      "Pipeline dua tahap yang mengklasifikasikan alert Wazuh dengan DBSCAN dan Random Forest, lalu memperkayanya dengan threat intelligence MISP.",
    problem:
      "SIEM menghasilkan terlalu banyak alarm palsu, sehingga alert yang benar-benar berbahaya tenggelam.",
    built: [
      "Klasifikasi 11 kelas (benign dan 10 fase serangan) dengan DBSCAN untuk deviation score dan Random Forest untuk keputusan akhir",
      "Enrichment IOC dari MISP untuk menutup false negative yang lolos dari model",
      "Logika empat kuadran yang menggabungkan hasil ML dan threat intelligence",
      "Penulisan hasil kembali ke OpenSearch agar muncul di dashboard Wazuh",
      "Deployment dua VM dengan FastAPI sebagai layanan inferensi",
    ],
    outcome:
      "False positive turun 66,78% dengan Random Forest dan 70,39% dengan XGBoost pada dataset uji.",
    stack: ["Python", "FastAPI", "scikit-learn", "DBSCAN", "MISP", "Wazuh", "OpenSearch"],
    shots: [],
  },
];

export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  points: string[];
  current?: boolean;
};

export const experience: Experience[] = [
  {
    period: "Apr 2026 - Okt 2026",
    role: "Backend Developer (.NET)",
    company: "PT Intikom Berlian Mustika",
    location: "Penempatan di PT Skyworx Indonesia",
    description:
      "Kontrak enam bulan pada produk perbankan SAMCO, domain parameter dan master data.",
    points: [
      "43 modul parameter master data dengan ASP.NET Core dan PostgreSQL",
      "Maker-Checker, audit trail, batch dan cascade approval",
      "448 route REST di belakang gateway KrakenD",
    ],
  },
  {
    period: "Des 2025 - Jan 2026",
    role: "Fullstack Developer",
    company: "Polda Jawa Barat, Banten, dan Mako Brimob",
    location: "Freelance",
    description:
      "Sistem Rikkes Berkala untuk tiga instansi, dari import data sampai distribusi hasil.",
    points: [
      "Laravel, Livewire, dan Flux dengan role-based access control",
      "Import WhatsApp dan Excel, laporan PDF otomatis",
      "Integrasi Google Drive dan Sheets untuk distribusi dokumen",
    ],
  },
  {
    period: "2026 - sekarang",
    role: "Solo builder",
    company: "Produk dan proyek mandiri",
    location: "Remote",
    description:
      "Membangun produk kesehatan, pemerintahan, dan infrastruktur dari perancangan sampai rilis.",
    points: [
      "SASTRO PACS, SYNVEA SIMRS, RadVault, Tilawah, dan pipeline keamanan Wazuh",
      "Menentukan lingkup, membangun, dan merilis sendiri",
      "Merawat aplikasi yang sudah berjalan",
    ],
    current: true,
  },
];

export const capabilities = [
  {
    title: "Backend",
    items: [
      "C#",
      ".NET",
      "ASP.NET Core",
      "Entity Framework Core",
      "Dapper",
      "Laravel",
      "Node.js",
      "Express",
      "FastAPI",
      "REST API",
      "KrakenD",
      "JWT",
    ],
    note: "Kontrak API, lapisan data, dan aturan bisnis yang bisa diuji. Termasuk alur persetujuan dan audit trail.",
  },
  {
    title: "Frontend",
    items: [
      "TypeScript",
      "React",
      "Next.js",
      "Vue 3",
      "Livewire",
      "Tailwind CSS",
      "Three.js",
      "Cornerstone3D",
      "Motion",
    ],
    note: "Antarmuka yang cepat dan responsif, termasuk viewer citra medis dan visualisasi 3D.",
  },
  {
    title: "Data",
    items: ["PostgreSQL", "SQL Server", "MySQL", "MongoDB", "SQLite", "Redis", "Prisma"],
    note: "Skema, migrasi, indexing, dan optimasi query. Termasuk DDL/DML untuk lingkungan UAT.",
  },
  {
    title: "Infrastruktur",
    items: ["Docker", "Linux", "Nginx", "Git", "CI/CD", "Vercel", "Orthanc", "DCM4CHEE"],
    note: "Rilis yang bisa diulang. Termasuk deployment PACS dengan server DICOM.",
  },
];

export const stats = [
  { value: "7", label: "Produk dan sistem" },
  { value: "43", label: "Modul perbankan" },
  { value: "3", label: "Instansi pemerintahan" },
  { value: "448", label: "Route REST" },
];

export const certifications = [
  { name: "Introduction to API Automation Using Postman", issuer: "PT Skyworx Indonesia", year: "2026", score: "90/100" },
  { name: "Secure Software Development Life Cycle", issuer: "PT Skyworx Indonesia", year: "2026" },
  { name: "Coding Camp Front-End & Back-End", issuer: "Dicoding x DBS Foundation", year: "2025", score: "910 jam" },
  { name: "English for Business Communication", issuer: "The British Institute", year: "2025", score: "82%" },
];

export const profile = {
  name: "Fadhli Rajwaa Rahmana",
  shortName: "Fadhli Rajwaa",
  role: "Backend Developer",
  subtitle: "Backend .NET, frontend React, sistem kesehatan",
  email: "fadhlirajwaarahmana@gmail.com",
  phone: "+62 812-3171-2687",
  github: "https://github.com/FadhliRajwaa",
  linkedin: "https://linkedin.com/in/fadhli-rajwaa-rahmana",
  location: "Semarang, Jawa Tengah",
  education: "S1 Teknik Informatika, Universitas Stikubank Semarang",
  bio: "Backend developer dengan pengalaman membangun layanan .NET untuk perangkat lunak perbankan. Sejak 2026 mengerjakan produk kesehatan dan pemerintahan sebagai solo builder, dari skema basis data sampai antarmuka.",
};
