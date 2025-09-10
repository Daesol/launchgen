interface HowItWorksSectionProps {
  onGenerateLandingPage?: () => void;
}

export default function HowItWorksSection({ onGenerateLandingPage }: HowItWorksSectionProps) {
  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enter Your Prompt</h3>
              <p className="text-slate-300">Describe your business and what you want to achieve</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Generates Content</h3>
              <p className="text-slate-300">Our AI creates a complete landing page tailored to your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Launch & Convert</h3>
              <p className="text-slate-300">Publish your page and start converting visitors into customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
