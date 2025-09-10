export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder",
      company: "TechStart",
      quote: "LaunchGen helped us create a professional landing page in minutes. Our conversion rate increased by 40%!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      company: "GrowthCo",
      quote: "The AI-generated content was spot-on. We saved weeks of work and got better results than our previous agency.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "CEO",
      company: "InnovateLab",
      quote: "Simple, fast, and effective. LaunchGen is a game-changer for small businesses like ours.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-slate-300 text-lg">Join thousands of businesses already using LaunchGen</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-slate-400 text-sm">{testimonial.role} at {testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
