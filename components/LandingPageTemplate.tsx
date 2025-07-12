import React from "react";
import LeadForm from "./LeadForm";

interface LandingPageTemplateProps {
  config: {
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
      backgroundImage?: string;
    };
    features: Array<{ title: string; description: string; icon?: string }>;
    themeColors: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
  };
  pageId?: string;
}

export default function LandingPageTemplate({ config, pageId }: LandingPageTemplateProps) {
  if (!config || !config.hero || !config.features || !config.themeColors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        Invalid or incomplete config. Please try again.
      </div>
    );
  }
  const { hero, features, themeColors } = config;
  const primary = themeColors.primaryColor || '#6366f1';
  const secondary = themeColors.secondaryColor || '#f1f5f9';
  const accent = themeColors.accentColor || '#a21caf';
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
    >
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center py-24 px-4 text-center relative"
        style={hero.backgroundImage ? { backgroundImage: `url(${hero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
          {hero.headline}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          {hero.subheadline}
        </p>
        <button
          className="px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
          style={{ background: accent, color: '#fff' }}
        >
          {hero.cta}
        </button>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 bg-white/80 flex-1">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-slate-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: accent }}
                  />
                  <span className="text-slate-800 text-base font-semibold">{feature.title}</span>
                </div>
                <span className="text-slate-700 text-sm">{feature.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Lead Form Section */}
      {pageId && (
        <section className="py-12 px-4 bg-white/90 flex justify-center">
          <LeadForm pageId={pageId} />
        </section>
      )}
      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm bg-white/70">
        Powered by LaunchGen AI
      </footer>
    </div>
  );
} 