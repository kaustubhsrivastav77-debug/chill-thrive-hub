import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Search, Eye, Check, X, Trash2, CheckCircle2, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GOOGLE_MAPS_REVIEW_URL = "https://www.google.com/search?q=chill+thrive&oq=chill+thrive&gs_lcrp=EgZjaHJvbWUqCggAEAAY4wIYgAQyCggAEAAY4wIYgAQyDQgBEC4YrwEYxwEYgAQyBwgCEAAYgAQyBwgDEAAYgAQyBwgEEAAYgAQyBggFEEUYPTIGCAYQRRg9MgYIBxBFGD3SAQgyODU2ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  time_slot: string;
  status: string;
  payment_status: string | null;
  payment_amount: number | null;
  notes: string | null;
  created_at: string;
  services: { name: string; price: number } | null;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        services (name, price)
      `)
      .order("booking_date", { ascending: false });

    if (error) {
      toast({ title: "Error fetching bookings", variant: "destructive" });
    } else {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  };

  const sendStatusNotification = async (booking: Booking, status: "confirmed" | "completed") => {
    try {
      await supabase.functions.invoke("send-status-notification", {
        body: {
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          serviceName: booking.services?.name || "Service",
          bookingDate: format(new Date(booking.booking_date), "MMMM d, yyyy"),
          timeSlot: booking.time_slot,
          status,
          googleMapsUrl: GOOGLE_MAPS_REVIEW_URL,
        },
      });
      console.log(`${status} notification sent to ${booking.customer_email}`);
    } catch (error) {
      console.log("Notification not sent (email service may not be configured)");
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    setProcessingId(id);
    const booking = bookings.find(b => b.id === id);
    
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating booking", variant: "destructive" });
    } else {
      // Send notification for confirmed or completed status
      if (booking && (status === "confirmed" || status === "completed")) {
        await sendStatusNotification(booking, status);
        toast({ 
          title: `Booking ${status}`, 
          description: `Customer notified via email${status === "completed" ? " with feedback request" : ""}` 
        });
      } else {
        toast({ title: `Booking ${status}` });
      }
      fetchBookings();
    }
    setProcessingId(null);
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting booking", variant: "destructive" });
    } else {
      toast({ title: "Booking deleted" });
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_phone.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    const matchesDate = !dateFilter || booking.booking_date === format(dateFilter, "yyyy-MM-dd");

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Manage all customer bookings</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dateFilter && (
              <Button variant="ghost" onClick={() => setDateFilter(undefined)}>
                Clear date
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.services?.name || "N/A"}</TableCell>
                      <TableCell>
                        <div>
                          <p>{format(new Date(booking.booking_date), "MMM d, yyyy")}</p>
                          <p className="text-sm text-muted-foreground">{booking.time_slot}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        {booking.payment_status === "completed" ? (
                          <Badge className="bg-green-500">Paid</Badge>
                        ) : (
                          <Badge variant="outline">Unpaid</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedBooking(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                              </DialogHeader>
                              {selectedBooking && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Customer</p>
                                      <p className="font-medium">{selectedBooking.customer_name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Email</p>
                                      <p className="font-medium">{selectedBooking.customer_email}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Phone</p>
                                      <p className="font-medium">{selectedBooking.customer_phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Service</p>
                                      <p className="font-medium">{selectedBooking.services?.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Date</p>
                                      <p className="font-medium">
                                        {format(new Date(selectedBooking.booking_date), "MMMM d, yyyy")}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Time</p>
                                      <p className="font-medium">{selectedBooking.time_slot}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Amount</p>
                                      <p className="font-medium">
                                        ₹{selectedBooking.services?.price || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Status</p>
                                      {getStatusBadge(selectedBooking.status)}
                                    </div>
                                  </div>
                                  {selectedBooking.notes && (
                                    <div>
                                      <p className="text-sm text-muted-foreground">Notes</p>
                                      <p>{selectedBooking.notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {/* Pending -> Confirm or Cancel */}
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500 hover:text-green-600"
                                disabled={processingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                title="Confirm booking"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                                disabled={processingId === booking.id}
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                title="Cancel booking"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {/* Confirmed -> Mark Complete */}
                          {booking.status === "confirmed" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-500 hover:text-blue-600"
                                  disabled={processingId === booking.id}
                                  title="Mark as completed"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Complete Booking?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will mark the booking as completed and send a feedback request 
                                    with a Google Maps review link to the customer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => updateBookingStatus(booking.id, "completed")}
                                    className="bg-blue-500 hover:bg-blue-600"
                                  >
                                    <Star className="mr-2 h-4 w-4" />
                                    Complete & Request Feedback
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
