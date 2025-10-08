'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Minimal and clean */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-foreground rounded-md"></div>
              <span className="text-lg font-semibold tracking-tight">Adonomics</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Clean and direct */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted border border-border/50 mb-8">
              <span className="text-xs font-medium">AI-Powered Creative Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
              Understand why your ads work
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed text-balance">
              Stop guessing. Get AI-powered insights that explain which creative elements drive performance,
              brand lift, and engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Analyzing
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by marketing teams • Built for Advertising Week NY
            </p>
          </div>
        </section>

        {/* How It Works - Simplified */}
        <section className="py-24 border-t border-border/40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              From video to insights in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload your ad",
                description: "Upload video ads and our AI analyzes every scene for emotional content, objects, pacing, and storytelling elements."
              },
              {
                step: "2",
                title: "AI analysis",
                description: "Advanced models identify patterns and correlate creative elements with performance metrics like brand lift and engagement."
              },
              {
                step: "3",
                title: "Get insights",
                description: "Receive specific, actionable recommendations to optimize your creative strategy and maximize impact."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/5 border border-border/50 flex items-center justify-center">
                  <span className="text-sm font-semibold">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="py-24 border-t border-border/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Scene-level analysis",
                description: "Dissect every moment of your video to understand emotional arcs, visual elements, and pacing."
              },
              {
                title: "Performance correlation",
                description: "Connect creative elements to business outcomes like brand lift, persuasion, and engagement."
              },
              {
                title: "Actionable insights",
                description: "Get specific recommendations to improve your creative strategy and maximize impact."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 border-t border-border/40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Built for marketing teams
            </h2>
            <p className="text-lg text-muted-foreground">
              From creative directors to CMOs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                role: "Creative Directors",
                benefit: "Understand which emotional beats and visual elements drive results"
              },
              {
                role: "Marketing Managers",
                benefit: "Justify creative spend with data-backed insights"
              },
              {
                role: "Brand Strategists",
                benefit: "See how different audiences respond to your creative approach"
              },
              {
                role: "Agency Teams",
                benefit: "Deliver client reports with specific, actionable recommendations"
              },
              {
                role: "Media Planners",
                benefit: "Optimize performance by understanding creative impact"
              },
              {
                role: "CMOs",
                benefit: "Transform creative decisions from art into science"
              }
            ].map((persona, index) => (
              <div
                key={index}
                className="p-5 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <h3 className="font-semibold mb-1.5 text-sm">{persona.role}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{persona.benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-border/40">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
              Ready to understand your creative performance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Join marketing teams using AI to make better creative decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Analyzing
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Powered by</h4>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <span>TwelveLabs AI</span>
                <span>Amazon Bedrock</span>
                <span>ElevenLabs</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground text-center">
              © 2025 Adonomics. Built for Advertising Week NY Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
