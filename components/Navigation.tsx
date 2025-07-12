'use client'

import { Zap } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">LaunchGen</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#demo" className="text-slate-300 hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="/auth/signin" className="text-slate-300 hover:text-white transition-colors">Sign In</a>
            <a href="/auth/signin?mode=signup" className="ml-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  )
} 