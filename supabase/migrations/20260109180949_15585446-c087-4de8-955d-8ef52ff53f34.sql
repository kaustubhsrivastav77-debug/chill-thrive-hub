-- Fix the overly permissive bookings insert policy
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

-- Create a more specific policy that requires valid customer data
CREATE POLICY "Anyone can create bookings with valid data" ON public.bookings
FOR INSERT
WITH CHECK (
  customer_name IS NOT NULL AND 
  customer_email IS NOT NULL AND 
  customer_phone IS NOT NULL AND
  booking_date IS NOT NULL AND
  time_slot IS NOT NULL
);