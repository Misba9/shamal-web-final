import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation';

export function CTASection() {
  const sectionRef = useIntersectionAnimation<HTMLElement>({
    animationClass: 'animate-fade-in-up-sm',
  });
  const contentRef = useIntersectionAnimation<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    delay: 100,
  });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden opacity-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div
          ref={contentRef}
          className="max-w-4xl mx-auto text-center opacity-0"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Start Your Project
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Ready to{' '}
            <span className="text-gradient-primary">Transform</span> Your Operations?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Get in touch with our team of experts to discuss your project requirements 
            and discover how our drone and geospatial solutions can drive your success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="tel:+966XXXXXXXX">
                <Phone className="h-5 w-5 mr-2" />
                Call Us Now
              </a>
            </Button>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
            <a
              href="mailto:info@shamal.sa"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              info@shamal.sa
            </a>
            <span className="hidden sm:block">•</span>
            <a
              href="tel:+966XXXXXXXX"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              +966 XX XXX XXXX
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
