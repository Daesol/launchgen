'use client'

import { useState, useEffect } from 'react'
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
  MousePointer 
} from 'lucide-react'

const steps = [
  'Enter your product idea',
  'AI analyzes your prompt',
  'Generate landing page',
  'Collect leads instantly',
  'View analytics dashboard'
]

export default function HowItWorksSection() {
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
  const [showLeads, setShowLeads] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [leadCount, setLeadCount] = useState(0)

  const demoPrompt = 'AI-powered meal planning app for busy professionals'

  useEffect(() => {
    const runDemo = async () => {
      // Reset everything
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

      // Wait before starting
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 1: Type the prompt
      setCurrentStep(0)
      for (let i = 0; i <= demoPrompt.length; i++) {
        setTypedText(demoPrompt.substring(0, i))
        await new Promise(resolve => setTimeout(resolve, 80))
      }
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Start generation
      setCurrentStep(1)
      setIsGenerating(true)
      for (let i = 0; i <= 100; i += 3) {
        setGenerationProgress(i)
        await new Promise(resolve => setTimeout(resolve, 40))
      }
      await new Promise(resolve => setTimeout(resolve, 800))

      // Step 3: Show preview
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
      
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 4: Show leads collection
      setCurrentStep(3)
      setShowLeads(true)
      setShowPreview(false)
      
      for (let i = 1; i <= 5; i++) {
        setLeadCount(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 5: Show analytics
      setCurrentStep(4)
      setShowLeads(false)
      setShowAnalytics(true)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Restart the demo
      setTimeout(() => runDemo(), 1000)
    }

    runDemo()
  }, [])

  const getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3 h-28 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Terminal</span>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs">
              <div className="text-slate-500 mb-1">$ launchgen create</div>
              <div className="text-slate-400 mb-1">Describe your product:</div>
              <div className="text-white truncate">
                {typedText}
                <span className="animate-pulse bg-purple-500 w-1 h-3 inline-block ml-1"></span>
              </div>
            </div>
          </div>
        )
      
      case 1:
        return (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-3 h-28 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-purple-400">Generating...</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Progress</span>
                <span className="text-purple-400">{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500">
                {generationProgress < 30 && "Analyzing..."}
                {generationProgress >= 30 && generationProgress < 60 && "Creating..."}
                {generationProgress >= 60 && generationProgress < 90 && "Writing..."}
                {generationProgress >= 90 && "Finalizing..."}
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="bg-white rounded-xl overflow-hidden shadow-lg h-28">
            <div className="bg-slate-100 px-2 py-1.5 border-b border-slate-200 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <div className="ml-1 text-xs text-slate-500">mealplan-ai.com</div>
            </div>
            <div className="p-2 text-slate-900">
              <div className={`transition-all duration-500 ${previewAnimations.header ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-xs font-bold mb-1">Smart Meal Planning</div>
                <div className="text-xs text-slate-600 leading-tight">Save 5+ hours weekly with AI-powered meal planning</div>
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 h-28 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">Collecting Leads</span>
            </div>
            <div className="space-y-1">
              {Array.from({ length: Math.min(leadCount, 2) }, (_, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-1.5 h-1.5 text-blue-400" />
                  </div>
                  <div className="text-white truncate">user{i + 1}@example.com</div>
                </div>
              ))}
              {leadCount > 2 && (
                <div className="text-xs text-blue-400 mt-1">+{leadCount - 2} more leads</div>
              )}
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 h-28 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-purple-400">Analytics</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded p-1.5">
                <div className="text-xs text-slate-400">Views</div>
                <div className="text-sm font-bold text-white">1,247</div>
              </div>
              <div className="bg-slate-800/50 rounded p-1.5">
                <div className="text-xs text-slate-400">Leads</div>
                <div className="text-sm font-bold text-white">103</div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            LaunchGen follows a simple 5-step process to transform your idea into a high-converting landing page.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              {/* Demo Animation - Above the number */}
              <div className="mb-6">
                {getStepContent(index)}
              </div>
              
              {/* Number Badge */}
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-purple-400">{index + 1}</span>
              </div>
              
              {/* Content - Left aligned */}
              <div className="text-left">
                <h3 className="font-semibold text-white mb-2">{step}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {index === 0 && "Simply describe your product idea in plain English"}
                  {index === 1 && "Our AI analyzes your prompt to understand your target audience and value proposition"}
                  {index === 2 && "AI generates a complete landing page with optimized copy and design"}
                  {index === 3 && "Start collecting leads immediately with built-in forms and analytics"}
                  {index === 4 && "Track performance and optimize your campaigns with real-time insights"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 