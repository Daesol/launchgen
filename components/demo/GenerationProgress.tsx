'use client'

interface GenerationProgressProps {
  generationProgress: number
}

export function GenerationProgress({ generationProgress }: GenerationProgressProps) {
  const getProgressMessage = () => {
    if (generationProgress < 30) return "Analyzing your prompt..."
    if (generationProgress >= 30 && generationProgress < 60) return "Creating layout and design..."
    if (generationProgress >= 60 && generationProgress < 90) return "Writing optimized copy..."
    if (generationProgress >= 90) return "Finalizing your page..."
    return ""
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 transition-all duration-300 animate-in fade-in h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-purple-400">Generating your landing page...</span>
      </div>
      
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="text-purple-400">{generationProgress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${generationProgress}%` }}
          ></div>
        </div>
        <div className="text-xs text-slate-500">
          {getProgressMessage()}
        </div>
      </div>
    </div>
  )
} 