import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: "lift" | "glow" | "border" | "scale" | "tilt" | "none";
  glowColor?: string;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, children, hoverEffect = "lift", glowColor, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || hoverEffect !== "tilt") return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      setMousePosition({ x, y });
    };

    const hoverClasses = {
      lift: "hover:-translate-y-2 hover:shadow-2xl",
      glow: "hover:shadow-xl hover:shadow-primary/20",
      border: "hover:border-primary/50",
      scale: "hover:scale-[1.02]",
      tilt: "",
      none: "",
    };

    const tiltStyle = hoverEffect === "tilt" && isHovered
      ? {
          transform: `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg) scale(1.02)`,
          transition: "transform 0.1s ease-out",
        }
      : {};

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "group relative rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden transition-all duration-500",
          hoverClasses[hoverEffect],
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        style={tiltStyle}
        {...props}
      >
        {/* Gradient overlay on hover */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
        />
        
        {/* Shine effect */}
        <div 
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none",
            isHovered && "opacity-100"
          )}
          style={{
            background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";
