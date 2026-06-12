"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactCtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 lg:p-20 text-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, var(--glow-blue), transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-6">
              Ready to navigate what&apos;s next?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Every engagement begins with a conversation. Tell us about your
              challenges, and we&apos;ll tell you honestly whether we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                Let's Find Honey
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
  );
}
