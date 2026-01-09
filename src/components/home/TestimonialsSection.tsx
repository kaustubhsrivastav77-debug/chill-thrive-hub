import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchTestimonials();
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return result;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/50" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <SectionHeader
          badge="Client Testimonials"
          title="What Our Clients Say"
          subtitle="Real experiences from our community of wellness enthusiasts who have transformed their lives."
        />

        {/* Testimonials Carousel */}
        <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Navigation Buttons */}
          {testimonials.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg bg-card border-border/50 hover:bg-muted hover:border-primary/30 w-12 h-12"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex rounded-full shadow-lg bg-card border-border/50 hover:bg-muted hover:border-primary/30 w-12 h-12"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card
                key={`${testimonial.id}-${index}`}
                className={`group relative bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                  index === 1 ? "md:scale-105 md:shadow-xl md:border-primary/20 md:z-10" : ""
                } ${index === 2 ? "hidden lg:block" : ""} ${index === 1 ? "hidden md:block" : ""}`}
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                
                <CardContent className="p-6 sm:p-8">
                  {/* Quote Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Quote className="w-7 h-7 text-primary" />
                  </div>
                  
                  {/* Feedback */}
                  <p className="text-foreground mb-6 leading-relaxed text-base sm:text-lg line-clamp-4">
                    "{testimonial.feedback}"
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {getInitials(testimonial.customer_name)}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-base">
                        {testimonial.customer_name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
