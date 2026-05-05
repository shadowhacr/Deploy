import { HeroSection } from '@/sections/HeroSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { PricingSection } from '@/sections/PricingSection';
import { Footer } from '@/sections/Footer';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
