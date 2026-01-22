import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Ahmed Hadeel',
    role: 'Data Processing Manager',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    bio: 'Ahmed leads our data processing team with expertise in photogrammetry and GIS analysis. With over 8 years of experience in geospatial data processing, he ensures all deliverables meet the highest accuracy standards. His background in remote sensing and advanced data analytics drives innovation in our processing workflows.',
  },
  {
    name: 'Nawaf Alsahli',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    bio: 'Nawaf oversees all field operations and drone missions across Saudi Arabia. A GACA-certified pilot with extensive flight experience, he coordinates complex multi-drone operations for large-scale infrastructure projects. His expertise in mission planning and safety protocols ensures successful project delivery.',
  },
  {
    name: 'Khalid Shami',
    role: 'Senior Project Manager',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
    bio: 'A graduate of the University of Rhode Island, Khalid is an Industrial and Systems Engineer with a minor in Mathematics, bringing experience in supply chain planning from the regional FMCG industry. As Senior Project Management Specialist, Khalid leads with a strong analytical mindset, thriving on tackling complex challenges and optimizing project processes. Khalid acts as the main conduit between Shamal\'s field operations, our client\'s project teams and Shamal\'s global technology partner network, managing deadlines and expectations in an ever-complex environment.',
  },
];

export function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(teamMembers.length / 3));
    setActiveIndex(null);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(teamMembers.length / 3)) % Math.ceil(teamMembers.length / 3));
    setActiveIndex(null);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Our People
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Meet The Team Driving The Vision
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Built upon over 25 years of industry experience, our team actively forms trusted partnerships, 
            fosters a culture of innovation, and relentlessly pursues excellence
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Team Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="group relative cursor-pointer"
                onClick={() => handleCardClick(index)}
              >
                {/* Card Container */}
                <div
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 ${
                    activeIndex === index
                      ? 'border-primary bg-primary'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  style={{ minHeight: '420px' }}
                >
                  {/* Image State */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      activeIndex === index ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
                    }`}
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Bio State */}
                  <div
                    className={`absolute inset-0 p-6 flex flex-col justify-center transition-all duration-500 ${
                      activeIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <h3 className="text-xl font-display font-bold text-primary-foreground mb-3">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary-foreground/90 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Name & Role - Always visible below card */}
                <div
                  className={`mt-4 transition-opacity duration-300 ${
                    activeIndex === index ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <h3 className="text-xl font-display font-bold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
