import { Shield, Users, Sparkles, HeartPulse, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const features = [
  {
    icon: Shield,
    title: "Science-Backed Recovery",
    description: "All our therapies are grounded in scientific research and proven methodologies for optimal results.",
  },
  {
    icon: Users,
    title: "Trained Professionals",
    description: "Our certified wellness experts guide you through every session ensuring safety and effectiveness.",
  },
  {
    icon: Sparkles,
    title: "Premium & Hygienic Setup",
    description: "State-of-the-art facilities with the highest standards of cleanliness and comfort.",
  },
  {
    icon: HeartPulse,
    title: "Community-Driven Wellness",
    description: "Join a community of like-minded individuals committed to health and high-performance living.",
  },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "3+", label: "Years Experience" },
  { value: "1000+", label: "Sessions Done" },
  { value: "4.9", label: "Average Rating" },
];

export function WhyChillThrive() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-6">
              <CheckCircle2 className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Experience the{" "}
              <span className="text-primary">ChillThrive</span>{" "}
              Difference
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-10 sm:mb-12 leading-relaxed max-w-xl">
              We're not just another wellness center. We're a movement dedicated to helping 
              you unlock your body's natural healing abilities through the power of temperature therapy.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group relative p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2 text-base sm:text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-3xl" />
            
            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`group relative bg-card border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-center hover:shadow-2xl hover:border-primary/30 transition-all duration-500 ${
                    index % 2 === 1 ? "mt-6 sm:mt-10" : ""
                  } ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${index * 100 + 400}ms` }}
                >
                  {/* Decorative gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-base font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
