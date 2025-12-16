"use client"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-tight font-medium">
            Good Bear Consulting
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/the-bear" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              The Bear
            </Link>
            <Link
              href="/contact"
              className="text-sm px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

            {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-tight text-balance mb-8">
              Operating at the Edge of Technology and Strategy
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed text-pretty max-w-3xl">
              We partner with forward-thinking organizations to navigate complexity, unlock optionality, and deliver
              sustainable technical leverage.
            </p>
          </div>
          <div className="relative h-[400px] lg:h-[500px] rounded-sm overflow-hidden">
            <Image
              src="/bear.png"
              alt="Nordic forest landscape representing strategic patience and observation"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-border">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-6">What We Do</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We architect transformation at the intersection of systems thinking and organizational readiness. Through
              deep engagement with your strategic imperatives, we design pathways that honor complexity while
              accelerating outcomes.
            </p>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2.5 py-1 bg-accent/15 text-accent rounded-sm font-medium">01</span>
                <h3 className="text-lg font-medium">Strategic Technology Advisory</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Positioning your technical infrastructure for long-term adaptability and growth.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2.5 py-1 bg-accent/15 text-accent rounded-sm font-medium">02</span>
                <h3 className="text-lg font-medium">Organizational Systems Design</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Building frameworks that enable clarity, alignment, and sustained performance.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2.5 py-1 bg-accent/15 text-accent rounded-sm font-medium">03</span>
                <h3 className="text-lg font-medium">Capability Development</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Embedding technical excellence through intentional practice and cultural evolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Create Impact */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-border">
        <div className="max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-8">How We Create Impact</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Our methodology is rooted in observation, iteration, and principled decision-making. We begin by
              understanding the full context—the systems, constraints, and aspirations that define your organization.
            </p>
            <p>
              Through collaborative discovery, we identify leverage points where strategic intervention yields
              disproportionate returns. We then design and implement solutions that are both technically robust and
              organizationally resonant.
            </p>
            <p>
              Impact is measured not in deliverables, but in sustained capability, improved decision velocity, and
              expanded strategic optionality.
            </p>
          </div>
        </div>
      </section>

      {/* Why Good Bear */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-border">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-light tracking-tight mb-8">Why Good Bear</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                We operate with quiet confidence and deliberate patience. Where others rush to prescription, we invest
                in understanding. Where complexity tempts simplification, we honor nuance.
              </p>
              <p>
                Our approach is shaped by Nordic principles: clarity over cleverness, substance over spectacle,
                long-term thinking over short-term optimization.
              </p>
              <p>We don't chase trends. We build foundations that endure.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-lg font-light text-foreground">Independent thinking</p>
            </div>
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-lg font-light text-foreground">Strategic patience</p>
            </div>
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-lg font-light text-foreground">Technical depth</p>
            </div>
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-lg font-light text-foreground">Systems fluency</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-12 mt-24 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Good Bear Consulting</p>
          <div className="flex gap-8">
            <Link href="/the-bear" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              The Bear
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
