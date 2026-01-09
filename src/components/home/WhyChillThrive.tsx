import { Shield, Users, Sparkles, HeartPulse } from "lucide-react";

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

export function WhyChillThrive() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
              Experience the ChillThrive Difference
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              We're not just another wellness center. We're a movement dedicated to helping 
              you unlock your body's natural healing abilities through the power of temperature therapy.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "3+", label: "Years Experience" },
              { value: "1000+", label: "Sessions Done" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
