import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Snowflake,
  Activity,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval, subDays } from "date-fns";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { QuickActions } from "@/components/admin/QuickActions";
import { RecentBookingsTable } from "@/components/admin/RecentBookingsTable";
import { BookingStatusChart } from "@/components/admin/BookingStatusChart";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  activeServices: number;
  totalCustomers: number;
  monthlyGrowth: number;
}

interface RecentBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  services: { name: string } | null;
}

interface ChartData {
  date: string;
  revenue: number;
  bookings: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Fetch current month bookings
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", format(monthStart, "yyyy-MM-dd"))
      .lte("booking_date", format(monthEnd, "yyyy-MM-dd"));

    // Fetch last month bookings for comparison
    const { data: lastMonthBookings } = await supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", format(lastMonthStart, "yyyy-MM-dd"))
      .lte("booking_date", format(lastMonthEnd, "yyyy-MM-dd"));

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

    // Generate chart data for last 14 days
    const last14Days = eachDayOfInterval({
      start: subDays(now, 13),
      end: now,
    });

    const { data: chartBookings } = await supabase
      .from("bookings")
      .select("booking_date, payment_amount, payment_status")
      .gte("booking_date", format(subDays(now, 13), "yyyy-MM-dd"))
      .lte("booking_date", format(now, "yyyy-MM-dd"));

    const chartDataMap = last14Days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayBookings = chartBookings?.filter((b) => b.booking_date === dateStr) || [];
      const revenue = dayBookings
        .filter((b) => b.payment_status === "completed")
        .reduce((sum, b) => sum + (b.payment_amount || 0), 0);
      return {
        date: dateStr,
        revenue,
        bookings: dayBookings.length * 100, // Scale for visibility
      };
    });

    setChartData(chartDataMap);

    if (bookings) {
      const pending = bookings.filter((b) => b.status === "pending").length;
      const confirmed = bookings.filter((b) => b.status === "confirmed").length;
      const cancelled = bookings.filter((b) => b.status === "cancelled").length;
      const completed = bookings.filter((b) => b.status === "completed").length;
      const revenue = bookings
        .filter((b) => b.payment_status === "completed")
        .reduce((sum, b) => sum + (b.payment_amount || 0), 0);

      // Calculate growth
      const lastMonthTotal = lastMonthBookings?.length || 0;
      const growth = lastMonthTotal > 0
        ? Math.round(((bookings.length - lastMonthTotal) / lastMonthTotal) * 100)
        : 0;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        cancelledBookings: cancelled,
        completedBookings: completed,
        totalRevenue: revenue,
        activeServices: servicesCount || 0,
        totalCustomers: uniqueCustomers,
        monthlyGrowth: growth,
      });
    }

    if (recent) {
      setRecentBookings(recent as RecentBooking[]);
    }

    setLoading(false);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Snowflake className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{greeting()}!</h1>
          </div>
          <p className="text-muted-foreground">
            Here's what's happening with Chill Thrive today
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
          <Activity className="h-4 w-4 text-emerald-500" />
          <span>System operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="This month"
          icon={Calendar}
          variant="primary"
          trend={stats.monthlyGrowth !== 0 ? { value: stats.monthlyGrowth, isPositive: stats.monthlyGrowth > 0 } : undefined}
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          subtitle="This month"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          subtitle="Available for booking"
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          subtitle="Last 30 days"
          icon={Users}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <RevenueChart data={chartData} loading={loading} />
        <BookingStatusChart
          pending={stats.pendingBookings}
          confirmed={stats.confirmedBookings}
          cancelled={stats.cancelledBookings}
          completed={stats.completedBookings}
          loading={loading}
        />
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <QuickActions />
        <RecentBookingsTable bookings={recentBookings} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
