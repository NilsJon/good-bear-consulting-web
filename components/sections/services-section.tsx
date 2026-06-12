"use client";

import { SectionWrapper } from "@/components/layout/section-wrapper";
import { ServiceCard } from "./service-card";
import { SERVICES } from "@/lib/constants";

export function ServicesSection() {
  return (
    <SectionWrapper id="services" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <p className="text-sm text-primary font-medium tracking-wider uppercase mb-4">
            Services
          </p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-xl">
            Strategic capabilities for complex challenges
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={i}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
