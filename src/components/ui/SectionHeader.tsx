import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge, 
  align = "center",
  className 
}: SectionHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "flex flex-col gap-4 mb-12",
        alignmentClasses[align],
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <span 
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-700",
            "bg-primary/10 text-primary border border-primary/20",
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </span>
      )}

      {/* Title with animated underline */}
      <div className="relative">
        <h2 
          className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold text-foreground transition-all duration-700",
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-6"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          {title}
        </h2>
        
        {/* Animated underline */}
        <div 
          className={cn(
            "absolute -bottom-3 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-1000 ease-out",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "left" && "left-0",
            align === "right" && "right-0",
            isVisible ? "w-24 opacity-100" : "w-0 opacity-0"
          )}
          style={{ transitionDelay: "300ms" }}
        />
        
        {/* Glow effect */}
        <div 
          className={cn(
            "absolute -bottom-3 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary blur-md transition-all duration-1000 ease-out",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "left" && "left-0",
            align === "right" && "right-0",
            isVisible ? "w-24 opacity-60" : "w-0 opacity-0"
          )}
          style={{ transitionDelay: "300ms" }}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p 
          className={cn(
            "text-lg text-muted-foreground max-w-2xl mt-2 transition-all duration-700",
            isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
