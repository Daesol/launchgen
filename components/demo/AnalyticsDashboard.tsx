'use client'

import { BarChart3, Eye, MousePointer, Mail, TrendingUp } from 'lucide-react'

export function AnalyticsDashboard() {
  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 transition-all duration-500 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        <div>
          <div className="font-semibold text-purple-400">Analytics Dashboard</div>
          <div className="text-sm text-slate-400">Real-time insights for your page</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1">
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
  )
} 