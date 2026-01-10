import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email({ message: "Please enter a valid email address" });

type SubscriptionState = "idle" | "loading" | "success" | "error";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscriptionState>("idle");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setState("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setState("success");
    setEmail("");

    // Reset after 5 seconds
    setTimeout(() => {
      setState("idle");
    }, 5000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/50" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Mail className="w-4 h-4" />
            Stay Updated
          </div>

          {/* Heading */}
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Join Our Wellness Community
          </h2>

          {/* Description */}
          <p
            className={`text-muted-foreground text-lg mb-8 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Get exclusive tips, special offers, and be the first to know about new
            services and events.
          </p>

          {/* Form */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {state === "success" ? (
              <div className="relative">
                {/* Success animation */}
                <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    {/* Celebration sparkles */}
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
                    <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-accent animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <Sparkles className="absolute top-0 -left-4 w-4 h-4 text-primary/60 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Welcome to the community!
                  </h3>
                  <p className="text-muted-foreground">
                    Check your inbox for a special welcome gift.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`h-12 sm:h-14 pl-12 pr-4 text-base rounded-xl border-2 transition-all ${
                        error
                          ? "border-destructive focus-visible:ring-destructive"
                          : "border-border focus-visible:ring-primary"
                      }`}
                      disabled={state === "loading"}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={state === "loading"}
                    className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl gap-2 group"
                  >
                    {state === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-destructive text-sm animate-fade-in">{error}</p>
                )}

                {/* Privacy note */}
                <p className="text-muted-foreground text-xs">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
