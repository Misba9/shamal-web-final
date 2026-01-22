import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Certified drone operators and licensed surveyors',
  'State-of-the-art equipment and technology',
  'ISO 9001:2015 Quality Management certified',
  'GACA approved and fully compliant operations',
  'Dedicated project management team',
  'Rapid deployment across Saudi Arabia',
];

export function AboutPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current?.children || [], {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(visualRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: visualRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div ref={contentRef}>
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              About Shamal
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Pioneering{' '}
              <span className="text-gradient-primary">Aerial Innovation</span>{' '}
              in Saudi Arabia
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              With over 15 years of experience in geospatial technology, Shamal Technologies 
              has established itself as the Kingdom's premier provider of drone survey 
              and aerial intelligence solutions.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild>
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div ref={visualRef} className="relative">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="stat-number">500+</div>
                <p className="text-muted-foreground mt-2">Projects Delivered</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="stat-number">15+</div>
                <p className="text-muted-foreground mt-2">Years Experience</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="stat-number">50+</div>
                <p className="text-muted-foreground mt-2">Expert Team</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="stat-number">12</div>
                <p className="text-muted-foreground mt-2">Service Areas</p>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
