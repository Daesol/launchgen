export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Content Generation",
      description: "Our advanced AI creates compelling headlines, descriptions, and calls-to-action tailored to your business.",
      icon: "🤖"
    },
    {
      title: "Professional Design Templates",
      description: "Choose from beautiful, conversion-optimized templates that work across all devices.",
      icon: "🎨"
    },
    {
      title: "Real-time Analytics",
      description: "Track visitor behavior, conversion rates, and optimize your page for better results.",
      icon: "📊"
    },
    {
      title: "Lead Capture Forms",
      description: "Built-in forms to capture leads and integrate with your favorite CRM tools.",
      icon: "📝"
    },
    {
      title: "Mobile Responsive",
      description: "All pages are automatically optimized for mobile, tablet, and desktop devices.",
      icon: "📱"
    },
    {
      title: "One-Click Publishing",
      description: "Publish your landing page instantly with a custom domain or subdomain.",
      icon: "🚀"
    }
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
          <p className="text-slate-300 text-lg">Powerful features designed to help you create, launch, and optimize your landing pages</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-lg">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
