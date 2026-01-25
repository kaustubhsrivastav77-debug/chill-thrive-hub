import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  Package,
  X,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  time_slot: string;
  status: string;
  notes: string | null;
  services: { name: string; price: number } | null;
}

interface DayBookings {
  [date: string]: Booking[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-emerald-500",
  cancelled: "bg-red-500",
  completed: "bg-blue-500",
};

const AdminCalendar = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<DayBookings>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchBookings = useCallback(async () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        time_slot,
        status,
        notes,
        services (name, price)
      `)
      .gte("booking_date", format(monthStart, "yyyy-MM-dd"))
      .lte("booking_date", format(monthEnd, "yyyy-MM-dd"))
      .order("time_slot", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load bookings", variant: "destructive" });
    } else {
      // Group bookings by date
      const grouped: DayBookings = {};
      data?.forEach((booking) => {
        if (!grouped[booking.booking_date]) {
          grouped[booking.booking_date] = [];
        }
        grouped[booking.booking_date].push(booking as Booking);
      });
      setBookings(grouped);
    }
    setLoading(false);
  }, [currentMonth, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("calendar-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getBookingsForDay = (date: Date): Booking[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayBookings = bookings[dateStr] || [];
    if (statusFilter === "all") return dayBookings;
    return dayBookings.filter((b) => b.status === statusFilter);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Booking marked as ${status}` });
      fetchBookings();
      setSelectedBooking(null);
    }
  };

  const renderDayCell = (date: Date) => {
    const dayBookings = getBookingsForDay(date);
    const isToday = isSameDay(date, new Date());
    const hasBookings = dayBookings.length > 0;

    return (
      <button
        key={date.toISOString()}
        onClick={() => hasBookings && setSelectedDate(date)}
        className={cn(
          "min-h-[100px] md:min-h-[120px] p-2 border rounded-lg transition-all text-left",
          "hover:border-primary/50 hover:shadow-sm",
          isToday && "border-primary bg-primary/5",
          hasBookings && "cursor-pointer",
          !hasBookings && "cursor-default opacity-60"
        )}
      >
        <div className={cn(
          "text-sm font-medium mb-1",
          isToday && "text-primary"
        )}>
          {format(date, "d")}
        </div>
        <div className="space-y-1">
          {dayBookings.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className={cn(
                "text-xs px-1.5 py-0.5 rounded truncate text-white",
                statusColors[booking.status] || "bg-muted"
              )}
            >
              {booking.time_slot.split("-")[0]} - {booking.customer_name.split(" ")[0]}
            </div>
          ))}
          {dayBookings.length > 3 && (
            <div className="text-xs text-muted-foreground pl-1">
              +{dayBookings.length - 3} more
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <CalendarDays className="h-7 w-7 text-primary" />
            Booking Calendar
          </h1>
          <p className="text-muted-foreground">
            Visualize and manage bookings by date
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="min-h-[100px] md:min-h-[120px] bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {[...Array(startOfMonth(currentMonth).getDay())].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[100px] md:min-h-[120px]" />
              ))}
              {days.map(renderDayCell)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", color)} />
            <span className="text-sm capitalize text-muted-foreground">{status}</span>
          </div>
        ))}
      </div>

      {/* Day Detail Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Bookings for {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {selectedDate &&
              getBookingsForDay(selectedDate).map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.time_slot}</span>
                    </div>
                    <Badge
                      className={cn(
                        "capitalize text-white",
                        statusColors[booking.status]
                      )}
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Package className="h-4 w-4" />
                    <span>{booking.services?.name || "Service"}</span>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    "capitalize text-white",
                    statusColors[selectedBooking.status]
                  )}
                >
                  {selectedBooking.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(selectedBooking.booking_date), "MMM d, yyyy")}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedBooking.customer_name}</p>
                    <p className="text-sm text-muted-foreground">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedBooking.customer_email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedBooking.customer_phone}</p>
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedBooking.time_slot}</p>
                    <p className="text-sm text-muted-foreground">Time Slot</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedBooking.services?.name || "Service"}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{selectedBooking.services?.price?.toLocaleString() || "0"}
                    </p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedBooking.status !== "confirmed" && (
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                  >
                    Confirm
                  </Button>
                )}
                {selectedBooking.status !== "completed" && selectedBooking.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                  >
                    Mark Complete
                  </Button>
                )}
                {selectedBooking.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCalendar;
