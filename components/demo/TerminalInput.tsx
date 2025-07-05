'use client'

interface TerminalInputProps {
  typedText: string
}

export function TerminalInput({ typedText }: TerminalInputProps) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 transition-all duration-300 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-sm text-slate-400">LaunchGen Terminal</span>
      </div>
      
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm flex-1">
        <div className="text-slate-500 mb-2">$ launchgen create</div>
        <div className="text-slate-400 mb-2">Describe your product:</div>
        <div className="text-white">
          {typedText}
          <span className="animate-pulse bg-purple-500 w-2 h-5 inline-block ml-1"></span>
        </div>
      </div>
    </div>
  )
} 