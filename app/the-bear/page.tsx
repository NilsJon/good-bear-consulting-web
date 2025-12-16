"use client"

import Link from "next/link"
import Image from "next/image"

export default function TheBear() {
  return (
    <div className="min-h-screen bg-[var(--bear-bg)]">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
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
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src="/majestic-bear-walking-through-snowy-nordic-forest-.jpg"
          alt="Bear walking through Nordic winter forest"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[var(--bear-bg)]" />
        <div className="relative h-full max-w-5xl mx-auto px-6 lg:px-12 flex items-end pb-16">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-white leading-tight text-balance">
              The Bear Philosophy
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-3xl text-pretty">
              Moving with purpose, not haste. Observing the system before acting.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Content */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 space-y-16 py-24">
        {/* Introduction */}
        <div className="bg-background/40 border border-border/30 p-12 rounded-sm space-y-6">
          <p className="text-xl lg:text-2xl text-foreground font-light leading-relaxed text-pretty">
            The bear moves through the forest with purpose, not haste. It observes the system before acting. It operates
            independently, but never without intent.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In Nordic tradition, the bear represents more than strength—it embodies patience, wisdom, and the quiet
            confidence that comes from understanding one's environment completely.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-foreground">Core Principles</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Patience */}
            <div className="bg-background/40 border border-border/30 p-8 rounded-sm space-y-4 hover:border-border/50 transition-colors">
              <div className="inline-block px-3 py-1 bg-primary/5 rounded-sm">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Principle</span>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Patience</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                The bear does not rush delivery. It waits for winter with preparation, not anxiety. It understands that
                timing is as critical as execution.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                In our practice, we resist the pressure to move before understanding is complete. Strategic patience
                yields better outcomes than reactive speed.
              </p>
            </div>

            {/* Observation */}
            <div className="bg-background/40 border border-border/30 p-8 rounded-sm space-y-4 hover:border-border/50 transition-colors">
              <div className="inline-block px-3 py-1 bg-primary/5 rounded-sm">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Principle</span>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Observation</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                The bear observes the system before acting. It reads patterns in the forest—the movement of seasons, the
                behavior of other creatures, the availability of resources.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                We believe that deep observation precedes effective intervention. Before we design solutions, we study
                the organizational ecosystem in its full complexity.
              </p>
            </div>

            {/* Independence */}
            <div className="bg-background/40 border border-border/30 p-8 rounded-sm space-y-4 hover:border-border/50 transition-colors">
              <div className="inline-block px-3 py-1 bg-primary/5 rounded-sm">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Principle</span>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Independence</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                The bear operates independently, but never without intent. It makes decisions based on direct experience
                and careful assessment, not external pressure or fleeting trends.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Our recommendations emerge from first principles and contextual analysis. We are unswayed by industry
                hype or conventional wisdom that doesn't serve your specific circumstances.
              </p>
            </div>

            {/* Resilience */}
            <div className="bg-background/40 border border-border/30 p-8 rounded-sm space-y-4 hover:border-border/50 transition-colors">
              <div className="inline-block px-3 py-1 bg-primary/5 rounded-sm">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Principle</span>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-foreground">Resilience</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                The bear endures long winters through preparation and adaptation. It builds reserves when resources are
                abundant and draws on them when conditions become harsh.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                We design systems and capabilities that withstand uncertainty. Our work creates organizational
                resilience—the capacity to adapt, recover, and thrive across changing conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="bg-background/40 border border-border/30 border-l-2 border-l-primary/40 p-12 rounded-sm space-y-6">
          <p className="text-xl lg:text-2xl text-foreground font-light leading-relaxed text-pretty">
            The forest teaches: clarity emerges from silence, strength from restraint, progress from patience.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This is how we work. This is the Good Bear way.
          </p>
        </div>
      </section>

    </div>
  )
}
