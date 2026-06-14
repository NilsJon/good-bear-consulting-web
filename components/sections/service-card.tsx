"use client";

import { motion } from "motion/react";
import { Brain, Layers, Search, Users, Shield, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Layers,
  Search,
  Users,
  Shield,
};

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export function ServiceCard({ title, description, icon, index }: ServiceCardProps) {
  const Icon = ICON_MAP[icon] || Brain;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const Wrapper = isMobile ? "div" : motion.div;
  const motionProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.5, delay: index * 0.1 },
      };

  return (
    <Wrapper
      {...motionProps}
      className="group relative p-6 lg:p-8 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]"
    >
      <div className="mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-medium mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Wrapper>
  );
}
