import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/5 blur-2xl animate-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-primary-foreground text-sm font-medium mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4" />
            Start Your Transformation
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
            Ready to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Thrive</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-white/20 -rotate-1" />
            </span>
            ?
          </h2>
          
          {/* Description */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of wellness enthusiasts who have transformed their lives 
            through the power of cold & heat therapy. Your path to resilience begins here.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 text-base px-6 sm:px-8 h-12 sm:h-14 shadow-2xl"
            >
              <Link to="/booking">
                <Calendar className="mr-2 w-5 h-5" />
                Book Your First Session
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base px-6 sm:px-8 h-12 sm:h-14 bg-transparent border-white/30 text-primary-foreground hover:bg-white/10"
            >
              <Link to="/contact">
                <Phone className="mr-2 w-5 h-5" />
                Talk to Us
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-primary-foreground/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No commitment required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Expert guidance
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Flexible scheduling
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
