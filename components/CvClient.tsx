"use client";

import Link from "next/link";
import { LangProvider } from "@/components/Lang";
import ThemeScript from "@/components/ThemeScript";
import HydrationGuard from "@/components/HydrationGuard";
import ThemeToggle from "@/components/ThemeToggle";
import LangToggle from "@/components/LangToggle";
import PrintButton from "@/components/PrintButton";
import { BackHome, WebLink } from "@/components/CvChrome";
import { useContent } from "@/lib/i18n";
import { useLang, pick } from "@/components/Lang";
import { certifications } from "@/lib/content";

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="mt-10 print:mt-7">
      <div className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
        <span className="readout text-[11px] text-signal">{index}</span>
        <h2 className="display-tight text-2xl text-ink print:text-xl">
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CvBody() {
  const { lang } = useLang();
  const { profile, projects, experience, capabilities } = useContent();
  const stack = Array.from(
    new Set(projects.flatMap((p) => p.stack)),
  ).slice(0, 24);

  const label = (id: string, en: string) => pick(lang, id, en);

  return (
    <>
      <a
        href="#cv-isi"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-110 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        {label("Lompat ke konten", "Skip to content")}
      </a>

      <div className="print:hidden">
        <header className="fixed inset-x-0 top-0 z-80 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border border-rule bg-paper/85 py-2 pr-2 pl-5 shadow-[0_8px_30px_-12px_rgba(16,19,25,0.25)] backdrop-blur-md">
            <BackHome />
            <div className="flex items-center gap-2">
              <LangToggle />
              <ThemeToggle className="rounded-full" />
              <PrintButton />
            </div>
          </div>
        </header>
      </div>

      <main
        id="cv-isi"
        className="mx-auto max-w-4xl px-5 pt-28 pb-20 sm:px-8 print:max-w-none print:px-0 print:pt-0 print:pb-0"
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-6">
          <div>
            <p className="label text-signal">Curriculum vitae</p>
            <h1 className="display mt-2 text-[clamp(2rem,11vw,4.5rem)] leading-[0.95] text-ink">
              {profile.name}
            </h1>
            <p className="mt-3 text-base font-medium text-ink">
              {profile.role}
            </p>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
              {profile.bio}
            </p>
          </div>
          <dl className="readout w-full space-y-0 text-xs text-ink-soft sm:w-auto sm:space-y-1.5">
            <div className="flex flex-col gap-0.5 border-t border-rule py-2 sm:flex-row sm:gap-2 sm:border-t-0 sm:py-0">
              <dt className="shrink-0 text-ink-mute sm:w-16">
                {label("Surel", "Email")}
              </dt>
              <dd className="break-words">{profile.email}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-rule py-2 sm:flex-row sm:gap-2 sm:border-t-0 sm:py-0">
              <dt className="shrink-0 text-ink-mute sm:w-16">
                {label("Telepon", "Phone")}
              </dt>
              <dd>{profile.phone}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-rule py-2 sm:flex-row sm:gap-2 sm:border-t-0 sm:py-0">
              <dt className="shrink-0 text-ink-mute sm:w-16">
                {label("Lokasi", "Based")}
              </dt>
              <dd>{profile.location}</dd>
            </div>
            <div className="flex flex-col gap-0.5 border-t border-rule py-2 sm:flex-row sm:gap-2 sm:border-t-0 sm:py-0 print:hidden">
              <dt className="shrink-0 text-ink-mute sm:w-16">Web</dt>
              <dd>
                <WebLink />
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 border-y border-rule py-2 sm:flex-row sm:gap-2 sm:border-y-0 sm:py-0">
              <dt className="shrink-0 text-ink-mute sm:w-16">
                {label("Didik", "Educ.")}
              </dt>
              <dd>{profile.education}</dd>
            </div>
          </dl>
        </div>

        <Section index="01" title={label("Pengalaman kerja", "Experience")}>
          <ol className="space-y-5">
            {experience.map((job) => (
              <li key={job.company} className="break-inside-avoid">
                <h3 className="text-base font-semibold text-ink">
                  <span className="block sm:inline">{job.role}</span>{" "}
                  <span className="mt-0.5 block text-[13px] font-normal text-ink-mute sm:mt-0 sm:inline">
                    — {job.company}
                  </span>
                </h3>
                <p className="readout mt-1 text-xs text-signal">
                  {job.period} · {job.location}
                </p>
                <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-ink-soft">
                  {job.description}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {job.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-px w-3 shrink-0 bg-rule-strong"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section index="02" title={label("Proyek pilihan", "Selected work")}>
          <ol className="space-y-5">
            {projects.map((project) => (
              <li key={project.slug} className="break-inside-avoid">
                <h3 className="text-base font-semibold text-ink">
                  {project.name}
                  <span className="ml-2 text-[13px] font-normal text-ink-mute">
                    {project.category} · {project.role}
                  </span>
                </h3>
                <p className="readout mt-1 text-xs text-signal">
                  {project.period}
                </p>
                <p className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-ink-soft">
                  {project.summary}{" "}
                  <span className="text-ink">{project.outcome}</span>
                </p>
                <p className="readout mt-1.5 text-[11px] leading-relaxed text-ink-mute">
                  {project.stack.join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section index="03" title={label("Keahlian", "Skills")}>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {capabilities.map((cap) => (
              <div key={cap.title} className="break-inside-avoid">
                <dt className="text-sm font-semibold text-ink">{cap.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {cap.items.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 break-inside-avoid">
            <h3 className="text-sm font-semibold text-ink">
              {label("Tumpukan lintas proyek", "Cross-project stack")}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {stack.join(", ")}
            </p>
          </div>
          <div className="mt-4 break-inside-avoid">
            <h3 className="text-sm font-semibold text-ink">
              {label("Sertifikasi", "Certifications")}
            </h3>
            <ul className="mt-1 space-y-1">
              {certifications.map((cert) => (
                <li key={cert.name} className="text-sm text-ink-soft">
                  <span className="text-ink">{cert.name}</span> — {cert.issuer},{" "}
                  {cert.year}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section index="04" title={label("Bahasa", "Languages")}>
          <p className="text-sm text-ink">
            {label(
              "Indonesia (asli) · Inggris (profesional)",
              "Indonesian (native) · English (professional)",
            )}
          </p>
        </Section>
      </main>
    </>
  );
}

export default function CvClient() {
  return (
    <LangProvider>
      <ThemeScript />
      <HydrationGuard />
      <CvBody />
      <style>{`@media print {
        :root { color-scheme: light; }
        .grain { display: none !important; }
        body { background: #fff !important; color: #111 !important; }
      }`}</style>
    </LangProvider>
  );
}
