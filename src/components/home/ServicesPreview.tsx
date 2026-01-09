import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Snowflake, Waves, CloudFog, Sparkles, Clock, Star } from "lucide-react";
import iceBathImage from "@/assets/ice-bath-service.jpg";
import jacuzziImage from "@/assets/jacuzzi-therapy.jpg";
import steamImage from "@/assets/steam-bath.jpg";
import { useEffect, useState, useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const services = [
  {
    id: "ice-bath",
    title: "Ice Bath Therapy",
    description: "Cold immersion therapy to reduce inflammation, boost immunity and enhance mental toughness.",
    icon: Snowflake,
    image: iceBathImage,
    duration: "15-20 min",
    price: "₹499",
    rating: 4.9,
    gradient: "from-primary to-accent",
    popular: true,
  },
  {
    id: "jacuzzi",
    title: "Jacuzzi Therapy",
    description: "Warm hydrotherapy for deep muscle relaxation and nervous system restoration.",
    icon: Waves,
    image: jacuzziImage,
    duration: "30 min",
    price: "₹599",
    rating: 4.8,
    gradient: "from-amber-500 to-orange-500",
    popular: false,
  },
  {
    id: "steam-bath",
    title: "Steam Bath",
    description: "Detoxifying heat therapy for skin health, relaxation and respiratory wellness.",
    icon: CloudFog,
    image: steamImage,
    duration: "20 min",
    price: "₹399",
    rating: 4.7,
    gradient: "from-slate-500 to-slate-600",
    popular: false,
  },
  {
    id: "combo",
    title: "Combo Packages",
    description: "Experience the ultimate contrast therapy with our curated wellness combinations.",
    icon: Sparkles,
    image: iceBathImage,
    duration: "60+ min",
    price: "₹999",
    rating: 5.0,
    gradient: "from-purple-500 to-pink-500",
    popular: true,
  },
];

export function ServicesPreview() {
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
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-muted/30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <SectionHeader
          badge="Our Premium Services"
          title="Recovery & Wellness Therapies"
          subtitle="Choose from our range of premium wellness services designed to help you recover faster, rejuvenate deeper, and thrive stronger."
        />

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`group relative overflow-hidden border border-border/50 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] font-bold text-primary-foreground uppercase tracking-wider shadow-lg">
                  Popular
                </div>
              )}
              
              {/* Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay that works in both light and dark mode */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                
                {/* Icon Badge */}
                <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-card border border-border shadow-lg">
                  <span className="text-lg font-bold text-foreground">{service.price}</span>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 sm:p-6">
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-foreground">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm group/link hover:gap-2 transition-all"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 sm:mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 px-8 h-14 text-base">
            <Link to="/services" className="gap-2">
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
