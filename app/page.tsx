import ThemeScript from "@/components/ThemeScript";
import HydrationGuard from "@/components/HydrationGuard";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-110 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Lompat ke konten
      </a>

      <Nav />

      <main>
        <Hero />
        <Ticker />
        <Work />
        <Experience />
        <Capabilities />
      </main>

      <Contact />

      <div className="grain" aria-hidden="true" />
    </>
  );
}
