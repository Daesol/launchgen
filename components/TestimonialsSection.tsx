'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, TechStart",
    content: "LaunchGen helped us validate our idea in 24 hours. We collected 50+ leads before even building the product!",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Product Manager, InnovateCorp",
    content: "The AI-generated copy was spot-on. Our conversion rate increased by 300% compared to our previous landing page.",
    rating: 5
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-slate-400">Join hundreds of founders who've already transformed their ideas into reality</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 