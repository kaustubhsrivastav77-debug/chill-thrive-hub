import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera, ZoomIn } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const categories = ["all", ...new Set(images.map((img) => img.category))];
  const filteredImages = activeCategory === "all" 
    ? images 
    : images.filter((img) => img.category === activeCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex === 0 ? filteredImages.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = selectedIndex === filteredImages.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-6 animate-fade-in">
            <Camera className="w-4 h-4" />
            Visual Stories
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Explore moments from our ice bath sessions, community events, and behind-the-scenes content
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "capitalize rounded-full px-5 sm:px-6 transition-all duration-300",
                  activeCategory === category 
                    ? "shadow-lg shadow-primary/25" 
                    : "hover:bg-muted/80"
                )}
              >
                {category === "all" ? "All Photos" : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8" ref={gridRef}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Camera className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No images available yet</h3>
              <p className="text-muted-foreground">
                Check back soon for photos from our sessions and events!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className={cn(
                    "group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-muted border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => openLightbox(image, index)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Dark overlay that works in both modes */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />
                  
                  {/* Content on hover */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex justify-end">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {image.title && (
                      <div className="text-white">
                        <p className="font-semibold text-lg">{image.title}</p>
                        {image.description && (
                          <p className="text-sm text-white/80 line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs font-medium text-white capitalize">
                    {image.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => closeLightbox()}>
        <DialogContent 
          className="max-w-6xl w-full p-0 bg-black/95 backdrop-blur-xl border-none rounded-2xl overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <div className="relative flex items-center justify-center min-h-[70vh]">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10 rounded-full"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-12 h-12"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            {selectedImage && (
              <div className="flex flex-col items-center p-4 sm:p-8 max-w-full">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title || "Gallery image"}
                  className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
                {(selectedImage.title || selectedImage.description) && (
                  <div className="mt-6 text-center text-white max-w-2xl">
                    {selectedImage.title && (
                      <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
                    )}
                    {selectedImage.description && (
                      <p className="text-white/80 mt-2">{selectedImage.description}</p>
                    )}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-white capitalize">
                    {selectedImage.category}
                  </span>
                  <span className="text-white/60 text-sm">
                    {selectedIndex + 1} / {filteredImages.length}
                  </span>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full w-12 h-12"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
