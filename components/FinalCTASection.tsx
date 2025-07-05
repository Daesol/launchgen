'use client'

import { ArrowRight, CheckCircle } from 'lucide-react'

interface FinalCTASectionProps {
  email: string
  setEmail: (email: string) => void
  isSubmitted: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export default function FinalCTASection({ email, setEmail, isSubmitted, handleSubmit }: FinalCTASectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Idea?</h2>
        <p className="text-slate-400 mb-8">
          Join the waitlist and be among the first to experience the future of landing page creation.
        </p>
        <div className="max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-semibold text-green-400">You're on the list!</div>
                  <div className="text-sm text-slate-400">We'll notify you when LaunchGen launches</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 