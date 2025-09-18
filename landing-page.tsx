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
    
    // Handle OAuth callback with code parameter
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        // This is an OAuth callback, exchange code for session
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('OAuth callback error:', error)
            return
          }
          if (data.session) {
            // Clear the URL parameters and redirect to dashboard
            window.history.replaceState({}, '', '/dashboard')
            router.replace('/dashboard')
            return
          }
        } catch (err) {
          console.error('OAuth callback error:', err)
        }
      }
    }

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
        
        // Check for OAuth callback (only if not already authenticated)
        if (!session) {
          handleOAuthCallback()
        }
      }
    })

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
        
        // Only redirect to dashboard if this is an OAuth callback
        if (session && _event === 'SIGNED_IN') {
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get('code')
          if (code) {
            // This is an OAuth callback, redirect to dashboard
            window.history.replaceState({}, '', '/dashboard')
            router.replace('/dashboard')
          }
        }
      }
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleGenerateLandingPage = () => {
    if (session) {
      // User is already signed in, go directly to dashboard
      router.push('/dashboard')
    } else {
      // User is not signed in, redirect to sign in
      router.push('/auth/signin')
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Always render the landing page for both authenticated and unauthenticated users

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