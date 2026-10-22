import ThemeScript from "@/components/ThemeScript";
import HydrationGuard from "@/components/HydrationGuard";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <ThemeScript />
      <HydrationGuard />
      <a
        href="#kerja"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-110 focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Lompat ke konten
      </a>

      <div id="nav-sentinel" aria-hidden="true" className="h-px w-full" />
      <Nav />

      <main>
        <Hero />
        <Work />
        <Experience />
        <Capabilities />
        <Contact />
      </main>

      <div className="grain" aria-hidden="true" />
    </>
  );
}
