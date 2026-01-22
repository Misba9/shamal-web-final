import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Youtube,
  Facebook,
  Instagram,
  Send,
  Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoPrimary from '@/assets/logo-primary.svg';

// Custom icons for platforms not in lucide-react
const XIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.063-.18-.031-.149.075-.349.255-.42 3.279-.54 4.761-3.879 4.821-4.029l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.825-.344-1.213-.734-1.213-1.183 0-.36.27-.69.72-.854.149-.06.314-.09.494-.09.12 0 .284.015.449.09.374.18.72.3 1.033.3.195 0 .314-.044.389-.074l-.03-.51c-.104-1.628-.225-3.654.304-4.847C7.849 1.069 11.216.793 12.206.793"/>
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
    { label: 'Our Team', href: '/about#team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  resources: [
    { label: 'Products', href: '/products' },
    { label: 'Case Studies', href: '/portfolio' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const contactInfo = {
  address: '11th floor, Office no:1109, The Headquarters Business Park, Al Shati Dist., Jeddah 23511, Saudi Arabia',
  phone: '+966 (0) 53 030 1370',
  email: 'hello@shamal.sa',
};

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok', isCustom: true },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: XIcon, href: 'https://x.com', label: 'X', isCustom: true },
  { icon: SnapchatIcon, href: 'https://snapchat.com', label: 'Snapchat', isCustom: true },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API endpoint
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img
                src={logoPrimary}
                alt="Shamal Technologies"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Leading provider of drone survey and geospatial solutions in Saudi Arabia. 
              Delivering precision, innovation, and excellence in aerial technology.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3">
                Newsletter
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to get the latest updates and insights.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                      setIsSuccess(false);
                    }}
                    disabled={isSubmitting || isSuccess}
                    className={cn(
                      "flex-1",
                      error && "border-destructive",
                      isSuccess && "border-green-500"
                    )}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    size="default"
                    className="shrink-0"
                  >
                    {isSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : isSubmitting ? (
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
                {isSuccess && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Successfully subscribed! Check your email.
                  </p>
                )}
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{contactInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Shamal Technologies. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors"
                aria-label={social.label}
              >
                {'isCustom' in social && social.isCustom ? (
                  <social.icon />
                ) : (
                  <social.icon className="h-4 w-4 text-foreground" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
