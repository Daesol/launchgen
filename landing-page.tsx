'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from './components/Navigation'
import { HeroSection } from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import FinalCTASection from './components/FinalCTASection'
import Footer from './components/Footer'

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