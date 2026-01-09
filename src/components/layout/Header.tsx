import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Snowflake, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/awareness", label: "Learn" },
  { href: "/founder", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const location = useLocation();
  const { user, isStaff, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-foreground/5"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/25">
                <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-foreground leading-tight tracking-tight">
                Chill<span className="text-primary">Thrive</span>
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                Wellness & Recovery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 bg-muted/50 rounded-full p-1 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onMouseEnter={() => setActiveLink(link.href)}
                onMouseLeave={() => setActiveLink(null)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  location.pathname === link.href
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active background */}
                {location.pathname === link.href && (
                  <span className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/25 animate-scale-in" />
                )}
                {/* Hover background */}
                {activeLink === link.href && location.pathname !== link.href && (
                  <span className="absolute inset-0 rounded-full bg-muted animate-fade-in" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* CTA & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 rounded-full hover:bg-muted/80 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:inline max-w-[80px] truncate text-sm">
                      {user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2">
                  {isStaff && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link to="/admin" className="flex items-center gap-3 cursor-pointer py-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                          </div>
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-3 cursor-pointer text-destructive focus:text-destructive py-2.5 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="rounded-full hover:bg-muted/80"
              >
                <Link to="/auth" className="gap-2">
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button 
              asChild 
              size="sm" 
              className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 px-5"
            >
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
              isOpen ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
            )}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <span className={cn(
                "absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300",
                isOpen ? "top-2 rotate-45" : "top-1"
              )} />
              <span className={cn(
                "absolute left-0 top-2 block w-5 h-0.5 bg-current transition-all duration-300",
                isOpen ? "opacity-0 scale-0" : "opacity-100"
              )} />
              <span className={cn(
                "absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300",
                isOpen ? "top-2 -rotate-45" : "top-3"
              )} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-16 md:top-20 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl transition-all duration-500 ease-out",
            isOpen 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-muted/80"
                  )}
                  style={{ 
                    animationDelay: isOpen ? `${index * 50}ms` : "0ms",
                    animation: isOpen ? "fade-in 0.3s ease-out forwards" : "none"
                  }}
                >
                  {location.pathname === link.href && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-4" />
              
              {user ? (
                <div className="space-y-1">
                  {isStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                      </div>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 text-left transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-muted/80 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  Sign In
                </Link>
              )}
              
              <Button 
                asChild 
                className="mt-4 h-12 rounded-xl shadow-lg shadow-primary/20 text-base"
              >
                <Link to="/booking" onClick={() => setIsOpen(false)}>
                  Book a Session
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
