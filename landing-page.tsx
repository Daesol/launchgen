'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import Navigation from './components/layout/Navigation'
import { HeroSection } from './components/marketing/HeroSection'
import FeaturesSection from './components/marketing/FeaturesSection'
import HowItWorksSection from './components/marketing/HowItWorksSection'
import TestimonialsSection from './components/marketing/TestimonialsSection'
import FinalCTASection from './components/marketing/FinalCTASection'
import Footer from './components/layout/Footer'

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const supabase = createPagesBrowserClient()

  useEffect(() => {
    let mounted = true
    
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
        
        // If user is signed in, redirect to dashboard
        if (session) {
          router.replace('/dashboard')
        }
      }
    })

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
        
        // If user signs in, redirect to dashboard
        if (session) {
          router.replace('/dashboard')
        }
      }
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleGenerateLandingPage = () => {
    router.push('/auth/signin')
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If user is signed in, don't render the landing page (they'll be redirected)
  if (session) {
    return null
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