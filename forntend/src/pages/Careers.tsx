import { useEffect, useRef } from 'react';
import { ArrowRight, MapPin, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing constants: jobOpenings, benefits)
const jobOpenings = [
  {
    id: '1',
    title: 'Senior Drone Pilot',
    department: 'Operations',
    location: 'Jeddah, Saudi Arabia',
    type: 'Full-time',
    description: 'Lead aerial survey missions and train junior pilots on advanced drone operations.',
  },
  {
    id: '2',
    title: 'GIS Analyst',
    department: 'Geospatial',
    location: 'Riyadh, Saudi Arabia',
    type: 'Full-time',
    description: 'Process and analyze geospatial data to deliver actionable insights for clients.',
  },
  {
    id: '3',
    title: 'AI/ML Engineer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    description: 'Develop computer vision and machine learning models for automated data analysis.',
  },
  {
    id: '4',
    title: 'Business Development Manager',
    department: 'Sales',
    location: 'Jeddah, Saudi Arabia',
    type: 'Full-time',
    description: 'Drive growth by identifying new opportunities and building client relationships.',
  },
  {
    id: '5',
    title: 'Project Manager',
    department: 'Operations',
    location: 'Riyadh, Saudi Arabia',
    type: 'Full-time',
    description: 'Coordinate complex survey projects from planning through final delivery.',
  },
];

const benefits = [
  {
    title: 'Competitive Salary',
    description: 'Industry-leading compensation packages with performance bonuses.',
  },
  {
    title: 'Health Insurance',
    description: 'Comprehensive medical, dental, and vision coverage for you and your family.',
  },
  {
    title: 'Professional Development',
    description: 'Continuous learning opportunities and certification support.',
  },
  {
    title: 'Flexible Work',
    description: 'Hybrid work options and flexible scheduling where possible.',
  },
  {
    title: 'Annual Leave',
    description: 'Generous paid time off plus Saudi national holidays.',
  },
  {
    title: 'Team Events',
    description: 'Regular team building activities and company celebrations.',
  },
];

const Careers = () => {
  useLenis();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.animate-in') || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO 
        title="Careers - Join the Shamal Technologies Team"
        description="Build your career with Saudi Arabia's leading geospatial technology company. Explore job openings for drone pilots, GIS analysts, and engineers."
        canonical="/careers"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Join Our Team
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Build the Future of <span className="text-gradient-primary">Geospatial Technology</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a team of innovators pushing the boundaries of drone technology, 
              AI, and geospatial intelligence in Saudi Arabia and beyond.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-padding bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Why Work With Us
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We offer competitive benefits and a dynamic work environment
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title} 
                  className="p-6 rounded-xl bg-background border border-border/50"
                >
                  <h3 className="text-lg font-display font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Open Positions
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Explore our current opportunities and find your perfect role
              </p>
            </div>
            <div className="space-y-4 max-w-4xl mx-auto">
              {jobOpenings.map((job) => (
                <Card 
                  key={job.id} 
                  className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{job.department}</Badge>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">{job.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <Button variant="hero" size="sm" className="shrink-0">
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary/5">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Don't See Your Role?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              We're always looking for talented individuals. Send us your resume and 
              we'll keep you in mind for future opportunities.
            </p>
            <Button variant="hero" size="lg">
              Send Your Resume
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Careers;
