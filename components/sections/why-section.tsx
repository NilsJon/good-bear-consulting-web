"use client";

import { motion } from "motion/react";
import { SectionWrapper } from "@/components/layout/section-wrapper";

export function WhySection() {
  return (
    <SectionWrapper className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-5xl font-light tracking-tight leading-tight mb-12"
          >
            Technology is changing faster than organizations.
          </motion.h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Most companies do not lack ideas. They lack technical clarity,
              execution velocity, and operating models designed for what comes
              next.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Good Bear helps leaders make better technology decisions under
              uncertainty.
            </motion.p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
