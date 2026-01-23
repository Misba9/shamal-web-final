import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Plane, 
  Building2, 
  Search, 
  Waves, 
  Globe, 
  Leaf, 
  Box, 
  Mountain, 
  Shield, 
  Brain, 
  Wheat,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Target,
  Zap,
  Clock,
  Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { SEO } from '@/components/SEO';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing services and portfolioHighlights arrays)
const services = [
  {
    icon: Plane,
    slug: 'aerial-survey',
    title: 'Aerial Survey',
    shortDescription: 'High-precision aerial mapping and photogrammetry for accurate topographic data collection and analysis.',
    description: 'Our aerial survey services utilize cutting-edge drone technology combined with advanced photogrammetry software to deliver centimeter-accurate mapping data. From large-scale infrastructure projects to detailed site surveys, we provide comprehensive aerial data solutions.',
    features: ['Orthomosaic mapping', 'Digital elevation models', '3D terrain modeling', 'Volumetric calculations'],
    benefits: [
      'Up to 90% faster data collection compared to traditional ground surveys',
      'Centimeter-level accuracy with RTK/PPK GPS integration',
      'Reduced project costs and minimal site disruption',
      'Comprehensive deliverables including DSM, DTM, and point clouds'
    ],
    howWeDoIt: 'Shamal Technologies deploys enterprise-grade DJI and senseFly drones equipped with high-resolution cameras and RTK GPS systems. Our certified pilots capture overlapping imagery that\'s processed using Pix4D and Agisoft Metashape to generate accurate orthomosaics, digital surface models, and 3D reconstructions.',
    useCases: ['Infrastructure planning', 'Land development', 'Construction monitoring', 'Mining operations'],
  },
  {
    icon: Building2,
    slug: 'construction-monitoring',
    title: 'Construction Monitoring',
    shortDescription: 'Real-time construction progress tracking with drone-based documentation and reporting.',
    description: 'Monitor your construction projects from above with regular drone flights that document progress, ensure compliance with design specifications, and identify potential issues before they become costly problems.',
    features: ['Progress documentation', 'Site comparison', 'Safety monitoring', 'As-built surveys'],
    benefits: [
      'Weekly or monthly progress reports with visual documentation',
      'Early detection of design deviations and construction errors',
      'Enhanced safety through remote site monitoring',
      'Integration with BIM models for progress tracking'
    ],
    howWeDoIt: 'We establish flight schedules aligned with your project milestones, capturing consistent aerial imagery that allows side-by-side comparison over time. Our deliverables include annotated progress reports, 3D models, and overlay comparisons with original design documents.',
    useCases: ['Commercial buildings', 'Infrastructure projects', 'Industrial facilities', 'Residential developments'],
  },
  {
    icon: Search,
    slug: 'asset-inspection',
    title: 'Asset Inspection',
    shortDescription: 'Comprehensive infrastructure inspection using advanced thermal and visual imaging systems.',
    description: 'Our drone-based inspection services provide safe, efficient, and detailed assessments of infrastructure assets. Using thermal and high-resolution cameras, we identify defects, corrosion, and maintenance needs without scaffolding or shutdowns.',
    features: ['Thermal imaging', 'Structural analysis', 'Defect detection', 'Maintenance planning'],
    benefits: [
      'Eliminate the need for expensive scaffolding and rope access',
      'Thermal anomaly detection for electrical and mechanical issues',
      'Detailed visual documentation of asset condition',
      'Risk-free inspections of hazardous or hard-to-reach areas'
    ],
    howWeDoIt: 'Shamal Technologies uses specialized inspection drones equipped with zoom cameras and radiometric thermal sensors. Our pilots are trained in close-proximity flying techniques, and our analysts provide detailed inspection reports with annotated imagery and recommendations.',
    useCases: ['Power lines', 'Pipelines', 'Bridges', 'Industrial plants'],
  },
  {
    icon: Waves,
    slug: 'bathymetric-survey',
    title: 'Bathymetric Survey',
    shortDescription: 'Underwater mapping and hydrographic surveys for marine and freshwater projects.',
    description: 'Combining drone-mounted LiDAR with traditional bathymetric techniques, we provide comprehensive underwater mapping solutions for coastal engineering, dredging projects, and environmental monitoring.',
    features: ['Depth mapping', 'Seafloor imaging', 'Harbor surveys', 'Pipeline routing'],
    benefits: [
      'Seamless integration of above and below water data',
      'High-resolution depth models for engineering design',
      'Reduced vessel time and associated costs',
      'Accurate volume calculations for dredging projects'
    ],
    howWeDoIt: 'We utilize green-wavelength LiDAR technology mounted on specialized drones that can penetrate water surfaces. Combined with traditional echo sounders and multi-beam sonar, we create comprehensive underwater terrain models.',
    useCases: ['Port development', 'Coastal engineering', 'Environmental monitoring', 'Flood management'],
  },
  {
    icon: Globe,
    slug: 'gis-remote-sensing',
    title: 'GIS & Remote Sensing',
    shortDescription: 'Geospatial data analysis and satellite imagery interpretation for planning and monitoring.',
    description: 'Our GIS and remote sensing services transform raw aerial and satellite data into actionable geospatial intelligence. We provide custom mapping solutions, change detection analysis, and spatial modeling for diverse applications.',
    features: ['Satellite analysis', 'Land use mapping', 'Change detection', 'Spatial modeling'],
    benefits: [
      'Multi-temporal analysis to track changes over time',
      'Integration of drone and satellite data for comprehensive coverage',
      'Custom GIS applications and web mapping solutions',
      'Decision-support systems for land management'
    ],
    howWeDoIt: 'Our GIS specialists process and analyze data from multiple sources including Sentinel, Landsat, and commercial satellites. Combined with our drone-collected data, we create comprehensive geospatial databases and visualization platforms.',
    useCases: ['Urban planning', 'Agriculture', 'Environmental monitoring', 'Disaster response'],
  },
  {
    icon: Leaf,
    slug: 'environmental-monitoring',
    title: 'Environmental Monitoring',
    shortDescription: 'Ecosystem assessment and environmental impact studies using advanced sensor technology.',
    description: 'We provide comprehensive environmental monitoring services using multispectral and thermal sensors to assess vegetation health, track wildlife, monitor water quality, and support environmental impact assessments.',
    features: ['Vegetation analysis', 'Wildlife monitoring', 'Pollution tracking', 'Impact assessment'],
    benefits: [
      'Non-invasive monitoring that doesn\'t disturb ecosystems',
      'Multispectral analysis for vegetation health assessment',
      'Thermal detection for wildlife surveys and pollution tracking',
      'Regulatory compliance documentation'
    ],
    howWeDoIt: 'Shamal Technologies deploys drones equipped with multispectral cameras, thermal sensors, and specialized payloads for environmental applications. Our environmental scientists analyze the data to produce reports aligned with regulatory requirements.',
    useCases: ['Protected areas', 'Mining reclamation', 'Coastal zones', 'Industrial sites'],
  },
  {
    icon: Box,
    slug: 'scan-cad-bim',
    title: 'SCAN/CAD to BIM',
    shortDescription: '3D laser scanning and BIM modeling for construction, architecture, and heritage preservation.',
    description: 'Our reality capture services combine aerial photogrammetry with terrestrial LiDAR scanning to create accurate 3D models that integrate seamlessly with BIM workflows for design, renovation, and heritage documentation.',
    features: ['Point cloud capture', 'BIM integration', 'Heritage documentation', 'Clash detection'],
    benefits: [
      'Millimeter-accurate as-built documentation',
      'Seamless integration with Revit, AutoCAD, and other BIM platforms',
      'Digital preservation of heritage structures',
      'Clash detection to prevent construction conflicts'
    ],
    howWeDoIt: 'We combine drone photogrammetry for exteriors with terrestrial LiDAR for interior spaces. Our modeling team processes point clouds into intelligent BIM models with accurate geometry and embedded metadata.',
    useCases: ['Renovation projects', 'Heritage sites', 'Industrial facilities', 'Architectural design'],
  },
  {
    icon: Mountain,
    slug: 'mining-exploration',
    title: 'Mining & Exploration',
    shortDescription: 'Volumetric analysis and mineral exploration surveys for mining operations.',
    description: 'We support mining operations with regular volumetric surveys for stockpile management, pit optimization, and exploration mapping. Our accurate measurements help mine managers make informed decisions.',
    features: ['Stockpile measurement', 'Pit optimization', 'Exploration mapping', 'Reclamation planning'],
    benefits: [
      'Accurate stockpile volumes for inventory management',
      'Regular progress tracking for extraction optimization',
      'Safe surveying without personnel in active mining areas',
      'Reclamation monitoring and compliance documentation'
    ],
    howWeDoIt: 'Shamal Technologies conducts regular drone surveys of mining sites, generating accurate surface models for volume calculations. Our mining specialists provide reports with cut/fill analysis, haul road optimization, and reclamation progress tracking.',
    useCases: ['Open pit mines', 'Quarries', 'Stockpile management', 'Mineral exploration'],
  },
  {
    icon: Shield,
    slug: 'security-surveillance',
    title: 'Security Surveillance',
    shortDescription: 'Aerial security monitoring, perimeter surveillance, and threat assessment.',
    description: 'Our security drone services provide comprehensive aerial surveillance for critical infrastructure, large events, and border monitoring. Real-time video feeds and thermal imaging enhance situational awareness.',
    features: ['Perimeter monitoring', 'Crowd analysis', 'Emergency response', 'Border security'],
    benefits: [
      'Real-time video transmission to command centers',
      'Thermal imaging for night operations',
      'Rapid deployment for emergency response',
      'Wide area coverage with fewer personnel'
    ],
    howWeDoIt: 'We deploy long-endurance drones equipped with zoom cameras and thermal sensors, linked to our ground control stations. Our operators provide real-time intelligence and recorded footage for incident documentation.',
    useCases: ['Critical infrastructure', 'Large events', 'Border areas', 'Industrial security'],
  },
  {
    icon: Brain,
    slug: 'ai-development',
    title: 'AI Development',
    shortDescription: 'Custom AI and machine learning solutions for automated data processing and analysis.',
    description: 'Shamal Technologies develops custom AI solutions that automate the analysis of aerial imagery. From object detection to predictive analytics, our machine learning models extract insights from your drone data.',
    features: ['Object detection', 'Predictive analytics', 'Automated processing', 'Custom algorithms'],
    benefits: [
      'Automated feature extraction from aerial imagery',
      'Predictive maintenance through trend analysis',
      'Scalable processing of large datasets',
      'Custom models trained on your specific requirements'
    ],
    howWeDoIt: 'Our AI team develops and trains custom machine learning models using frameworks like TensorFlow and PyTorch. We integrate these models into automated pipelines that process incoming drone data and generate actionable insights.',
    useCases: ['Infrastructure monitoring', 'Agriculture analytics', 'Security detection', 'Quality control'],
  },
  {
    icon: Wheat,
    slug: 'agriculture-monitoring',
    title: 'Agriculture Monitoring',
    shortDescription: 'Crop health analysis and precision agriculture solutions for modern farming.',
    description: 'Our agricultural drone services help farmers optimize crop management through multispectral imagery analysis. We provide vegetation indices, irrigation recommendations, and yield predictions.',
    features: ['NDVI analysis', 'Irrigation planning', 'Yield estimation', 'Pest detection'],
    benefits: [
      'Early detection of crop stress and disease',
      'Precise application of inputs for cost savings',
      'Water management optimization through thermal analysis',
      'Data-driven yield predictions'
    ],
    howWeDoIt: 'We deploy drones equipped with multispectral cameras that capture vegetation indices like NDVI and NDRE. Our agronomists analyze the data to provide prescription maps and recommendations for precision agriculture.',
    useCases: ['Crop monitoring', 'Irrigation management', 'Pest control', 'Harvest planning'],
  },
  {
    icon: Sparkles,
    slug: 'special-projects',
    title: 'Special Projects',
    shortDescription: 'Custom drone solutions for unique industry requirements and specialized applications.',
    description: 'We tackle unique challenges that require custom solutions. From specialized sensor integration to innovative data processing, our team develops tailored approaches for your specific needs.',
    features: ['Custom sensors', 'R&D projects', 'Consulting', 'Training programs'],
    benefits: [
      'Flexible solutions for unique requirements',
      'Access to cutting-edge technology and expertise',
      'Collaborative development approach',
      'Comprehensive training and knowledge transfer'
    ],
    howWeDoIt: 'Our R&D team works closely with clients to understand their specific challenges and develop custom solutions. We leverage our extensive experience and technology partnerships to create innovative approaches.',
    useCases: ['Research projects', 'Custom applications', 'Technology pilots', 'Training programs'],
  },
];

