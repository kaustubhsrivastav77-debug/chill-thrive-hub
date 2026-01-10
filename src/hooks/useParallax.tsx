import { useState, useEffect, useCallback, useRef, RefObject } from "react";

interface ParallaxConfig {
  speed?: number;
  direction?: "up" | "down";
  disabled?: boolean;
}

interface MouseParallaxConfig {
  strength?: number;
  disabled?: boolean;
}

interface ParallaxResult {
  offset: number;
  elementRef: RefObject<HTMLElement | null>;
}

interface MouseParallaxResult {
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
}

export function useParallax({ speed = 0.5, direction = "up", disabled = false }: ParallaxConfig = {}): ParallaxResult {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (disabled) return;

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const multiplier = direction === "up" ? -1 : 1;
        setOffset(scrollY * speed * multiplier);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [speed, direction, disabled]);

  useEffect(() => {
    if (disabled) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, disabled]);

  return { offset, elementRef };
}

export function useMouseParallax({ strength = 0.02, disabled = false }: MouseParallaxConfig = {}): MouseParallaxResult {
  const [position, setPosition] = useState({ x: 0, y: 0, mouseX: 0.5, mouseY: 0.5 });

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setPosition({
        x: x * strength * 100,
        y: y * strength * 100,
        mouseX: e.clientX / window.innerWidth,
        mouseY: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [strength, disabled]);

  return position;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setProgress(Math.min(Math.max(currentProgress, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, elementRef };
}

export function useElementInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementProgress = 1 - (rect.top / windowHeight);
      setScrollProgress(Math.min(Math.max(elementProgress, 0), 2));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return { isInView, scrollProgress, elementRef };
}

// Hook for parallax images that tracks element position
export function useImageParallax(speed = 0.3) {
  const [transform, setTransform] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const offset = (elementCenter - viewportCenter) * speed;
      
      setTransform(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { transform, elementRef };
}
