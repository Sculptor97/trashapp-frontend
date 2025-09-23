import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

export function NewsletterSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-8 w-8 text-brand-light" />
                  <Badge
                    variant="secondary"
                    className="bg-brand-light text-brand-primary"
                  >
                    Newsletter
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  {APP_CONFIG.newsletter.title}
                </h2>
                <p className="text-xl text-brand-light">
                  {APP_CONFIG.newsletter.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-light">
                  What you'll get:
                </h3>
                <ul className="space-y-2">
                  {APP_CONFIG.newsletter.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-brand-light" />
                      <span className="text-brand-light">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-center">
                    Join Our Community
                  </CardTitle>
                  <CardDescription className="text-brand-light text-center">
                    Be the first to know about new features and environmental
                    initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder={APP_CONFIG.newsletter.placeholder}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                    />
                    <Button
                      className="w-full bg-white text-brand-primary hover:bg-gray-100 font-semibold"
                      size="lg"
                    >
                      {APP_CONFIG.newsletter.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-brand-light text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
