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
import { DemoComponent } from '../demo'

interface HeroSectionProps {
  onGenerateLandingPage: () => void
}

export function HeroSection({ onGenerateLandingPage }: HeroSectionProps) {
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
                  Create Landing Pages in{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    One Prompt
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                  Turn your product idea into a beautiful, <strong><em>lead-ready</em></strong> landing page with <strong><em>built-in CRM and analytics.</em></strong>
                </p>
              </div>

              {/* Generate Landing Page Button */}
              <div className="space-y-4">
                <button
                  onClick={onGenerateLandingPage}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Generate A Landing Page
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-slate-400">
                  🚀 Start creating your landing page in minutes
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['JD', 'SM', 'AL', 'RK'].map((initial, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-semibold"
                      >
                        {initial}
                      </div>
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

      {/* Mobile Floating CTA Button */}
      <div className={`lg:hidden fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        showFloatingDock ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <button
          onClick={onGenerateLandingPage}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <span>Generate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
} 