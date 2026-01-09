import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Snowflake, User, LogOut, LayoutDashboard, ChevronDown, Moon, Sun } from "lucide-react";
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
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const { user, isStaff, signOut } = useAuth();

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

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

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-foreground/5"
          : "bg-gradient-to-b from-foreground/20 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/30">
                <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-lg sm:text-xl font-bold leading-tight tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-primary-foreground"
              )}>
                Chill<span className="text-primary">Thrive</span>
              </span>
              <span className={cn(
                "hidden sm:block text-[10px] uppercase tracking-[0.2em] transition-colors",
                scrolled ? "text-muted-foreground" : "text-primary-foreground/70"
              )}>
                Wellness & Recovery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center">
            <div className={cn(
              "flex items-center gap-1 rounded-full p-1.5 transition-all duration-300",
              scrolled ? "bg-muted/60 backdrop-blur-sm" : "bg-primary-foreground/10 backdrop-blur-md"
            )}>
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
                      : scrolled 
                        ? "text-muted-foreground hover:text-foreground" 
                        : "text-primary-foreground/80 hover:text-primary-foreground"
                  )}
                >
                  {/* Active background */}
                  {location.pathname === link.href && (
                    <span className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30" style={{ animation: "scale-in 0.2s ease-out" }} />
                  )}
                  {/* Hover background */}
                  {activeLink === link.href && location.pathname !== link.href && (
                    <span className={cn(
                      "absolute inset-0 rounded-full transition-colors",
                      scrolled ? "bg-muted" : "bg-primary-foreground/10"
                    )} style={{ animation: "fade-in 0.2s ease-out" }} />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                scrolled 
                  ? "bg-muted hover:bg-muted/80 text-foreground" 
                  : "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              )}
              aria-label="Toggle theme"
            >
              <Sun className={cn(
                "w-5 h-5 absolute transition-all duration-500",
                isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
              )} />
              <Moon className={cn(
                "w-5 h-5 absolute transition-all duration-500",
                isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
              )} />
            </button>

            {/* Auth Dropdown / Sign In - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "gap-2 rounded-full transition-colors h-10 px-3",
                        scrolled 
                          ? "hover:bg-muted/80" 
                          : "text-primary-foreground hover:bg-primary-foreground/10"
                      )}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden lg:inline max-w-[80px] truncate text-sm">
                        {user.email?.split("@")[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                    <div className="px-3 py-2 mb-2 border-b border-border">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Logged in</p>
                    </div>
                    {isStaff && (
                      <>
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                          <Link to="/admin" className="flex items-center gap-3 py-2.5">
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
                  className={cn(
                    "rounded-full h-10 px-4",
                    scrolled 
                      ? "hover:bg-muted/80" 
                      : "text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  <Link to="/auth" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild 
                size="sm" 
                className="rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 px-5 h-10"
              >
                <Link to="/booking">Book Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
                isOpen 
                  ? "bg-primary text-primary-foreground" 
                  : scrolled 
                    ? "text-foreground hover:bg-muted" 
                    : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span className={cn(
                  "absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-out",
                  isOpen ? "top-[9px] rotate-45" : "top-1"
                )} />
                <span className={cn(
                  "absolute left-0 top-[9px] block h-0.5 bg-current transition-all duration-200",
                  isOpen ? "w-0 opacity-0" : "w-4 opacity-100"
                )} />
                <span className={cn(
                  "absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ease-out",
                  isOpen ? "top-[9px] -rotate-45" : "top-[17px]"
                )} />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 bg-background/98 backdrop-blur-xl transition-all duration-500 ease-out overflow-y-auto",
            isOpen 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 -translate-y-8 pointer-events-none"
          )}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "relative px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-muted/80"
                  )}
                  style={{ 
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateX(0)" : "translateX(-20px)",
                    transition: `all 0.3s ease-out ${index * 50}ms`
                  }}
                >
                  {location.pathname === link.href && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-r-full" />
                  )}
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-border my-4" />
              
              {user ? (
                <div className="space-y-2">
                  <div className="px-5 py-3 rounded-2xl bg-muted/50">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Logged in</p>
                  </div>
                  {isStaff && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-foreground hover:bg-muted/80 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                      </div>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-lg font-medium text-destructive hover:bg-destructive/10 text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-foreground hover:bg-muted/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  Sign In / Sign Up
                </Link>
              )}
              
              <Button 
                asChild 
                className="mt-4 h-14 rounded-2xl shadow-lg shadow-primary/25 text-lg font-semibold"
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
