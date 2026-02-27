import { Card, CardContent } from '@/components/ui/card';
import { Users, Folder, Calendar } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '10K+',
    label: 'repositories analyzed'
  },
  {
    icon: Folder,
    value: '100+',
    label: 'categories tracked'
  },
  {
    icon: Calendar,
    value: 'Daily',
    label: 'automated updates'
  }
];

export function SocialProof() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Trusted by Technical Leaders
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Used by developers, indie hackers, and startup founders who need real technical signals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-lg bg-surface border border-border">
                    <stat.icon className="w-6 h-6 text-blue" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-secondary">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
