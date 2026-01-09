import { Link } from "react-router-dom";
import { Snowflake, Instagram, Mail, Phone, MapPin, Facebook, Youtube, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/services", label: "Our Services" },
  { href: "/booking", label: "Book Now" },
  { href: "/gallery", label: "Gallery" },
  { href: "/awareness", label: "Learn About Therapy" },
  { href: "/founder", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Ice Bath Therapy",
  "Jacuzzi Therapy",
  "Steam Bath",
  "Combo Packages",
];

const socialLinks = [
  { href: "https://www.instagram.com/chill.thrive/", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold">ChillThrive</span>
                <p className="text-xs text-background/60 uppercase tracking-wider">
                  Wellness & Recovery
                </p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Where Recovery Meets Resilience. Experience premium wellness through 
              scientifically-backed cold & heat therapy treatments.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Services</h4>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-background/70 hover:text-primary transition-colors text-sm flex items-center gap-1 group"
                  >
                    {service}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@chillthrive.com" 
                  className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors text-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>hello@chillthrive.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-background/70 text-sm">
                <div className="w-9 h-9 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>123 Wellness Lane, Recovery District, India</span>
              </li>
            </ul>
            
            <Button asChild size="sm" className="w-full mt-4">
              <Link to="/booking">Book a Session</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <p className="text-background/50 text-sm">
              © {currentYear} ChillThrive. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-background/50 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/50 hover:text-background transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
