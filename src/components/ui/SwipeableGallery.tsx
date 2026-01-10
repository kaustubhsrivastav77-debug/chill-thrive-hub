import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface SwipeableGalleryProps {
  images: {
    id: string;
    url: string;
    title?: string | null;
    description?: string | null;
    category?: string;
  }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export function SwipeableGallery({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  onIndexChange,
}: SwipeableGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const initialPinchDistanceRef = useRef(0);
  const initialScaleRef = useRef(1);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  
  const haptic = useHapticFeedback();

  // Reset state when opening or changing images
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 5));
    haptic.light();
  };

  const zoomOut = () => {
    const newScale = scale / 1.5;
    if (newScale <= 1) {
      resetZoom();
    } else {
      setScale(newScale);
    }
    haptic.light();
  };

  const goToPrevious = () => {
    if (scale > 1) {
      resetZoom();
      return;
    }
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    haptic.selection();
  };

  const goToNext = () => {
    if (scale > 1) {
      resetZoom();
      return;
    }
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    haptic.selection();
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      setIsZooming(true);
      initialPinchDistanceRef.current = getTouchDistance(e.touches);
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      // Single touch - drag or swipe
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      lastTouchRef.current = touchStartRef.current;
      lastTimeRef.current = Date.now();
      velocityRef.current = { x: 0, y: 0 };
    }
  }, [scale]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isZooming) {
      // Pinch zoom
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scaleChange = currentDistance / initialPinchDistanceRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleChange, 1), 5);
      setScale(newScale);
      
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - lastTouchRef.current.x;
      const deltaY = currentY - lastTouchRef.current.y;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTimeRef.current;
      
      if (timeDelta > 0) {
        velocityRef.current = {
          x: deltaX / timeDelta,
          y: deltaY / timeDelta,
        };
      }
      
      lastTouchRef.current = { x: currentX, y: currentY };
      lastTimeRef.current = currentTime;

      if (scale > 1) {
        // Pan when zoomed
        e.preventDefault();
        setPosition((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
      }
    }
  }, [isDragging, isZooming, scale]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isZooming && e.touches.length < 2) {
      setIsZooming(false);
      if (scale <= 1) {
        resetZoom();
      }
      return;
    }

    if (isDragging && e.touches.length === 0) {
      setIsDragging(false);
      
      // If zoomed in, we were panning - don't swipe
      if (scale > 1) return;
      
      const touchEndX = lastTouchRef.current.x;
      const deltaX = touchEndX - touchStartRef.current.x;
      const velocity = velocityRef.current.x;
      
      // Swipe threshold
      const swipeThreshold = 50;
      const velocityThreshold = 0.3;
      
      if (Math.abs(deltaX) > swipeThreshold || Math.abs(velocity) > velocityThreshold) {
        if (deltaX > 0 || velocity > velocityThreshold) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    }
  }, [isDragging, isZooming, scale, goToPrevious, goToNext]);

  // Double tap to zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastTapRef.current = now;
    
    if (timeSinceLastTap < 300) {
      e.preventDefault();
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2.5);
        haptic.medium();
      }
    }
  }, [scale, haptic]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={(e) => {
        if (e.target === containerRef.current && scale === 1) {
          onClose();
        }
      }}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10 z-20 rounded-full w-12 h-12"
        onClick={() => {
          haptic.light();
          onClose();
        }}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Zoom controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={zoomOut}
          disabled={scale <= 1}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="text-white/80 text-sm min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={zoomIn}
          disabled={scale >= 5}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        {scale > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-full"
            onClick={() => {
              resetZoom();
              haptic.light();
            }}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation buttons - hide when zoomed */}
      {scale === 1 && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-20 rounded-full w-12 h-12 hidden sm:flex"
            onClick={() => {
              haptic.selection();
              goToPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-20 rounded-full w-12 h-12 hidden sm:flex"
            onClick={() => {
              haptic.selection();
              goToNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center px-4 sm:px-16",
          scale > 1 ? "cursor-grab" : "cursor-default",
          isDragging && scale > 1 && "cursor-grabbing"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onClick={handleDoubleTap as unknown as React.MouseEventHandler}
      >
        <div
          className="transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "center center",
          }}
        >
          <img
            ref={imageRef}
            src={currentImage.url}
            alt={currentImage.title || "Gallery image"}
            className="max-h-[80vh] max-w-full object-contain rounded-lg select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Image info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-2xl mx-auto text-center text-white">
          {currentImage.title && (
            <h3 className="text-xl sm:text-2xl font-bold mb-1">{currentImage.title}</h3>
          )}
          {currentImage.description && (
            <p className="text-white/80 text-sm sm:text-base mb-2">{currentImage.description}</p>
          )}
          <div className="flex items-center justify-center gap-3 text-sm">
            {currentImage.category && (
              <span className="px-3 py-1 rounded-full bg-white/10 capitalize">
                {currentImage.category}
              </span>
            )}
            <span className="text-white/60">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          
          {/* Swipe hint on mobile */}
          <p className="text-white/40 text-xs mt-3 sm:hidden">
            Swipe to navigate • Pinch to zoom • Double-tap to zoom
          </p>
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && scale === 1 && (
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 px-4 hidden sm:block">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 max-w-3xl mx-auto">
            {images.map((img, index) => (
              <button
                key={img.id}
                onClick={() => {
                  setCurrentIndex(index);
                  haptic.selection();
                }}
                className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  index === currentIndex
                    ? "border-white scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile navigation dots */}
      {images.length > 1 && scale === 1 && (
        <div className="absolute bottom-28 left-0 right-0 flex justify-center gap-1.5 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                haptic.selection();
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
