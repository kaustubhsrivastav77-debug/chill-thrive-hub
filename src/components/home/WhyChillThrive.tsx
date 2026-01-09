import { Shield, Users, Sparkles, HeartPulse, CheckCircle2 } from "lucide-react";

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
  return (
    <section className="py-16 sm:py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Experience the{" "}
              <span className="text-primary">ChillThrive</span>{" "}
              Difference
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              We're not just another wellness center. We're a movement dedicated to helping 
              you unlock your body's natural healing abilities through the power of temperature therapy.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group flex gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-3xl" />
            
            <div className="relative grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-card border border-border rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl hover:border-primary/30 transition-all duration-300 ${
                    index % 2 === 1 ? "mt-6 sm:mt-8" : ""
                  }`}
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
