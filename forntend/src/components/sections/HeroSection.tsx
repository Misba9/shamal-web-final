import { useEffect, useRef } from 'react';
import { ArrowDown, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import patternOverlay from '@/assets/pattern-overlay.png';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in content
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2,
        });
      }

      // Stats Animation & Counting
      if (statsRef.current) {
        // Fade in container
        gsap.from(statsRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1,
        });

        // Animate numbers
        const statItems = statsRef.current.querySelectorAll('.stat-value');
        statItems.forEach((item) => {
          const originalText = item.textContent || '0';
          const match = originalText.match(/(\d+)(.*)/); // Separate number and suffix (e.g., 500 and +)
          
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
                start: 'top 90%',
                once: true,
              },
              onUpdate: () => {
                item.textContent = `${Math.floor(obj.val)}${suffix}`;
              }
            });
          }
        });
      }

      // Parallax effect on scroll
      if (overlayRef.current && heroRef.current) {
        gsap.to(overlayRef.current, {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Video Background Container */}
      <div className="absolute inset-0 z-0 select-none">
        <div className="absolute inset-0 bg-background/20 z-10" /> {/* Slight dim */}
        <iframe
          ref={videoRef}
          src="https://www.youtube.com/embed/lXcJZBKMRTo?autoplay=1&mute=1&loop=1&playlist=lXcJZBKMRTo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          title="Shamal Technologies Hero Video"
          className="w-full h-full object-cover scale-[1.35] pointer-events-none opacity-90"
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.35)',
            width: '100vw',
            height: '100vh',
            minWidth: '177.77vh', 
            minHeight: '56.25vw'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Advanced Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
      </div>

      {/* Tech Pattern */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none z-20"
        style={{
          backgroundImage: `url(${patternOverlay})`,
          backgroundSize: '600px',
          backgroundPosition: 'center',
        }}
      />

      {/* Content */}
      <div className="relative z-30 container-custom flex flex-col items-center justify-center h-full pt-20">
        <div ref={contentRef} className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-6 md:mb-8 hover:bg-white/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-white tracking-wide">
              Saudi Arabia's Premier Drone Solutions
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6 text-white drop-shadow-xl">
            Precision Drone Survey &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Geospatial Intelligence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed drop-shadow-md text-balance px-4">
            Transforming industries with advanced aerial technology, AI-powered analytics, 
            and comprehensive geospatial solutions across the Kingdom.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
            <Button 
              className="btn-primary-gradient h-12 px-8 text-base rounded-full w-full sm:w-auto shadow-lg shadow-primary/20" 
              asChild
            >
              <Link to="/services">
                Explore Services <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-8 text-base rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-20 w-full max-w-4xl bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10 shadow-2xl mx-4"
        >
          {[
            { value: '500+', label: 'Projects Delivered' },
            { value: '15+', label: 'Years Experience' },
            { value: '50+', label: 'Expert Team' },
            { value: '100%', label: 'Saudi Owned' },
          ].map((stat, index) => (
            <div key={index} className="text-center group p-2">
              <div className="stat-value text-2xl md:text-3xl font-display font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors group z-30"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 hidden md:block">
          Discover
        </span>
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
