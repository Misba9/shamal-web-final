import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useIntersectionAnimation, useStaggerChildren } from '@/hooks/use-intersection-animation';

const blogs = [
  {
    id: 1,
    title: 'The Future of Aerial Mapping in Saudi Arabia',
    excerpt: 'Discover how advanced drone technology is revolutionizing surveying and mapping across the Kingdom.',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop',
    slug: 'future-aerial-mapping',
  },
  {
    id: 2,
    title: 'LiDAR Technology: Precision Beyond Limits',
    excerpt: 'Explore the capabilities of LiDAR scanning for infrastructure inspection and terrain modeling.',
    image: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&h=400&fit=crop',
    slug: 'lidar-technology-precision',
  },
  {
    id: 3,
    title: 'Sustainable Surveying: Green Initiatives',
    excerpt: 'Learn how drone-based surveys reduce environmental impact while improving data accuracy.',
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop',
    slug: 'sustainable-surveying',
  },
];

export function BlogsSection() {
  const sectionRef = useIntersectionAnimation<HTMLElement>({
    animationClass: 'animate-fade-in-up-sm',
  });
  const headerRef = useIntersectionAnimation<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    delay: 100,
  });
  const gridRef = useStaggerChildren<HTMLDivElement>({
    animationClass: 'animate-fade-in-up-sm',
    staggerDelay: 100,
  });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden opacity-0">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16 opacity-0">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Insights
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
            Latest{' '}
            <span className="text-gradient-primary">Blog Posts</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest trends, technologies, and insights 
            in drone surveying and geospatial solutions.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group block opacity-0"
            >
              <article className="h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-lg md:text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Read More
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
