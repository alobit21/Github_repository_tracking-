import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Showcase } from '@/components/landing/Showcase';
import { Analytics } from '@/components/landing/Analytics';
import { Testimonials } from '@/components/landing/Testimonials';
import { Integration } from '@/components/landing/Integration';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Categories } from '@/components/landing/Categories';
import { SocialProof } from '@/components/landing/SocialProof';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Showcase />
      <Analytics />
      <Features />
      <Testimonials />
      <Integration />
      <HowItWorks />
      <Categories />
      <SocialProof />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
