import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Snowflake, 
  Waves, 
  CloudFog, 
  Sparkles, 
  Clock, 
  Check,
  ArrowRight 
} from "lucide-react";
import iceBathImage from "@/assets/ice-bath-service.jpg";
import jacuzziImage from "@/assets/jacuzzi-therapy.jpg";
import steamImage from "@/assets/steam-bath.jpg";

const services = [
  {
    id: "ice-bath",
    title: "Ice Bath Therapy",
    description: "Cold immersion therapy designed to reduce inflammation, improve circulation, and enhance mental toughness. Experience the power of controlled cold exposure.",
    icon: Snowflake,
    image: iceBathImage,
    duration: "30 min / 60 min",
    price: "₹1,500",
    benefits: [
      "Muscle recovery & reduced soreness",
      "Improved blood circulation",
      "Enhanced mental focus",
      "Stress regulation & resilience",
      "Better sleep quality",
    ],
  },
  {
    id: "jacuzzi",
    title: "Jacuzzi Therapy",
    description: "Warm hydrotherapy for muscle relaxation and nervous system calm. Let the soothing warm water jets massage away your tension and stress.",
    icon: Waves,
    image: jacuzziImage,
    duration: "45 min / 90 min",
    price: "₹1,200",
    benefits: [
      "Deep muscle relaxation",
      "Improved blood flow",
      "Stress & anxiety relief",
      "Joint pain reduction",
      "Better flexibility",
    ],
  },
  {
    id: "steam-bath",
    title: "Steam Bath",
    description: "Detoxifying heat therapy for relaxation and respiratory health. Open your pores, cleanse your skin, and breathe easier with therapeutic steam.",
    icon: CloudFog,
    image: steamImage,
    duration: "30 min / 45 min",
    price: "₹800",
    benefits: [
      "Detoxification & cleansing",
      "Skin rejuvenation",
      "Respiratory relief",
      "Mental relaxation",
      "Improved circulation",
    ],
  },
];

const combos = [
  {
    id: "ice-steam",
    title: "Ice + Steam Combo",
    services: ["Ice Bath", "Steam Bath"],
    originalPrice: 2300,
    discountedPrice: 1999,
    duration: "75 min",
    badge: "Popular",
  },
  {
    id: "ice-jacuzzi",
    title: "Ice + Jacuzzi Combo",
    services: ["Ice Bath", "Jacuzzi"],
    originalPrice: 2700,
    discountedPrice: 2299,
    duration: "90 min",
    badge: null,
  },
  {
    id: "full-recovery",
    title: "Full Recovery Combo",
    services: ["Ice Bath", "Steam Bath", "Jacuzzi"],
    originalPrice: 3500,
    discountedPrice: 2999,
    duration: "120 min",
    badge: "Best Value",
  },
];

const ServicesPage = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Premium Recovery Therapies
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose from our range of science-backed wellness services designed 
              to help you recover faster, feel better, and perform at your peak.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                      <service.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {service.price}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-foreground mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild size="lg">
                    <Link to="/booking">
                      Book Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo Packages */}
      <section className="py-20 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Save More
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
              Combo Packages
            </h2>
            <p className="text-muted-foreground text-lg">
              Get the best of multiple therapies at discounted prices with our 
              specially curated combo packages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {combos.map((combo) => (
              <Card
                key={combo.id}
                className="relative border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                {combo.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {combo.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{combo.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    {combo.services.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{combo.duration}</span>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{combo.originalPrice}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      ₹{combo.discountedPrice}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <Link to="/booking">Book This Combo</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
