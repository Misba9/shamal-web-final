import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Target, 
  Eye, 
  Award, 
  Globe, 
  Shield, 
  ArrowRight,
  Zap,
  Mountain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TeamCarousel } from '@/components/sections/TeamCarousel';
import { PartnersSlider } from '@/components/sections/PartnersSlider';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing constants: locations, droneAdvantages, differentiators, achievements, certifications)
const locations = [
  { name: 'Jeddah', position: 'bottom-[42%] left-[32%]' },
  { name: 'Thuwal', position: 'bottom-[48%] left-[30%]' },
  { name: 'Riyadh', position: 'bottom-[45%] right-[32%]' },
  { name: 'Jubail', position: 'top-[32%] right-[28%]' },
  { name: 'Tabuk', position: 'top-[28%] left-[28%]' },
];

const droneAdvantages = [
  {
    icon: Zap,
    title: '10x Faster',
    description: 'Complete surveys in hours, not weeks. Rapid data acquisition reduces project timelines significantly.',
  },
  {
    icon: Mountain,
    title: 'Access Anywhere',
    description: 'Safely survey difficult-to-reach areas including steep terrain, hazardous sites, and remote locations.',
  },
  {
    icon: Target,
    title: 'Survey-Grade Accuracy',
    description: 'RTK/PPK positioning delivers centimeter-level precision for engineering-grade deliverables.',
  },
  {
    icon: Shield,
    title: 'Enhanced Safety',
    description: 'Eliminate on-ground risks with aerial data collection that keeps teams out of dangerous zones.',
  },
];

const differentiators = [
  'RTK/PPK for survey-grade accuracy (±2cm)',
  'Fully licensed and GACA-approved pilots',
  'Expert in-house data processing team',
  'LiDAR and multispectral sensor capabilities',
  'CAD-ready deliverables and GIS integration',
  'Rapid turnaround with 24/7 project support',
];


const achievements = [
  { value: '500+', label: 'Projects Completed' },
  { value: '15+', label: 'Years of Experience' },
  { value: '93%', label: 'Saudi Workforce' },
  { value: '100+', label: 'Clients Served' },
];

const certifications = [
  {
    title: 'GACA Certified',
    description: 'Our Drone pilots are GACA 107 certified and insured for third party liability. All activities, solutions, and services are entirely legalized and approved by the Saudi General Authority of Civil Aviation.',
  },
  {
    title: 'ISO 9001:2015',
    description: 'Quality Management System certification demonstrating our commitment to meeting the quality expected by our clients.',
  },
  {
    title: 'ISO 14001:2015',
    description: 'Environmental Management certification ensuring we operate in an environmentally sound manner.',
  },
  {
    title: 'ISO 45001:2018',
    description: 'Occupational Health and Safety certification, operating with the health and safety of our teams at the front of mind.',
  },
];

