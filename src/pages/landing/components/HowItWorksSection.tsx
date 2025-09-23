import { Badge } from '@/components/ui/badge';
import { APP_CONFIG } from '@/config/app';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-brand-light/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="outline"
            className="border-brand-primary text-brand-primary"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Simple Steps to a Cleaner Environment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started with EcoCollect is easy. Follow these simple steps
            to begin your waste management journey on our web platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {APP_CONFIG.howItWorks.map(step => (
            <div key={step.step} className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
