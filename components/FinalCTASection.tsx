'use client'

import { ArrowRight, CheckCircle } from 'lucide-react'

interface FinalCTASectionProps {
  email: string
  setEmail: (email: string) => void
  isSubmitted: boolean
  isSubmitting: boolean
  isWaitlistFull: boolean
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export default function FinalCTASection({ email, setEmail, isSubmitted, isSubmitting, isWaitlistFull, handleSubmit }: FinalCTASectionProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Idea?</h2>
        <p className="text-slate-400 mb-8">
          Join the waitlist and be among the first to experience the future of landing page creation.
        </p>
        <div className="max-w-md mx-auto">
          {!isSubmitted && !isWaitlistFull ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : isSubmitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-semibold text-green-400">Thank you for joining!</div>
                  <div className="text-sm text-slate-400">You're now on the exclusive waitlist. We'll be in touch soon!</div>
                </div>
              </div>
            </div>
          ) : isWaitlistFull ? (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 text-orange-400 font-bold">⚠</div>
                <div>
                  <div className="font-semibold text-orange-400">The current waitlist is full</div>
                  <div className="text-sm text-slate-400">Please contact <a href="mailto:daesol@webproagency.ca" className="text-orange-400 hover:underline">daesol@webproagency.ca</a> to join waitlist</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
} 