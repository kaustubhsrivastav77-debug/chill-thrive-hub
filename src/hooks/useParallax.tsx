import { useState, useEffect, useCallback, useRef } from "react";

interface ParallaxConfig {
  speed?: number;
  direction?: "up" | "down";
  disabled?: boolean;
}

export function useParallax({ speed = 0.5, direction = "up", disabled = false }: ParallaxConfig = {}) {
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
