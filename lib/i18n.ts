"use client";

import { useMemo } from "react";
import { useLang, pick } from "@/components/Lang";
import {
  aiSkills,
  capabilities,
  certifications,
  experience,
  profile,
  projects,
  stats,
  workflowSteps,
} from "@/lib/content";
import {
  aiSkillsEn,
  capabilitiesEn,
  experienceEn,
  profileEn,
  projectsEn,
  statsEn,
  workflowStepsEn,
} from "@/lib/content-en";

const ui = {
  skip: { id: "Lompat ke konten", en: "Skip to content" },
  backToTop: { id: "Kembali ke atas", en: "Back to top" },
  openMenu: { id: "Buka menu", en: "Open menu" },
  closeMenu: { id: "Tutup menu", en: "Close menu" },
  menu: { id: "Menu", en: "Menu" },
  backHome: { id: "Beranda", en: "Home" },
  nav: {
    work: { id: "Proyek", en: "Work" },
    experience: { id: "Pengalaman", en: "Experience" },
    capabilities: { id: "Keahlian", en: "Skills" },
    aiSkills: { id: "Skill AI", en: "AI Skills" },
    workflow: { id: "Cara Kerja", en: "Workflow" },
    contact: { id: "Kontak", en: "Contact" },
  },
  palette: {
    search: { id: "Cari aksi...", en: "Search actions..." },
    noResult: { id: "Tidak ada hasil", en: "No results" },
    hint: {
      id: "Panah untuk navigasi, Enter untuk jalankan",
      en: "Arrows to navigate, Enter to run",
    },
  },
  available: { id: "Terbuka untuk proyek", en: "Open for projects" },
  open: { id: "Terbuka", en: "Open" },
  sendEmail: { id: "Kirim surel", en: "Send email" },
  backToTopAria: { id: "kembali ke atas", en: "back to top" },
} as const;

export function useUi() {
  const { lang } = useLang();
  return useMemo(() => {
    const t = (v: { id: string; en: string }) => pick(lang, v.id, v.en);
    return {
      lang,
      skip: t(ui.skip),
      backToTop: t(ui.backToTop),
      openMenu: t(ui.openMenu),
      closeMenu: t(ui.closeMenu),
      menu: t(ui.menu),
      backHome: t(ui.backHome),
      backHomeAria: (name: string) =>
        lang === "id"
          ? `${name}, kembali ke atas`
          : `${name}, back to top`,
      navLinks: [
        { href: "#kerja", label: t(ui.nav.work), index: "01" },
        { href: "#pengalaman", label: t(ui.nav.experience), index: "02" },
        { href: "#keahlian", label: t(ui.nav.capabilities), index: "03" },
        { href: "#skill-ai", label: t(ui.nav.aiSkills), index: "04" },
        { href: "#cara-kerja", label: t(ui.nav.workflow), index: "05" },
        { href: "#kontak", label: t(ui.nav.contact), index: "06" },
      ],
      available: t(ui.available),
      openBadge: t(ui.open),
      sendEmail: t(ui.sendEmail),
      palette: {
        search: t(ui.palette.search),
        noResult: t(ui.palette.noResult),
        hint: t(ui.palette.hint),
      },
    };
  }, [lang]);
}

export function useContent() {
  const { lang } = useLang();
  return useMemo(
    () => ({
      lang,
      profile: pick(lang, profile, profileEn),
      projects: pick(lang, projects, projectsEn),
      experience: pick(lang, experience, experienceEn),
      capabilities: pick(lang, capabilities, capabilitiesEn),
      stats: pick(lang, stats, statsEn),
      aiSkills: pick(lang, aiSkills, aiSkillsEn),
      workflowSteps: pick(lang, workflowSteps, workflowStepsEn),
      certifications,
    }),
    [lang],
  );
}
