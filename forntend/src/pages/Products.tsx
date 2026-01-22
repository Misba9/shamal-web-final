import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ProductCategory = 'drones' | 'payloads' | 'satellite';

interface Product {
  id: string;
  category: ProductCategory;
  badge: string;
  badgeColor: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

const products: Product[] = [
  // Drones
  {
    id: 'dock-2',
    category: 'drones',
    badge: 'Autonomous Docking',
    badgeColor: 'bg-primary',
    name: 'DJI Dock 2',
    description: 'Next-generation autonomous drone docking station with advanced weather resistance and remote operation capabilities.',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop',
    features: ['Autonomous operation', 'Weather resistant', 'Remote monitoring'],
  },
  {
    id: 'dock-3',
    category: 'drones',
    badge: 'Autonomous Docking',
    badgeColor: 'bg-primary',
    name: 'DJI Dock 3',
    description: 'Latest autonomous docking solution with enhanced reliability and extended operational capabilities for enterprise deployment.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop',
    features: ['Enhanced reliability', 'Extended range', '24/7 operation'],
  },
  {
    id: 'm350',
    category: 'drones',
    badge: 'Enterprise Drones',
    badgeColor: 'bg-emerald-600',
    name: 'DJI M350',
    description: 'Professional flagship drone with advanced AI capabilities, multiple payload support, and superior flight performance for industrial applications.',
    image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=600&h=400&fit=crop',
    features: ['55-min flight time', 'RTK positioning', 'IP55 rated'],
  },
  {
    id: 'mavic-3e',
    category: 'drones',
    badge: 'Enterprise Drones',
    badgeColor: 'bg-emerald-600',
    name: 'DJI Mavic 3 Enterprise',
    description: 'Compact enterprise drone with thermal imaging and high-resolution camera for versatile industrial inspection tasks.',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=400&fit=crop',
    features: ['Thermal imaging', '4/3 CMOS sensor', 'Compact design'],
  },
  // Payloads
  {
    id: 'zenmuse-h20',
    category: 'payloads',
    badge: 'Multi-Sensor',
    badgeColor: 'bg-blue-600',
    name: 'Zenmuse H20T',
    description: 'Hybrid sensor payload combining thermal, zoom, and wide-angle cameras for comprehensive aerial inspections.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    features: ['Thermal + Visual', '20x optical zoom', 'Laser rangefinder'],
  },
  {
    id: 'zenmuse-l1',
    category: 'payloads',
    badge: 'LiDAR',
    badgeColor: 'bg-purple-600',
    name: 'Zenmuse L1',
    description: 'Integrated LiDAR payload for high-precision 3D mapping and surveying applications with real-time point cloud generation.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    features: ['450m detection range', 'Point cloud live view', '2cm accuracy'],
  },
  {
    id: 'zenmuse-p1',
    category: 'payloads',
    badge: 'Photogrammetry',
    badgeColor: 'bg-amber-600',
    name: 'Zenmuse P1',
    description: 'Full-frame photogrammetry camera with interchangeable lenses for ultra-high resolution aerial mapping.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    features: ['45MP full-frame', '3-axis stabilization', 'Smart oblique'],
  },
  // Satellite Imagery
  {
    id: 'pneo',
    category: 'satellite',
    badge: 'Very High Resolution',
    badgeColor: 'bg-rose-600',
    name: 'Pléiades Neo',
    description: '30cm resolution satellite imagery for detailed urban planning, infrastructure monitoring, and precision agriculture.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
    features: ['30cm resolution', 'Daily revisit', '12-bit radiometry'],
  },
  {
    id: 'worldview',
    category: 'satellite',
    badge: 'Archive Imagery',
    badgeColor: 'bg-indigo-600',
    name: 'WorldView Legion',
    description: 'Sub-meter resolution satellite constellation for change detection and historical analysis applications.',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&h=400&fit=crop',
    features: ['31cm resolution', 'Multi-spectral', 'Rapid tasking'],
  },
  {
    id: 'planet',
    category: 'satellite',
    badge: 'Daily Monitoring',
    badgeColor: 'bg-teal-600',
    name: 'Planet Dove',
    description: 'Daily global coverage satellite imagery for continuous monitoring and time-series analysis.',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop',
    features: ['Daily coverage', '3m resolution', 'Global archive'],
  },
];

const Products = () => {
  useLenis();
  const heroRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<ProductCategory>('drones');

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

  const filteredProducts = products.filter((product) => product.category === activeTab);

  return (
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
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProductCategory)} className="w-full">
            <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 mb-12 h-auto p-1">
              <TabsTrigger 
                value="drones" 
                className="py-3 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Drones
              </TabsTrigger>
              <TabsTrigger 
                value="payloads"
                className="py-3 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Payloads
              </TabsTrigger>
              <TabsTrigger 
                value="satellite"
                className="py-3 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Satellite Imagery
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <Badge className={`${product.badgeColor} text-white mb-3`}>
                        {product.badge}
                      </Badge>
                      <h3 className="text-xl font-display font-bold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Key Features:</p>
                        {product.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Products;
