import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";

interface NewBooking {
  id: string;
  customer_name: string;
  booking_date: string;
  time_slot: string;
  status: string;
}

export function useRealtimeBookings(onNewBooking?: (booking: NewBooking) => void) {
  const { toast } = useToast();
  const { isStaff } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const showNotification = useCallback((booking: NewBooking) => {
    // Show toast notification
    toast({
      title: "🎉 New Booking!",
      description: `${booking.customer_name} booked for ${booking.booking_date} at ${booking.time_slot}`,
      duration: 5000,
    });

    // Play notification sound (optional)
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors (user hasn't interacted yet)
      });
    } catch {
      // Ignore audio errors
    }

    // Callback for custom handling
    onNewBooking?.(booking);
  }, [toast, onNewBooking]);

  useEffect(() => {
    if (!isStaff) return;

    // Subscribe to new bookings
    channelRef.current = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
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
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [isStaff, showNotification, toast]);

  return null;
}

export function RealtimeNotificationProvider({ children }: { children: React.ReactNode }) {
  useRealtimeBookings();
  return <>{children}</>;
}
