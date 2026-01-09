import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: "bounce" | "pulse" | "spin" | "wiggle" | "float" | "none";
  hoverAnimation?: "scale" | "rotate" | "bounce" | "wiggle" | "glow" | "none";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const animationClasses = {
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
  wiggle: "animate-wiggle",
  float: "animate-float",
  none: "",
};

const hoverAnimationClasses = {
  scale: "group-hover:scale-125 transition-transform duration-300",
  rotate: "group-hover:rotate-12 transition-transform duration-300",
  bounce: "group-hover:animate-bounce",
  wiggle: "group-hover:animate-wiggle",
  glow: "group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-300",
  none: "",
};

export function AnimatedIcon({
  icon: Icon,
  className,
  animation = "none",
  hoverAnimation = "scale",
  size = "md",
}: AnimatedIconProps) {
  return (
    <Icon
      className={cn(
        sizeClasses[size],
        animationClasses[animation],
        hoverAnimationClasses[hoverAnimation],
        "transition-all duration-300",
        className
      )}
    />
  );
}
