import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  MapPin,
  Calendar,
  Ruler,
  Building2,
  Mountain,
  Plane,
  Waves,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing constants: categories, projects, getCategoryIcon)
const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'construction', label: 'Construction' },
  { id: 'mining', label: 'Mining' },
  { id: 'environmental', label: 'Environmental' },
  { id: 'marine', label: 'Marine' },
];

const projects = [
  {
    id: 1,
    slug: 'neom-infrastructure-survey',
    title: 'NEOM Infrastructure Survey',
    category: 'infrastructure',
    location: 'Tabuk Province, Saudi Arabia',
    date: '2023',
    image: '/placeholder.svg',
    description: 'Comprehensive topographic and aerial survey for Saudi Arabia\'s flagship megaproject NEOM, covering extensive desert and coastal terrain.',
    client: 'NEOM Company',
    metrics: {
      area: '26,500 km²',
      accuracy: '2cm RTK',
      duration: '6 months',
      deliverables: '3D Models, DTM, Orthomosaics'
    },
    services: ['Aerial Survey', 'GIS Mapping', 'Topographic Analysis'],
    challenge: 'Mapping vast, remote desert terrain with extreme temperature variations and limited ground control access.',
    solution: 'Deployed fleet of long-range fixed-wing drones with RTK GPS, established distributed ground control network, and utilized satellite imagery for validation.',
    results: [
      'Complete topographic database for infrastructure planning',
      'Identified optimal corridors for transportation networks',
      'Volumetric analysis for earthworks estimation'
    ]
  },
  {
    id: 2,
    slug: 'jeddah-port-expansion',
    title: 'Jeddah Islamic Port Expansion',
    category: 'marine',
    location: 'Jeddah, Saudi Arabia',
    date: '2023',
    image: '/placeholder.svg',
    description: 'Multi-sensor survey combining aerial photogrammetry and bathymetric mapping for the Jeddah Islamic Port expansion project.',
    client: 'Saudi Ports Authority',
    metrics: {
      area: '500 hectares',
      accuracy: '5cm horizontal',
      duration: 'Ongoing',
      deliverables: 'Bathymetric Charts, As-built Surveys'
    },
    services: ['Bathymetric Survey', 'Aerial Survey', 'Construction Monitoring'],
    challenge: 'Integrating above-water and underwater survey data while coordinating with active port operations.',
    solution: 'Combined drone aerial surveys with multi-beam sonar and deployed during scheduled operational windows.',
    results: [
      'Seamless above/below water terrain model',
      'Weekly progress updates for dredging operations',
      'Accurate volume calculations for material tracking'
    ]
  },
  {
    id: 3,
    slug: 'riyadh-metro-monitoring',
    title: 'Riyadh Metro Construction Monitoring',
    category: 'construction',
    location: 'Riyadh, Saudi Arabia',
    date: '2022-2024',
    image: '/placeholder.svg',
    description: 'Ongoing construction progress monitoring for Riyadh Metro stations and line infrastructure using regular drone surveys.',
    client: 'Riyadh Development Authority',
    metrics: {
      stations: '85 stations',
      frequency: 'Monthly',
      duration: '3 years',
      deliverables: 'Progress Reports, 3D Models'
    },
    services: ['Construction Monitoring', 'Progress Documentation', 'BIM Integration'],
    challenge: 'Coordinating surveys across multiple active construction sites throughout the city.',
    solution: 'Established efficient multi-site survey protocols with standardized flight patterns and automated reporting.',
    results: [
      'Comprehensive progress documentation archive',
      'Early identification of schedule deviations',
      'BIM model updates for project management'
    ]
  },
  {
    id: 4,
    slug: 'aramco-pipeline-inspection',
    title: 'Saudi Aramco Pipeline Corridor',
    category: 'infrastructure',
    location: 'Eastern Province, Saudi Arabia',
    date: '2023',
    image: '/placeholder.svg',
    description: 'Thermal and visual inspection of critical oil and gas pipeline infrastructure using specialized inspection drones.',
    client: 'Saudi Aramco',
    metrics: {
      length: '450 km',
      accuracy: 'Thermal 0.05°C',
      duration: '3 months',
      deliverables: 'Inspection Reports, Anomaly Maps'
    },
    services: ['Asset Inspection', 'Thermal Imaging', 'GIS Mapping'],
    challenge: 'Detecting potential leaks and structural issues across hundreds of kilometers of pipeline in harsh desert conditions.',
    solution: 'Deployed drones with radiometric thermal cameras and developed AI-assisted anomaly detection workflow.',
    results: [
      'Identified 12 thermal anomalies requiring attention',
      'Complete visual documentation of corridor condition',
      'Prioritized maintenance schedule'
    ]
  },
  {
    id: 5,
    slug: 'red-sea-coastal-mapping',
    title: 'Red Sea Coastal Development',
    category: 'environmental',
    location: 'Red Sea Coast, Saudi Arabia',
    date: '2023',
    image: '/placeholder.svg',
    description: 'Environmental baseline survey and coastal mapping for sustainable tourism development along the Red Sea coast.',
    client: 'Red Sea Global',
    metrics: {
      coastline: '200 km',
      accuracy: '3cm',
      duration: '4 months',
      deliverables: 'Environmental Reports, Coastal Models'
    },
    services: ['Environmental Monitoring', 'Coastal Mapping', 'Habitat Assessment'],
    challenge: 'Documenting sensitive marine and coastal ecosystems while supporting development planning.',
    solution: 'Combined multispectral imagery with traditional ecological surveys to create comprehensive environmental baseline.',
    results: [
      'Detailed habitat mapping for protected species',
      'Coastal erosion risk assessment',
      'Development suitability analysis'
    ]
  },
  {
    id: 6,
    slug: 'maaden-mining-survey',
    title: 'Ma\'aden Mining Operations',
    category: 'mining',
    location: 'Northern Saudi Arabia',
    date: '2022-2023',
    image: '/placeholder.svg',
    description: 'Regular volumetric surveys and pit optimization analysis for phosphate and gold mining operations.',
    client: 'Ma\'aden - Saudi Arabian Mining Company',
    metrics: {
      sites: '4 sites',
      frequency: 'Bi-weekly',
      duration: 'Ongoing',
      deliverables: 'Volume Reports, Pit Models'
    },
    services: ['Mining Survey', 'Volumetric Analysis', 'Progress Monitoring'],
    challenge: 'Providing accurate, timely volumetric data for inventory management and extraction planning.',
    solution: 'Established regular flight schedules with standardized processing for consistent measurements.',
    results: [
      'Accurate stockpile inventory tracking',
      'Optimized extraction sequences',
      'Reduced reconciliation discrepancies'
    ]
  },
  {
    id: 7,
    slug: 'kaec-construction',
    title: 'King Abdullah Economic City',
    category: 'construction',
    location: 'Rabigh, Saudi Arabia',
    date: '2023',
    image: '/placeholder.svg',
    description: 'As-built survey and construction documentation for residential and commercial development in KAEC.',
    client: 'Emaar Economic City',
    metrics: {
      area: '1,500 hectares',
      accuracy: '2cm',
      duration: '8 months',
      deliverables: 'As-built Models, Progress Reports'
    },
    services: ['Construction Monitoring', 'As-built Survey', 'BIM Modeling'],
    challenge: 'Creating accurate as-built documentation for large-scale mixed-use development.',
    solution: 'Combined aerial photogrammetry with ground control for precise building footprints and elevations.',
    results: [
      'Complete as-built BIM models',
      'Infrastructure verification surveys',
      'Quality control documentation'
    ]
  },
  {
    id: 8,
    slug: 'diriyah-heritage',
    title: 'Diriyah Gate Heritage Documentation',
    category: 'construction',
    location: 'Diriyah, Riyadh',
    date: '2023',
    image: '/placeholder.svg',
    description: '3D documentation and preservation survey of historic Diriyah structures using photogrammetry and LiDAR.',
    client: 'Diriyah Gate Development Authority',
    metrics: {
      buildings: '150+ structures',
      accuracy: 'Sub-centimeter',
      duration: '5 months',
      deliverables: '3D Models, Point Clouds, BIM'
    },
    services: ['SCAN/CAD to BIM', 'Heritage Documentation', '3D Modeling'],
    challenge: 'Capturing intricate architectural details of historic mud-brick structures for preservation.',
    solution: 'Deployed combination of aerial photogrammetry and terrestrial LiDAR with specialized heritage modeling workflow.',
    results: [
      'Digital archive of historic structures',
      'Restoration planning models',
      'Visitor experience applications'
    ]
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'infrastructure': return Building2;
    case 'construction': return Building2;
    case 'mining': return Mountain;
    case 'environmental': return Plane;
    case 'marine': return Waves;
    default: return MapPin;
  }
};

