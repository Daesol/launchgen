'use client'

import { useState } from 'react'
import Navigation from './components/Navigation'
import { HeroSection } from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import FinalCTASection from './components/FinalCTASection'
import Footer from './components/Footer'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection 
        email={email}
        setEmail={setEmail}
        isSubmitted={isSubmitted}
        handleSubmit={handleSubmit}
      />
      <Footer />
    </div>
  )
} 