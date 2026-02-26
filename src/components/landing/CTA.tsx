import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
          Start Detecting Real Signal
        </h2>
        <p className="text-lg text-secondary mb-10 max-w-2xl mx-auto">
          Join thousands of developers and investors who use SignalFromNoise to identify emerging trends before they go mainstream.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-base px-8">
            Create Free Account
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8">
            Explore Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