const portfolioHighlights = [
  {
    title: 'NEOM Infrastructure Survey',
    description: 'Large-scale topographic mapping for Saudi Arabia\'s flagship megaproject, covering over 26,500 km².',
    image: '/placeholder.svg',
    metrics: ['26,500 km² covered', '2cm accuracy', '6 months duration'],
  },
  {
    title: 'Jeddah Port Expansion',
    description: 'Comprehensive bathymetric and aerial survey supporting the port expansion project.',
    image: '/placeholder.svg',
    metrics: ['500 hectares mapped', 'Multi-sensor integration', 'Weekly updates'],
  },
  {
    title: 'Riyadh Metro Monitoring',
    description: 'Regular construction progress monitoring across multiple metro line stations.',
    image: '/placeholder.svg',
    metrics: ['85 stations', 'Monthly reports', '3-year project'],
  },
];

const Services = () => {
  useLenis();
  const { slug } = useParams<{ slug?: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);

  const selectedService = slug ? services.find(s => s.slug === slug) : null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.animate-in') || [], {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

      if (!selectedService && gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (selectedService && detailRef.current) {
        gsap.from(detailRef.current.querySelectorAll('.detail-animate'), {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, [selectedService]);

  // Dynamic SEO based on selected service
  const seoTitle = selectedService 
    ? `${selectedService.title} - Shamal Technologies`
    : "Our Services - Drone Survey & Geospatial Solutions";
  
  const seoDescription = selectedService
    ? selectedService.description
    : "Explore our comprehensive range of drone and geospatial services including aerial survey, construction monitoring, asset inspection, and AI analytics.";

  // Service Detail View
  if (selectedService) {
    const ServiceIcon = selectedService.icon;
    
    return (
      <>
        <SEO 
          title={seoTitle}
          description={seoDescription}
          canonical={`/services/${slug}`}
        />
        <main className="min-h-screen bg-background">
          <Navbar />

          {/* Hero Section */}
          <section ref={heroRef} className="pt-32 pb-16 md:pt-40 md:pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <Link 
                to="/services" 
                className="animate-in inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Services
              </Link>
              
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ServiceIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                <div>
                  <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-2">
                    Our Services
                  </span>
                  <h1 className="animate-in text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                    {selectedService.title}
                  </h1>
                </div>
              </div>
              
              <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {selectedService.description}
              </p>
            </div>
          </section>

          {/* Detail Content */}
          <section ref={detailRef} className="section-padding">
            <div className="container mx-auto px-4 md:px-6">
              {/* Key Features & Benefits */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                <Card variant="gradient" className="p-8 detail-animate">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-display font-bold">Key Features</h2>
                    </div>
                    <ul className="space-y-4">
                      {selectedService.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="gradient" className="p-8 detail-animate">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Target className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-xl font-display font-bold">Benefits</h2>
                    </div>
                    <ul className="space-y-4">
                      {selectedService.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* How Shamal Does It */}
              <div className="mb-16 detail-animate">
                <Card variant="service" className="p-8 md:p-12">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-display font-bold">How Shamal Technologies Delivers</h2>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      {selectedService.howWeDoIt}
                    </p>
                    
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedService.useCases.map((useCase, i) => (
                        <div key={i} className="bg-primary/5 rounded-xl px-4 py-3 text-center">
                          <span className="text-sm font-medium">{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Why Choose This Service */}
              <div className="mb-16 detail-animate">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Why Choose Our <span className="text-gradient-primary">{selectedService.title}</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Industry-leading technology combined with local expertise delivers results you can trust.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <Card variant="glass" className="p-6 text-center">
                    <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Faster Delivery</h3>
                    <p className="text-sm text-muted-foreground">
                      90% reduction in data collection time compared to traditional methods
                    </p>
                  </Card>
                  <Card variant="glass" className="p-6 text-center">
                    <Target className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Higher Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      Centimeter-level precision with RTK/PPK GPS integration
                    </p>
                  </Card>
                  <Card variant="glass" className="p-6 text-center">
                    <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Safer Operations</h3>
                    <p className="text-sm text-muted-foreground">
                      Remote data collection eliminates risks to field personnel
                    </p>
                  </Card>
                </div>
              </div>

              {/* Projects Highlights */}
              <div className="detail-animate">
                <div className="text-center mb-12">
                  <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
                    Projects
                  </span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold">
                    Featured Projects
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {portfolioHighlights.map((project, index) => (
                    <Card key={index} variant="service" className="overflow-hidden group">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-display font-bold text-lg mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.metrics.map((metric, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {metric}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/projects">
                      View All Projects
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-padding bg-card/50 border-y border-border">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Contact our team to discuss your {selectedService.title.toLowerCase()} requirements 
                and get a customized solution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/contact">
                    Request a Quote
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/services">
                    View All Services
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </>
    );
  }

  // Services List View
  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonical="/services"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Our Services
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Comprehensive{' '}
              <span className="text-gradient-primary">Drone Solutions</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From aerial surveys to AI-powered analytics, we deliver end-to-end 
              geospatial services tailored to your industry needs.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <Card key={service.slug} variant="service" className="p-6 h-full group">
                  <CardContent className="p-0 h-full flex flex-col">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="font-display font-bold text-xl mb-3">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 flex-grow">
                      {service.shortDescription}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link to={`/services/${service.slug}`}>
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-card/50 border-y border-border">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Our team is ready to discuss your specific requirements and design 
              a tailored solution for your project.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Get in Touch
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

export default Services;
