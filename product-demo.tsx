'use client'

import { useEffect, useState } from 'react'
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

export default function LaunchGenDemo() {
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
  const steps = [
    'Enter your product idea',
    'AI analyzes your prompt',
    'Generate landing page',
    'Your page is ready!',
    'Collect leads instantly',
    'View analytics dashboard'
  ]

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

      // Wait a bit before starting
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 1: Type the prompt
      setCurrentStep(0)
      for (let i = 0; i <= demoPrompt.length; i++) {
        setTypedText(demoPrompt.substring(0, i))
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Start generation
      setCurrentStep(1)
      setIsGenerating(true)
      
      // Progress bar animation
      for (let i = 0; i <= 100; i += 2) {
        setGenerationProgress(i)
        await new Promise(resolve => setTimeout(resolve, 30))
      }

      setCurrentStep(2)
      await new Promise(resolve => setTimeout(resolve, 800))

      // Step 3: Show preview
      setCurrentStep(3)
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

      // Wait before showing leads phase
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Step 4: Show leads collection
      setCurrentStep(4)
      setShowLeads(true)
      
      // Simulate lead collection
      for (let i = 1; i <= 5; i++) {
        setLeadCount(i)
        await new Promise(resolve => setTimeout(resolve, 400))
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Step 5: Show analytics
      setCurrentStep(5)
      setShowAnalytics(true)
      
      // Wait before restarting
      await new Promise(resolve => setTimeout(resolve, 4000))
      runDemo()
    }

    runDemo()
  }, [])

  // Helper function to determine what to show based on current step
  const shouldShowComponent = (component: string) => {
    switch (component) {
      case 'input':
        return currentStep <= 1 || (currentStep === 2 && isGenerating)
      case 'generation':
        return currentStep === 1 || (currentStep === 2 && isGenerating)
      case 'success':
        return currentStep === 3 && !isGenerating
      case 'leads':
        return currentStep === 4 && showLeads
      case 'analytics':
        return currentStep === 5 && showAnalytics
      case 'preview':
        return showPreview && (currentStep === 3 || currentStep === 4 || currentStep === 5)
      case 'preview-placeholder':
        return !showPreview && currentStep <= 2
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>
      </div>
      
      {/* Animated Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>

      <div className="relative flex items-center justify-center min-h-screen p-8">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-400 mb-4">
              <Zap className="w-4 h-4" />
              <span>LaunchGen Demo</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Watch your idea become a landing page
            </h1>
            <p className="text-slate-400">In real-time, in under 60 seconds</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep >= index 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    currentStep >= index ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 transition-colors duration-300 ${
                      currentStep > index ? 'bg-purple-500' : 'bg-slate-800'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Terminal Input */}
              {shouldShowComponent('input') && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 transition-all duration-300 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-400">LaunchGen Terminal</span>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm min-h-[120px]">
                    <div className="text-slate-500 mb-2">$ launchgen create</div>
                    <div className="text-slate-400 mb-2">Describe your product:</div>
                    <div className="text-white">
                      {typedText}
                      <span className="animate-pulse bg-purple-500 w-2 h-5 inline-block ml-1"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Generation Progress */}
              {shouldShowComponent('generation') && (
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 transition-all duration-300 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-purple-400">Generating your landing page...</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-purple-400">{generationProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {generationProgress < 30 && "Analyzing your prompt..."}
                      {generationProgress >= 30 && generationProgress < 60 && "Creating layout and design..."}
                      {generationProgress >= 60 && generationProgress < 90 && "Writing optimized copy..."}
                      {generationProgress >= 90 && "Finalizing your page..."}
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {shouldShowComponent('success') && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 transition-all duration-500 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-semibold text-green-400">Page Generated Successfully!</div>
                      <div className="text-sm text-slate-400">Ready to publish in 1.3 seconds</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leads Collection */}
              {shouldShowComponent('leads') && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 transition-all duration-500 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="font-semibold text-blue-400">Collecting Leads</div>
                      <div className="text-sm text-slate-400">Users are signing up for your product</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: leadCount }, (_, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm transition-all duration-300 animate-in fade-in">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">user{i + 1}@example.com</div>
                          <div className="text-slate-400 text-xs">Just signed up</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    <strong className="text-blue-400">{leadCount}</strong> leads collected so far
                  </div>
                </div>
              )}

              {/* Analytics Dashboard */}
              {shouldShowComponent('analytics') && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 transition-all duration-500 animate-in fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="font-semibold text-purple-400">Analytics Dashboard</div>
                      <div className="text-sm text-slate-400">Real-time insights for your page</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Page Views</span>
                      </div>
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <div className="text-xs text-green-400">+12% today</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <MousePointer className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Conversion</span>
                      </div>
                      <div className="text-2xl font-bold text-white">8.3%</div>
                      <div className="text-xs text-green-400">+2.1% today</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Signups</span>
                      </div>
                      <div className="text-2xl font-bold text-white">103</div>
                      <div className="text-xs text-green-400">+5 today</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Growth</span>
                      </div>
                      <div className="text-2xl font-bold text-white">+23%</div>
                      <div className="text-xs text-green-400">this week</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              {/* Landing Page Preview */}
              {shouldShowComponent('preview') && (
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in">
                  {/* Browser Header */}
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="ml-4 text-sm text-slate-500">mealplan-ai.com</div>
                  </div>

                  {/* Page Content */}
                  <div className="text-slate-900 min-h-[500px]">
                    {/* Hero Section */}
                    <div
                      className={`bg-white text-gray-900 px-6 py-16 sm:px-10 sm:py-24 transition-all duration-500 ${
                        previewAnimations.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 mb-6 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          <Sparkles className="w-4 h-4" />
                          <span>MealPlan AI</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                          Smart Meal Planning for Busy Professionals
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-8">
                          Save 5+ hours weekly with AI-powered meal planning tailored to your schedule, dietary preferences, and nutritional goals.
                        </p>
                        <div className="flex justify-center gap-4 mb-10 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>4.9/5 rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>10K+ users</span>
                          </div>
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md transition-colors">
                          Try MealPlan AI Free
                        </button>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className={`px-8 py-8 transition-all duration-500 delay-200 ${
                      previewAnimations.content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="font-semibold mb-1">Save Time</h3>
                          <p className="text-sm text-slate-600">5+ hours saved weekly</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="font-semibold mb-1">Eat Better</h3>
                          <p className="text-sm text-slate-600">Personalized nutrition</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold mb-1">Stay Healthy</h3>
                          <p className="text-sm text-slate-600">Track your goals</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className={`px-8 py-6 bg-slate-50 transition-all duration-500 delay-300 ${
                      previewAnimations.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">Start Your Free Trial</h2>
                        <p className="text-slate-600">Join thousands of professionals who've transformed their eating habits</p>
                      </div>
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2">
                            Start Free
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 text-center">
                          ✨ 7-day free trial • No credit card required • Cancel anytime
                        </p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className={`px-8 py-6 transition-all duration-500 delay-400 ${
                      previewAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          Everything you need to succeed
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>AI-generated meal plans</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Smart grocery lists</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Nutrition tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Recipe suggestions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Dietary restrictions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                            <span>Mobile app access</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Placeholder */}
              {shouldShowComponent('preview-placeholder') && (
                <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                      <Zap className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="text-slate-400">Your landing page will appear here</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}