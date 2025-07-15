'use client'

import { ArrowRight, CheckCircle } from 'lucide-react'

interface FinalCTASectionProps {
  onGenerateLandingPage: () => void
}

export default function FinalCTASection({ onGenerateLandingPage }: FinalCTASectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Idea?</h2>
        <p className="text-slate-400 mb-8">
          Start creating your landing page today and turn your idea into leads.
        </p>
        <div className="max-w-md mx-auto">
          <button
            onClick={onGenerateLandingPage}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Generate A Landing Page
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
} 