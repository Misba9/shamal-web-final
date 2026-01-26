import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowRight,
  Calendar,
  Clock,
  Search,
  ChevronRight,
  Loader2,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import { getBlogs, getBlogBySlug, postNewsletter, type Blog } from '@/lib/api';
import { getImageSrc } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'technology', label: 'Technology' },
  { id: 'case-study', label: 'Case Studies' },
  { id: 'industry', label: 'Industry Insights' },
  { id: 'tutorials', label: 'Tutorials' },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

function excerptFromContent(blog: Blog | undefined, max = 200) {
  if (!blog) return '—';
  // Use excerpt if available, otherwise extract from content
  if (blog.excerpt) return blog.excerpt;
  if (!blog.content) return '—';
  const text = blog.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length <= max ? text : text.slice(0, max) + '…';
}

function readTimeFromContent(html: string | undefined) {
  const len = (html || '').replace(/<[^>]+>/g, '').length;
  return `${Math.max(1, Math.ceil(len / 800))} min read`;
}

const Blog = () => {
  useLenis();
  const { slug } = useParams<{ slug?: string }>();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [single, setSingle] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getBlogBySlug(slug)
        .then((r) => { setSingle(r.data); setError(null); })
        .catch((e) => { setError(e instanceof Error ? e.message : 'Post not found'); setSingle(null); })
        .finally(() => setLoading(false));
    } else {
      setSingle(null);
      getBlogs({ limit: 100 })
        .then((r) => { setPosts(r.data); setError(null); })
        .catch((e) => { setError(e instanceof Error ? e.message : 'Failed to load posts'); setPosts([]); })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const filteredPosts = posts.filter((post) => {
    const excerpt = excerptFromContent(post);
    const tags = post.keywords || [];
    const matchesCategory = activeCategory === 'all' || tags.some((t) => t.toLowerCase().includes(activeCategory));
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.slice(0, 2);
  const regularPosts = filteredPosts.slice(2);
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitting(true);
    try {
      await postNewsletter(newsletterEmail.trim());
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    } catch {
      setNewsletterSuccess(false);
    } finally {
      setNewsletterSubmitting(false);
    }
  };

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

  // Single post view when slug is in URL
  if (slug) {
    return (
      <>
        <SEO
          title={single ? (single.metaTitle || `${single.title} - Blog`) : 'Blog'}
          description={single ? (single.metaDescription || excerptFromContent(single, 160)) : 'Blog post'}
          canonical={`/blog/${slug}`}
        />
        <main className="min-h-screen bg-background">
          <Navbar />
          {loading && (
            <div className="flex justify-center pt-32">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && !loading && (
            <div className="container mx-auto px-4 pt-32 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button asChild><Link to="/blog">Back to Blog</Link></Button>
            </div>
          )}
          {single && !loading && (
            <article className="pt-28 pb-20">
              <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <Link to="/blog" className="text-primary hover:underline text-sm mb-6 inline-block">← Back to Blog</Link>
                <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">{single.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-8">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(single.publishedAt || single.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readTimeFromContent(single.content)}
                  </span>
                  {single.author && (
                    <span>By {single.author}</span>
                  )}
                </div>
                {(single.featuredImage || single.thumbnail) && (
                  <img
                    src={getImageSrc(single.featuredImage || single.thumbnail)}
                    alt=""
                    className="w-full aspect-video object-cover rounded-xl mb-8"
                  />
                )}
                <div
                  className="prose prose-neutral dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: single.content }}
                />
              </div>
            </article>
          )}
        </main>
        <Footer />
      </>
    );
  }

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
        {!loading && activeCategory === 'all' && searchQuery === '' && featuredPosts.length > 0 && (
          <section className="pb-16">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="text-2xl font-display font-bold mb-8">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Card key={post._id} variant="service" className="overflow-hidden group h-full">
                    <div className="grid md:grid-cols-2 h-full">
                      <div className="aspect-video md:aspect-auto overflow-hidden">
                        <img 
                          src={getImageSrc(post.featuredImage || post.thumbnail)} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col justify-center">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
                          {(post.keywords && post.keywords[0]) || 'Article'}
                        </span>
                        <h3 className="font-display font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {excerptFromContent(post)}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {readTimeFromContent(post.content)}
                          </span>
                        </div>
                        <Link to={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-primary font-medium text-sm">
                          Read more <ChevronRight className="h-4 w-4" />
                        </Link>
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
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(activeCategory === 'all' && searchQuery === '' ? regularPosts : filteredPosts).map((post) => (
                <Card key={post._id} variant="service" className="overflow-hidden group h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={getImageSrc(post.featuredImage || post.thumbnail)} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {(post.keywords && post.keywords[0]) || 'Article'}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {readTimeFromContent(post.content)}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
                      {excerptFromContent(post)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(post.keywords || []).slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
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
            )}

            {!loading && filteredPosts.length === 0 && (
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
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterSubmitting || newsletterSuccess}
                required
              />
              <Button type="submit" variant="hero" disabled={newsletterSubmitting || newsletterSuccess}>
                {newsletterSuccess ? <Check className="h-4 w-4" /> : <><ArrowRight className="h-4 w-4 ml-2" /> Subscribe</>}
              </Button>
            </form>
            {newsletterSuccess && <p className="text-sm text-green-600 mt-2">Thanks for subscribing!</p>}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Blog;
