import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
  services: { name: string } | null;
}

interface RecentBookingsTableProps {
  bookings: RecentBooking[];
  loading?: boolean;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Confirmed", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
};

export function RecentBookingsTable({ bookings, loading }: RecentBookingsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted rounded" />
                </div>
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
          <Link to="/admin/bookings">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground">Bookings will appear here once customers book sessions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{booking.customer_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate">{booking.services?.name || "Service"}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(booking.booking_date), "MMM d")}
                      </span>
                      <span className="hidden md:flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.time_slot}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={status.variant}
                    className={cn(
                      "shrink-0 capitalize",
                      booking.status === "confirmed" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                      booking.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}
                  >
                    {status.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
