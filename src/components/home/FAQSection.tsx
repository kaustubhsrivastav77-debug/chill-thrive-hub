import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "What should I expect during my first ice bath session?",
    answer:
      "Your first session will begin with a brief orientation where our expert guides will explain the process and answer any questions. You'll start with a shorter immersion time (typically 2-3 minutes) and gradually build up. We provide all necessary equipment, including towels and robes. Most people experience an initial shock that quickly transforms into an invigorating sensation.",
    category: "Getting Started",
  },
  {
    id: "2",
    question: "How cold is the ice bath water?",
    answer:
      "Our ice baths are maintained between 2-4°C (35-39°F). This temperature range is optimal for triggering the body's cold shock response while remaining safe for most individuals. Our trained staff monitors water temperature continuously to ensure consistency.",
    category: "Ice Bath",
  },
  {
    id: "3",
    question: "Are there any health conditions that would prevent me from using your services?",
    answer:
      "While cold and heat therapy offers many benefits, certain conditions require medical clearance first. These include cardiovascular conditions, Raynaud's disease, cold urticaria, pregnancy, and uncontrolled high blood pressure. We recommend consulting with your healthcare provider before your first visit if you have any concerns.",
    category: "Health & Safety",
  },
  {
    id: "4",
    question: "How often should I do ice bath therapy for best results?",
    answer:
      "For optimal benefits, we recommend 2-3 sessions per week. However, this can vary based on your goals and fitness level. Athletes may benefit from more frequent sessions, especially during intense training periods. Our wellness experts can create a personalized schedule during your consultation.",
    category: "Getting Started",
  },
  {
    id: "5",
    question: "What are the benefits of combining ice bath with jacuzzi or steam bath?",
    answer:
      "Contrast therapy (alternating between hot and cold) enhances circulation, accelerates muscle recovery, and boosts the immune system more effectively than single-temperature therapy alone. The combination creates a 'pumping' effect in your blood vessels, flushing out toxins and reducing inflammation more efficiently.",
    category: "Services",
  },
  {
    id: "6",
    question: "How do I book a session?",
    answer:
      "Booking is easy! You can book online through our website's booking page, call us directly, or send us a message on Instagram. We recommend booking at least 24 hours in advance, especially for weekend slots which fill up quickly.",
    category: "Booking",
  },
  {
    id: "7",
    question: "What is your cancellation policy?",
    answer:
      "We understand plans change. You can cancel or reschedule your booking up to 12 hours before your scheduled session without any penalty. Cancellations made less than 12 hours in advance may be subject to a 50% cancellation fee.",
    category: "Booking",
  },
  {
    id: "8",
    question: "Do you offer packages or memberships?",
    answer:
      "Yes! We offer various packages including single sessions, 5-session packs, 10-session packs, and monthly unlimited memberships. Package holders enjoy discounted rates and priority booking. Check our Services page for current pricing and promotions.",
    category: "Pricing",
  },
];

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const categories = useMemo(() => {
    return [...new Set(filteredFaqs.map((faq) => faq.category))];
  }, [filteredFaqs]);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Frequently Asked Questions
            </h2>

            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Everything you need to know about our wellness services. Can't find
              what you're looking for? Feel free to contact us.
            </p>

            {/* Search */}
            <div
              className={`relative max-w-md mx-auto transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 text-base rounded-xl border-2 border-border focus-visible:ring-primary"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* FAQ Accordion */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or browse all questions below.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                      {category}
                    </h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFaqs
                        .filter((faq) => faq.category === category)
                        .map((faq, index) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border border-border rounded-xl px-4 sm:px-6 bg-card data-[state=open]:bg-muted/50 transition-colors"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-5">
                              <span className="font-medium text-foreground text-sm sm:text-base pr-4">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pb-4 sm:pb-5">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div
            className={`mt-12 sm:mt-16 text-center p-6 sm:p-8 rounded-2xl bg-muted/50 border border-border transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-4">
              Our team is here to help. Reach out anytime!
            </p>
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
