import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring trends',
    features: [
      'Daily trend reports',
      'Limited category filters',
      'Public repositories only',
      'Basic momentum scores',
      'Community support'
    ],
    highlighted: false,
    cta: 'Start Free'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For serious signal detection',
    features: [
      'Advanced filtering options',
      'Category-based alerts',
      'Historical data exports',
      'Private repository tracking',
      'Custom momentum metrics',
      'Priority support',
      'API access'
    ],
    highlighted: true,
    cta: 'Start Pro Trial'
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Start with free access, upgrade when you need advanced signal detection capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`
                border-border relative
                ${plan.highlighted ? 'border-blue' : ''}
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-blue text-primary px-3 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-primary">{plan.price}</span>
                  {plan.period && (
                    <span className="text-secondary">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-secondary mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green flex-shrink-0" />
                      <span className="text-sm text-primary">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
