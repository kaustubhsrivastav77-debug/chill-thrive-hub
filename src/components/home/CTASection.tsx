import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, Phone, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const benefits = [
  "No commitment required",
  "Expert guidance",
  "Flexible scheduling",
  "Premium facilities",
];

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground text-sm font-semibold mb-8 sm:mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4" />
            Start Your Transformation Today
          </div>
          
          {/* Heading */}
          <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 sm:mb-8 leading-tight transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Ready to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Thrive</span>
              <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-primary-foreground/20 -rotate-1 rounded-sm" />
            </span>
            ?
          </h2>
          
          {/* Description */}
          <p className={`text-lg sm:text-xl md:text-2xl text-primary-foreground/80 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Join hundreds of wellness enthusiasts who have transformed their lives 
            through the power of cold & heat therapy. Your path to resilience begins here.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mb-12 sm:mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button
              asChild
              size="lg"
              className="group bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 shadow-2xl rounded-full transition-all duration-300"
            >
              <Link to="/booking" className="gap-2">
                <Calendar className="w-5 h-5" />
                Book Your First Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 rounded-full transition-all duration-300"
            >
              <Link to="/contact" className="gap-2">
                <Phone className="w-5 h-5" />
                Talk to Us
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className={`flex flex-wrap justify-center gap-x-8 gap-y-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {benefits.map((benefit, index) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 text-primary-foreground/80 text-sm sm:text-base"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="w-5 h-5 text-primary-foreground/60" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
