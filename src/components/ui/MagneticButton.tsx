import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

interface MagneticButtonProps extends ButtonProps {
  strength?: number;
  magneticStrength?: number;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, children, strength = 0.4, magneticStrength = 0.15, ...props }, ref) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [textPosition, setTextPosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;
      
      const textDistanceX = (e.clientX - centerX) * magneticStrength;
      const textDistanceY = (e.clientY - centerY) * magneticStrength;
      
      setPosition({ x: distanceX, y: distanceY });
      setTextPosition({ x: textDistanceX, y: textDistanceY });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
      setTextPosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    return (
      <Button
        ref={(node) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "relative overflow-hidden transition-[transform,box-shadow] duration-300 ease-out",
          isHovered && "shadow-xl",
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Magnetic glow effect */}
        <span
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-r from-primary-foreground/10 to-transparent",
            isHovered && "opacity-100"
          )}
          style={{
            transform: `translate(${textPosition.x * 2}px, ${textPosition.y * 2}px)`,
          }}
        />
        
        {/* Content with magnetic effect */}
        <span
          className="relative z-10 flex items-center gap-2 transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
          }}
        >
          {children}
        </span>
      </Button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

// Simple magnetic wrapper for any element
interface MagneticWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: number;
  children: React.ReactNode;
}

export const MagneticWrapper = React.forwardRef<HTMLDivElement, MagneticWrapperProps>(
  ({ className, children, strength = 0.3, ...props }, ref) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!wrapperRef.current) return;
      
      const rect = wrapperRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;
      
      setPosition({ x: distanceX, y: distanceY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <div
        ref={(node) => {
          (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("transition-transform duration-300 ease-out", className)}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MagneticWrapper.displayName = "MagneticWrapper";
