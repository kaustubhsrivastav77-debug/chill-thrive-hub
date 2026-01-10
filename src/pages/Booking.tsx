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
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  const { toast } = useToast();

  useEffect(() => {
    fetchServicesAndSlots();
  }, []);

  const fetchServicesAndSlots = async () => {
    setIsDataLoading(true);
    const [servicesRes, slotsRes] = await Promise.all([
      supabase.from("services").select("id, name, price, duration_minutes").eq("is_active", true),
      supabase.from("time_slots").select("slot_time").eq("is_active", true).order("slot_time"),
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
    }
    setIsDataLoading(false);
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
      const { error } = await supabase.from("bookings").insert({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service_id: selectedService,
        booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        time_slot: selectedTime || "",
        payment_amount: selectedServiceData?.price || 0,
      });

      if (error) throw error;

      // Try to send confirmation email (won't fail if not configured)
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
      toast({ title: "Booking confirmed!", description: "We'll see you soon!" });
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
      case 3: return selectedTime !== null;
      case 4: return formData.name && formData.phone && formData.email;
      default: return false;
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-28 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-lg mx-auto text-center border-0 shadow-2xl">
              <CardContent className="py-10 sm:py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for booking with ChillThrive. We've sent a confirmation 
                  to <span className="font-medium text-foreground">{formData.email}</span>.
                </p>
                <div className="bg-muted/50 rounded-xl p-5 text-left mb-6 space-y-3">
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
                <p className="text-sm text-muted-foreground">
                  Please arrive 10 minutes before your scheduled time. 
                  Payment can be made at the venue.
                </p>
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
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-xl border shadow-sm"
                  />
                </div>
              )}

              {/* Step 3: Time Selection */}
              {step === 3 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 px-2 sm:px-4 rounded-xl border-2 font-medium transition-all hover:border-primary text-sm sm:text-base",
                        selectedTime === time
                          ? "border-primary bg-primary text-primary-foreground shadow-lg"
                          : "border-border text-foreground hover:shadow-md"
                      )}
                    >
                      {time}
                    </button>
                  ))}
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
                    {isLoading ? "Confirming..." : "Confirm Booking"}
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
