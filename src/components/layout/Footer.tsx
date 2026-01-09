import { Link } from "react-router-dom";
import { Snowflake, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">ChillThrive</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Where Recovery Meets Resilience. Experience premium wellness through 
              cold & heat therapy.
            </p>
            <a
              href="https://www.instagram.com/chill.thrive/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm">@chill.thrive</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/services", label: "Our Services" },
                { href: "/booking", label: "Book Now" },
                { href: "/awareness", label: "Learn About Therapy" },
                { href: "/founder", label: "Our Story" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Services</h4>
            <ul className="space-y-3">
              {[
                "Ice Bath Therapy",
                "Jacuzzi Therapy",
                "Steam Bath",
                "Combo Packages",
              ].map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@chillthrive.com</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>123 Wellness Lane, Recovery District, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} ChillThrive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
