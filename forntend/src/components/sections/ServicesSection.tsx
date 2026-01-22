import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Building2, 
  Search, 
  Waves, 
  Globe, 
  Leaf, 
  Box, 
  Mountain, 
  Shield, 
  Brain, 
  Wheat,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Plane,
    title: 'Aerial Survey',
    description: 'High-precision aerial mapping and photogrammetry for accurate topographic data.',
    href: '/services/aerial-survey',
  },
  {
    icon: Building2,
    title: 'Construction Monitoring',
    description: 'Real-time construction progress tracking with drone-based documentation.',
    href: '/services/construction-monitoring',
  },
  {
    icon: Search,
    title: 'Asset Inspection',
    description: 'Comprehensive infrastructure inspection using advanced imaging systems.',
    href: '/services/asset-inspection',
  },
  {
    icon: Waves,
    title: 'Bathymetric Survey',
    description: 'Underwater mapping and hydrographic surveys for marine projects.',
    href: '/services/bathymetric-survey',
  },
  {
    icon: Globe,
    title: 'GIS & Remote Sensing',
    description: 'Geospatial data analysis and satellite imagery interpretation.',
    href: '/services/gis-remote-sensing',
  },
  {
    icon: Leaf,
    title: 'Environmental Monitoring',
    description: 'Ecosystem assessment and environmental impact studies.',
    href: '/services/environmental-monitoring',
  },
  {
    icon: Box,
    title: 'SCAN/CAD to BIM',
    description: '3D scanning and BIM modeling for construction and architecture.',
    href: '/services/scan-cad-bim',
  },
  {
    icon: Mountain,
    title: 'Mining & Exploration',
    description: 'Volumetric analysis and mineral exploration surveys.',
    href: '/services/mining-exploration',
  },
  {
    icon: Shield,
    title: 'Security Surveillance',
    description: 'Aerial security monitoring and threat assessment.',
    href: '/services/security-surveillance',
  },
  {
    icon: Brain,
    title: 'AI Development',
    description: 'Custom AI solutions for automated data processing and analysis.',
    href: '/services/ai-development',
  },
  {
    icon: Wheat,
    title: 'Agriculture Monitoring',
    description: 'Crop health analysis and precision agriculture solutions.',
    href: '/services/agriculture-monitoring',
  },
  {
    icon: Sparkles,
    title: 'Special Projects',
    description: 'Custom drone solutions for unique industry requirements.',
    href: '/services/special-projects',
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Cards stagger animation
      gsap.from(listRef.current?.children || [], {
        x: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Desktop: Fixed height container with internal scroll */}
        {/* Mobile: Auto height with natural page scroll */}
        <div className="flex flex-col lg:flex-row lg:h-[65vh] lg:min-h-[500px] lg:max-h-[700px]">
          
          {/* Left Column - Sticky within section (Desktop) / Normal (Mobile) */}
          <div 
            ref={headerRef} 
            className="lg:w-2/5 xl:w-1/3 mb-8 lg:mb-0 lg:pr-12 lg:flex lg:flex-col lg:justify-center"
          >
            <div>
              <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                Our Expertise
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                Our{' '}
                <span className="text-gradient-primary">Services</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                From aerial surveys to AI-powered analytics, we deliver end-to-end 
                geospatial services tailored to your industry needs.
              </p>
              <Button variant="outline" size="lg" asChild className="hidden lg:inline-flex">
                <Link to="/services">
                  View All Services
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Scrollable Services List (Desktop only) */}
          <div className="lg:w-3/5 xl:w-2/3 lg:overflow-hidden lg:relative">
            <div
              ref={listRef}
              className="flex flex-col gap-4 lg:absolute lg:inset-0 lg:overflow-y-auto lg:pr-4 lg:scrollbar-thin lg:scrollbar-thumb-primary/20 lg:scrollbar-track-transparent"
              style={{ scrollBehavior: 'smooth' }}
            >
              {services.map((service) => (
                <Link key={service.href} to={service.href} className="group">
                  <Card variant="service" className="p-5 group-hover:translate-x-2 transition-transform duration-300">
                    <CardContent className="p-0 flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-10 lg:hidden">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
