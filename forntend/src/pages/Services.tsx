import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Clock,
  Award,
  Shield,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import { getServices, getServiceBySlug, type Service } from '@/lib/api';
import { getImageSrc } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const portfolioHighlights = [
  {
    title: 'NEOM Infrastructure Survey',
    description: 'Large-scale topographic mapping for Saudi Arabia\'s flagship megaproject, covering over 26,500 km².',
    image: '/placeholder.svg',
    metrics: ['26,500 km² covered', '2cm accuracy', '6 months duration'],
  },
  {
    title: 'Jeddah Port Expansion',
    description: 'Comprehensive bathymetric and aerial survey supporting the port expansion project.',
    image: '/placeholder.svg',
    metrics: ['500 hectares mapped', 'Multi-sensor integration', 'Weekly updates'],
  },
  {
    title: 'Riyadh Metro Monitoring',
    description: 'Regular construction progress monitoring across multiple metro line stations.',
    image: '/placeholder.svg',
    metrics: ['85 stations', 'Monthly reports', '3-year project'],
  },
];

const Services = () => {
  useLenis();
  const { slug } = useParams<{ slug?: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      // Single service view
      setLoading(true);
      getServiceBySlug(slug)
        .then((r) => { 
          setSelectedService(r.data); 
          setError(null); 
        })
        .catch((e) => { 
          setError(e instanceof Error ? e.message : 'Service not found'); 
          setSelectedService(null); 
        })
        .finally(() => setLoading(false));
    } else {
      // Services list view
      setSelectedService(null);
      const fetchServices = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await getServices();
          if (res.success && Array.isArray(res.data)) {
            setServices(res.data);
          } else {
            setServices([]);
          }
        } catch (e: any) {
          console.error('Error loading services:', e);
          const errorMessage = e?.response?.data?.message 
            || e?.message 
            || 'Failed to load services. Please try again later.';
          setError(errorMessage);
          setServices([]);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [slug]);

  useEffect(() => {
    if (loading) return;
    
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.animate-in') || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

      if (!selectedService && gridRef.current && services.length > 0) {
        gsap.from(gridRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (selectedService && detailRef.current) {
        gsap.from(detailRef.current.querySelectorAll('.detail-animate'), {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, [loading, selectedService, services]);

  // Dynamic SEO based on selected service
  const seoTitle = selectedService 
    ? (selectedService.seoTitle || `${selectedService.title} - Shamal Technologies`)
    : "Our Services - Drone Survey & Geospatial Solutions";
  
  const seoDescription = selectedService
    ? (selectedService.seoDescription || selectedService.shortDescription || selectedService.description)
    : "Explore our comprehensive range of drone and geospatial services including aerial survey, construction monitoring, asset inspection, and AI analytics.";

  const seoKeywords = selectedService?.seoKeywords || [];

  // Service Detail View
  if (slug) {
    if (loading) {
      return (
        <>
          <SEO 
            title="Loading..."
            description=""
            canonical={`/services/${slug}`}
          />
          <main className="min-h-screen bg-background">
            <Navbar />
            <div className="flex justify-center pt-32">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
            <Footer />
          </main>
        </>
      );
    }

    if (error || !selectedService) {
      return (
        <>
          <SEO 
            title="Service Not Found"
            description=""
            canonical={`/services/${slug}`}
          />
          <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-32 text-center">
              <p className="text-destructive mb-4">{error || 'Service not found'}</p>
              <Button asChild><Link to="/services">Back to Services</Link></Button>
            </div>
            <Footer />
          </main>
        </>
      );
    }
    
    return (
      <>
        <SEO 
          title={seoTitle}
          description={seoDescription}
          canonical={`/services/${slug}`}
          keywords={seoKeywords}
        />
        <main className="min-h-screen bg-background">
          <Navbar />

          {/* Hero Section */}
          <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <Link 
                to="/services" 
                className="animate-in inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Services
              </Link>
              
              <div className="flex items-start gap-6 mb-8">
                {(selectedService.icon || selectedService.featuredImage) && (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {selectedService.icon ? (
                      <img 
                        src={getImageSrc(selectedService.icon)} 
                        alt={selectedService.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={getImageSrc(selectedService.featuredImage || '')} 
                        alt={selectedService.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <div>
                  <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                    Our Services
                  </span>
                  <h1 className="animate-in text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                    {selectedService.title}
                  </h1>
                </div>
              </div>
              
              <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {selectedService.shortDescription || selectedService.description}
              </p>
            </div>
          </section>

          {/* Detail Content */}
          <section ref={detailRef} className="section-padding">
            <div className="container mx-auto px-4 md:px-6">
              {/* Service Description */}
              <div className="mb-16 detail-animate">
                <Card variant="service" className="p-8 md:p-12">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-display font-bold">Service Details</h2>
                    </div>
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                        {selectedService.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Why Choose This Service */}
              <div className="mb-16 detail-animate">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Why Choose Our <span className="text-gradient-primary">{selectedService.title}</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Industry-leading technology combined with local expertise delivers results you can trust.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <Card variant="glass" className="p-6 text-center">
                    <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Faster Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      90% reduction in data collection time compared to traditional methods
                    </p>
                  </Card>
                  <Card variant="glass" className="p-6 text-center">
                    <Target className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Higher Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      Centimeter-level precision with RTK/PPK GPS integration
                    </p>
                  </Card>
                  <Card variant="glass" className="p-6 text-center">
                    <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Safer Operations</h3>
                    <p className="text-sm text-muted-foreground">
                      Remote data collection eliminates risks to field personnel
                    </p>
                  </Card>
                </div>
              </div>

              {/* Projects Highlights */}
              <div className="detail-animate">
                <div className="text-center mb-12">
                  <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                    Projects
                  </span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold">
                    Featured Projects
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {portfolioHighlights.map((project, index) => (
                    <Card key={index} variant="service" className="overflow-hidden group">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-display font-bold text-lg mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.metrics.map((metric, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/projects">
                      View All Projects
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-card/50 border-y border-border">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Contact our team to discuss your {selectedService.title} requirements 
                and get a customized solution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact">
                    Request a Quote
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/services">
                    View All Services
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </>
    );
  }

  // Services List View
  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonical="/services"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Our Services
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Comprehensive{' '}
              <span className="text-gradient-primary">Drone Solutions</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From aerial surveys to AI-powered analytics, we deliver end-to-end 
              geospatial services tailored to your industry needs.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">Please try again later.</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No services available at the moment.</p>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {services.map((service) => (
                  <Card key={service._id} variant="service" className="p-6 h-full group">
                    <CardContent className="p-0 h-full flex flex-col">
                      {(service.icon || service.featuredImage) && (
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors overflow-hidden">
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
                      <h2 className="font-display font-bold text-xl mb-3">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground mb-6 flex-grow">
                        {service.shortDescription}
                      </p>
                      <Button variant="outline" className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                        <Link to={`/services/${service.slug}`}>
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Our team is ready to discuss your specific requirements and design 
              a tailored solution for your project.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Services;
