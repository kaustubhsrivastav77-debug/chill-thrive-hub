import { useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
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
  Menu,
  ChevronLeft,
  Bell,
  Settings,
  Home,
  CalendarRange,
  FileText,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/calendar", icon: CalendarRange, label: "Calendar" },
  { path: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { path: "/admin/services", icon: Package, label: "Services" },
  { path: "/admin/reports", icon: FileText, label: "Reports" },
  { path: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { path: "/admin/events", icon: CalendarDays, label: "Events" },
  { path: "/admin/gallery", icon: Image, label: "Gallery" },
  { path: "/admin/users", icon: Users, label: "Users" },
  { path: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminLayout = () => {
  const { user, loading, isStaff, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Enable realtime notifications for staff
  const { isSubscribed } = useRealtimeBookings();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user && !isStaff) {
      navigate("/");
    }
  }, [user, loading, isStaff, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:flex w-72 flex-col border-r bg-card/50 p-4 space-y-4">
          <div className="flex items-center gap-3 px-2 py-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-xl" />
            ))}
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 p-4 lg:p-8 space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user || !isStaff) {
    return null;
  }

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-3 mb-8",
        isMobile ? "px-2 py-4" : "px-4 py-6"
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Snowflake className="h-5 w-5 text-primary" />
        </div>
        <div>
          <span className="font-bold text-lg">Chill Thrive</span>
          <span className="block text-xs text-muted-foreground">Admin Panel</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path 
            : location.pathname.startsWith(item.path) && item.path !== "/admin";
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-11 rounded-xl transition-all",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                  !isActive && "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive && "text-primary"
                )} />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom Section */}
      <div className="mt-auto space-y-2 px-2 pt-4 border-t">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-11 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
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
      <aside className="hidden lg:flex w-72 flex-col border-r bg-card/30 backdrop-blur-sm">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:px-8">
          {/* Mobile Menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <NavContent isMobile />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Snowflake className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin</span>
            </div>
          </div>

          {/* Desktop Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {location.pathname !== "/admin" && (
              <>
                <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                <span className="font-medium capitalize">
                  {location.pathname.split("/").pop()}
                </span>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl relative">
                  <Bell className="h-5 w-5" />
                  <span 
                    className={cn(
                      "absolute top-1.5 right-1.5 h-2 w-2 rounded-full transition-colors",
                      isSubscribed ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                    )} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSubscribed ? "Live notifications active" : "Connecting to notifications..."}
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-xl px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium max-w-32 truncate">
                    {user?.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive flex items-center gap-2"
                  onClick={() => signOut().then(() => navigate("/"))}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
