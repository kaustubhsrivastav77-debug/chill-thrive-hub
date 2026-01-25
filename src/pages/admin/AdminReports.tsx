import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  DollarSign,
  Users,
  Calendar as CalendarIconAlt,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  time_slot: string;
  status: string;
  payment_amount: number | null;
  payment_status: string | null;
  created_at: string;
  services: { name: string; price: number } | null;
}

interface ReportStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  uniqueCustomers: number;
}

const AdminReports = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [reportType, setReportType] = useState<string>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    
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
        payment_amount,
        payment_status,
        created_at,
        services (name, price)
      `)
      .gte("booking_date", format(startDate, "yyyy-MM-dd"))
      .lte("booking_date", format(endDate, "yyyy-MM-dd"))
      .order("booking_date", { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to fetch report data", variant: "destructive" });
      setLoading(false);
      return;
    }

    setBookings(data as Booking[]);

    // Calculate stats
    const confirmed = data.filter((b) => b.status === "confirmed" || b.status === "completed");
    const cancelled = data.filter((b) => b.status === "cancelled");
    // Calculate revenue from confirmed/completed bookings (not just paid ones)
    const revenue = confirmed.reduce((sum, b) => sum + (b.payment_amount || b.services?.price || 0), 0);
    const uniqueEmails = new Set(data.map((b) => b.customer_email));

    setStats({
      totalBookings: data.length,
      confirmedBookings: confirmed.length,
      cancelledBookings: cancelled.length,
      totalRevenue: revenue,
      avgBookingValue: confirmed.length > 0 ? revenue / confirmed.length : 0,
      uniqueCustomers: uniqueEmails.size,
    });

    setLoading(false);
  }, [startDate, endDate, toast]);

  const exportToCSV = () => {
    setExporting(true);
    
    try {
      const headers = [
        "Booking Date",
        "Time Slot",
        "Customer Name",
        "Email",
        "Phone",
        "Service",
        "Status",
        "Payment Status",
        "Amount",
      ];

      const rows = bookings.map((b) => [
        b.booking_date,
        b.time_slot,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.services?.name || "N/A",
        b.status,
        b.payment_status || "N/A",
        b.payment_amount?.toString() || "0",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `chill-thrive-${reportType}-report-${format(startDate, "yyyy-MM-dd")}-to-${format(endDate, "yyyy-MM-dd")}.csv`;
      link.click();

      toast({ title: "Success", description: "CSV report downloaded" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export CSV", variant: "destructive" });
    }
    
    setExporting(false);
  };

  const exportToPDF = () => {
    setExporting(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(59, 130, 246);
      doc.text("Chill Thrive", 14, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 30);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Period: ${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`, 14, 38);
      doc.text(`Generated: ${format(new Date(), "MMM d, yyyy 'at' h:mm a")}`, 14, 44);

      // Stats Summary
      if (stats) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Summary", 14, 56);
        
        doc.setFontSize(10);
        doc.text(`Total Bookings: ${stats.totalBookings}`, 14, 64);
        doc.text(`Confirmed: ${stats.confirmedBookings}`, 14, 70);
        doc.text(`Cancelled: ${stats.cancelledBookings}`, 14, 76);
        doc.text(`Total Revenue: ₹${stats.totalRevenue.toLocaleString()}`, 100, 64);
        doc.text(`Avg. Booking Value: ₹${stats.avgBookingValue.toFixed(0)}`, 100, 70);
        doc.text(`Unique Customers: ${stats.uniqueCustomers}`, 100, 76);
      }

      // Bookings Table
      const tableData = bookings.map((b) => [
        b.booking_date,
        b.time_slot,
        b.customer_name,
        b.services?.name || "N/A",
        b.status,
        `₹${b.payment_amount || 0}`,
      ]);

      autoTable(doc, {
        head: [["Date", "Time", "Customer", "Service", "Status", "Amount"]],
        body: tableData,
        startY: 85,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });

      doc.save(`chill-thrive-${reportType}-report-${format(startDate, "yyyy-MM-dd")}-to-${format(endDate, "yyyy-MM-dd")}.pdf`);

      toast({ title: "Success", description: "PDF report downloaded" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to export PDF", variant: "destructive" });
    }
    
    setExporting(false);
  };

  const quickDateRanges = [
    { label: "This Month", start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
    { label: "Last Month", start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) },
    { label: "Last 3 Months", start: startOfMonth(subMonths(new Date(), 2)), end: endOfMonth(new Date()) },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground">
              Only administrators can access the reports page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          Reports
        </h1>
        <p className="text-muted-foreground">
          Generate and download booking and revenue reports
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Report Settings</CardTitle>
          <CardDescription>Select date range and report type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Date Ranges */}
          <div className="flex flex-wrap gap-2">
            {quickDateRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setStartDate(range.start);
                  setEndDate(range.end);
                }}
                className={cn(
                  startDate.getTime() === range.start.getTime() &&
                  endDate.getTime() === range.end.getTime() &&
                  "border-primary bg-primary/5"
                )}
              >
                {range.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookings">Bookings Report</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Generate</label>
              <Button onClick={fetchReportData} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CalendarIconAlt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{stats.avgBookingValue.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Avg. Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.uniqueCustomers}</p>
                  <p className="text-xs text-muted-foreground">Unique Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Buttons & Data Table */}
      {bookings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Report Data</CardTitle>
                <CardDescription>{bookings.length} records found</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  disabled={exporting}
                  className="gap-1"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  onClick={exportToPDF}
                  disabled={exporting}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.slice(0, 20).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {format(new Date(booking.booking_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{booking.time_slot}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.services?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            booking.status === "confirmed" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                            booking.status === "pending" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                            booking.status === "cancelled" && "bg-red-500/10 text-red-600 border-red-500/20"
                          )}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{booking.payment_amount?.toLocaleString() || "0"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {bookings.length > 20 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Showing 20 of {bookings.length} records. Export to see all.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && stats === null && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-1">No Report Generated</h3>
            <p className="text-sm text-muted-foreground">
              Select a date range and click "Generate Report" to see data
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminReports;
