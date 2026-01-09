-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  benefits TEXT[],
  is_combo BOOLEAN DEFAULT false,
  original_price DECIMAL(10,2),
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  payment_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  feedback TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_url TEXT,
  video_thumbnail TEXT,
  is_video BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  location TEXT,
  image_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_slots table for booking management
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_time TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blocked_dates table for admin to block specific dates
CREATE TABLE public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or staff
CREATE OR REPLACE FUNCTION public.is_admin_or_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'staff')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all services" ON public.services FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for testimonials (public read, admin write)
CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can view all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for events (public read, admin write)
CREATE POLICY "Anyone can view visible events" ON public.events FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can view all events" ON public.events FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for gallery_images (public read, admin write)
CREATE POLICY "Anyone can view visible gallery images" ON public.gallery_images FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can view all gallery images" ON public.gallery_images FOR SELECT TO authenticated USING (public.is_admin_or_staff(auth.uid()));
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for time_slots (public read, admin write)
CREATE POLICY "Anyone can view active time slots" ON public.time_slots FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage time slots" ON public.time_slots FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- RLS Policies for blocked_dates (public read, admin write)
CREATE POLICY "Anyone can view blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked dates" ON public.blocked_dates FOR ALL TO authenticated USING (public.is_admin_or_staff(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default time slots
INSERT INTO public.time_slots (slot_time, capacity) VALUES
  ('09:00 AM', 2),
  ('10:00 AM', 2),
  ('11:00 AM', 2),
  ('12:00 PM', 2),
  ('01:00 PM', 2),
  ('02:00 PM', 2),
  ('03:00 PM', 2),
  ('04:00 PM', 2),
  ('05:00 PM', 2),
  ('06:00 PM', 2),
  ('07:00 PM', 2),
  ('08:00 PM', 2);

-- Insert default services
INSERT INTO public.services (name, short_description, description, duration_minutes, price, benefits, is_combo, display_order) VALUES
  ('Ice Bath Therapy', 'Cold immersion for recovery', 'Cold immersion therapy designed to reduce inflammation, improve circulation, and enhance mental toughness.', 30, 1500.00, ARRAY['Muscle recovery', 'Reduced soreness', 'Improved focus', 'Stress regulation'], false, 1),
  ('Jacuzzi Therapy', 'Warm hydrotherapy relaxation', 'Warm hydrotherapy for muscle relaxation and nervous system calm.', 45, 1200.00, ARRAY['Muscle relaxation', 'Improved blood flow', 'Stress relief'], false, 2),
  ('Steam Bath', 'Detoxifying heat therapy', 'Detoxifying heat therapy for relaxation and respiratory health.', 30, 1000.00, ARRAY['Detox', 'Skin rejuvenation', 'Mental relaxation'], false, 3),
  ('Ice Bath + Steam Combo', 'Ultimate recovery experience', 'Combine cold and heat therapy for maximum recovery benefits.', 60, 2200.00, ARRAY['Enhanced recovery', 'Better circulation', 'Full body rejuvenation'], true, 4),
  ('Ice Bath + Jacuzzi Combo', 'Contrast therapy experience', 'Alternate between cold and warm for optimal muscle recovery.', 75, 2400.00, ARRAY['Contrast therapy', 'Deep relaxation', 'Muscle recovery'], true, 5),
  ('Full Recovery Combo', 'Complete wellness package', 'Experience all three therapies for the ultimate recovery session.', 90, 3200.00, ARRAY['Complete recovery', 'Maximum benefits', 'Premium experience'], true, 6);

-- Insert sample testimonials
INSERT INTO public.testimonials (customer_name, feedback, rating, is_video, display_order) VALUES
  ('Rahul M.', 'The ice bath experience was incredible! I felt so energized after my session. The staff was professional and the facility is top-notch.', 5, false, 1),
  ('Priya S.', 'As an athlete, recovery is crucial. Chill Thrive has become my weekly ritual. The combo packages are amazing value!', 5, false, 2),
  ('Amit K.', 'I was skeptical at first, but after trying the steam + ice bath combo, I''m hooked. Best wellness investment I''ve made.', 5, false, 3);