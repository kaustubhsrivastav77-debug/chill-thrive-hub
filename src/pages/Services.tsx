import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ServiceCardSkeleton } from "@/components/ui/PageSkeleton";
import { InteractiveCard, ParallaxImageCard } from "@/components/ui/InteractiveCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useMouseParallax } from "@/hooks/useParallax";
import { 
  Snowflake, 
  Waves, 
  CloudFog, 
  Sparkles, 
  Clock, 
  Check,
  ArrowRight,
  Star
} from "lucide-react";
import iceBathImage from "@/assets/ice-bath-service.jpg";
import jacuzziImage from "@/assets/jacuzzi-therapy.jpg";
import steamImage from "@/assets/steam-bath.jpg";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  duration_minutes: number;
  benefits: string[] | null;
  badge: string | null;
  is_combo: boolean | null;
  image_url: string | null;
}

const fallbackServices = [
  {
    id: "ice-bath",
    name: "Ice Bath Therapy",
    description: "Cold immersion therapy designed to reduce inflammation, improve circulation, and enhance mental toughness. Experience the power of controlled cold exposure.",
    price: 1500,
    original_price: null,
    duration_minutes: 60,
    benefits: ["Muscle recovery & reduced soreness", "Improved blood circulation", "Enhanced mental focus", "Stress regulation & resilience", "Better sleep quality"],
    badge: null,
    is_combo: false,
    image_url: null,
  },
  {
    id: "jacuzzi",
    name: "Jacuzzi Therapy",
    description: "Warm hydrotherapy for muscle relaxation and nervous system calm. Let the soothing warm water jets massage away your tension and stress.",
    price: 1200,
    original_price: null,
    duration_minutes: 45,
    benefits: ["Deep muscle relaxation", "Improved blood flow", "Stress & anxiety relief", "Joint pain reduction", "Better flexibility"],
    badge: null,
    is_combo: false,
    image_url: null,
  },
  {
    id: "steam-bath",
    name: "Steam Bath",
    description: "Detoxifying heat therapy for relaxation and respiratory health. Open your pores, cleanse your skin, and breathe easier with therapeutic steam.",
    price: 800,
    original_price: null,
    duration_minutes: 30,
    benefits: ["Detoxification & cleansing", "Skin rejuvenation", "Respiratory relief", "Mental relaxation", "Improved circulation"],
    badge: null,
    is_combo: false,
    image_url: null,
  },
];

const getServiceIcon = (name: string) => {
  if (name.toLowerCase().includes("ice")) return Snowflake;
  if (name.toLowerCase().includes("jacuzzi")) return Waves;
  if (name.toLowerCase().includes("steam")) return CloudFog;
  return Sparkles;
};

