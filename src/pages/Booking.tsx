import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Snowflake, 
  Waves, 
  CloudFog, 
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const services = [
  { id: "ice-bath", name: "Ice Bath Therapy", price: 1500, duration: "60 min", icon: Snowflake },
  { id: "jacuzzi", name: "Jacuzzi Therapy", price: 1200, duration: "45 min", icon: Waves },
  { id: "steam", name: "Steam Bath", price: 800, duration: "30 min", icon: CloudFog },
  { id: "ice-steam", name: "Ice + Steam Combo", price: 1999, duration: "75 min", icon: Sparkles },
  { id: "ice-jacuzzi", name: "Ice + Jacuzzi Combo", price: 2299, duration: "90 min", icon: Sparkles },
  { id: "full-combo", name: "Full Recovery Combo", price: 2999, duration: "120 min", icon: Sparkles },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
        <section className="py-20 md:py-28 min-h-[70vh] flex items-center">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="py-12">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for booking with ChillThrive. We've sent a confirmation 
                  to {formData.email}.
                </p>
                <div className="bg-muted rounded-lg p-4 text-left mb-6 space-y-2">
                  <p><strong>Service:</strong> {selectedServiceData?.name}</p>
                  <p><strong>Date:</strong> {selectedDate && format(selectedDate, "PPP")}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Amount:</strong> ₹{selectedServiceData?.price}</p>
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
      <section className="py-16 md:py-20 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book Your Session
            </h1>
            <p className="text-muted-foreground text-lg">
              Reserve your spot for a transformative wellness experience.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Progress */}
          <div className="flex items-center justify-center mb-12 max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      "w-16 md:w-24 h-1 mx-2 transition-colors",
                      step > s ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                {step === 1 && "Select Service"}
                {step === 2 && "Choose Date"}
                {step === 3 && "Select Time Slot"}
                {step === 4 && "Your Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:border-primary",
                        selectedService === service.id
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <service.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-1">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </div>
                      <div className="text-lg font-bold text-primary">
                        ₹{service.price}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Date Selection */}
              {step === 2 && (
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border"
                  />
                </div>
              )}

              {/* Step 3: Time Selection */}
              {step === 3 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 px-4 rounded-lg border-2 font-medium transition-all hover:border-primary",
                        selectedTime === time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: User Details */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-muted rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-foreground">Booking Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Service:</strong> {selectedServiceData?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Date:</strong> {selectedDate && format(selectedDate, "PPP")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      Total: ₹{selectedServiceData?.price}
                    </p>
                  </div>
                </form>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back
                </Button>

                {step < 4 ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Next
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!canProceed()}>
                    Confirm Booking
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
