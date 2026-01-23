import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLenis } from '@/hooks/use-lenis';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { postContact } from '@/lib/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ... (keep existing constants: contactInfo, businessHours)
const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '+966 (0) 53 030 1370',
    href: 'tel:+966530301370',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'hello@shamal.sa',
    href: 'mailto:hello@shamal.sa',
  },
  {
    icon: MapPin,
    title: 'Office Location',
    content: '11th floor, Office no:1109, The Headquarters Business Park, Al Shati Dist., Jeddah 23511, Saudi Arabia',
  },
];

const businessHours = {
  weekdays: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
  weekend: 'Friday - Saturday: Closed',
};

const Contact = () => {
  useLenis();
  const { toast } = useToast();
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value?.trim() || undefined;
    const message = (form.elements.namedItem('message') as HTMLInputElement | HTMLTextAreaElement)?.value?.trim();
    if (!name || !email || !message) return;
    setIsSubmitting(true);
    try {
      await postContact({ name, email, phone, message });
      toast({ title: 'Message Sent!', description: "We'll get back to you as soon as possible." });
      form.reset();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to send. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us - Get a Quote for Drone Services"
        description="Contact Shamal Technologies for your aerial survey and geospatial data needs in Saudi Arabia. Request a quote or schedule a consultation."
        canonical="/contact"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <span className="animate-in inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              Contact Us
            </span>
            <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Let's <span className="text-gradient-primary">Work Together</span>
            </h1>
            <p className="animate-in text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your next project? Get in touch with our team and 
              discover how we can help transform your operations.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl font-display font-bold mb-6">
                  Send us a message
                </h2>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+966 XX XXX XXXX"
                        className="bg-card"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-card"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project..."
                      rows={5}
                      required
                      className="bg-card resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info & Map */}
              <div className="order-1 lg:order-2 space-y-8">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Reach out to us through any of these channels
                  </p>
                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.title}</h3>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {item.content}
                            </a>
                          ) : (
                            <p className="text-muted-foreground text-sm">{item.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-display font-bold mb-4">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{businessHours.weekdays}</p>
                    <p className="text-muted-foreground">{businessHours.weekend}</p>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-border h-[300px] lg:h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3710.4829098721244!2d39.1286!3d21.5433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d0f5d8b2e7f1%3A0x1234567890abcdef!2sThe%20Headquarters%20Business%20Park!5e0!3m2!1sen!2ssa!4v1700000000000!5m2!1sen!2ssa"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shamal Technologies Location - Jeddah"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Contact;
