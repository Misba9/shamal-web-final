import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation';

const portfolioItems = [
  {
    id: 1,
    title: 'NEOM Infrastructure Survey',
    description: 'Comprehensive aerial mapping and terrain analysis for the NEOM megaproject development.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
    slug: 'neom-infrastructure',
  },
  {
    id: 2,
    title: 'Red Sea Coastal Mapping',
    description: 'High-resolution coastal survey supporting sustainable tourism development initiatives.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    slug: 'red-sea-mapping',
  },
  {
    id: 3,
    title: 'Riyadh Metro Expansion',
    description: 'Precision LiDAR scanning for underground tunnel alignment and construction monitoring.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop',
    slug: 'riyadh-metro',
  },
];

export function PortfolioSection() {
  const sectionRef = useIntersectionAnimation<HTMLElement>({
    animationClass: 'animate-fade-in-up-sm',
  });
  const headerRef = useIntersectionAnimation<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    delay: 100,
  });
  const gridRef = useIntersectionAnimation<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    delay: 200,
  });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden bg-card/30 opacity-0">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16 opacity-0">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Our Work
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Featured{' '}
            <span className="text-gradient-primary">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects across 
            Saudi Arabia's most ambitious developments.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 opacity-0">
          {portfolioItems.map((item) => (
            <Link
              key={item.id}
              to={`/portfolio/${item.slug}`}
              className="group block"
            >
              <article className="h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg md:text-xl mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    View Project
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
