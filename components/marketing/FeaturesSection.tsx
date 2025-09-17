'use client'

import { Zap, Sparkles, TrendingUp, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional landing pages in under 60 seconds"
  },
  {
    icon: Sparkles,
    title: "1 Click Deploy",
    description: "Make your landing page live in seconds with CRM and Analytics"
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimized",
    description: "Built-in best practices for maximum lead generation"
  },
  {
    icon: BarChart3,
    title: "Analytics Included",
    description: "Track performance and optimize your campaigns"
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need To Succeed</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Our AI automates to create professional landing page instantly for you to start collect leads and payment immediately.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 