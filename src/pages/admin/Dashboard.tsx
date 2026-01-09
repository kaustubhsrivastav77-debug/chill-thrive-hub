import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, DollarSign, Package, TrendingUp } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  activeServices: number;
  totalCustomers: number;
}

interface RecentBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  services: { name: string } | null;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    totalCustomers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Fetch bookings stats
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", format(monthStart, "yyyy-MM-dd"))
      .lte("booking_date", format(monthEnd, "yyyy-MM-dd"));

    // Fetch services count
    const { count: servicesCount } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    // Fetch recent bookings
    const { data: recent } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        booking_date,
        time_slot,
        status,
        services (name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch unique customers
    const { data: customers } = await supabase
      .from("bookings")
      .select("customer_email")
      .gte("created_at", format(subMonths(now, 1), "yyyy-MM-dd"));

    const uniqueCustomers = new Set(customers?.map((c) => c.customer_email)).size;

    if (bookings) {
      const pending = bookings.filter((b) => b.status === "pending").length;
      const confirmed = bookings.filter((b) => b.status === "confirmed").length;
      const revenue = bookings
        .filter((b) => b.payment_status === "completed")
        .reduce((sum, b) => sum + (b.payment_amount || 0), 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        totalRevenue: revenue,
        activeServices: servicesCount || 0,
        totalCustomers: uniqueCustomers,
      });
    }

    if (recent) {
      setRecentBookings(recent as RecentBooking[]);
    }

    setLoading(false);
  };

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      subtitle: "This month",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      subtitle: "Awaiting confirmation",
      icon: TrendingUp,
      color: "text-yellow-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmedBookings,
      subtitle: "Ready for session",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtitle: "This month",
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      subtitle: "Available for booking",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      subtitle: "Last 30 days",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bookings yet
            </p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.services?.name || "Service"} •{" "}
                      {format(new Date(booking.booking_date), "MMM d, yyyy")} at{" "}
                      {booking.time_slot}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
