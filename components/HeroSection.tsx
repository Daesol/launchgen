'use client'

import { useState } from 'react'
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

export function HeroSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <section className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>
      
      {/* Animated Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>

      <div className="relative min-h-screen flex items-center">
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
                  Create stunning landing pages in{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    60 seconds
                  </span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed">
                  Transform your product idea into a professional landing page with AI. 
                  No design skills required. Just describe your product and watch the magic happen.
                </p>
              </div>

              {/* Email Signup */}
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    className="flex-1 px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Join Waitlist
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
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
    </section>
  )
} 