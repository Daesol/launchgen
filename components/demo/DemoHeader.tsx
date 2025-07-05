'use client'

interface DemoHeaderProps {
  steps: string[]
  currentStep: number
}

export function DemoHeader({ steps, currentStep }: DemoHeaderProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800/50 rounded-b-2xl p-4">
      {/* Mobile: Show only current phase title */}
      <div className="block md:hidden text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          {steps[currentStep]}
        </h3>
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentStep >= index ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Show all phases with current highlighted */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center transition-all duration-300 ${
                currentStep === index 
                  ? 'text-purple-400' 
                  : currentStep > index 
                    ? 'text-slate-400' 
                    : 'text-slate-600'
              }`}
            >
              <div className={`w-3 h-3 rounded-full mx-auto mb-2 transition-all duration-300 ${
                currentStep >= index ? 'bg-purple-500' : 'bg-slate-700'
              }`} />
              <div className={`text-xs font-medium transition-all duration-300 ${
                currentStep === index ? 'text-white' : ''
              }`}>
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 