"use client"

import Link from "next/link"

export default function Contact() {
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
            <span className="text-sm px-5 py-2 bg-primary text-primary-foreground rounded-sm">Contact</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 pt-32 pb-32">
        <h1 className="text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-tight text-balance mb-16">
          Start a Conversation
        </h1>

        <div className="space-y-12">
          <p className="text-xl text-muted-foreground leading-relaxed">
            We engage with organizations facing complex technical and strategic challenges—those who recognize that
            sustainable transformation requires both depth and patience.
          </p>

          <div className="space-y-6 border-t border-border pt-12">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">Email</p>
            <a
              href="mailto:hello@goodbear.consulting"
              className="text-2xl font-light text-foreground hover:text-primary transition-colors inline-block"
            >
              hello@goodbear.consulting
            </a>
          </div>

          <div className="space-y-6 border-t border-border pt-12">
            <p className="text-lg text-muted-foreground leading-relaxed italic">Engagements begin with alignment.</p>
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
