import { useEffect, useState } from "react";
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
  Check,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface RecentBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Enable realtime notifications for staff
  const { isSubscribed } = useRealtimeBookings();

  // Fetch recent bookings for notifications
  useEffect(() => {
    const fetchRecentBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, customer_name, booking_date, time_slot, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) setRecentBookings(data);
    };

    if (isStaff && !loading) {
      fetchRecentBookings();
    }
  }, [isStaff, loading]);

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
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <NavContent isMobile />
                </ScrollArea>
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
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl relative">
                  <Bell className="h-5 w-5" />
                  <span 
                    className={cn(
                      "absolute top-1.5 right-1.5 h-2 w-2 rounded-full transition-colors",
                      isSubscribed ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                    )} 
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0 bg-popover border shadow-lg">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Recent Bookings</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      isSubscribed ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                    )}>
                      {isSubscribed ? "Live" : "Connecting..."}
                    </span>
                  </div>
                </div>
                <ScrollArea className="max-h-80">
                  {recentBookings.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No recent bookings
                    </div>
                  ) : (
                    <div className="divide-y">
                      {recentBookings.map((booking) => (
                        <Link
                          key={booking.id}
                          to="/admin/bookings"
                          onClick={() => setNotificationsOpen(false)}
                          className="flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className={cn(
                            "mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            booking.status === "confirmed" && "bg-emerald-500/10",
                            booking.status === "pending" && "bg-amber-500/10",
                            booking.status === "completed" && "bg-primary/10",
                            booking.status === "cancelled" && "bg-destructive/10"
                          )}>
                            {booking.status === "confirmed" || booking.status === "completed" ? (
                              <Check className={cn(
                                "h-4 w-4",
                                booking.status === "confirmed" && "text-emerald-500",
                                booking.status === "completed" && "text-primary"
                              )} />
                            ) : booking.status === "cancelled" ? (
                              <X className="h-4 w-4 text-destructive" />
                            ) : (
                              <Bell className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{booking.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(booking.booking_date), "MMM d")} at {booking.time_slot}
                            </p>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full capitalize shrink-0",
                            booking.status === "confirmed" && "bg-emerald-500/10 text-emerald-600",
                            booking.status === "pending" && "bg-amber-500/10 text-amber-600",
                            booking.status === "completed" && "bg-primary/10 text-primary",
                            booking.status === "cancelled" && "bg-destructive/10 text-destructive"
                          )}>
                            {booking.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <div className="p-2 border-t">
                  <Link to="/admin/bookings" onClick={() => setNotificationsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Bookings
                    </Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

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
