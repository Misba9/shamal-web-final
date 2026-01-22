import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, Building2, Search, Waves, Globe, Leaf, Box, Mountain, 
  Shield, Brain, Wheat, Sparkles, ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { icon: Plane, title: 'Aerial Survey', description: 'High-precision aerial mapping and photogrammetry for accurate topographic data.', href: '/services/aerial-survey' },
  { icon: Building2, title: 'Construction Monitoring', description: 'Real-time construction progress tracking with drone-based documentation.', href: '/services/construction-monitoring' },
  { icon: Search, title: 'Asset Inspection', description: 'Comprehensive infrastructure inspection using advanced imaging systems.', href: '/services/asset-inspection' },
  { icon: Waves, title: 'Bathymetric Survey', description: 'Underwater mapping and hydrographic surveys for marine projects.', href: '/services/bathymetric-survey' },
  { icon: Globe, title: 'GIS & Remote Sensing', description: 'Geospatial data analysis and satellite imagery interpretation.', href: '/services/gis-remote-sensing' },
  { icon: Leaf, title: 'Environmental Monitoring', description: 'Ecosystem assessment and environmental impact studies.', href: '/services/environmental-monitoring' },
  { icon: Box, title: 'SCAN/CAD to BIM', description: '3D scanning and BIM modeling for construction and architecture.', href: '/services/scan-cad-bim' },
  { icon: Mountain, title: 'Mining & Exploration', description: 'Volumetric analysis and mineral exploration surveys.', href: '/services/mining-exploration' },
  { icon: Shield, title: 'Security Surveillance', description: 'Aerial security monitoring and threat assessment.', href: '/services/security-surveillance' },
  { icon: Brain, title: 'AI Development', description: 'Custom AI solutions for automated data processing and analysis.', href: '/services/ai-development' },
  { icon: Wheat, title: 'Agriculture Monitoring', description: 'Crop health analysis and precision agriculture solutions.', href: '/services/agriculture-monitoring' },
  { icon: Sparkles, title: 'Special Projects', description: 'Custom drone solutions for unique industry requirements.', href: '/services/special-projects' },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Header
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Animate Grid Items
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-4">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-3 block">
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comprehensive <span className="text-gradient">Geospatial Solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            From aerial surveys to AI-powered analytics, we deliver end-to-end 
            services tailored to your industry needs, ensuring precision and efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link key={service.href} to={service.href} className="group block h-full">
              <Card className="h-full card-hover border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden relative">
                <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors mt-auto">
                    Learn more 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
                
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Card>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/5" asChild>
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
