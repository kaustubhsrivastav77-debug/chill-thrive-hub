import { useRef, useState, useEffect } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  className?: string;
  variant?: "default" | "cards" | "minimal";
}

export function StatsSection({ stats, className, variant = "default" }: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (variant === "cards") {
    return (
      <div ref={ref} className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6", className)}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
              {isVisible && (
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2000 + index * 200}
                  startOnView={false}
                />
              )}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div ref={ref} className={cn("flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16", className)}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "text-center transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-2">
              {isVisible && (
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2000 + index * 200}
                  startOnView={false}
                />
              )}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={ref} className={cn("grid grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "group flex items-center gap-4 p-5 rounded-2xl bg-muted/50 hover:bg-muted transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <stat.icon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {isVisible && (
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2000 + index * 200}
                  startOnView={false}
                />
              )}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
