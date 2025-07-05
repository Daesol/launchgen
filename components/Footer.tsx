'use client'

import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Zap className="w-6 h-6 text-purple-500" />
            <span className="text-lg font-bold">LaunchGen</span>
          </div>
          <div className="text-sm text-slate-400">
            © 2024 LaunchGen. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 