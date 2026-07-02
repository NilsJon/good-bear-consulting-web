"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Trees, Hexagon, Target, Zap } from "lucide-react";
import { GradientOrbs } from "@/components/effects/gradient-orbs";
import { Footer } from "@/components/layout/footer";

const PRINCIPLES = [
  {
    title: "Read the Forest",
    description: "Understand the system before changing it.",
    icon: Trees,
  },
  {
    title: "Find the Honey",
    description: "Identify the opportunity that creates real value.",
    icon: Hexagon,
  },
  {
    title: "Build with Intent",
    description:
      "Turn insight into working software, platforms, and capabilities.",
    icon: Target,
  },
  {
    title: "Stay Dangerous",
    description:
      "Bring enough technical depth to solve the hard problems, not just name them.",
    icon: Zap,
  },
];

export default function TheBear() {
  return (
    <div className="min-h-screen relative">
      <div className="hidden md:block">
        <GradientOrbs />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0D12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link

            href="/"
            className="text-lg font-medium tracking-tight text-foreground"
          >
            Good Bear
          </Link>
          <div className="flex items-center gap-8">
            <span className="text-sm text-foreground font-medium">
              The Bear
            </span>
            <Link
  
              href="/contact"
              className="text-sm px-5 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors rounded-lg"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative" style={{ zIndex: 1 }}>
        {/* Hero */}
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
    
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
              >
                <ArrowLeft size={14} />
                Back
              </Link>
              <h1 className="text-4xl lg:text-6xl font-light tracking-tight leading-tight mb-10">
                The Bear Method
              </h1>
              <div className="font-mono text-sm lg:text-base text-primary/70 space-y-1 mb-10">
                <p>&gt; Observe the forest.</p>
                <p>&gt; Find the honey.</p>
              </div>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
                Good Bear exists for companies operating in complex terrain
                where product, engineering, people, and systems all interact.
                The work is not to move randomly. The work is to understand the
                forest, find the real opportunity, and build what matters.
              </p>
            </motion.div>
          </div>
        </section>

        {/* The Forest */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 lg:py-28"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <p className="text-xs text-primary font-medium tracking-[0.2em] uppercase mb-6">
              The Forest
            </p>
            <div className="p-8 lg:p-12 rounded-xl bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-cyan-500/40">
              <h2 className="text-2xl lg:text-3xl font-light tracking-tight mb-6">
                Every company is a complex system.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The forest is the system: users, markets, architecture,
                incentives, legacy decisions, and organizational constraints.
                Before building, we map the terrain.
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Honey */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 lg:py-28"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <p className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: "#F59E0B" }}>
              The Honey
            </p>
            <div
              className="p-8 lg:p-12 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              style={{ borderLeftWidth: 2, borderLeftColor: "rgba(245, 158, 11, 0.4)" }}
            >
              <h2 className="text-2xl lg:text-3xl font-light tracking-tight mb-6">
                Find the opportunity with real leverage.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Honey is the opportunity with real leverage. The product that
                should exist. The workflow that can be automated. The technical
                decision that unlocks speed. The capability that compounds.
              </p>
            </div>
          </div>
        </motion.section>

        {/* The Bear */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 lg:py-28"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <p className="text-xs text-primary font-medium tracking-[0.2em] uppercase mb-6">
              The Bear
            </p>
            <div className="p-8 lg:p-12 rounded-xl bg-white/[0.02] border border-white/[0.06] border-l-2 border-l-primary/40">
              <h2 className="text-2xl lg:text-3xl font-light tracking-tight mb-6">
                Move with intent. Build what matters.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The bear does not chase noise. It observes, follows the signal,
                and moves with intent. When the path is clear, it builds.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Principles */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="py-20 lg:py-28"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <p className="text-xs text-primary font-medium tracking-[0.2em] uppercase mb-10">
              Principles
            </p>
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group p-6 lg:p-8 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(59,130,246,0.06)] transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium tracking-tight text-foreground mb-3">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {p.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Closing CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 lg:py-28"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 lg:p-20 text-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--glow-blue), transparent 70%)",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-8">
                  Ready to find the honey?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
        
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                  >
                    Let&apos;s Find Honey
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <a
                    href="mailto:nils@goodbearconsulting.se"
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-white/[0.03] text-foreground border border-white/[0.08] rounded-lg text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    nils@goodbearconsulting.se
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
