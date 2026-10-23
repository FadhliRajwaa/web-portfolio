import ThemeScript from "@/components/ThemeScript";
import HydrationGuard from "@/components/HydrationGuard";
import { LangProvider } from "@/components/Lang";
import SkipLink from "@/components/SkipLink";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <LangProvider>
      <ThemeScript />
      <HydrationGuard />
      <SkipLink />

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
    </LangProvider>
  );
}
