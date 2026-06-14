"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { GradientOrbs } from "@/components/effects/gradient-orbs";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WhySection } from "@/components/sections/why-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { TerminalEntry } from "@/components/entry/terminal-entry";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [skipAnimations, setSkipAnimations] = useState(false);

  useEffect(() => {
    try {
      const entered = sessionStorage.getItem("gb-entered");
      if (entered === "true") {
        setHasEntered(true);
        setSkipAnimations(true);
      }
    } catch {
      // sessionStorage unavailable
    }
    setCheckingSession(false);
  }, []);

  const handleEnter = useCallback(() => {
    setHasEntered(true);
    try {
      sessionStorage.setItem("gb-entered", "true");
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  if (checkingSession) {
    return <div className="min-h-screen" style={{ backgroundColor: "#05070A" }} />;
  }

  return (
    <>
      {hasEntered && (
        <div className="hidden md:block">
          <GradientOrbs />
        </div>
      )}

      {!hasEntered && (
        <div
          className="transition-opacity duration-500"
          style={{ opacity: hasEntered ? 0 : 1 }}
        >
          <TerminalEntry onEnter={handleEnter} />
        </div>
      )}

      <div
        className={skipAnimations ? "" : "transition-opacity duration-700 delay-200"}
        style={{
          opacity: hasEntered ? 1 : 0,
          pointerEvents: hasEntered ? "auto" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navigation />
        <main>
          <HeroSection skipAnimations={skipAnimations} />
          <ServicesSection />
          <WhySection />
          <ApproachSection />
          <AboutSection />
          <ContactCtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