const About = () => {
  useLenis();
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const advantagesRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.animate-in') || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

      if (statsRef.current) {
        // Fade in stats container
        gsap.from(statsRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        // Animate numbers
        const statItems = statsRef.current.querySelectorAll('.stat-value');
        statItems.forEach((item) => {
          const originalText = item.textContent || '0';
          const match = originalText.match(/(\d+)(.*)/);
          
          if (match) {
            const endValue = parseInt(match[1], 10);
            const suffix = match[2];
            const obj = { val: 0 };

            gsap.to(obj, {
              val: endValue,
              duration: 2.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 85%',
                once: true,
              },
              onUpdate: () => {
                item.textContent = `${Math.floor(obj.val)}${suffix}`;
              }
            });
          }
        });
      }

      if (advantagesRef.current) {
        gsap.from(advantagesRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: advantagesRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO 
        title="About Us - Leading Drone Survey Company in Saudi Arabia"
        description="Learn about Shamal Technologies, a fully Saudi-owned geospatial data company. We provide survey-grade drone solutions, supporting Vision 2030 with 93% Saudi workforce."
        canonical="/about"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section with Video */}
        <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://www.youtube.com/embed/DaIQ-5Yo_Xs?autoplay=1&mute=1&loop=1&playlist=DaIQ-5Yo_Xs&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
              title="Operation Team in action"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ 
                width: '100vw',
                height: '56.25vw',
                minHeight: '100vh',
                minWidth: '177.77vh',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-20">
            <div className="max-w-3xl">
              <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                A Saudi Geospatial Data Company
              </span>
              <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Smart Data Solutions for{' '}
                <span className="text-gradient-primary">Vision 2030</span>
              </h1>
              <p className="animate-in text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                We provide end-to-end solutions from data acquisition to data visualization and analytics 
                using world-leading technology to empower leaders to make data-informed decisions 
                and reduce operation costs.
              </p>
              <div className="animate-in flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Request a Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/projects">
                    View Our Projects
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {achievements.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="stat-value text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  A Leading Provider of{' '}
                  <span className="text-gradient-primary">Smart Data Solutions</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Shamal Technologies is a leading provider of smart data solutions in the Kingdom of Saudi Arabia. 
                    As a <strong className="text-foreground">fully Saudi owned</strong> and funded company, we proudly support{' '}
                    <strong className="text-foreground">Vision 2030</strong> by investing in local talent, with over{' '}
                    <strong className="text-foreground">93% Saudi workforce</strong> undergoing continuous development.
                  </p>
                  <p>
                    Our advanced solutions cover ground, aerial, and marine data acquisition, offering clients 
                    high-precision datasets, complete visibility, and a deeper understanding of their environment.
                  </p>
                  <p>
                    We operate across industries using <strong className="text-foreground">market-leading drone systems</strong>{' '}
                    and <strong className="text-foreground">cutting-edge data processing methodologies</strong> to ensure 
                    best in class services and deliverables.
                  </p>
                </div>
              </div>
              
              {/* Saudi Arabia Map with Locations */}
              <div className="relative">
                <div className="bg-primary/10 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="text-primary font-display font-bold text-lg">LOCALLY</span>
                    <span className="block bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-semibold">
                      EXPERIENCED
                    </span>
                  </div>
                  
                  {/* Saudi Arabia SVG Map */}
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                    <img 
                      src="/sa.svg" 
                      alt="Saudi Arabia Map" 
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Location markers */}
                    {locations.map((loc) => (
                       <div key={loc.name} className={`absolute ${loc.position} flex items-center gap-2`}>
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm font-semibold">{loc.name.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Partnerships - Infinite Loop Slider */}
        <PartnersSlider />

        {/* Why Us - Drone vs Traditional */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                Why Choose Drones
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                The Advantage of{' '}
                <span className="text-gradient-primary">Aerial Surveying</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Drone technology delivers significant advantages over traditional surveying methods, 
                providing faster results, enhanced safety, and superior data quality.
              </p>
            </div>

            <div
              ref={advantagesRef}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {droneAdvantages.map((advantage) => (
                <Card key={advantage.title} variant="service" className="p-6 text-center h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <advantage.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1">{advantage.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Differentiators */}
            <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">
                  What Sets Us Apart
                </h3>
                <ul className="space-y-4">
                  {differentiators.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Card variant="gradient" className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <Shield className="h-10 w-10 text-primary" />
                    <div>
                      <h4 className="font-bold text-lg">Safety & Compliance</h4>
                      <p className="text-sm text-muted-foreground">GACA Approved Operations</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    All operations are conducted in full compliance with GACA (General Authority 
                    of Civil Aviation) regulations. Our pilots are fully licensed and insured, 
                    with comprehensive safety protocols for every mission.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Mission & Vision */}
        <section className="section-padding bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <Card variant="gradient" className="p-8">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To deliver world-class geospatial data services, strengthened by local expertise, 
                    strategic collaborations, and integrated project delivery. We empower organizations 
                    to make informed decisions, optimize operations, and achieve sustainable growth.
                  </p>
                </CardContent>
              </Card>

              <Card variant="gradient" className="p-8">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the Middle East's most trusted partner for aerial intelligence 
                    and geospatial services, setting the standard for innovation, quality, 
                    and customer success in supporting Saudi Arabia's Vision 2030.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamCarousel />


        {/* Accreditations */}
        <section className="section-padding bg-card/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                Accreditations
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Certified for{' '}
                <span className="text-gradient-primary">Excellence</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Shamal is proudly accredited by the General Authority of Civil Aviation (GACA) and holds 
                ISO certifications, demonstrating our commitment to maintaining the highest standards of 
                safety, quality, and operational excellence.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.title} variant="gradient" className="p-6 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col flex-1">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <Card variant="gradient" className="p-8 md:p-12 text-center">
              <CardContent className="p-0">
                <Globe className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Ready to Transform Your Projects?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                  Partner with Saudi Arabia's leading geospatial data company. Let us show you how 
                  our drone solutions can accelerate your projects and deliver exceptional results.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/contact">
                      Contact Us Today
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild>
                    <Link to="/services">
                      Explore Services
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default About;
