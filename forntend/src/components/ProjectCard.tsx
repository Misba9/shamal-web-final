import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Building2, Mountain, Plane, Waves, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getImageSrc } from '@/lib/utils';
import type { Project } from '@/lib/api';

const getCategoryIcon = (categoryName: string) => {
  const normalized = categoryName.toLowerCase();
  switch (normalized) {
    case 'infrastructure': return Building2;
    case 'construction': return Building2;
    case 'mining': return Mountain;
    case 'environmental': return Plane;
    case 'marine': return Waves;
    default: return MapPin;
  }
};

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact';
}

export function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  // Extract category info
  let categoryName = '';
  
  if (project.category) {
    if (typeof project.category === 'object' && project.category !== null && 'name' in project.category) {
      categoryName = (project.category as { _id?: string; name: string }).name || '';
    } else if (typeof project.category === 'string') {
      // Fallback for legacy data
      categoryName = project.category;
    }
  }
  
  const CategoryIcon = getCategoryIcon(categoryName || 'infrastructure');
  const dateStr = project.startDate
    ? new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric' })
    : project.endDate
      ? new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric' })
      : '—';

  if (variant === 'compact') {
    return (
      <Link to={`/projects/${project._id}`} className="group block">
        <article className="h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[3/2] overflow-hidden">
            <img
              src={getImageSrc(project.image || project.images?.[0] || project.gallery?.[0])}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-display font-bold text-lg md:text-xl mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
              {project.description || '—'}
            </p>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
              View Project
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Card key={project._id} variant="service" className="overflow-hidden group h-full">
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={getImageSrc(project.image || project.images?.[0] || project.gallery?.[0])} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
            <CategoryIcon className="h-3 w-3" />
            {categoryName || 'Project'}
          </span>
        </div>
      </div>
      <CardContent className="p-6 flex flex-col h-[calc(100%-33.33%)]">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateStr}
          </span>
        </div>
        <h3 className="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
          {project.description || '—'}
        </p>

        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
          <Link to={`/projects/${project._id}`}>
            View Project Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
