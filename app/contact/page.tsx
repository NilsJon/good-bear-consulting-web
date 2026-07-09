"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import { GradientOrbs } from "@/components/effects/gradient-orbs";
import { Footer } from "@/components/layout/footer";

export default function Contact() {
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
            Good Bear Consulting
          </Link>
          <div className="flex items-center gap-8">
            <Link
  
              href="/the-bear"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              The Bear
            </Link>
            <span className="text-sm px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg">
              Contact
            </span>
          </div>
        </div>
      </nav>

      <main className="relative" style={{ zIndex: 1 }}>
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
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
              <h1 className="text-4xl lg:text-6xl font-light tracking-tight leading-tight mb-6">
                Start a Conversation
              </h1>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Every engagement begins with alignment. Tell us about your
                challenges, and we&apos;ll tell you honestly whether we can
                help.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-10 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="relative w-28 h-36 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src="/ceo.JPG"
                      alt="Nils Stridbeck"
                      width={112}
                      height={144}
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-light tracking-tight text-foreground mb-1">
                    Nils Stridbeck
                  </h2>
                  <p className="text-sm text-primary mb-4">Founder & CEO</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Our visionary CEO with nearly a decade at the intersection of
                    engineering, product, and organizational transformation.
                    Nils leads with systems thinking, strategic patience, and
                    an instinct for finding honey where others see only forest.
                  </p>
                  <a
                    href="mailto:nils@goodbearconsulting.se"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <Mail size={14} />
                    nils@goodbearconsulting.se
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 sm:p-12 lg:p-16 rounded-xl bg-white/[0.02] border border-white/[0.06]"
            >
              <h3 className="text-lg text-foreground mb-6">Get in Touch</h3>
              <a
                href="mailto:nils@goodbearconsulting.se"
                className="inline-flex items-center gap-3 text-lg sm:text-2xl lg:text-3xl font-light text-foreground hover:text-primary transition-colors break-all sm:break-normal"
              >
                nils@goodbearconsulting.se
              </a>
              <p className="text-sm text-muted-foreground mt-6">
                We typically respond within 24 hours.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
