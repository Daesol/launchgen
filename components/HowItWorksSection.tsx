'use client'

const steps = [
  'Enter your product idea',
  'AI analyzes your prompt',
  'Generate landing page',
  'Your page is ready!',
  'Collect leads instantly',
  'View analytics dashboard'
]

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12">
          LaunchGen follows a simple 6-step process to transform your idea into a high-converting landing page.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-400">{index + 1}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{step}</h3>
              <p className="text-slate-400 text-sm">
                {index === 0 && "Simply describe your product idea in plain English"}
                {index === 1 && "Our AI analyzes your prompt to understand your target audience and value proposition"}
                {index === 2 && "AI generates a complete landing page with optimized copy and design"}
                {index === 3 && "Your page is ready to publish with one click"}
                {index === 4 && "Start collecting leads immediately with built-in forms and analytics"}
                {index === 5 && "Track performance and optimize your campaigns with real-time insights"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 