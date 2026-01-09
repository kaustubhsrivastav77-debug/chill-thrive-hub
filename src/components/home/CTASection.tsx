import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Start Your Recovery Journey Today
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            Join hundreds of wellness enthusiasts who have transformed their lives 
            through cold & heat therapy. Your path to resilience begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="hero"
              className="text-base px-8"
            >
              <Link to="/booking">
                <Calendar className="mr-2 w-5 h-5" />
                Book Your First Session
              </Link>
            </Button>
            <Button
              asChild
              variant="heroOutline"
              size="lg"
              className="text-base px-8"
            >
              <Link to="/contact">
                Talk to Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
