import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'VC at TechVentures',
    content: 'SignalFromNoise helps us identify emerging trends weeks before they hit mainstream. The momentum scoring is incredibly accurate.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c6ca?w=100&h=100&fit=crop&auto=format',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Indie Hacker',
    content: 'I discovered three breakout technologies through SignalFromNoise before they became popular. It\'s my secret weapon.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Engineering Manager',
    content: 'The category-based filtering helps us track ecosystem trends relevant to our stack. Invaluable for strategic planning.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Trusted by Technical Leaders
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            See what developers, founders, and investors are saying about SignalFromNoise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-secondary">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <Quote className="w-5 h-5 text-blue mb-2" />
                  <p className="text-secondary text-sm leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow fill-current" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
