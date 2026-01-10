import * as React from "react";
import { cn } from "@/lib/utils";

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: "lift" | "glow" | "border" | "scale" | "tilt" | "magnetic" | "none";
  glowColor?: string;
  tiltStrength?: number;
  magneticStrength?: number;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ 
    className, 
    children, 
    hoverEffect = "lift", 
    glowColor, 
    tiltStrength = 10,
    magneticStrength = 0.15,
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
    const [isHovered, setIsHovered] = React.useState(false);
    const [magneticOffset, setMagneticOffset] = React.useState({ x: 0, y: 0 });
    const cardRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
      
      // Magnetic effect
      if (hoverEffect === "magnetic") {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMagneticOffset({
          x: (e.clientX - centerX) * magneticStrength,
          y: (e.clientY - centerY) * magneticStrength,
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0.5, y: 0.5 });
      setMagneticOffset({ x: 0, y: 0 });
    };

    const hoverClasses = {
      lift: "hover:-translate-y-2 hover:shadow-2xl",
      glow: "hover:shadow-xl hover:shadow-primary/20",
      border: "hover:border-primary/50",
      scale: "hover:scale-[1.02]",
      tilt: "",
      magnetic: "",
      none: "",
    };

    const getTransformStyle = (): React.CSSProperties => {
      if (!isHovered) return {};
      
      switch (hoverEffect) {
        case "tilt":
          return {
            transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -tiltStrength}deg) rotateY(${(mousePosition.x - 0.5) * tiltStrength}deg) scale(1.02)`,
            transition: "transform 0.15s ease-out",
          };
        case "magnetic":
          return {
            transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px) scale(1.01)`,
            transition: "transform 0.2s ease-out",
          };
        default:
          return {};
      }
    };

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "group relative rounded-xl border bg-card text-card-foreground shadow-lg overflow-hidden transition-all duration-300",
          hoverClasses[hoverEffect],
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={getTransformStyle()}
        {...props}
      >
        {/* Gradient overlay on hover */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovered && "opacity-100"
          )}
        />
        
        {/* Spotlight/shine effect following cursor */}
        <div 
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
            isHovered && "opacity-100"
          )}
          style={{
            background: `radial-gradient(circle 200px at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--primary) / 0.15) 0%, transparent 70%)`,
          }}
        />
        
        {/* Border glow effect */}
        {isHovered && (hoverEffect === "glow" || hoverEffect === "tilt" || hoverEffect === "magnetic") && (
          <div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--primary) / 0.3) 0%, transparent 50%)`,
              opacity: 0.5,
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";

// Parallax Image Card with built-in parallax effect
interface ParallaxImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  parallaxSpeed?: number;
}

export const ParallaxImageCard = React.forwardRef<HTMLDivElement, ParallaxImageCardProps>(
  ({ className, children, imageSrc, imageAlt, parallaxSpeed = 0.2, ...props }, ref) => {
    const [transform, setTransform] = React.useState(0);
    const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });
    const [isHovered, setIsHovered] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleScroll = () => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offset = (elementCenter - viewportCenter) * parallaxSpeed;
        
        setTransform(offset);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }, [parallaxSpeed]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    return (
      <div
        ref={(node) => {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Parallax Image */}
        <div className="relative overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700"
            style={{
              transform: `translateY(${transform}px) scale(${isHovered ? 1.05 : 1.02})`,
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Cursor follow spotlight */}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300 pointer-events-none",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(circle 150px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 70%)`,
            }}
          />
        </div>
        
        {/* Content */}
        {children}
      </div>
    );
  }
);

ParallaxImageCard.displayName = "ParallaxImageCard";
