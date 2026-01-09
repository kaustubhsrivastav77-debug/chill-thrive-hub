import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Snowflake, Waves, CloudFog, Sparkles } from "lucide-react";
import iceBathImage from "@/assets/ice-bath-service.jpg";
import jacuzziImage from "@/assets/jacuzzi-therapy.jpg";
import steamImage from "@/assets/steam-bath.jpg";

const services = [
  {
    id: "ice-bath",
    title: "Ice Bath Therapy",
    description: "Cold immersion therapy to reduce inflammation and enhance mental toughness.",
    icon: Snowflake,
    image: iceBathImage,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "jacuzzi",
    title: "Jacuzzi Therapy",
    description: "Warm hydrotherapy for muscle relaxation and nervous system calm.",
    icon: Waves,
    image: jacuzziImage,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "steam-bath",
    title: "Steam Bath",
    description: "Detoxifying heat therapy for relaxation and respiratory health.",
    icon: CloudFog,
    image: steamImage,
    color: "from-slate-500/20 to-gray-500/20",
  },
  {
    id: "combo",
    title: "Combo Packages",
    description: "Get the best of all therapies with our specially curated combo packages.",
    icon: Sparkles,
    image: iceBathImage,
    color: "from-purple-500/20 to-pink-500/20",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-20 md:py-28 bg-section-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Recovery & Wellness Therapies
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from our range of premium wellness services designed to help you 
            recover, rejuvenate, and thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} to-transparent`} />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                <Link
                  to="/services"
                  className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
