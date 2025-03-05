
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          Portfolio
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium tracking-wide transition-all hover:text-primary/80",
              isActive('/') && "text-primary border-b-2 border-primary"
            )}
          >
            Accueil
          </Link>
          <Link 
            to="/gallery" 
            className={cn(
              "text-sm font-medium tracking-wide transition-all hover:text-primary/80",
              isActive('/gallery') && "text-primary border-b-2 border-primary"
            )}
          >
            Galerie
          </Link>
          <Link 
            to="/admin" 
            className={cn(
              "text-sm font-medium tracking-wide transition-all hover:text-primary/80",
              isActive('/admin') && "text-primary border-b-2 border-primary"
            )}
          >
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-md animate-fade-in">
          <nav className="container mx-auto py-6 px-6 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={cn(
                "text-lg py-2 border-b border-border/30",
                isActive('/') && "text-primary font-medium"
              )}
            >
              Accueil
            </Link>
            <Link 
              to="/gallery" 
              className={cn(
                "text-lg py-2 border-b border-border/30",
                isActive('/gallery') && "text-primary font-medium"
              )}
            >
              Galerie
            </Link>
            <Link 
              to="/admin" 
              className={cn(
                "text-lg py-2 border-b border-border/30",
                isActive('/admin') && "text-primary font-medium"
              )}
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
