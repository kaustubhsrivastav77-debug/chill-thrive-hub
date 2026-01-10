import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, Award, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-ice-bath.jpg";
import logo from "@/assets/logo.png";
import { useEffect, useState, useCallback } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Happy Clients" },
  { icon: Star, value: 4.9, suffix: "", decimals: 1, label: "Rating" },
  { icon: Award, value: 3, suffix: "+", label: "Years" },
];

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Parallax scroll effect
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Calculate parallax transforms
  const bgParallax = scrollY * 0.5;
  const contentParallax = scrollY * 0.2;
  const floatParallax = scrollY * 0.3;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${bgParallax}px) scale(${1 + scrollY * 0.0005})`,
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 scale-110">
          <img
            src={heroImage}
            alt="Premium ice bath therapy session"
            className="w-full h-full object-cover transition-transform duration-1000"
            style={{ 
              transform: `scale(${isLoaded ? 1 : 1.1}) translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        </div>
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full bg-primary/30 blur-3xl animate-float"
          style={{ transform: `translate(${mousePosition.x * 20}px, ${-floatParallax + mousePosition.y * 20}px)` }}
        />
        <div 
          className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-accent/30 blur-3xl animate-float"
          style={{ 
            animationDelay: "1s",
            transform: `translate(${mousePosition.x * -15}px, ${-floatParallax * 0.8 + mousePosition.y * 15}px)` 
          }}
        />
        <div 
          className="absolute bottom-1/4 left-[20%] w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-float"
          style={{ 
            animationDelay: "2s",
            transform: `translate(${mousePosition.x * 25}px, ${-floatParallax * 0.6 + mousePosition.y * 25}px)` 
          }}
        />
        <div 
          className="absolute bottom-1/3 right-[10%] w-28 h-28 rounded-full bg-accent/25 blur-3xl animate-float"
          style={{ 
            animationDelay: "1.5s",
            transform: `translate(${mousePosition.x * -20}px, ${-floatParallax * 0.7 + mousePosition.y * 20}px)` 
          }}
        />
        {/* Additional parallax particles */}
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          style={{ transform: `translate(-50%, -50%) translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)` }}
        />
      </div>

      {/* Content with Parallax */}
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-12"
        style={{
          transform: `translateY(${contentParallax}px)`,
          opacity: Math.max(0, 1 - scrollY * 0.002),
          willChange: "transform, opacity",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            {/* Logo */}
            <div 
              className={`mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <img 
                src={logo} 
                alt="Chill Thrive Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
              />
            </div>
            
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transform: `translateY(${isLoaded ? mousePosition.y * 5 : 16}px)` }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-white">Premium Ice Bath Center</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            
            {/* Heading with parallax */}
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transform: `translateY(${mousePosition.y * 3}px)` }}
            >
              <span className="text-white">Welcome to</span>{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer">
                  Chill Thrive
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary/40 to-accent/40 blur-lg" />
              </span>
            </h1>
            
            {/* Tagline */}
            <p 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 mb-5 font-semibold tracking-tight transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Rejuvenate your body. Reset your mind.
            </p>
            
            {/* Description */}
            <p 
              className={`text-base sm:text-lg md:text-xl text-white/80 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Experience the transformative power of cold & heat therapy. Build resilience, 
              accelerate recovery, and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Button
                asChild
                size="lg"
                className="group relative text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 overflow-hidden rounded-full"
              >
                <Link to="/booking">
                  <span className="relative z-10 flex items-center gap-2">
                    Book a Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="group text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm rounded-full transition-all duration-300"
              >
                <Link to="/services">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Bar with animated counters */}
          <div 
            className={`mt-16 sm:mt-20 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 hover:scale-105 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transform: `translateY(${mousePosition.y * (2 + index)}px)`,
                  }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      <AnimatedCounter 
                        end={stat.value} 
                        suffix={stat.suffix} 
                        decimals={stat.decimals || 0}
                        duration={2000}
                      />
                    </p>
                    <p className="text-xs sm:text-sm text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with parallax fade */}
      <div 
        className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-3 transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          opacity: Math.max(0, 1 - scrollY * 0.01),
          transform: `translateX(-50%) translateY(${scrollY * 0.3}px)`,
        }}
      >
        <span className="text-white/60 text-xs uppercase tracking-[0.25em] font-medium">Scroll to explore</span>
        <div className="relative w-6 h-10 rounded-full border-2 border-white/40 flex justify-center overflow-hidden">
          <div className="w-1 h-3 rounded-full bg-white/70 mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
