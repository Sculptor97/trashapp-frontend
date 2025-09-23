import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  PricingSection,
  NewsletterSection,
} from './components';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <PricingSection />
      <NewsletterSection />
    </div>
  );
}

export default LandingPage;
