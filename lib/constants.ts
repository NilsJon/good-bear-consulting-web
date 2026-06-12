export const COLORS = {
  background: "#0A0D12",
  terminalBg: "#05070A",
  surface: "#111318",
  surfaceElevated: "#161A22",
  text: "#E0E6ED",
  textMuted: "#8B95A5",
  glowBlue: "#3B82F6",
  glowCyan: "#06B6D4",
  glowViolet: "#8B5CF6",
  border: "#1E2330",
} as const;

export const PARTICLE_CONFIG = {
  terminal: {
    count: 80,
    countMobile: 40,
    speed: 0.3,
    opacity: { min: 0.05, max: 0.25 },
    size: { min: 1, max: 2.5 },
    color: COLORS.glowBlue,
    connectionDistance: 120,
    connectionOpacity: 0.06,
  },
  site: {
    count: 100,
    countMobile: 50,
    speed: 0.2,
    opacity: { min: 0.03, max: 0.15 },
    size: { min: 0.8, max: 2 },
    color: COLORS.glowCyan,
    connectionDistance: 100,
    connectionOpacity: 0.04,
  },
} as const;

export const ANIMATION = {
  transition: {
    fast: { duration: 0.2, ease: "easeOut" as const },
    default: { duration: 0.4, ease: "easeOut" as const },
    slow: { duration: 0.6, ease: "easeOut" as const },
    spring: { type: "spring" as const, stiffness: 200, damping: 30 },
  },
  stagger: {
    fast: 0.05,
    default: 0.1,
    slow: 0.15,
  },
  typing: {
    charDelay: 25,
    lineDelay: 400,
    promptDelay: 200,
  },
} as const;

export const SERVICES = [
  {
    title: "AI Strategy & Adoption",
    description:
      "Navigate the AI landscape with clarity. We help you evaluate what matters, cut through the hype, and move from experimentation to real deployment.",
    icon: "Brain" as const,
  },
  {
    title: "Product & Platform Strategy",
    description:
      "Define the technical architecture and product strategy that turns ambition into reality. We help you build platforms that scale with your business, not against it.",
    icon: "Layers" as const,
  },
  {
    title: "Technical Due Diligence",
    description:
      "Deep technical assessment for investors, acquirers, and boards. We evaluate architecture, team capability, technical debt, and scalability with precision.",
    icon: "Search" as const,
  },
  {
    title: "Engineering Organization Design",
    description:
      "Build engineering organizations that ship with confidence. Team structures, processes, and culture designed for sustained velocity and technical excellence.",
    icon: "Users" as const,
  },
  {
    title: "Interim CTO & Strategic Advisory",
    description:
      "Embedded technical leadership for companies in transition. Whether you need a CTO, a strategic advisor, or a bridge between business and engineering.",
    icon: "Shield" as const,
  },
] as const;

export const APPROACH_STAGES = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "Understand systems, constraints, opportunities, and risk. We listen before we prescribe, mapping the full landscape before recommending action.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Define strategy, architecture, priorities, and operating models. Every recommendation is grounded in your reality, not abstract best practices.",
  },
  {
    number: "03",
    title: "Accelerate",
    description:
      "Help teams execute with confidence and measurable outcomes. We stay engaged through implementation, ensuring strategy becomes reality.",
  },
] as const;

export const TERMINAL_SCRIPT = [
  { type: "prompt" as const, text: "identify yourself" },
  { type: "response" as const, text: "I am a good bear." },
  { type: "prompt" as const, text: "what do you do" },
  { type: "response" as const, text: "I help companies find honey." },
  { type: "prompt" as const, text: "what's honey" },
  {
    type: "response" as const,
    text: "The thing everyone wants.\nThe thing few can find.",
  },
  { type: "action" as const, text: "enter" },
] as const;
