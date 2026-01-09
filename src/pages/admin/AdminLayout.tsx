import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  MessageSquare, 
  CalendarDays,
  Image,
  Users,
  LogOut,
  Snowflake,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { path: "/admin/services", icon: Package, label: "Services" },
  { path: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { path: "/admin/events", icon: CalendarDays, label: "Events" },
  { path: "/admin/gallery", icon: Image, label: "Gallery" },
  { path: "/admin/users", icon: Users, label: "Users" },
];

const AdminLayout = () => {
  const { user, loading, isStaff, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user && !isStaff) {
      navigate("/");
    }
  }, [user, loading, isStaff, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-card border-r p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user || !isStaff) {
    return null;
  }

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <Snowflake className="h-8 w-8 text-primary" />
        <span className="font-bold text-xl">Admin Panel</span>
      </Link>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={() => signOut().then(() => navigate("/"))}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r p-4">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Snowflake className="h-6 w-6 text-primary" />
          <span className="font-bold">Admin</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto lg:p-8 p-4 pt-20 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
