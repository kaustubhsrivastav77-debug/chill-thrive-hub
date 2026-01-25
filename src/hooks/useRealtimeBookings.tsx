import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface NewBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
}

export function useRealtimeBookings(onNewBooking?: (booking: NewBooking) => void) {
  const { toast } = useToast();
  const { isStaff, loading } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const showNotification = useCallback((booking: NewBooking) => {
    // Show toast notification
    toast({
      title: "🎉 New Booking!",
      description: `${booking.customer_name} booked for ${booking.booking_date} at ${booking.time_slot}`,
      duration: 5000,
    });

    // Browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New Booking!", {
        body: `${booking.customer_name} booked for ${booking.booking_date} at ${booking.time_slot}`,
        icon: "/favicon.ico",
      });
    }

    // Callback for custom handling
    onNewBooking?.(booking);
  }, [toast, onNewBooking]);

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;
    
    // Only subscribe if staff/admin
    if (!isStaff) {
      console.log("Realtime: User is not staff, skipping subscription");
      return;
    }

    // Prevent duplicate subscriptions
    if (channelRef.current) {
      console.log("Realtime: Channel already exists");
      return;
    }

    console.log("Realtime: Setting up booking notifications...");

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Subscribe to new bookings
    channelRef.current = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Realtime: New booking received", payload);
          const newBooking = payload.new as NewBooking;
          showNotification(newBooking);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Realtime: Booking updated", payload);
          const updatedBooking = payload.new as NewBooking;
          if (payload.old && (payload.old as NewBooking).status !== updatedBooking.status) {
            toast({
              title: "Booking Updated",
              description: `${updatedBooking.customer_name}'s booking is now ${updatedBooking.status}`,
              duration: 3000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        setIsSubscribed(status === "SUBSCRIBED");
      });

    return () => {
      if (channelRef.current) {
        console.log("Realtime: Cleaning up subscription");
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsSubscribed(false);
      }
    };
  }, [isStaff, loading, showNotification, toast]);

  return { isSubscribed };
}

export function RealtimeNotificationProvider({ children }: { children: React.ReactNode }) {
  useRealtimeBookings();
  return <>{children}</>;
}
