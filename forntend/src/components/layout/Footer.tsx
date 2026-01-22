import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  MapPin, Phone, Mail, Linkedin, Youtube, Facebook, Instagram, Send, Check 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoPrimary from '@/assets/logo-primary.svg';

// Custom icons
const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const footerLinks = {
  services: [
    { label: 'Aerial Survey', href: '/services/aerial-survey' },
    { label: 'Construction Monitoring', href: '/services/construction-monitoring' },
    { label: 'Asset Inspection', href: '/services/asset-inspection' },
    { label: 'GIS & Remote Sensing', href: '/services/gis-remote-sensing' },
    { label: 'AI Development', href: '/services/ai-development' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: XIcon, href: 'https://x.com', label: 'X' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    setEmail('');
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <footer className="bg-muted/30 border-t border-border pt-16 md:pt-20 pb-8 md:pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 md:mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <Link to="/" className="inline-block">
              <img src={logoPrimary} alt="Shamal Technologies" className="h-8 md:h-10 w-auto" />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm md:text-base">
              Leading provider of drone survey and geospatial solutions in Saudi Arabia. 
              Delivering precision, innovation, and excellence.
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wider">Subscribe to Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                />
                <Button type="submit" disabled={isSubmitting || isSuccess} size="icon" className="shrink-0 bg-primary">
                  {isSuccess ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-semibold text-foreground mb-4 md:mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-semibold text-foreground mb-4 md:mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-semibold text-foreground mb-4 md:mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>11th floor, Office 1109, The Headquarters Business Park, Jeddah 23511, KSA</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+966 (0) 53 030 1370</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>hello@shamal.sa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Shamal Technologies. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