const Portfolio = () => {
  useLenis();
  const [activeCategory, setActiveCategory] = useState('all');
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

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
  }, [activeCategory]);

  return (
    <>
      <SEO 
        title="Portfolio - Featured Drone Survey Projects in Saudi Arabia"
        description="Explore our portfolio of major infrastructure, construction, and environmental projects across Saudi Arabia, including NEOM, Red Sea Global, and Riyadh Metro."
        canonical="/portfolio"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Our Portfolio
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Projects That <span className="text-gradient-primary">Define Excellence</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Explore our portfolio of precision aerial surveys, engineering data, and technical deliverables 
              that have powered Saudi Arabia's most ambitious infrastructure and development projects.
            </p>

            {/* Stats */}
            <div className="animate-in grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">km² Mapped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="pb-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-center">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full max-w-4xl">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 bg-card border border-border">
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
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => {
                const CategoryIcon = getCategoryIcon(project.category);
                return (
                  <Card key={project.id} variant="service" className="overflow-hidden group h-full">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                          <CategoryIcon className="h-3 w-3" />
                          {categories.find(c => c.id === project.category)?.label}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col h-[calc(100%-33.33%)]">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {project.date}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow">
                        {project.description}
                      </p>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-muted/50 rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground">Area</div>
                          <div className="text-sm font-semibold">{project.metrics.area}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2 text-center">
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                          <div className="text-sm font-semibold">{project.metrics.accuracy}</div>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                        <Link to={`/portfolio/${project.slug}`}>
                          View Project Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try selecting a different category</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Have a Similar Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Let's discuss how Shamal Technologies can deliver precision aerial data 
              for your infrastructure, construction, or development project.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Start Your Project
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Portfolio;
