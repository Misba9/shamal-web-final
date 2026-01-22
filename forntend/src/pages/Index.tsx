import { useEffect } from 'react';
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
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger to ensure accurate start/end points after render
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <SEO 
        title="Drone Survey & Geospatial Solutions Saudi Arabia"
        description="Shamal Technologies is Saudi Arabia's leading provider of drone survey, aerial mapping, and geospatial intelligence solutions. Supporting Vision 2030 with precision data."
        canonical="/"
      />
      
      <main className="relative min-h-screen overflow-x-hidden bg-background">
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
    </>
  );
};

export default Index;
