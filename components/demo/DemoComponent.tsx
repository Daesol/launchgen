'use client'

import { useState, useRef } from 'react'
import { Zap } from 'lucide-react'
import { DemoOverlay } from './DemoOverlay'
import { DemoHeader } from './DemoHeader'
import { TerminalInput } from './TerminalInput'
import { GenerationProgress } from './GenerationProgress'
import { LandingPagePreview } from './LandingPagePreview'
import { LeadsCollection } from './LeadsCollection'
import { AnalyticsDashboard } from './AnalyticsDashboard'

export function DemoComponent() {
  const [currentStep, setCurrentStep] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [previewAnimations, setPreviewAnimations] = useState({
    header: false,
    content: false,
    cta: false,
    features: false
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeads, setShowLeads] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [leadCount, setLeadCount] = useState(0)
  const [isDemoStarted, setIsDemoStarted] = useState(false)

  const demoPrompt = 'AI-powered meal planning app for busy professionals'
  const steps = [
    'Enter your product idea',
    'AI analyzes your prompt',
    'Generate landing page',
    'Collect leads instantly',
    'View analytics dashboard'
  ]

  // Reset demo state
  const resetDemo = () => {
    setCurrentStep(0)
    setTypedText('')
    setIsGenerating(false)
    setGenerationProgress(0)
    setShowPreview(false)
    setShowLeads(false)
    setShowAnalytics(false)
    setLeadCount(0)
    setIsDemoStarted(false)
    setPreviewAnimations({
      header: false,
      content: false,
      cta: false,
      features: false
    })
  }

  // Custom smooth scroll function for natural scrolling behavior
  const smoothScrollTo = (element: HTMLElement, target: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const start = element.scrollTop
      const distance = target - start
      const startTime = performance.now()
      
      const easeInOutQuad = (t: number): number => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      }
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuad(progress)
        
        element.scrollTop = start + distance * easedProgress
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          resolve()
        }
      }
      
      requestAnimationFrame(animateScroll)
    })
  }

  const startDemo = async () => {
    // Reset everything except isDemoStarted
    setCurrentStep(0)
    setTypedText('')
    setIsGenerating(false)
    setGenerationProgress(0)
    setShowPreview(false)
    setShowLeads(false)
    setShowAnalytics(false)
    setLeadCount(0)
    setPreviewAnimations({
      header: false,
      content: false,
      cta: false,
      features: false
    })
    
    // Set demo as started (this will hide the overlay)
    setIsDemoStarted(true)

    // Phase 1: Enter your product idea
    setCurrentStep(0)
    for (let i = 0; i <= demoPrompt.length; i++) {
      setTypedText(demoPrompt.substring(0, i))
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Phase 2: AI analyzes your prompt
    setCurrentStep(1)
    setIsGenerating(true)
    for (let i = 0; i <= 100; i += 2) {
      setGenerationProgress(i)
      await new Promise(resolve => setTimeout(resolve, 30))
    }
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Phase 3: Generate landing page
    setCurrentStep(2)
    setShowPreview(true)
    setIsGenerating(false)
    
    // Animate preview elements
    await new Promise(resolve => setTimeout(resolve, 300))
    setPreviewAnimations(prev => ({ ...prev, header: true }))
    
    await new Promise(resolve => setTimeout(resolve, 400))
    setPreviewAnimations(prev => ({ ...prev, content: true }))
    
    await new Promise(resolve => setTimeout(resolve, 400))
    setPreviewAnimations(prev => ({ ...prev, cta: true }))
    
    await new Promise(resolve => setTimeout(resolve, 400))
    setPreviewAnimations(prev => ({ ...prev, features: true }))
    
    // Start scroll animation after all elements are visible
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Custom scroll animation
    if (scrollRef.current) {
      const container = scrollRef.current
      const maxScroll = container.scrollHeight - container.clientHeight
      
      // Scroll down (faster for engagement)
      await smoothScrollTo(container, maxScroll, 2500) // 2.5 seconds to scroll down
      
      // Pause at bottom to "read" content
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Scroll back up (faster, like user returning to top)
      await smoothScrollTo(container, 0, 1200) // 1.2 seconds to scroll back up
      
      // Pause at top
      await new Promise(resolve => setTimeout(resolve, 400))
    }
    
    await new Promise(resolve => setTimeout(resolve, 600))

    // Phase 4: Collect leads instantly
    setCurrentStep(3)
    setShowLeads(true)
    setShowPreview(false)
    
    // Dynamic lead collection with varied timing
    const leadTimings = [600, 450, 800, 300, 700, 400, 550, 350] // Varied delays between leads
    
    for (let i = 1; i <= 8; i++) {
      setLeadCount(i)
      await new Promise(resolve => setTimeout(resolve, leadTimings[i - 1] || 500))
    }
    
    // Stay longer on leads page to show the full collection
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Phase 5: View analytics dashboard
    setCurrentStep(4)
    setShowLeads(false)
    setShowAnalytics(true)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Reset and restart
    setTimeout(() => {
      startDemo()
    }, 2000)
  }

  const shouldShowComponent = (component: string) => {
    switch (component) {
      case 'input':
        return currentStep === 0
      case 'generation':
        return currentStep === 1
      case 'preview':
        return currentStep === 2
      case 'leads':
        return currentStep === 3
      case 'analytics':
        return currentStep === 4
      default:
        return true
    }
  }

  return (
    <div className="relative h-screen md:h-full flex flex-col">
      {/* Demo Overlay */}
      {!isDemoStarted && (
        <DemoOverlay onStartDemo={startDemo} />
      )}

      {/* Demo Content Area - Fixed height with padding for bottom footer */}
      <div className="flex-1 pb-24 overflow-hidden">
        <div className="h-full space-y-4 min-h-0 flex flex-col">
          {/* Terminal Input */}
          {shouldShowComponent('input') && (
            <TerminalInput typedText={typedText} />
          )}

          {/* Generation Progress */}
          {shouldShowComponent('generation') && (
            <GenerationProgress generationProgress={generationProgress} />
          )}

          {/* Landing Page Preview */}
          {shouldShowComponent('preview') && (
            <LandingPagePreview 
              ref={scrollRef}
              previewAnimations={previewAnimations}
            />
          )}

          {/* Leads Collection */}
          {shouldShowComponent('leads') && (
            <LeadsCollection leadCount={leadCount} />
          )}

          {/* Analytics Dashboard */}
          {shouldShowComponent('analytics') && (
            <AnalyticsDashboard />
          )}
        </div>
      </div>

      {/* Fixed Footer - Phase Title and Progress Dots */}
      <DemoHeader steps={steps} currentStep={currentStep} />
    </div>
  )
} 