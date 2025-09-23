import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Truck, Leaf, Shield, Users, Recycle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="outline"
            className="border-brand-primary text-brand-primary"
          >
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything You Need for Smart Waste Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform makes waste management simple, efficient,
            and environmentally responsible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {APP_CONFIG.features.map((feature, index) => {
            const iconMap = {
              Calendar,
              Truck,
              Leaf,
              Shield,
              Users,
              Recycle,
            };
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap];

            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-brand-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
