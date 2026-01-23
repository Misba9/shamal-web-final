import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import { getProjects, getCategories, type Project, type Category } from '@/lib/api';
import { ProjectCard } from '@/components/ProjectCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  useLenis();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch categories and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories and projects in parallel
        const [categoriesRes, projectsRes] = await Promise.all([
          getCategories().catch((e) => {
            console.warn('Failed to load categories:', e);
            return { success: true, data: [] }; // Continue even if categories fail
          }),
          getProjects({ limit: 100 })
        ]);

        // Set categories
        if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        }

        // Set projects
        if (projectsRes?.success === false) {
          setError('Failed to load projects');
          setProjects([]);
        } else {
          const projectsData = Array.isArray(projectsRes?.data) ? projectsRes.data : [];
          setProjects(projectsData);
        }
      } catch (e: any) {
        const errorMessage = e?.response?.data?.message 
          || e?.message 
          || 'Failed to load data. Please try again later.';
        setError(errorMessage);
        setProjects([]);
        setCategories([]);
        console.error('Error loading data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects by category
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter(
          p =>
            p.category &&
            typeof p.category === 'object' &&
            p.category !== null &&
            String(p.category._id) === String(selectedCategory)
        );

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
  }, [selectedCategory]);

  return (
    <>
      <SEO 
        title="Projects - Featured Drone Survey Projects in Saudi Arabia"
        description="Explore our portfolio of major infrastructure, construction, and environmental projects across Saudi Arabia, including NEOM, Red Sea Global, and Riyadh Metro."
        canonical="/projects"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Our Projects
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
              <Tabs 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                }} 
                className="w-full max-w-4xl"
              >
                <TabsList className="grid h-auto p-1 bg-card border border-border" style={{
                  gridTemplateColumns: `repeat(${Math.min(categories.length + 1, 6)}, minmax(0, 1fr))`
                }}>
                  <TabsTrigger 
                    key="all"
                    value="all"
                    onClick={() => setSelectedCategory("all")}
                    className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All Projects
                  </TabsTrigger>
                  {categories.map((cat) => (
                    <TabsTrigger 
                      key={cat._id} 
                      value={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className="text-xs md:text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.name}
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
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">Please try again later.</p>
              </div>
            ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            )}

            {!loading && !error && filteredProjects.length === 0 && (
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

export default Projects;
