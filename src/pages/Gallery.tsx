import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    fetchImages();
  }, []);

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
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore moments from our ice bath sessions, community events, and behind-the-scenes content
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No images available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for photos from our sessions and events!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(image, index)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                    {image.title && (
                      <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="font-semibold">{image.title}</p>
                        {image.description && (
                          <p className="text-sm text-white/80">{image.description}</p>
                        )}
                      </div>
                    )}
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
          className="max-w-5xl w-full p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative flex items-center justify-center min-h-[60vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            {selectedImage && (
              <div className="flex flex-col items-center p-4">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title || "Gallery image"}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg"
                />
                {(selectedImage.title || selectedImage.description) && (
                  <div className="mt-4 text-center text-white">
                    {selectedImage.title && (
                      <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                    )}
                    {selectedImage.description && (
                      <p className="text-white/80 mt-1">{selectedImage.description}</p>
                    )}
                  </div>
                )}
                <p className="text-white/60 mt-2 text-sm">
                  {selectedIndex + 1} / {filteredImages.length}
                </p>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
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
