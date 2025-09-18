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
        console.log('Processing OAuth callback with code:', code)
        // This is an OAuth callback, exchange code for session
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error('OAuth callback error:', error)
            // Clear the URL parameters even if there's an error
            window.history.replaceState({}, '', '/')
            return
          }
          if (data.session) {
            console.log('OAuth session established, redirecting to dashboard')
            // Clear the URL parameters and redirect to dashboard
            window.history.replaceState({}, '', '/')
            // Use a small delay to ensure session is fully established
            setTimeout(() => {
              router.push('/dashboard')
            }, 100)
            return
          }
        } catch (err) {
          console.error('OAuth callback error:', err)
          // Clear the URL parameters even if there's an error
          window.history.replaceState({}, '', '/')
        }
      }
    }

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
        
        // Always check for OAuth callback first
        handleOAuthCallback()
      }
    })

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        console.log('Auth state change:', _event, !!session)
        setSession(session)
        setLoading(false)
        
        // Redirect to dashboard on successful sign in
        if (session && _event === 'SIGNED_IN') {
          console.log('User signed in, redirecting to dashboard')
          // Use a small delay to ensure session is fully established
          setTimeout(() => {
            router.push('/dashboard')
          }, 100)
        }
      }
    })

    return () => {
      mounted = false
      listener?.subscription.unsubscribe()
    }
  }, [router, supabase]) // Include supabase in deps since we need it for the callback

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