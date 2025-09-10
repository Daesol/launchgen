'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from './components/layout/Navigation'
import { HeroSection } from './components/marketing/HeroSection'
import FeaturesSection from './components/marketing/FeaturesSection'
import HowItWorksSection from './components/marketing/HowItWorksSection'
import TestimonialsSection from './components/marketing/TestimonialsSection'
import FinalCTASection from './components/marketing/FinalCTASection'
import Footer from './components/layout/Footer'

export default function LandingPage() {
  const router = useRouter()

  const handleGenerateLandingPage = () => {
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <HeroSection onGenerateLandingPage={handleGenerateLandingPage} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection onGenerateLandingPage={handleGenerateLandingPage} />
      <Footer />
    </div>
  )
} 