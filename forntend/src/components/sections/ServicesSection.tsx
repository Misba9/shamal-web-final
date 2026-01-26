import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getHomeServices, type Service } from '@/lib/api';
import { getImageSrc } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getHomeServices();
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;
    
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
  }, [loading, services]);

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
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service._id} to={`/services/${service.slug}`} className="group block h-full">
                <Card className="h-full card-hover border-border/60 bg-background/50 backdrop-blur-sm overflow-hidden relative">
                  <CardContent className="p-6 md:p-8 flex flex-col h-full relative z-10">
                    {(service.icon || service.featuredImage) && (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300 overflow-hidden">
                        {service.icon ? (
                          <img 
                            src={getImageSrc(service.icon)} 
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img 
                            src={getImageSrc(service.featuredImage || '')} 
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    
                    <h3 className="text-lg md:text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 flex-grow">
                      {service.shortDescription}
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
        )}

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
