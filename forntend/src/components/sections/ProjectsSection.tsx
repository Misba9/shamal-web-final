import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ui/skeleton';
import { getProjects, getCategories, type Project, type Category } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  limit?: number;
  showViewAll?: boolean;
  showCategories?: boolean;
}

export function ProjectsSection({ limit = 6, showViewAll = true, showCategories = true }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories and projects in parallel
        const [categoriesRes, projectsRes] = await Promise.all([
          showCategories 
            ? getCategories().catch((e) => {
                console.warn('Failed to load categories:', e);
                return { success: true, data: [] };
              })
            : Promise.resolve({ success: true, data: [] }),
          getProjects({ limit: limit * 2 }) // Fetch more to allow filtering
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
          || 'Failed to load projects';
        setError(errorMessage);
        setProjects([]);
        setCategories([]);
        console.error('Error loading data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, showCategories]);

  // Filter projects by category
  const filteredProjects =
    selectedCategory === "all"
      ? projects.slice(0, limit)
      : projects
          .filter(
            p =>
              p.category &&
              typeof p.category === 'object' &&
              p.category !== null &&
              String(p.category._id) === String(selectedCategory)
          )
          .slice(0, limit);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Grid Animation
      if (gridRef.current && !loading) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, selectedCategory]);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden bg-card/30">
      <div className="container-custom">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Featured Projects
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

        {/* Category Filter Tabs */}
        {showCategories && categories.length > 0 && (
          <div className="mb-8 md:mb-12">
            <div className="flex justify-center">
              <Tabs 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                }} 
                className="w-full max-w-4xl"
              >
                {/* Mobile: Horizontal scroll */}
                <div className="block sm:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide">
                  <TabsList className="inline-flex h-auto p-1 bg-card border border-border gap-1">
                    <TabsTrigger 
                      key="all"
                      value="all"
                      onClick={() => setSelectedCategory("all")}
                      className="text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap shrink-0"
                    >
                      All Projects
                    </TabsTrigger>
                    {categories.map((cat) => (
                      <TabsTrigger 
                        key={cat._id} 
                        value={cat._id}
                        onClick={() => setSelectedCategory(cat._id)}
                        className="text-xs py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap shrink-0"
                      >
                        {cat.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {/* Desktop: Grid layout */}
                <TabsList className="hidden sm:grid h-auto p-1 bg-card border border-border" style={{
                  gridTemplateColumns: `repeat(${Math.min(categories.length + 1, 6)}, minmax(0, 1fr))`
                }}>
                  <TabsTrigger 
                    key="all"
                    value="all"
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All Projects
                  </TabsTrigger>
                  {categories.map((cat) => (
                    <TabsTrigger 
                      key={cat._id} 
                      value={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className="text-sm py-2 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">Please try again later.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
          <>
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} variant="compact" />
              ))}
            </div>
            
            {showViewAll && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/projects">
                    View All Projects
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
