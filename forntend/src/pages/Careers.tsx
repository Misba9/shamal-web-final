import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowRight, MapPin, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { getJobs, getJobBySlug, submitJobApplication, type Job } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Careers = () => {
  useLenis();
  const { slug } = useParams<{ slug?: string }>();
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [singleJob, setSingleJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (slug) {
      // Single job view
      setLoading(true);
      getJobBySlug(slug)
        .then((r) => { setSingleJob(r.data); setError(null); })
        .catch((e) => { setError(e instanceof Error ? e.message : 'Job not found'); setSingleJob(null); })
        .finally(() => setLoading(false));
    } else {
      // Jobs list view
      setSingleJob(null);
      const fetchJobs = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await getJobs();
          if (res.success && Array.isArray(res.data)) {
            setJobs(res.data);
          } else {
            setJobs([]);
          }
        } catch (e: any) {
          console.error('Error loading jobs:', e);
          const errorMessage = e?.response?.data?.message 
            || e?.message 
            || 'Failed to load jobs. Please try again later.';
          setError(errorMessage);
          setJobs([]);
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
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
  }, [loading, jobs]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOC/DOCX files are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setResumeFile(file);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleJob || !resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('jobId', singleJob._id);
      formData.append('fullName', applyForm.fullName.trim());
      formData.append('email', applyForm.email.trim());
      formData.append('phone', applyForm.phone.trim());
      formData.append('coverLetter', applyForm.coverLetter.trim());
      formData.append('resume', resumeFile);

      await submitJobApplication(formData);
      toast.success('Application submitted successfully!');
      setApplyForm({ fullName: '', email: '', phone: '', coverLetter: '' });
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to submit application';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Single job view
  if (slug) {
    return (
      <>
        <SEO
          title={singleJob ? (singleJob.seoTitle || `${singleJob.title} - Careers`) : 'Job'}
          description={singleJob ? (singleJob.seoDescription || singleJob.description.substring(0, 160)) : 'Job details'}
          canonical={`/careers/${slug}`}
          keywords={singleJob?.seoKeywords}
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
              <Button asChild><Link to="/careers">Back to Careers</Link></Button>
            </div>
          )}
          {singleJob && !loading && (
            <article className="pt-28 pb-20">
              <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Link to="/careers" className="text-primary hover:underline text-sm mb-6 inline-flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Careers
                </Link>
                
                <div className="mb-8">
                  <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">{singleJob.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    {singleJob.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {singleJob.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {singleJob.employmentType}
                    </span>
                    {singleJob.experience && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {singleJob.experience}
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none mb-12">
                  <h2 className="text-2xl font-display font-bold mb-4">Job Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{singleJob.description}</p>
                </div>

                {singleJob.responsibilities && singleJob.responsibilities.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-display font-bold mb-4">Responsibilities</h2>
                    <ul className="space-y-2">
                      {singleJob.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {singleJob.requirements && singleJob.requirements.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-display font-bold mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {singleJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Form */}
                <div className="border-t border-border pt-12">
                  <h2 className="text-2xl font-display font-bold mb-6">Apply for this Position</h2>
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={applyForm.fullName}
                          onChange={(e) => setApplyForm((f) => ({ ...f, fullName: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm((f) => ({ ...f, email: e.target.value }))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={applyForm.phone}
                        onChange={(e) => setApplyForm((f) => ({ ...f, phone: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="resume">Resume/CV * (PDF or DOC/DOCX, max 5MB)</Label>
                      <Input
                        ref={fileInputRef}
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileSelect}
                        required
                        className="mt-1"
                      />
                      {resumeFile && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <textarea
                        id="coverLetter"
                        value={applyForm.coverLetter}
                        onChange={(e) => setApplyForm((f) => ({ ...f, coverLetter: e.target.value }))}
                        rows={6}
                        className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                        placeholder="Tell us why you're a great fit for this position..."
                      />
                    </div>
                    <Button type="submit" disabled={submitting} size="lg">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </form>
                </div>
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
        title="Careers - Join Our Team"
        description="Explore career opportunities at Shamal Technologies. We're looking for talented individuals to join our team in Saudi Arabia."
        canonical="/careers"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Join Our Team
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl">
              Build your career with Saudi Arabia's leading drone and geospatial technology company
            </p>
          </div>
        </section>

        {/* Jobs Section */}
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No open positions at the moment. Check back soon!</p>
              </div>
            ) : (
              <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job) => (
                  <Link key={job._id} to={`/careers/${job.slug}`} className="block h-full">
                    <Card 
                      className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full"
                    >
                      <CardContent className="p-6">
                        <h3 className="text-xl font-display font-bold mb-3">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                          )}
                          <Badge variant="outline">{job.employmentType}</Badge>
                        </div>
                        {job.experience && (
                          <p className="text-sm text-muted-foreground mb-4">{job.experience}</p>
                        )}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {job.description.substring(0, 150)}...
                        </p>
                        <span className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all mt-4">
                          Apply Now
                          <ArrowRight className="h-4 w-4 rotate-180" />
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

export default Careers;
