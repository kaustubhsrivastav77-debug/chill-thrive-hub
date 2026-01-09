import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  customer_name: string;
  feedback: string;
  rating: number | null;
}

const fallbackTestimonials = [
  {
    id: "1",
    customer_name: "Rahul Sharma",
    feedback: "The ice bath therapy at ChillThrive has completely transformed my recovery routine. I feel more energized and my muscle soreness has reduced significantly.",
    rating: 5,
  },
  {
    id: "2",
    customer_name: "Priya Patel",
    feedback: "As an athlete, recovery is crucial. ChillThrive's combo packages give me the perfect blend of cold and heat therapy. Highly recommended!",
    rating: 5,
  },
  {
    id: "3",
    customer_name: "Amit Kumar",
    feedback: "The steam bath sessions help me decompress after long work weeks. The staff is professional and the facility is top-notch.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("id, customer_name, feedback, rating")
      .eq("is_visible", true)
      .order("display_order", { ascending: true })
      .limit(6);

    if (data && data.length > 0) {
      setTestimonials(data);
    }
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    // Show 1 on mobile, 2 on tablet, 3 on desktop
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return result;
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Real experiences from our community of wellness enthusiasts who have transformed their lives.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg bg-background"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg bg-background"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card
                key={`${testimonial.id}-${index}`}
                className={`group bg-card border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? "md:scale-105 md:shadow-lg md:border-primary/20" : ""
                } ${index === 2 ? "hidden lg:block" : ""} ${index === 1 ? "hidden md:block" : ""}`}
              >
                <CardContent className="p-6 sm:p-8">
                  {/* Quote Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Feedback */}
                  <p className="text-foreground mb-6 leading-relaxed text-sm sm:text-base line-clamp-4">
                    "{testimonial.feedback}"
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.customer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm sm:text-base">
                        {testimonial.customer_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
