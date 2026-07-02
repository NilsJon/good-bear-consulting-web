"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BearConstellation } from "@/components/effects/bear-constellation";

export function HeroSection({ skipAnimations = false }: { skipAnimations?: boolean }) {
  const words = "Building what's next.".split(" ");

  return (
    <section className="relative md:min-h-screen md:flex md:items-center overflow-hidden">
      <div
        className={
          skipAnimations
            ? "relative h-[55vh] md:absolute md:inset-0 md:h-auto"
            : "relative h-[55vh] md:absolute md:inset-0 md:h-auto animate-[fadeIn_2s_0.3s_both]"
        }
      >
        <BearConstellation />
      </div>

      <div className="relative z-10 px-6 lg:px-24 -mt-12 pb-12 md:mt-0 md:py-20 lg:py-32 w-full pointer-events-none">
        <div className="max-w-xl lg:max-w-2xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[1.1] mb-6 md:mb-8">
            {skipAnimations
              ? words.join(" ")
              : words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.08,
                      ease: "easeOut",
                    }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
          </h1>
          {skipAnimations ? (
            <p className="text-base lg:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mb-10 md:mb-12">
              Good Bear Consulting helps companies turn ambitious ideas into real
              products, systems, and capabilities through software engineering,
              AI, and technical expertise.
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-base lg:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mb-10 md:mb-12"
            >
              Good Bear Consulting helps companies turn ambitious ideas into real
              products, systems, and capabilities through software engineering,
              AI, and technical expertise.
            </motion.p>
          )}
          <div
            className={
              skipAnimations
                ? "flex flex-col sm:flex-row gap-4"
                : "flex flex-col sm:flex-row gap-4 animate-[fadeIn_0.6s_1.2s_both]"
            }
          >
            <Link
              href="/contact"
              className="pointer-events-auto group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
            >
              Let&apos;s Find Honey
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="mailto:nils@goodbearconsulting.se"
              className="pointer-events-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/[0.03] text-foreground border border-white/[0.08] rounded-lg text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  );
}
