"use client";

import { motion } from "motion/react";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export function AboutSection() {
  return (
    <SectionWrapper id="about" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-sm text-primary font-medium tracking-wider uppercase mb-4">
              About
            </p>
            <h2 className="text-3xl lg:text-5xl font-light tracking-tight leading-tight mb-8">
              Calm under pressure.
              <br />
              Strategic by nature.
              <br />
              Sharp when it matters.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-lg"
            >
              Good Bear exists to help organizations navigate complexity,
              emerging technology, and change. We work with leaders who
              understand that the decisions they make today about
              architecture, technology, and organization design will define
              their competitive position for years.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg"
            >
              We operate with the patience of deep observation and the
              precision of practiced execution. No buzzwords. No frameworks
              for framework&apos;s sake. Just clear thinking applied to hard
              problems.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg"
            >
              The bear sees the full landscape before it moves. So do we.
            </motion.p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
