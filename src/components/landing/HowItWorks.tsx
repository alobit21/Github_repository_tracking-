import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Cpu, Target } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Data Collection',
    description: 'We collect GitHub metadata daily across millions of repositories, tracking stars, contributions, issues, and commit activity.'
  },
  {
    icon: Cpu,
    title: 'Signal Processing',
    description: 'Our engine computes momentum scores, contribution velocity, and trend patterns to identify meaningful signals from noise.'
  },
  {
    icon: Target,
    title: 'Categorized Insights',
    description: 'You get categorized signals and alerts before trends go mainstream, with actionable insights for each ecosystem.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Three-step process that turns raw GitHub data into actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue text-primary rounded-full flex items-center justify-center text-sm font-bold border-2 border-background">
                {index + 1}
              </div>
              
              <Card className="border-border h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface border border-border">
                      <step.icon className="w-5 h-5 text-blue" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
