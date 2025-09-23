import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MapPin, Star } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-brand-light via-white to-brand-accent/20 py-20 lg:py-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-brand-primary text-white hover:bg-brand-secondary">
                🇨🇲 Made for Cameroon
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                {APP_CONFIG.tagline}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {APP_CONFIG.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-secondary text-white text-lg px-8 py-6"
              >
                {APP_CONFIG.cta.primary.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              >
                {APP_CONFIG.cta.secondary.text}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-brand-primary" />
                <span>{APP_CONFIG.stats.users} Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-brand-primary" />
                <span>{APP_CONFIG.stats.cities} Cities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-brand-primary" />
                <span>{APP_CONFIG.stats.rating} Rating</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src={APP_CONFIG.images.hero}
                alt="Waste management in Cameroon"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-brand-primary text-white p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{APP_CONFIG.stats.satisfaction}</div>
                <div className="text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
