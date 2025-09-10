interface FinalCTASectionProps {
  onGenerateLandingPage: () => void;
}

export default function FinalCTASection({ onGenerateLandingPage }: FinalCTASectionProps) {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Create Your Landing Page?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of businesses already using LaunchGen to grow their online presence
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGenerateLandingPage}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Learn More
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-4">
          No credit card required • 5-minute setup • Cancel anytime
        </p>
      </div>
    </section>
  );
}
