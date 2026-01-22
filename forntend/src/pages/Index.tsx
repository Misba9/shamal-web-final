import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { SectorsSection } from '@/components/sections/SectorsSection';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { BlogsSection } from '@/components/sections/BlogsSection';
import { CTASection } from '@/components/sections/CTASection';
import { useLenis } from '@/hooks/use-lenis';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger after page load
    ScrollTrigger.refresh();
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      
      <HeroSection />
      <ServicesSection />
      <SectorsSection />
      <AboutPreview />
      <PortfolioSection />
      <BlogsSection />
      <CTASection />
      
      <Footer />
    </main>
  );
};

export default Index;
