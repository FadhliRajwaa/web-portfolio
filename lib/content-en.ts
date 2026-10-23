import type { Experience, Project } from "./content";

/** English mirror of lib/content.ts. Same order, same slugs. */

export const projectsEn: Project[] = [
  {
    slug: "rikkes-berkala",
    index: "01",
    name: "Rikkes Berkala",
    category: "Government",
    role: "Fullstack Developer",
    period: "Dec 2025 - Jan 2026",
    tagline: "Periodic health-check management system for the regional police.",
    summary:
      "An app for managing member and civil-servant health-check results. It replaces manual consolidation with import flows, result delivery over WhatsApp, and automatic PDF reports.",
    problem:
      "Check-up recaps were collected from scattered files and sent one by one. There was no single place to see delivery status, history, or results per participant.",
    built: [
      "Participant import from WhatsApp and Excel, with duplicate NRP/NIP validation",
      "Result PDFs delivered through signed URLs, so recipients without accounts can still open files",
      "Role-based access control with Spatie Permission for admins, operators, and agencies",
      "PDF report generator plus Google Drive and Sheets integration for document distribution",
      "WhatsApp gateway with per-participant status, not per message",
    ],
    outcome:
      "Used by the East Java, Banten regional police and Mobile Brigade HQ. Delivery status is visible in one dashboard.",
    stack: ["Laravel", "Livewire", "Flux", "MySQL", "Spatie", "DomPDF", "WhatsApp API"],
    live: "https://biddokkespoldajabar.net",
    shots: [
      {
        src: "/work/rikkes/dashboard.jpg",
        alt: "Rikkes Berkala dashboard showing participant totals, messages sent, and activity history",
        caption: "Dashboard: participant summary, delivery status, and activity timeline.",
      },
      {
        src: "/work/rikkes/peserta.jpg",
        alt: "Participant data table with NRP, rank, unit, and status columns",
        caption: "Participant data: filter, search, and export.",
      },
      {
        src: "/work/rikkes/login.jpg",
        alt: "Rikkes Berkala login page with the East Java regional police HQ building backdrop",
        caption: "Sign-in page with agency identity.",
      },
    ],
  },
  {
    slug: "sastro-pacs",
    index: "02",
    name: "SASTRO PACS",
    category: "Healthcare",
    role: "Fullstack Developer",
    period: "2026",
    tagline: "Radiology PACS with 2D DICOM viewer, MPR, and 3D reconstruction.",
    summary:
      "A picture archiving and communication system for type-C/D hospitals and primary clinics. Covers modality worklists, radiology viewers, reporting, and DICOM server integration.",
    problem:
      "Small hospitals often keep images only on the modality workstation. No central archive, no viewer for re-reads, and reports written separately from the images.",
    built: [
      "Cornerstone3D-based DICOM viewer with window/level, zoom, pan, measurement, and multi-frame layouts",
      "MPR and 3D volume reconstruction from CT series, including tissue presets",
      "Modality Worklist and integration with DCM4CHEE Archive and Orthanc via Docker",
      "RSA licensing system with HWID activation and a 30-day trial",
      "Dual-mode database: SQLite for small clinics, PostgreSQL for hospitals",
      "Radiology report editor with digital signatures and addenda",
    ],
    outcome:
      "Shipping as a product with Lite and Pro install modes, plus deployment docs for both runtime profiles.",
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
        alt: "PACS 3D viewer showing a head-CT volume reconstruction with tissue preset",
        caption: "3D volume reconstruction from a CT series.",
      },
      {
        src: "/work/pacs/mpr.jpg",
        alt: "MPR view with axial, coronal, and sagittal slices",
        caption: "MPR: three slice planes from one volume.",
      },
      {
        src: "/work/pacs/dashboard.jpg",
        alt: "PACS operations dashboard showing study queue, worklist, and modality status",
        caption: "Operations dashboard: queue, worklist, and modality status.",
      },
      {
        src: "/work/pacs/viewer.jpg",
        alt: "2D DICOM viewer with measurement toolbar and series panel",
        caption: "2D viewer with radiology measurement tools.",
      },
    ],
  },
  {
    slug: "simrs",
    index: "03",
    name: "SYNVEA SIMRS",
    category: "Healthcare",
    role: "Fullstack Developer",
    period: "2026",
    tagline: "Hospital information system with 33 modules and electronic medical records.",
    summary:
      "A SIMRS for type-C hospitals. Covers registration, electronic medical records, pharmacy, billing, laboratory, radiology, and an executive dashboard.",
    problem:
      "Type-C hospitals often run one app per unit, so patient data moves between hands without a trace and the medical record is never complete in one place.",
    built: [
      "Electronic medical records with SOAP flow, ICD-10 diagnoses, ICD-9 procedures, and digital signatures",
      "33 modules in separated domain boundaries, guarded by architecture tests",
      "Four-layer append-only audit trail for every record change",
      "Registration with a Master Patient Index and automatic, duplication-free record numbering",
      "TV queue displays, tablet kiosks, and mobile views for the patient flow",
      "Billing, tariffs, pharmacy, and e-prescriptions tied to one visit",
    ],
    outcome:
      "The .NET 10 and React 19 foundation runs with 16 backend tests, EF Core migrations, and a 33-module blueprint.",
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
        alt: "Electronic medical record workspace with SOAP form and ICD-10 diagnosis",
        caption: "Electronic records: SOAP, ICD-10, and digital signatures.",
      },
      {
        src: "/work/simrs/registrasi.jpg",
        alt: "New patient registration form with Master Patient Index",
        caption: "Registration with MPI and automatic record numbers.",
      },
      {
        src: "/work/simrs/farmasi.jpg",
        alt: "Prescription and pharmacy stock page",
        caption: "Pharmacy: prescriptions and stock in one flow.",
      },
      {
        src: "/work/simrs/billing.jpg",
        alt: "Hospital billing and tariff page",
        caption: "Billing and tariffs tied to the visit.",
      },
    ],
  },
  {
    slug: "tilawah",
    index: "04",
    name: "Tilawah",
    category: "Public product",
    role: "Solo builder",
    period: "2026",
    tagline: "Digital Qur'an following the Indonesian standard mushaf, with tafsir and six reciters.",
    summary:
      "A complete Qur'an app with 114 surahs and 30 juz, following the Indonesian Standard Mushaf. Includes Kemenag tafsir, six-reciter murattal, and prayer times.",
    problem:
      "Many Qur'an apps use the Madinah mushaf, which differs from the printed mushaf used in Indonesian mosques and pesantren.",
    built: [
      "Full 114-surah, 30-juz text following the Indonesian Standard Mushaf, with surah-continuation markers",
      "Six-reciter murattal player with per-verse waveform and reciter switching without losing position",
      "Per-verse Kemenag tafsir in a modal, plus Asmaul Husna and daily duas",
      "Per-city prayer times and saved verses",
      "Arabic text rendered with mushaf typography, not generic Arabic fonts",
    ],
    outcome: "Released and publicly accessible at tilawahsurah.my.id.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    live: "https://www.tilawahsurah.my.id",
    shots: [
      {
        src: "/work/tilawah/home.jpg",
        alt: "Tilawah home page showing title, verse of the day, and 114-surah summary",
        caption: "Home with daily verse and mushaf summary.",
      },
    ],
  },
  {
    slug: "radvault",
    index: "05",
    name: "RadVault",
    category: "Infrastructure",
    role: "Solo builder",
    period: "2026",
    tagline: "PACS infrastructure management console with zero-knowledge encryption.",
    summary:
      "A hybrid console (web, desktop, CLI, and MCP server) for storing PACS install configs, SSH credentials, network topologies, and facility licenses.",
    problem:
      "Field teams kept SSH credentials and PACS configs in scattered notes. When an install broke, there was no single source of truth.",
    built: [
      "Per-column AES-256-GCM encryption with keys from PBKDF2-SHA512 at 600,000 iterations",
      "Session auto-lock and buffer zeroization for in-memory credentials",
      "Pure-Node implementation of the DICOM Upper Layer protocol: C-ECHO, C-FIND, C-STORE, C-MOVE, C-GET",
      "Per-facility emergency runbook generator in print-ready Markdown and HTML",
      "Encrypted backups with a custom archive format and transactional restore",
      "26 MCP tools so AI assistants can audit deployment readiness",
    ],
    outcome:
      "Running as a monorepo with a web console, desktop app, operator CLI, and MCP server.",
    stack: ["React", "Vite", "Node.js", "SQLite", "AES-256-GCM", "DICOM", "MCP"],
    shots: [
      {
        src: "/work/radvault/console.jpg",
        alt: "RadVault console with facility panel, fleet radar, and locked vault status",
        caption: "Precision console with vault status and port diagnostics.",
      },
    ],
  },
  {
    slug: "samco-slc",
    index: "06",
    name: "SAMCO SLC",
    category: "Banking",
    role: "Backend Developer",
    period: "Apr - Oct 2026",
    confidential: true,
    tagline: "43 master-data parameter modules for a special-asset management platform.",
    summary:
      "A special-asset management platform for restructuring, litigation, and asset sales, used by financial institutions. Built as a backend developer via PT Intikom Berlian Mustika, placed at PT Skyworx Indonesia.",
    problem:
      "Credit parameters lived across many tables and approval flows. Every critical data change needed an audit trail and dual control.",
    built: [
      "43 master-data parameter modules in C# and ASP.NET Core: collateral, credit facilities, currencies, rates, products, and regional reference data",
      "Maker-checker flow for create, approve, reject, and update with before-after diffs, activation, and soft delete",
      "Batch and cascade approval for tiered parameters such as RM code tiering and collateral-type conditions",
      "448 REST routes behind a KrakenD gateway",
      "Sorting and filtering optimization across 45 repositories, plus fixes for duplicate INSERTs and immutable parameter codes",
      "DDL/DML migrations and seeds for UAT and staging on PostgreSQL",
    ],
    outcome:
      "The six-month contract closed with modules and documentation handed over to the permanent team before the term ended.",
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
    category: "Security",
    role: "Solo builder",
    period: "2026",
    tagline: "Machine-learning pipeline that cuts SIEM false-positive alerts.",
    summary:
      "A two-stage pipeline that classifies Wazuh alerts with DBSCAN and Random Forest, then enriches them with MISP threat intelligence.",
    problem:
      "SIEMs produce too many false alarms, so genuinely dangerous alerts drown in noise.",
    built: [
      "11-class classification (benign plus 10 attack phases) with DBSCAN for deviation scores and Random Forest for the final call",
      "MISP IOC enrichment to catch false negatives the model misses",
      "Four-quadrant logic combining ML output with threat intelligence",
      "Results written back to OpenSearch so they surface in the Wazuh dashboard",
      "Two-VM deployment with FastAPI as the inference service",
    ],
    outcome:
      "False positives down 66.78% with Random Forest and 70.39% with XGBoost on the test set.",
    stack: ["Python", "FastAPI", "scikit-learn", "DBSCAN", "MISP", "Wazuh", "OpenSearch"],
    shots: [],
  },
];

