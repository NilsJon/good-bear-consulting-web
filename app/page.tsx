"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { ParticleCanvas, type ParticleCanvasRef } from "@/components/effects/particle-canvas";
import { GradientOrbs } from "@/components/effects/gradient-orbs";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { WhySection } from "@/components/sections/why-section";
import { ApproachSection } from "@/components/sections/approach-section";
import { AboutSection } from "@/components/sections/about-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";

const TerminalEntry = dynamic(
  () =>
    import("@/components/entry/terminal-entry").then((mod) => ({
      default: mod.TerminalEntry,
    })),
  { ssr: false }
);

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const particleRef = useRef<ParticleCanvasRef>(null);

  useEffect(() => {
    try {
      const entered = sessionStorage.getItem("gb-entered");
      if (entered === "true") {
        setHasEntered(true);
      }
    } catch {
      // sessionStorage unavailable
    }
    setCheckingSession(false);
  }, []);

  const handleEnter = () => {
    particleRef.current?.burst();
    setTimeout(() => {
      particleRef.current?.setMode("site");
    }, 300);
    setHasEntered(true);
    try {
      sessionStorage.setItem("gb-entered", "true");
    } catch {
      // sessionStorage unavailable
    }
  };

  if (checkingSession) {
    return <div className="min-h-screen" style={{ backgroundColor: "#05070A" }} />;
  }

  return (
    <>
      <ParticleCanvas
        ref={particleRef}
        mode={hasEntered ? "site" : "terminal"}
      />
      <GradientOrbs />

      <AnimatePresence mode="wait">
        {!hasEntered && (
          <motion.div
            key="terminal"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TerminalEntry onEnter={handleEnter} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          opacity: hasEntered ? 1 : 0,
          pointerEvents: hasEntered ? "auto" : "none",
        }}
        transition={{ duration: 0.8, delay: hasEntered ? 0.2 : 0 }}
        className="relative"
        style={{ zIndex: 1 }}
      >
        <Navigation />
        <main>
          <HeroSection />
          <ServicesSection />
          <WhySection />
          <ApproachSection />
          <AboutSection />
          <ContactCtaSection />
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
