"use client";

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
      <div
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-gradient-shift"
        style={{ background: "radial-gradient(circle, var(--glow-blue), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, var(--glow-violet), transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] blur-[150px] animate-gradient-shift"
        style={{
          background: "radial-gradient(ellipse, var(--glow-cyan), transparent 70%)",
          animationDelay: "-13s",
        }}
      />
    </div>
  );
}