export const experienceEn: Experience[] = [
  {
    period: "Apr 2026 - Oct 2026",
    role: "Backend Developer (.NET)",
    company: "PT Intikom Berlian Mustika",
    location: "Placed at PT Skyworx Indonesia",
    description:
      "A six-month contract on the SAMCO banking product, in the parameters and master-data domain.",
    points: [
      "43 master-data parameter modules with ASP.NET Core and PostgreSQL",
      "Maker-checker, audit trails, batch and cascade approvals",
      "448 REST routes behind a KrakenD gateway",
    ],
  },
  {
    period: "Dec 2025 - Jan 2026",
    role: "Fullstack Developer",
    company: "West Java & Banten Police, Mobile Brigade HQ",
    location: "Freelance",
    description:
      "The Rikkes Berkala system for three agencies, from data import to result distribution.",
    points: [
      "Laravel, Livewire, and Flux with role-based access control",
      "WhatsApp and Excel imports, automatic PDF reports",
      "Google Drive and Sheets integration for document distribution",
    ],
  },
  {
    period: "2026 - present",
    role: "Solo builder",
    company: "Independent products and projects",
    location: "Remote",
    description:
      "Building health, government, and infrastructure products from scoping to release.",
    points: [
      "SASTRO PACS, SYNVEA SIMRS, RadVault, Tilawah, and the Wazuh security pipeline",
      "Scoping, building, and releasing solo",
      "Maintaining shipped applications",
    ],
    current: true,
  },
];

