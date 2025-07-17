'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import Navigation from './components/Navigation'
import { HeroSection } from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import FinalCTASection from './components/FinalCTASection'
import Footer from './components/Footer'

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    // Check if user is already signed in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is signed in, redirect to dashboard
        router.replace('/dashboard')
        return
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard')
      } else {
        setLoading(false)
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleGenerateLandingPage = () => {
    router.push('/auth/signin')
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
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