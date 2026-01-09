import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Clock,
  Send,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", phone: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message 
              and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-6 mb-12">
                {[
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 98765 43210",
                    href: "tel:+919876543210",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@chillthrive.com",
                    href: "mailto:hello@chillthrive.com",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "123 Wellness Lane, Recovery District, Mumbai 400001",
                    href: null,
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    value: "@chill.thrive",
                    href: "https://www.instagram.com/chill.thrive/",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-foreground font-medium hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Operating Hours
                  </h3>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12">
                <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Google Maps Integration</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
