import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logoPrimary from '@/assets/logo-primary.svg';
import gsap from 'gsap';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Products' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle Body Scroll Lock & GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobileMenuOpen) {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Ensure menu is visible before animating
        gsap.set(mobileMenuRef.current, { display: 'flex' });

        const tl = gsap.timeline();
        
        tl.to(mobileMenuRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.4,
          ease: 'power3.out',
        })
        .fromTo(
          mobileLinksRef.current?.children || [],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(1.2)',
          },
          "-=0.2"
        );
      } else {
        // Unlock body scroll
        document.body.style.overflow = '';
        
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.3,
          ease: 'power3.in',
          onComplete: () => {
            // Optional: hide display after animation if needed for accessibility/layout
             if (mobileMenuRef.current) {
               // gsap.set(mobileMenuRef.current, { display: 'none' });
             }
          }
        });
      }
    }, headerRef); // Scope to header

    return () => {
      ctx.revert();
      document.body.style.overflow = ''; // Cleanup scroll lock
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled || isMobileMenuOpen
          ? 'bg-background/90 backdrop-blur-md border-border/50 py-3 shadow-sm'
          : 'bg-transparent border-transparent py-4 md:py-6'
      )}
    >
      <nav className="container-custom flex items-center justify-between relative z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" aria-label="Shamal Technologies Home">
          <img
            src={logoPrimary}
            alt="Shamal Technologies"
            className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-full border border-border/20 shadow-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 relative',
                location.pathname === link.href
                  ? 'text-primary font-semibold bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button className="btn-primary-gradient rounded-full px-6 shadow-md hover:shadow-lg transition-all" size="sm" asChild>
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative p-2 text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-background/98 backdrop-blur-xl lg:hidden z-40 opacity-0 pointer-events-none flex flex-col items-center justify-center pt-20"
        style={{ height: '100vh' }}
      >
        <div ref={mobileLinksRef} className="flex flex-col items-center gap-6 w-full px-8 max-w-sm max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'text-2xl font-display font-bold transition-colors w-full text-center py-2 border-b border-transparent hover:border-border/50',
                location.pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button className="btn-primary-gradient w-full mt-6" size="lg" asChild>
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
