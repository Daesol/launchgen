'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  Zap, 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Mail, 
  Star, 
  Shield, 
  Sparkles, 
  Database, 
  BarChart3, 
  Eye, 
  MousePointer,
  Play
} from 'lucide-react'
import { DemoComponent } from './demo'

interface HeroSectionProps {
  email: string
  setEmail: (email: string) => void
  isSubmitted: boolean
  isSubmitting: boolean
  isWaitlistFull: boolean
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export function HeroSection({ email, setEmail, isSubmitted, isSubmitting, isWaitlistFull, handleSubmit }: HeroSectionProps) {
  const [showFloatingDock, setShowFloatingDock] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      // Show floating dock when user scrolls past the hero section (roughly 80% of viewport height)
      setShowFloatingDock(scrollY > windowHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>
      
      {/* Animated Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>

      <div className="relative min-h-screen flex items-center pt-16">
        <div className="container mx-auto px-4 py-8 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-400">
                  <span>✨</span>
                  <span>AI-Powered Landing Page Generator</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  From Idea to Leads in{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    One Prompt
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed">
                  Turn your product idea into a beautiful, lead-ready landing page with built-in CRM and analytics. <strong><em>No design tools. No integrations. Just type and launch.</em></strong>
                </p>
              </div>

              {/* Email Signup */}
              <div className="space-y-4">
                {!isSubmitted && !isWaitlistFull ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for early access"
                      className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                ) : isSubmitted ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="font-semibold text-green-400">Welcome to the waitlist!</div>
                        <div className="text-sm text-slate-400">We'll notify you as soon as LaunchGen launches</div>
                      </div>
                    </div>
                  </div>
                ) : isWaitlistFull ? (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 text-orange-400 font-bold">⚠</div>
                      <div>
                        <div className="font-semibold text-orange-400">The current waitlist is full</div>
                        <div className="text-sm text-slate-400">Please contact <a href="mailto:daesol@webproagency.ca" className="text-orange-400 hover:underline">daesol@webproagency.ca</a> to join waitlist</div>
                      </div>
                    </div>
                  </div>
                ) : null}
                <p className="text-sm text-slate-400">
                  🚀 Join 2,000+ founders already on the waitlist
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900"
                      />
                    ))}
                  </div>
                  <span>2,000+ founders</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - Demo */}
            <div className="lg:h-full lg:flex lg:flex-col lg:justify-center">
              <DemoComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Dock Form */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 p-4 transition-all duration-300 ${
        showFloatingDock ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {!isSubmitted && !isWaitlistFull ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              required
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Join Waitlist</span>
                  <span className="sm:hidden">Join</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : isSubmitted ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-green-400 text-sm">Welcome to the waitlist!</div>
                <div className="text-xs text-slate-400">We'll notify you when LaunchGen launches</div>
              </div>
            </div>
          </div>
        ) : isWaitlistFull ? (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-orange-400 font-bold flex-shrink-0">⚠</div>
              <div className="min-w-0">
                <div className="font-semibold text-orange-400 text-sm">Waitlist is full</div>
                <div className="text-xs text-slate-400">Contact <a href="mailto:daesol@webproagency.ca" className="text-orange-400 hover:underline">daesol@webproagency.ca</a></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
} 