import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Showcase } from '@/components/landing/Showcase';
import { Categories } from '@/components/landing/Categories';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen  ">
      <Navbar />
      <Hero />
      <Showcase />
      <Features />
      <Categories />
      <CTA />
      <Footer />
    </div>
  );
}
