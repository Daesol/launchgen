interface HeroSectionProps {
  onGenerateLandingPage: () => void;
}

export function HeroSection({ onGenerateLandingPage }: HeroSectionProps) {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Create Stunning Landing Pages with AI
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Generate professional, conversion-optimized landing pages in minutes. 
            No design skills required. Just describe your business and let our AI do the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGenerateLandingPage}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Creating Now
            </button>
            <button className="border-2 border-slate-300 text-slate-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-800 transition-colors">
              Watch Demo
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Free to try • No credit card required • 5-minute setup
          </p>
        </div>
      </div>
    </section>
  );
}
