"use client";

import { motion } from "motion/react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { APPROACH_STAGES } from "@/lib/constants";

export function ApproachSection() {
  return (
    <SectionWrapper id="approach" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <p className="text-sm text-primary font-medium tracking-wider uppercase mb-4">
            Approach
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-xl">
            From diagnosis to momentum
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {APPROACH_STAGES.map((stage, i) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-xs font-mono text-primary/60 mt-1.5">
                  {stage.number}
                </span>
                <div>
                  <h3 className="text-2xl font-light tracking-tight text-foreground">
                    {stage.title}
                  </h3>
                </div>
              </div>
              <div className="pl-9">
                <p className="text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>
              </div>
              {i < APPROACH_STAGES.length - 1 && (
                <div className="hidden lg:block absolute top-5 -right-6 w-12 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
