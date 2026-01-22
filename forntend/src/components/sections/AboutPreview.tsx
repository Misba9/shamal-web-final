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
      // Content Animation
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Visual Animation
      if (visualRef.current) {
        gsap.from(visualRef.current, {
          x: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: visualRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div ref={contentRef} className="order-2 lg:order-1">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest mb-3 block">
              About Shamal
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Pioneering <span className="text-gradient">Aerial Innovation</span> in Saudi Arabia
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              With over 15 years of experience in geospatial technology, Shamal Technologies 
              has established itself as the Kingdom's premier provider of drone survey 
              and aerial intelligence solutions.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-foreground/90 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="btn-primary-gradient rounded-full px-8 py-6 text-lg" asChild>
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div ref={visualRef} className="order-1 lg:order-2 relative">
            <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6 mt-12">
                <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground font-medium">Projects Delivered</p>
                </div>
                <div className="p-6 md:p-8 rounded-3xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                  <p className="text-white/80 font-medium">Years Experience</p>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">50+</div>
                  <p className="text-muted-foreground font-medium">Expert Team</p>
                </div>
                <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-soft hover:shadow-hover transition-all duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
                  <p className="text-muted-foreground font-medium">Saudi Owned</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
