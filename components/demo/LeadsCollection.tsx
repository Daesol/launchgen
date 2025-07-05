'use client'

import { Database, Mail } from 'lucide-react'

interface LeadsCollectionProps {
  leadCount: number
}

// Realistic lead data with names, emails, and timestamps
const realisticLeads = [
  { name: 'Sarah Chen', email: 'sarah.chen@techstartup.io', time: '2 min ago' },
  { name: 'Marcus Rodriguez', email: 'm.rodriguez@consulting.com', time: '1 min ago' },
  { name: 'Emily Watson', email: 'emily.watson@healthcare.org', time: '45 sec ago' },
  { name: 'David Kim', email: 'david.kim@fintech.co', time: '30 sec ago' },
  { name: 'Lisa Thompson', email: 'lisa.t@marketing.agency', time: '15 sec ago' },
  { name: 'Alex Johnson', email: 'alex.j@startup.xyz', time: 'Just now' },
  { name: 'Rachel Green', email: 'rachel.green@product.dev', time: 'Just now' },
  { name: 'Michael Brown', email: 'mike.brown@saas.io', time: 'Just now' }
]

export function LeadsCollection({ leadCount }: LeadsCollectionProps) {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 transition-all duration-500 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-400" />
        <div>
          <div className="font-semibold text-blue-400">Collecting Leads</div>
          <div className="text-sm text-slate-400">Users are signing up for your product</div>
        </div>
      </div>
      <div className="space-y-2 flex-1 overflow-auto">
        {Array.from({ length: leadCount }, (_, i) => {
          const lead = realisticLeads[i]
          return (
            <div key={i} className="flex items-center gap-3 text-sm transition-all duration-300 animate-in fade-in">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{lead.name}</div>
                <div className="text-slate-400 text-xs">{lead.email}</div>
              </div>
              <div className="text-xs text-slate-500">{lead.time}</div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-sm text-slate-400">
        <strong className="text-blue-400">{leadCount}</strong> leads collected so far
      </div>
    </div>
  )
} 