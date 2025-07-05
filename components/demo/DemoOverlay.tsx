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
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
        >
          <div className="relative">
            <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          </div>
          Show Demo
        </button>
        <p className="text-slate-400 mt-4 text-sm">
          Watch your idea become a landing page in real-time
        </p>
      </div>
    </div>
  )
} 