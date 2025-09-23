import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="outline"
            className="border-brand-primary text-brand-primary"
          >
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Affordable Plans for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our core
            features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {APP_CONFIG.pricing.plans.map(plan => (
            <Card
              key={plan.name}
              className={`border-2 ${plan.popular ? 'border-brand-primary' : 'border-gray-200 hover:border-brand-primary'} transition-colors relative`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-brand-primary text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-brand-primary">
                    {plan.price} {plan.currency}
                  </div>
                  <div className="text-gray-600">{plan.period}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-brand-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-brand-primary hover:bg-brand-secondary text-white">
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
