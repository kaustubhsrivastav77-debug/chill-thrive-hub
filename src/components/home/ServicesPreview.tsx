import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Snowflake, Waves, CloudFog, Sparkles, Clock, IndianRupee } from "lucide-react";
import iceBathImage from "@/assets/ice-bath-service.jpg";
import jacuzziImage from "@/assets/jacuzzi-therapy.jpg";
import steamImage from "@/assets/steam-bath.jpg";

const services = [
  {
    id: "ice-bath",
    title: "Ice Bath Therapy",
    description: "Cold immersion therapy to reduce inflammation, boost immunity and enhance mental toughness.",
    icon: Snowflake,
    image: iceBathImage,
    duration: "15-20 min",
    price: "₹499",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "jacuzzi",
    title: "Jacuzzi Therapy",
    description: "Warm hydrotherapy for deep muscle relaxation and nervous system restoration.",
    icon: Waves,
    image: jacuzziImage,
    duration: "30 min",
    price: "₹599",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "steam-bath",
    title: "Steam Bath",
    description: "Detoxifying heat therapy for skin health, relaxation and respiratory wellness.",
    icon: CloudFog,
    image: steamImage,
    duration: "20 min",
    price: "₹399",
    gradient: "from-slate-600 to-gray-500",
  },
  {
    id: "combo",
    title: "Combo Packages",
    description: "Experience the ultimate contrast therapy with our curated wellness combinations.",
    icon: Sparkles,
    image: iceBathImage,
    duration: "60+ min",
    price: "₹999",
    gradient: "from-purple-600 to-pink-500",
  },
];

export function ServicesPreview() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Recovery & Wellness Therapies
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose from our range of premium wellness services designed to help you 
            recover faster, rejuvenate deeper, and thrive stronger.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-card"
            >
              {/* Image */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className={`absolute top-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}>
                  <service.icon className="w-5 h-5 text-white" />
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm text-sm font-bold text-foreground">
                  {service.price}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-primary font-medium text-sm group/link"
                  >
                    Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <Button asChild size="lg" className="shadow-lg">
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
