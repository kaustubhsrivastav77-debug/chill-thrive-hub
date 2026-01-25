import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ReactNode, useEffect, useState } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Awareness from "./pages/Awareness";
import Founder from "./pages/Founder";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Auth from "./pages/Auth";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminServices from "./pages/admin/AdminServices";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminCalendar from "./pages/admin/AdminCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Enhanced page transition wrapper with smooth animations
function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [currentChildren, setCurrentChildren] = useState(children);
  const [currentKey, setCurrentKey] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentKey) {
      // Start exit animation
      setIsExiting(true);
      
      const exitTimer = setTimeout(() => {
        setCurrentChildren(children);
        setCurrentKey(location.pathname);
        setIsExiting(false);
        setIsEntering(true);
        
        // Reset entering state after animation
        const enterTimer = setTimeout(() => {
          setIsEntering(false);
        }, 400);
        
        return () => clearTimeout(enterTimer);
      }, 250);
      
      return () => clearTimeout(exitTimer);
    } else {
      setCurrentChildren(children);
      const timer = setTimeout(() => setIsEntering(false), 400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, children, currentKey]);

  return (
    <>
      {/* Page loading indicator */}
      <div 
        className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[100] transition-all duration-300 ${
          isExiting ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
        style={{ transformOrigin: "left" }}
      />
      
      {/* Page Content with animations */}
      <div
        className={`transition-all duration-300 ease-out ${
          isExiting 
            ? "opacity-0 translate-x-4 scale-[0.99]" 
            : isEntering 
              ? "opacity-100 translate-x-0 scale-100 animate-fade-in" 
              : "opacity-100 translate-x-0 scale-100"
        }`}
      >
        {currentChildren}
      </div>
    </>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
