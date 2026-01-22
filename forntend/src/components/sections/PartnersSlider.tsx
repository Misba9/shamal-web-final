import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  {
    name: 'CyberHawk',
    logo: 'https://images.squarespace-cdn.com/content/v1/5abe68e225bf02cf7ac6c8bd/1603719814155-PEBHOFNVTGCN3BZ5MWOP/Cyberhawk_Primary_Logo_Green_Pantone349C.png',
  },
  {
    name: 'DJI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/DJI_logo.svg/2560px-DJI_logo.svg.png',
  },
  {
    name: 'ECURS',
    logo: 'https://ecurs.com/wp-content/uploads/2023/01/cropped-ECURS-Main-Logo-250.png',
  },
  {
    name: 'nybl',
    logo: 'https://nybl.ai/wp-content/uploads/2023/03/nybl-logo-black.svg',
  },
  {
    name: 'ERM',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/ERM_Group_logo.svg/1280px-ERM_Group_logo.svg.png',
  },
];

// Duplicate partners array for seamless infinite loop
const allPartners = [...partners, ...partners, ...partners];

export function PartnersSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    // Get the width of one set of partners
    const partnerElements = slider.querySelectorAll('.partner-item');
    const singleSetWidth = Array.from(partnerElements)
      .slice(0, partners.length)
      .reduce((total, el) => total + (el as HTMLElement).offsetWidth + 48, 0); // 48px = gap

    // GSAP infinite scroll animation
    const tl = gsap.timeline({ repeat: -1 });
    
    gsap.set(slider, { x: 0 });
    
    tl.to(slider, {
      x: -singleSetWidth,
      duration: 30,
      ease: 'none',
      repeat: -1,
    });

    // Pause on hover
    container.addEventListener('mouseenter', () => tl.pause());
    container.addEventListener('mouseleave', () => tl.play());

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-card/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Strategic Partnerships
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            World-Leading{' '}
            <span className="text-gradient-primary">Technology Partners</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Our capabilities are powered by world-leading technology partnerships. We are authorized 
            distributors and partners of DJI products and satellite data, committed to providing 
            world-class geospatial data services.
          </p>
        </div>
      </div>

      {/* Infinite Loop Slider */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden"
      >
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card/30 to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={sliderRef}
          className="flex items-center gap-12"
        >
          {allPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="partner-item flex-shrink-0 h-16 md:h-20 px-6 flex items-center justify-center bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300 min-w-[180px] md:min-w-[220px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-10 md:max-h-12 w-auto object-contain filter dark:invert dark:brightness-0 dark:contrast-100 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
