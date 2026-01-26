import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { getProducts, getProductBySlug, type Product } from '@/lib/api';
import { getImageSrc } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  useLenis();
  const { slug } = useParams<{ slug?: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      // Single product view
      setLoading(true);
      getProductBySlug(slug)
        .then((r) => { setSingleProduct(r.data); setError(null); })
        .catch((e) => { setError(e instanceof Error ? e.message : 'Product not found'); setSingleProduct(null); })
        .finally(() => setLoading(false));
    } else {
      // Products list view
      setSingleProduct(null);
      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await getProducts({ active: true });
          if (res.success && Array.isArray(res.data)) {
            setProducts(res.data);
          } else {
            setProducts([]);
          }
        } catch (e: any) {
          console.error('Error loading products:', e);
          const errorMessage = e?.response?.data?.message 
            || e?.message 
            || 'Failed to load products. Please try again later.';
          setError(errorMessage);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [slug]);

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
    if (gridRef.current && !loading) {
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
  }, [loading, products]);

  // Single product view
  if (slug) {
    return (
      <>
        <SEO
          title={singleProduct ? `${singleProduct.name} - Products` : 'Product'}
          description={singleProduct ? (singleProduct.shortDescription || singleProduct.description || 'Product details') : 'Product'}
          canonical={`/products/${slug}`}
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
              <Button asChild><Link to="/products">Back to Products</Link></Button>
            </div>
          )}
          {singleProduct && !loading && (
            <article className="pt-28 pb-20">
              <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link to="/products" className="text-primary hover:underline text-sm mb-6 inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Link>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {singleProduct.image && (
                    <div className="aspect-square overflow-hidden rounded-xl">
                      <img
                        src={getImageSrc(singleProduct.image)}
                        alt={singleProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">{singleProduct.name}</h1>
                    {singleProduct.price != null && (
                      <div className="mb-4">
                        <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(singleProduct.price)}
                        </Badge>
                      </div>
                    )}
                    {singleProduct.shortDescription && (
                      <p className="text-lg text-muted-foreground mb-6">{singleProduct.shortDescription}</p>
                    )}
                  </div>
                </div>
                {singleProduct.description && (
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-display font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{singleProduct.description}</p>
                  </div>
                )}
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
        title="Products - Drones, Payloads & Satellite Imagery"
        description="Browse our selection of enterprise drones, LiDAR sensors, and high-resolution satellite imagery available for sale or lease in Saudi Arabia."
        canonical="/products"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Our Products
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl">
              Professional-grade drone equipment, sensors, and geospatial technology products for sale or lease
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">Please try again later.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No products available at the moment.</p>
              </div>
            ) : (
              <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link key={product._id} to={`/products/${product.slug}`} className="block h-full">
                    <Card 
                      className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageSrc(product.image || '')}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6">
                        {product.price != null && (
                          <Badge className="bg-primary text-white mb-3">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
                          </Badge>
                        )}
                        <h3 className="text-xl font-display font-bold mb-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {product.shortDescription || product.description || 'No description available.'}
                        </p>
                        <span className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all mt-4">
                          Learn More
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Products;
