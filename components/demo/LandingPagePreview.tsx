'use client'

import { forwardRef } from 'react'
import { 
  Sparkles, 
  Star, 
  Users, 
  Clock, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  Zap,
  BarChart3
} from 'lucide-react'

interface PreviewAnimations {
  header: boolean
  content: boolean
  cta: boolean
  features: boolean
}

interface LandingPagePreviewProps {
  previewAnimations: PreviewAnimations
}

export const LandingPagePreview = forwardRef<HTMLDivElement, LandingPagePreviewProps>(
  ({ previewAnimations }, ref) => {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in min-h-[400px] h-full flex flex-col">
        {/* Browser Header */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div className="ml-4 text-sm text-slate-500">mealplan-ai.com</div>
        </div>

        {/* Viewport Container */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <div 
            ref={ref}
            className="absolute inset-0 overflow-auto"
          >
            {/* Hero Section */}
            <div
              className={`bg-gradient-to-br from-purple-50 via-white to-pink-50 text-gray-900 px-4 py-8 transition-all duration-500 ${
                previewAnimations.header ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-1 mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  <span>MealPlan AI</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                  Smart Meal Planning for Busy Professionals
                </h1>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-xl mx-auto">
                  Save 5+ hours weekly with AI-powered meal planning tailored to your schedule, dietary preferences, and nutritional goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-4">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start Free Trial
                  </button>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>4.9/5 rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-500" />
                      <span>10K+ users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className={`px-4 py-6 bg-white transition-all duration-500 delay-200 ${
              previewAnimations.content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
                  Everything you need to succeed
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold mb-1 text-gray-900">Save Time</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">5+ hours saved weekly with intelligent meal planning and grocery automation</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold mb-1 text-gray-900">Eat Better</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Personalized nutrition plans that adapt to your goals and preferences</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold mb-1 text-gray-900">Stay Healthy</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Track your progress and get insights to maintain a healthy lifestyle</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={`px-4 py-8 bg-gradient-to-r from-purple-50 to-pink-50 transition-all duration-500 delay-300 ${
              previewAnimations.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-xl font-bold mb-2 text-gray-900">Start Your Free Trial Today</h2>
                <p className="text-sm text-gray-600 mb-4">Join thousands of professionals who've transformed their eating habits and saved countless hours</p>
                <div className="max-w-sm mx-auto space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm shadow-sm"
                    />
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-1 shadow-lg text-sm">
                      Start Free
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    ✨ 7-day free trial • No credit card required • Cancel anytime
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className={`px-4 py-8 bg-white transition-all duration-500 delay-400 ${
              previewAnimations.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 shadow-lg">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
                    <Zap className="w-4 h-4 text-purple-600" />
                    Powerful Features for Modern Life
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">AI-Generated Meal Plans</div>
                        <div className="text-xs text-gray-600">Personalized recipes based on your preferences and dietary restrictions</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">Smart Grocery Lists</div>
                        <div className="text-xs text-gray-600">Automatically generated shopping lists with quantities and store locations</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">Nutrition Tracking</div>
                        <div className="text-xs text-gray-600">Monitor your daily intake and progress toward health goals</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">Recipe Suggestions</div>
                        <div className="text-xs text-gray-600">Discover new dishes based on ingredients you have</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">Dietary Restrictions</div>
                        <div className="text-xs text-gray-600">Support for vegan, keto, gluten-free, and other special diets</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 mb-0.5">Mobile App Access</div>
                        <div className="text-xs text-gray-600">Plan meals and shop on the go with our intuitive mobile app</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional content to make scrolling visible */}
            <div className="px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900">More Amazing Features</h3>
                <p className="text-sm text-gray-600 mb-6">Discover all the tools that make MealPlan AI the perfect solution for busy professionals</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-3 shadow-lg text-left">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="font-bold text-sm mb-1 text-gray-900">Smart Recommendations</div>
                    <p className="text-xs text-gray-600">Our AI learns your preferences and suggests meals you'll actually enjoy</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-lg text-left">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="font-bold text-sm mb-1 text-gray-900">Grocery Integration</div>
                    <p className="text-xs text-gray-600">Sync with your local store for real-time pricing and availability</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-lg text-left">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-2">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="font-bold text-sm mb-1 text-gray-900">Nutrition Analytics</div>
                    <p className="text-xs text-gray-600">Track your health goals with detailed insights and progress reports</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-lg text-left">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mb-2">
                      <Users className="w-4 h-4 text-pink-600" />
                    </div>
                    <div className="font-bold text-sm mb-1 text-gray-900">Family Planning</div>
                    <p className="text-xs text-gray-600">Plan meals for everyone in your household with individual preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

LandingPagePreview.displayName = 'LandingPagePreview' 