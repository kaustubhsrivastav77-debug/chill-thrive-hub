import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Snowflake, 
  Waves, 
  CloudFog, 
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar as CalendarIcon,
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

const fallbackServices = [
  { id: "ice-bath", name: "Ice Bath Therapy", price: 1500, duration: "60 min", icon: Snowflake },
  { id: "jacuzzi", name: "Jacuzzi Therapy", price: 1200, duration: "45 min", icon: Waves },
  { id: "steam", name: "Steam Bath", price: 800, duration: "30 min", icon: CloudFog },
  { id: "ice-steam", name: "Ice + Steam Combo", price: 1999, duration: "75 min", icon: Sparkles },
  { id: "ice-jacuzzi", name: "Ice + Jacuzzi Combo", price: 2299, duration: "90 min", icon: Sparkles },
  { id: "full-combo", name: "Full Recovery Combo", price: 2999, duration: "120 min", icon: Sparkles },
];

const fallbackTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const steps = [
  { num: 1, label: "Service", icon: Sparkles },
  { num: 2, label: "Date", icon: CalendarIcon },
  { num: 3, label: "Time", icon: Clock },
  { num: 4, label: "Details", icon: User },
];

interface SlotAvailability {
  [key: string]: number; // slot_time -> available count
}

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState(fallbackServices);
  const [timeSlots, setTimeSlots] = useState(fallbackTimeSlots);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [slotAvailability, setSlotAvailability] = useState<SlotAvailability>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServicesAndSlots();
  }, []);

  // Fetch slot availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkSlotAvailability(selectedDate);
    }
  }, [selectedDate]);

  const fetchServicesAndSlots = async () => {
    setIsDataLoading(true);
    const [servicesRes, slotsRes, blockedRes] = await Promise.all([
      supabase.from("services").select("id, name, price, duration_minutes").eq("is_active", true),
      supabase.from("time_slots").select("slot_time, capacity").eq("is_active", true).order("slot_time"),
      supabase.from("blocked_dates").select("blocked_date"),
    ]);

    if (servicesRes.data && servicesRes.data.length > 0) {
      const mappedServices = servicesRes.data.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: `${s.duration_minutes} min`,
        icon: s.name.toLowerCase().includes("ice") ? Snowflake : 
              s.name.toLowerCase().includes("jacuzzi") ? Waves : 
              s.name.toLowerCase().includes("steam") ? CloudFog : Sparkles,
      }));
      setServices(mappedServices);
    }

    if (slotsRes.data && slotsRes.data.length > 0) {
      setTimeSlots(slotsRes.data.map((s) => s.slot_time));
      // Initialize availability with capacity
      const availability: SlotAvailability = {};
      slotsRes.data.forEach(s => {
        availability[s.slot_time] = s.capacity;
      });
      setSlotAvailability(availability);
    }

    if (blockedRes.data) {
      setBlockedDates(blockedRes.data.map(d => d.blocked_date));
    }

    setIsDataLoading(false);
  };

  const checkSlotAvailability = async (date: Date) => {
    setIsCheckingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");

    // Get all time slots with capacity
    const { data: slots } = await supabase
      .from("time_slots")
      .select("slot_time, capacity")
      .eq("is_active", true);

    // Get bookings for this date (excluding cancelled)
    const { data: bookings } = await supabase
      .from("bookings")
      .select("time_slot")
      .eq("booking_date", dateStr)
      .neq("status", "cancelled");

    const availability: SlotAvailability = {};
    
    if (slots) {
      slots.forEach(slot => {
        const bookedCount = bookings?.filter(b => b.time_slot === slot.slot_time).length || 0;
        availability[slot.slot_time] = Math.max(0, slot.capacity - bookedCount);
      });
    }

    setSlotAvailability(availability);
    setIsCheckingSlots(false);

    // Reset selected time if it's no longer available
    if (selectedTime && availability[selectedTime] === 0) {
      setSelectedTime(null);
      toast({
        title: "Slot no longer available",
        description: "Please select another time slot.",
        variant: "destructive",
      });
    }
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateStr);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Double-check availability before submitting
      if (selectedDate && selectedTime) {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const { data: existingBookings } = await supabase
          .from("bookings")
          .select("id")
          .eq("booking_date", dateStr)
          .eq("time_slot", selectedTime)
          .neq("status", "cancelled");

        const { data: slotData } = await supabase
          .from("time_slots")
          .select("capacity")
          .eq("slot_time", selectedTime)
          .single();

        const capacity = slotData?.capacity || 1;
        const bookedCount = existingBookings?.length || 0;

        if (bookedCount >= capacity) {
          toast({
            title: "Slot no longer available",
            description: "This time slot was just booked by someone else. Please select a different slot.",
            variant: "destructive",
          });
          setStep(3);
          await checkSlotAvailability(selectedDate);
          setIsLoading(false);
          return;
        }
      }

      const { error } = await supabase.from("bookings").insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_id: selectedService,
        booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        time_slot: selectedTime || "",
        payment_amount: selectedServiceData?.price || 0,
        status: "pending", // Explicitly set to pending
      });

      if (error) throw error;

      // Try to send confirmation email
      try {
        await supabase.functions.invoke("send-booking-confirmation", {
          body: {
            customerName: formData.name,
            customerEmail: formData.email,
            serviceName: selectedServiceData?.name || "",
            bookingDate: selectedDate ? format(selectedDate, "MMMM d, yyyy") : "",
            timeSlot: selectedTime || "",
            bookingId: crypto.randomUUID(),
          },
        });
      } catch (emailError) {
        console.log("Email notification not sent (service may not be configured)");
      }

      setIsSubmitted(true);
      toast({ title: "Booking submitted!", description: "Your booking is pending confirmation." });
    } catch (error: any) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedService !== null;
      case 2: return selectedDate !== undefined;
      case 3: return selectedTime !== null && slotAvailability[selectedTime] > 0;
      case 4: return formData.name && formData.phone && formData.email;
      default: return false;
    }
  };

  const getAvailableSlotsCount = () => {
    return Object.values(slotAvailability).filter(v => v > 0).length;
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-28 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-lg mx-auto text-center border-0 shadow-2xl">
              <CardContent className="py-10 sm:py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Booking Submitted! ⏳
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your booking is pending confirmation. We'll notify you at{" "}
                  <span className="font-medium text-foreground">{formData.email}</span>{" "}
                  once confirmed.
                </p>
                <div className="bg-muted/50 rounded-xl p-5 text-left mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full text-sm">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDate && format(selectedDate, "PPP")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-primary text-lg">₹{selectedServiceData?.price}</span>
                  </div>
                </div>
                <Alert className="text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You'll receive an email once your booking is confirmed by our team. 
                    Payment will be collected after confirmation.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wider mb-4">
              <CalendarIcon className="w-3.5 h-3.5" />
              Book Your Session
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Reserve Your Spot
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Book your transformative wellness experience in just a few steps.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8 sm:mb-12 max-w-2xl mx-auto overflow-x-auto py-2">
            {steps.map((s, index) => (
              <div key={s.num} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-semibold transition-all",
                      step >= s.num
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 font-medium hidden sm:block",
                    step >= s.num ? "text-primary" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      "w-12 sm:w-16 md:w-24 h-1 mx-2 sm:mx-3 rounded-full transition-colors",
                      step > s.num ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto border-0 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-xl sm:text-2xl">
                {step === 1 && "Select Your Service"}
                {step === 2 && "Choose Your Date"}
                {step === 3 && "Pick a Time Slot"}
                {step === 4 && "Enter Your Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 md:p-8">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                isDataLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-5 rounded-xl border-2 border-border/50 space-y-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-5 w-3/4 rounded" />
                        <Skeleton className="h-4 w-1/2 rounded" />
                        <Skeleton className="h-6 w-20 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {services.map((service) => {
                      const IconComponent = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={cn(
                            "p-4 sm:p-5 rounded-xl border-2 text-left transition-all hover:border-primary group",
                            selectedService === service.id
                              ? "border-primary bg-primary/5 shadow-lg"
                              : "border-border hover:shadow-md"
                          )}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                            selectedService === service.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          )}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                            {service.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                            <Clock className="w-3.5 h-3.5" />
                            {service.duration}
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-primary">
                            ₹{service.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              )}

              {/* Step 2: Date Selection */}
              {step === 2 && (
                <div className="flex flex-col items-center gap-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || isDateBlocked(date)}
                    className="rounded-xl border shadow-sm"
                  />
                  {blockedDates.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Some dates may be unavailable due to maintenance or holidays.
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Time Selection */}
              {step === 3 && (
                <div className="space-y-4">
                  {isCheckingSlots ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                      {timeSlots.map((_, i) => (
                        <Skeleton key={i} className="h-12 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {getAvailableSlotsCount() === 0 ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No slots available for this date. Please select a different date.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          {getAvailableSlotsCount()} time slots available for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                        </p>
                      )}
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                        {timeSlots.map((time) => {
                          const available = slotAvailability[time] || 0;
                          const isAvailable = available > 0;
                          return (
                            <button
                              key={time}
                              onClick={() => isAvailable && setSelectedTime(time)}
                              disabled={!isAvailable}
                              className={cn(
                                "py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all text-sm sm:text-base relative",
                                !isAvailable && "opacity-50 cursor-not-allowed bg-muted border-border line-through",
                                isAvailable && selectedTime === time
                                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                                  : isAvailable 
                                    ? "border-border text-foreground hover:border-primary hover:shadow-md"
                                    : "border-border text-muted-foreground"
                              )}
                            >
                              {time}
                              {!isAvailable && (
                                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                                  Full
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 4: User Details */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-xl p-5 space-y-3 mt-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Booking Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{selectedServiceData?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{selectedDate && format(selectedDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">₹{selectedServiceData?.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Payment will be collected after your booking is confirmed.
                    </p>
                  </div>
                </form>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-6 sm:mt-8 gap-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="h-11 sm:h-12"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button onClick={handleNext} disabled={!canProceed()} className="h-11 sm:h-12">
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceed() || isLoading} className="h-11 sm:h-12">
                    {isLoading ? "Submitting..." : "Submit Booking"}
                    <Check className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default BookingPage;