const getServiceImage = (name: string, imageUrl: string | null) => {
  if (imageUrl) return imageUrl;
  if (name.toLowerCase().includes("ice")) return iceBathImage;
  if (name.toLowerCase().includes("jacuzzi")) return jacuzziImage;
  if (name.toLowerCase().includes("steam")) return steamImage;
  return iceBathImage;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [combos, setCombos] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mouseParallax = useMouseParallax({ strength: 0.01 });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (data && data.length > 0) {
      setServices(data.filter((s) => !s.is_combo));
      setCombos(data.filter((s) => s.is_combo));
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      {/* Hero with parallax */}
      <section className="relative py-16 sm:py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        {/* Parallax background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            style={{ transform: `translate(${mouseParallax.x}px, ${mouseParallax.y}px)` }}
          />
          <div 
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
            style={{ transform: `translate(${-mouseParallax.x}px, ${-mouseParallax.y}px)` }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4"
              style={{ transform: `translateY(${mouseParallax.y * 0.5}px)` }}
            >
              <Star className="w-3.5 h-3.5" />
              Our Services
            </span>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
              style={{ transform: `translateY(${mouseParallax.y * 0.3}px)` }}
            >
              Premium Recovery Therapies
            </h1>
            <p 
              className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
              style={{ transform: `translateY(${mouseParallax.y * 0.2}px)` }}
            >
              Choose from our range of science-backed wellness services designed 
              to help you recover faster, feel better, and perform at your peak.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-16 sm:space-y-20 md:space-y-24">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  <ServiceCardSkeleton />
                  <div className="space-y-4">
                    <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-32 bg-muted rounded animate-pulse mt-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="space-y-16 sm:space-y-20 md:space-y-24">
            {services.map((service, index) => {
              const IconComponent = getServiceIcon(service.name);
              const image = getServiceImage(service.name, service.image_url);
              
              return (
                <div
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <ParallaxImageCard
                      imageSrc={image}
                      imageAlt={service.name}
                      parallaxSpeed={0.15}
                    >
                      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg z-20">
                        <IconComponent className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                      </div>
                      {service.badge && (
                        <Badge className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-accent z-20">
                          {service.badge}
                        </Badge>
                      )}
                    </ParallaxImageCard>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {service.name}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                        <Clock className="w-5 h-5" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {service.original_price && (
                          <span className="text-muted-foreground line-through text-lg">
                            ₹{service.original_price}
                          </span>
                        )}
                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                          ₹{service.price}
                        </span>
                      </div>
                    </div>

                    {service.benefits && service.benefits.length > 0 && (
                      <div className="mb-8">
                        <h4 className="font-semibold text-foreground mb-3">Benefits:</h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {service.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-muted-foreground text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <MagneticButton asChild size="lg" className="shadow-lg">
                      <Link to="/booking">
                        Book Now
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </MagneticButton>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* Combo Packages */}
      {combos.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Save More
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Combo Packages
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Get the best of multiple therapies at discounted prices with our 
                specially curated combo packages.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {combos.map((combo, index) => (
                <InteractiveCard
                  key={combo.id}
                  hoverEffect="tilt"
                  className={`relative border-0 shadow-xl ${
                    index === 1 ? "lg:scale-105 lg:shadow-2xl" : ""
                  }`}
                >
                  {combo.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent shadow-lg">
                      {combo.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{combo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {combo.benefits && combo.benefits.length > 0 && (
                      <div className="space-y-2">
                        {combo.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-center gap-2 text-muted-foreground">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{combo.duration_minutes} min</span>
                    </div>

                    <div className="text-center">
                      {combo.original_price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{combo.original_price}
                        </div>
                      )}
                      <div className="text-3xl sm:text-4xl font-bold text-primary">
                        ₹{combo.price}
                      </div>
                    </div>

                    <MagneticButton asChild className="w-full h-12 shadow-md">
                      <Link to="/booking">Book This Combo</Link>
                    </MagneticButton>
                  </CardContent>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback Combos if none from DB */}
      {combos.length === 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Save More
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Combo Packages
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                Get the best of multiple therapies at discounted prices.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { id: "1", name: "Ice + Steam Combo", services: ["Ice Bath", "Steam Bath"], originalPrice: 2300, price: 1999, duration: 75, badge: "Popular" },
                { id: "2", name: "Ice + Jacuzzi Combo", services: ["Ice Bath", "Jacuzzi"], originalPrice: 2700, price: 2299, duration: 90, badge: null },
                { id: "3", name: "Full Recovery Combo", services: ["Ice Bath", "Steam", "Jacuzzi"], originalPrice: 3500, price: 2999, duration: 120, badge: "Best Value" },
              ].map((combo, index) => (
                <InteractiveCard
                  key={combo.id}
                  hoverEffect="tilt"
                  className={`relative border-0 shadow-xl ${
                    index === 2 ? "lg:scale-105 lg:shadow-2xl" : ""
                  }`}
                >
                  {combo.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent shadow-lg">
                      {combo.badge}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl">{combo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      {combo.services.map((s) => (
                        <div key={s} className="flex items-center gap-2 text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{s}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/50 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{combo.duration} min</span>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground line-through">
                        ₹{combo.originalPrice}
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-primary">
                        ₹{combo.price}
                      </div>
                    </div>

                    <MagneticButton asChild className="w-full h-12 shadow-md">
                      <Link to="/booking">Book This Combo</Link>
                    </MagneticButton>
                  </CardContent>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ServicesPage;
