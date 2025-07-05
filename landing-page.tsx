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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWaitlistFull, setIsWaitlistFull] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && !isSubmitting) {
      setIsSubmitting(true)
      
      try {
        const response = await fetch('https://hook.us2.make.com/vwep1zw1ww407mg8x85ykt7w691varde', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            submittedAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            time: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              timeZoneName: 'short'
            }),
            source: 'LaunchGen Landing Page',
            userAgent: navigator.userAgent
          })
        })

        // Check if response is ok OR if we get a successful response text
        const responseText = await response.text()
        console.log('Webhook response:', responseText)
        
        if (response.ok || responseText.includes('Accepted') || responseText.includes('OK')) {
          setIsSubmitted(true)
          setIsWaitlistFull(false)
          setEmail('')
          console.log('Email submitted successfully:', email)
        } else {
          console.error('Failed to submit email. Response:', responseText)
          // Show waitlist full message for webhook errors
          setIsWaitlistFull(true)
          setIsSubmitted(false)
          setEmail('')
          console.log('Webhook error - showing waitlist full message for:', email)
        }
      } catch (error) {
        console.error('Error submitting email:', error)
        // Show waitlist full message for network errors too
        setIsWaitlistFull(true)
        setIsSubmitted(false)
        setEmail('')
        console.log('Network error - showing waitlist full message for:', email)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navigation />
      <HeroSection 
        email={email}
        setEmail={setEmail}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        isWaitlistFull={isWaitlistFull}
        handleSubmit={handleSubmit}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection 
        email={email}
        setEmail={setEmail}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        isWaitlistFull={isWaitlistFull}
        handleSubmit={handleSubmit}
      />
      <Footer />
    </div>
  )
} 