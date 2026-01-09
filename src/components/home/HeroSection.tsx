import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-ice-bath.jpg";

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Star, value: "4.9", label: "Rating" },
  { icon: Award, value: "3+", label: "Years" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium ice bath therapy session"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/70 to-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-primary-foreground">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 text-sm font-medium mb-6 sm:mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premium Wellness & Recovery Center
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-up">
              Welcome to{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                  Chill Thrive
                </span>
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-xl sm:text-2xl md:text-3xl text-primary-foreground/90 mb-4 animate-slide-up font-medium" style={{ animationDelay: "0.1s" }}>
              Rejuvenate your body. Reset your mind.
            </p>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-primary-foreground/70 mb-8 sm:mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Experience the transformative power of cold & heat therapy. Build resilience, 
              accelerate recovery, and unlock your full potential.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button
                asChild
                size="lg"
                className="text-base px-6 sm:px-8 h-12 sm:h-14 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
              >
                <Link to="/booking">
                  Book a Session
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-6 sm:px-8 h-12 sm:h-14 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
              >
                <Link to="/services">
                  <Play className="mr-2 w-5 h-5" />
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 sm:px-6 py-3 rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl sm:text-2xl font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-xs text-primary-foreground/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-primary-foreground/60 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-primary-foreground/50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
