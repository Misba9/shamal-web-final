import { useEffect, useRef } from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import patternOverlay from '@/assets/pattern-overlay.png';

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate hero content
      gsap.from(contentRef.current?.children || [], {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      // Parallax effect on scroll
      gsap.to(overlayRef.current, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <iframe
          src="https://www.youtube.com/embed/lXcJZBKMRTo?autoplay=1&mute=1&loop=1&playlist=lXcJZBKMRTo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          title="Shamal Technologies"
          className="w-full h-full object-cover scale-150 pointer-events-none"
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.5)',
            width: '177.77777778vh',
            minWidth: '100%',
            minHeight: '56.25vw',
            height: '100vh'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Gradient Overlay - adjusted for video */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
      </div>

      {/* Tech Pattern Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-[0.07] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url(${patternOverlay})`,
          backgroundSize: '600px',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan-line" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 container mx-auto px-4 md:px-6 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-border shadow-lg mb-8">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            Saudi Arabia's Leading Drone Solutions
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] mb-6 max-w-5xl mx-auto text-primary-foreground drop-shadow-lg">
          Precision Drone Survey &{' '}
          <span className="text-secondary-foreground">Geospatial Intelligence</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
          Transforming industries with advanced aerial technology, AI-powered analytics, 
          and comprehensive geospatial solutions across the Kingdom.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" size="xl" asChild>
            <Link to="/services">Explore Services</Link>
          </Button>
          <Button variant="heroOutline" size="xl" className="gap-3">
            <Play className="h-5 w-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24 max-w-3xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
          {[
            { value: '500+', label: 'Projects Completed' },
            { value: '15+', label: 'Years Experience' },
            { value: '50+', label: 'Expert Team' },
            { value: '100%', label: 'Client Satisfaction' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        aria-label="Scroll to content"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
