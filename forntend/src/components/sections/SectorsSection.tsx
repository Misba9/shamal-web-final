import { 
  Building, 
  Train, 
  Mountain, 
  Droplets, 
  Factory, 
  Wheat, 
  Landmark, 
  Fuel,
  Zap,
  TreePine,
  Radio,
  Shield,
  Map
} from 'lucide-react';
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation';

const sectors = [
  { icon: Landmark, title: 'Government' },
  { icon: Train, title: 'Transportation' },
  { icon: Mountain, title: 'Mining' },
  { icon: Droplets, title: 'Water Resources' },
  { icon: Building, title: 'Construction' },
  { icon: Wheat, title: 'Agriculture' },
  { icon: Factory, title: 'Oil & Gas' },
  { icon: Fuel, title: 'Energy' },
  { icon: Zap, title: 'Utilities' },
  { icon: TreePine, title: 'Environment' },
  { icon: Radio, title: 'Telecom' },
  { icon: Shield, title: 'Defense' },
  { icon: Map, title: 'Urban Planning' },
];

export function SectorsSection() {
  // Duplicate sectors array for seamless loop
  const duplicatedSectors = [...sectors, ...sectors];
  const sectionRef = useIntersectionAnimation<HTMLElement>({
    animationClass: 'animate-fade-in-up-sm',
  });
  const headerRef = useIntersectionAnimation<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    delay: 100,
  });

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden bg-card/50 opacity-0">
      {/* Section Header */}
      <div ref={headerRef} className="container mx-auto px-4 md:px-6 mb-12 opacity-0">
        <div className="text-center">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Industries
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Sectors{' '}
            <span className="text-gradient-primary">We Serve</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Delivering specialized drone and geospatial solutions across 
            diverse industries throughout the Kingdom.
          </p>
        </div>
      </div>

      {/* Infinite Sliding Icons */}
      <div className="relative w-full overflow-hidden group">
        {/* Gradient masks for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-card/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-card/50 to-transparent z-10 pointer-events-none" />
        
        {/* Sliding container */}
        <div className="flex animate-infinite-scroll group-hover:[animation-play-state:paused]">
          {duplicatedSectors.map((sector, index) => (
            <div
              key={`${sector.title}-${index}`}
              className="flex-shrink-0 mx-4 md:mx-8"
            >
              <div className="flex flex-col items-center gap-3 p-4 md:p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all duration-300 min-w-[100px] md:min-w-[140px] hover:scale-[1.02] hover:shadow-md">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <sector.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground/80 text-center whitespace-nowrap">
                  {sector.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
