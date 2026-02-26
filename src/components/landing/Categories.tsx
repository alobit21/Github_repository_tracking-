import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'AI / ML', color: 'blue' },
  { name: 'DevTools', color: 'green' },
  { name: 'Infrastructure', color: 'yellow' },
  { name: 'Web3', color: 'blue' },
  { name: 'Frontend', color: 'green' },
  { name: 'Backend', color: 'yellow' },
  { name: 'Enterprise', color: 'blue' },
  { name: 'Experimental', color: 'green' }
];

export function Categories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Track Trends by Ecosystem Category
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Monitor momentum across different technology ecosystems and discover trends in your areas of interest.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className={`px-4 py-2 text-sm border-${category.color} text-${category.color} bg-${category.color}/10`}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary">
            Each category is analyzed independently to identify ecosystem-specific trends and signals.
          </p>
        </div>
      </div>
    </section>
  );
}
