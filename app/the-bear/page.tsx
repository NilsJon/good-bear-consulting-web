"use client"

import Link from "next/link"

export default function TheBear() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl tracking-tight font-medium">
            Good Bear Consulting
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/the-bear" className="text-sm text-foreground font-medium">
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-foreground leading-tight text-balance">
          The Bear Philosophy
        </h1>
      </section>

      {/* Philosophy Content */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 space-y-24 pb-32">
        {/* Introduction */}
        <div className="space-y-8">
          <p className="text-xl lg:text-2xl text-foreground font-light leading-relaxed text-pretty">
            The bear moves through the forest with purpose, not haste. It observes the system before acting. It operates
            independently, but never without intent.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In Nordic tradition, the bear represents more than strength—it embodies patience, wisdom, and the quiet
            confidence that comes from understanding one's environment completely.
          </p>
        </div>

        {/* Principles */}
        <div className="space-y-16 border-t border-border pt-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-sm mb-3">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">Principle</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-2">Patience</h2>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The bear does not rush delivery. It waits for winter with preparation, not anxiety. It understands that
                timing is as critical as execution.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                In our practice, we resist the pressure to move before understanding is complete. Strategic patience
                yields better outcomes than reactive speed.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-border pt-16">
            <div className="md:col-span-1">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-sm mb-3">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">Principle</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-2">Observation</h2>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The bear observes the system before acting. It reads patterns in the forest—the movement of seasons, the
                behavior of other creatures, the availability of resources.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that deep observation precedes effective intervention. Before we design solutions, we study
                the organizational ecosystem in its full complexity.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-border pt-16">
            <div className="md:col-span-1">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-sm mb-3">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">Principle</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-2">Independence</h2>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The bear operates independently, but never without intent. It makes decisions based on direct experience
                and careful assessment, not external pressure or fleeting trends.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our recommendations emerge from first principles and contextual analysis. We are unswayed by industry
                hype or conventional wisdom that doesn't serve your specific circumstances.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 border-t border-border pt-16">
            <div className="md:col-span-1">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-sm mb-3">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">Principle</span>
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-2">Resilience</h2>
            </div>
            <div className="md:col-span-2 space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The bear endures long winters through preparation and adaptation. It builds reserves when resources are
                abundant and draws on them when conditions become harsh.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We design systems and capabilities that withstand uncertainty. Our work creates organizational
                resilience—the capacity to adapt, recover, and thrive across changing conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Closing */}
        <div className="space-y-8 border-t border-border pt-16">
          <p className="text-xl lg:text-2xl text-foreground font-light leading-relaxed text-pretty">
            The forest teaches: clarity emerges from silence, strength from restraint, progress from patience.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This is how we work. This is the Good Bear way.
          </p>
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
