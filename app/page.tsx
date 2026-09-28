import { ScrollProgressProvider } from "@/lib/scroll-context";
import { SkillTabProvider } from "@/lib/skill-tab-context";
import { ThemeProvider } from "@/lib/theme-context";
import HeroCanvasWrapper from "@/components/three/HeroCanvasWrapper";
import { Atmosphere } from "@/components/shared/Atmosphere";
import { PerformanceNotice } from "@/components/ui/PerformanceNotice";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/ui/Footer";
import { Preloader } from "@/components/shared/Preloader";
import { ProgressSpine } from "@/components/ui/ProgressSpine";
import { ClientOnly } from "@/components/shared/ClientOnly";

export default function HomePage() {
  return (
    <ThemeProvider>
      <ScrollProgressProvider>
        <SkillTabProvider>
          <Preloader />
          <ClientOnly>
            <PerformanceNotice />
          </ClientOnly>
          <a
            href="#hero"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[90] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-void"
          >
            Skip to content
          </a>
          <Atmosphere />
          <HeroCanvasWrapper />
          <Navbar />
          <ClientOnly>
            <ProgressSpine />
          </ClientOnly>
          <main>
            <Hero />
            <About />
            <Skills />
            <Work />
            <Contact />
          </main>
          <Footer />
        </SkillTabProvider>
      </ScrollProgressProvider>
    </ThemeProvider>
  );
}
