'use client'

import { Play } from 'lucide-react'

interface DemoOverlayProps {
  onStartDemo: () => void
}

export function DemoOverlay({ onStartDemo }: DemoOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
      <div className="text-center">
        <button
          onClick={onStartDemo}
          className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-extrabold text-xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 focus:outline-none focus:ring-4 focus:ring-pink-400/60 animate-glow"
          style={{ boxShadow: '0 0 32px 8px rgba(168,85,247,0.5), 0 0 64px 16px rgba(236,72,153,0.3)' }}
        >
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600 blur-xl opacity-60 animate-pulse pointer-events-none z-0"></span>
          <span className="relative z-10 flex items-center gap-3">
            <Play className="w-7 h-7 transition-transform group-hover:scale-110 drop-shadow-lg" />
            Show Demo
          </span>
        </button>
        <p className="text-slate-400 mt-4 text-sm">
          Watch your idea become a landing page in real-time
        </p>
      </div>
    </div>
  )
} 