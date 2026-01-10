import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, Images, BookOpen, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/services", label: "Services", icon: Grid3X3 },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/awareness", label: "Learn", icon: BookOpen },
  { href: "/booking", label: "Book", icon: Calendar },
];

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const haptic = useHapticFeedback();

  // Don't show on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const isBooking = item.href === "/booking";
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => haptic.selection()}
              className={cn(
                "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
                  style={{ animation: "scale-in 0.2s ease-out" }}
                />
              )}
              
              {/* Special styling for booking button */}
              {isBooking ? (
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 -mt-4 rounded-full shadow-lg transition-all duration-300",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-primary/40" 
                    : "bg-primary text-primary-foreground shadow-primary/30"
                )}>
                  <item.icon className="w-5 h-5" />
                  
                  {/* Pulse ring animation */}
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                </div>
              ) : (
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary/10" : "hover:bg-muted"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                </div>
              )}
              
              {/* Label */}
              <span className={cn(
                "text-[10px] font-medium mt-0.5 transition-all duration-300",
                isBooking ? "-mt-0.5" : "",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Account/Profile link */}
        <Link
          to={user ? "/admin" : "/auth"}
          onClick={() => haptic.selection()}
          className={cn(
            "relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
            (location.pathname === "/auth" || location.pathname.startsWith("/admin")) 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          {(location.pathname === "/auth" || location.pathname.startsWith("/admin")) && (
            <span 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full"
              style={{ animation: "scale-in 0.2s ease-out" }}
            />
          )}
          
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
            (location.pathname === "/auth" || location.pathname.startsWith("/admin"))
              ? "bg-primary/10" 
              : "hover:bg-muted"
          )}>
            {user ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            ) : (
              <User className={cn(
                "w-5 h-5 transition-transform duration-300",
                (location.pathname === "/auth") && "scale-110"
              )} />
            )}
          </div>
          
          <span className={cn(
            "text-[10px] font-medium mt-0.5 transition-all duration-300",
            (location.pathname === "/auth" || location.pathname.startsWith("/admin")) 
              ? "opacity-100" 
              : "opacity-70"
          )}>
            {user ? "Account" : "Sign In"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
