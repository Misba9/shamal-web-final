import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing constants: categories, posts, formatDate)
const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'technology', label: 'Technology' },
  { id: 'case-study', label: 'Case Studies' },
  { id: 'industry', label: 'Industry Insights' },
  { id: 'tutorials', label: 'Tutorials' },
];

const posts = [
  {
    id: 1,
    slug: 'drone-surveying-vs-traditional-methods',
    title: 'Drone Surveying vs Traditional Methods: A Complete Comparison',
    excerpt: 'Explore the advantages of drone-based surveying over traditional ground methods, including cost savings, time efficiency, and accuracy improvements.',
    category: 'technology',
    image: '/placeholder.svg',
    author: 'Ahmed Al-Rashid',
    authorRole: 'Chief Technical Officer',
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['Aerial Survey', 'Technology', 'Comparison'],
    featured: true,
  },
  {
    id: 2,
    slug: 'neom-case-study-large-scale-mapping',
    title: 'Case Study: Large-Scale Topographic Mapping for NEOM',
    excerpt: 'How Shamal Technologies delivered comprehensive aerial survey data for Saudi Arabia\'s ambitious megaproject, covering over 26,500 km².',
    category: 'case-study',
    image: '/placeholder.svg',
    author: 'Sarah Khan',
    authorRole: 'Project Manager',
    date: '2024-01-10',
    readTime: '12 min read',
    tags: ['NEOM', 'Case Study', 'Infrastructure'],
    featured: true,
  },
  {
    id: 3,
    slug: 'rtk-ppk-gps-drone-accuracy',
    title: 'Understanding RTK and PPK GPS for Drone Accuracy',
    excerpt: 'A technical deep-dive into Real-Time Kinematic and Post-Processed Kinematic GPS technologies that enable centimeter-level accuracy.',
    category: 'technology',
    image: '/placeholder.svg',
    author: 'Mohammed Hassan',
    authorRole: 'Survey Engineer',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['GPS', 'RTK', 'PPK', 'Accuracy'],
    featured: false,
  },
  {
    id: 4,
    slug: 'ai-automated-defect-detection',
    title: 'AI-Powered Automated Defect Detection in Infrastructure',
    excerpt: 'How machine learning is revolutionizing infrastructure inspection by automatically identifying cracks, corrosion, and structural anomalies.',
    category: 'technology',
    image: '/placeholder.svg',
    author: 'Dr. Fatima Al-Zahrani',
    authorRole: 'AI Research Lead',
    date: '2023-12-28',
    readTime: '7 min read',
    tags: ['AI', 'Machine Learning', 'Inspection'],
    featured: false,
  },
  {
    id: 5,
    slug: 'construction-monitoring-best-practices',
    title: 'Best Practices for Drone-Based Construction Monitoring',
    excerpt: 'Learn how to effectively implement drone surveys for construction progress tracking, including flight planning, frequency, and deliverables.',
    category: 'tutorials',
    image: '/placeholder.svg',
    author: 'Khalid Al-Quraishi',
    authorRole: 'Operations Director',
    date: '2023-12-20',
    readTime: '9 min read',
    tags: ['Construction', 'Best Practices', 'Tutorial'],
    featured: false,
  },
  {
    id: 6,
    slug: 'saudi-arabia-drone-regulations-2024',
    title: 'Saudi Arabia Drone Regulations: What You Need to Know in 2024',
    excerpt: 'A comprehensive guide to GACA regulations for commercial drone operations in the Kingdom, including licensing, airspace, and compliance.',
    category: 'industry',
    image: '/placeholder.svg',
    author: 'Abdullah Al-Otaibi',
    authorRole: 'Compliance Manager',
    date: '2023-12-15',
    readTime: '6 min read',
    tags: ['Regulations', 'GACA', 'Compliance'],
    featured: false,
  },
  {
    id: 7,
    slug: 'bathymetric-survey-techniques',
    title: 'Advanced Bathymetric Survey Techniques for Coastal Projects',
    excerpt: 'Explore how combining drone photogrammetry with sonar technology creates comprehensive above and below water terrain models.',
    category: 'technology',
    image: '/placeholder.svg',
    author: 'Omar Al-Shehri',
    authorRole: 'Marine Survey Specialist',
    date: '2023-12-10',
    readTime: '11 min read',
    tags: ['Bathymetry', 'Marine', 'Coastal'],
    featured: false,
  },
  {
    id: 8,
    slug: 'vision-2030-infrastructure-development',
    title: 'How Aerial Intelligence Supports Vision 2030 Infrastructure',
    excerpt: 'The role of drone technology and geospatial data in accelerating Saudi Arabia\'s ambitious infrastructure development goals.',
    category: 'industry',
    image: '/placeholder.svg',
    author: 'Ahmed Al-Rashid',
    authorRole: 'Chief Technical Officer',
    date: '2023-12-05',
    readTime: '8 min read',
    tags: ['Vision 2030', 'Infrastructure', 'Development'],
    featured: false,
  },
  {
    id: 9,
    slug: 'lidar-vs-photogrammetry',
    title: 'LiDAR vs Photogrammetry: When to Use Each Technology',
    excerpt: 'A practical guide to choosing between LiDAR and photogrammetry for different survey applications, with pros and cons of each approach.',
    category: 'tutorials',
    image: '/placeholder.svg',
    author: 'Sarah Khan',
    authorRole: 'Project Manager',
    date: '2023-11-28',
    readTime: '10 min read',
    tags: ['LiDAR', 'Photogrammetry', 'Technology'],
    featured: false,
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const Blog = () => {
  useLenis();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = posts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured || activeCategory !== 'all');

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

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5, 
          stagger: 0.08, 
          ease: 'power3.out' 
        }
      );
    }
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEO 
        title="Blog - Drone Surveying & Geospatial Insights"
        description="Stay updated with the latest trends in drone surveying, aerial mapping, and geospatial technology in Saudi Arabia. Expert articles and case studies."
        canonical="/blog"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Insights & Knowledge
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              The Shamal <span className="text-gradient-primary">Technology Blog</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Expert insights on drone surveying, geospatial technology, and aerial intelligence 
              from Saudi Arabia's leading aerial solutions provider.
            </p>

            {/* Search Bar */}
            <div className="animate-in max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base bg-card border-border"
              />
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {activeCategory === 'all' && searchQuery === '' && (
          <section className="pb-16">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-display font-bold mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post.id} variant="service" className="overflow-hidden group h-full">
                    <div className="grid md:grid-cols-2 h-full">
                      <div className="aspect-video md:aspect-auto overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col justify-center">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
                          {categories.find(c => c.id === post.category)?.label}
                        </span>
                        <h3 className="font-display font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filter Tabs */}
        <section className="pb-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid grid-cols-3 md:grid-cols-5 h-auto p-1 bg-card border border-border w-full md:w-auto">
                  {categories.map((cat) => (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id}
                      className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(activeCategory === 'all' && searchQuery === '' ? regularPosts.filter(p => !p.featured) : filteredPosts).map((post) => (
                <Card key={post.id} variant="service" className="overflow-hidden group h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {categories.find(c => c.id === post.category)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(post.date)}</p>
                        </div>
                      </div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try a different search term or category</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for the latest insights on drone technology, 
              industry trends, and project highlights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow"
              />
              <Button variant="hero">
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Blog;
