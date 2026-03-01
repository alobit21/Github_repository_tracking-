import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
          Start Tracking GitHub Trends
        </h2>
        <p className="text-lg text-secondary mb-10 max-w-2xl mx-auto">
          Explore real-time repository analytics, discover emerging projects, and track momentum across the open-source ecosystem.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="text-base px-8 w-full sm:w-auto">
              View Dashboard
            </Button>
          </Link>
          <Link to="/dashboard/repositories">
            <Button variant="outline" size="lg" className="text-base px-8 w-full sm:w-auto">
              Browse Repositories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
