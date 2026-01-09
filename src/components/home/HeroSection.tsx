import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, Award, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-ice-bath.jpg";
import { useEffect, useState } from "react";

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Award, value: "3+", label: "Years" },
];

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 scale-110">
          <img
            src={heroImage}
            alt="Premium ice bath therapy session"
            className="w-full h-full object-cover transition-transform duration-1000"
            style={{ transform: isLoaded ? 'scale(1)' : 'scale(1.1)' }}
          />
        </div>
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-foreground/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--foreground)/0.4)_100%)]" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-[20%] w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 right-[10%] w-28 h-28 rounded-full bg-accent/15 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-primary-foreground">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 text-sm font-medium mb-6 sm:mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Premium Wellness & Recovery Center
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            
            {/* Heading */}
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Welcome to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer">
                  Chill Thrive
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary/30 to-accent/30 blur-lg" />
              </span>
            </h1>
            
            {/* Tagline */}
            <p 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary-foreground/90 mb-4 font-semibold tracking-tight transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Rejuvenate your body. Reset your mind.
            </p>
            
            {/* Description */}
            <p 
              className={`text-base sm:text-lg md:text-xl text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Experience the transformative power of cold & heat therapy. Build resilience, 
              accelerate recovery, and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Button
                asChild
                size="lg"
                className="group relative text-base px-8 sm:px-10 h-14 sm:h-16 shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 overflow-hidden rounded-full"
              >
                <Link to="/booking">
                  <span className="relative z-10 flex items-center gap-2">
                    Book a Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group text-base px-8 sm:px-10 h-14 sm:h-16 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/40 backdrop-blur-sm rounded-full transition-all duration-300"
              >
                <Link to="/services">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div 
            className={`mt-14 sm:mt-20 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-3 sm:gap-4 px-5 sm:px-8 py-4 sm:py-5 rounded-2xl bg-primary-foreground/5 backdrop-blur-md border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-primary-foreground/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-primary-foreground/50 text-xs uppercase tracking-[0.25em] font-medium">Scroll to explore</span>
        <div className="relative w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center overflow-hidden">
          <div className="w-1 h-3 rounded-full bg-primary-foreground/60 mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