export const capabilitiesEn = [
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
    note: "API contracts, data layers, and testable business rules. Including approval flows and audit trails.",
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
    note: "Fast, responsive interfaces — including medical image viewers and 3D visualization.",
  },
  {
    title: "Data",
    items: ["PostgreSQL", "SQL Server", "MySQL", "MongoDB", "SQLite", "Redis", "Prisma"],
    note: "Schemas, migrations, indexing, and query optimization. Including DDL/DML for UAT environments.",
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Linux", "Nginx", "Git", "CI/CD", "Vercel", "Orthanc", "DCM4CHEE"],
    note: "Repeatable releases. Including PACS deployment with DICOM servers.",
  },
];

export const statsEn = [
  { value: "7", label: "Products & systems" },
  { value: "43", label: "Banking modules" },
  { value: "3", label: "Government agencies" },
  { value: "448", label: "REST routes" },
];

export const profileEn = {
  name: "Fadhli Rajwaa Rahmana",
  shortName: "Fadhli Rajwaa",
  role: "Backend Developer",
  subtitle: "Backend .NET, React frontend, health systems",
  email: "fadhlirajwaarahmana@gmail.com",
  phone: "+62 812-3171-2687",
  github: "https://github.com/FadhliRajwaa",
  linkedin: "https://linkedin.com/in/fadhli-rajwaa-rahmana",
  location: "Semarang, Indonesia",
  education: "BSc Informatics Engineering, Stikubank University Semarang",
  bio: "Backend developer with experience building .NET services for banking software. Since 2026 working on health and government products as a solo builder, from database schema to interface.",
};
