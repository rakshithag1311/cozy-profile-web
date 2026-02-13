
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'shopkeeper');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Shops table
CREATE TABLE public.shops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  prep_time TEXT NOT NULL DEFAULT '10-15 mins',
  image TEXT NOT NULL DEFAULT '🏪',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Shop staff linking table
CREATE TABLE public.shop_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_id TEXT REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  UNIQUE (user_id, shop_id)
);
ALTER TABLE public.shop_staff ENABLE ROW LEVEL SECURITY;

-- Shop items table
CREATE TABLE public.shop_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  shop_id TEXT REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '',
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;

-- Orders table
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_id TEXT REFERENCES public.shops(id) NOT NULL,
  shop_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_price NUMERIC NOT NULL DEFAULT 0,
  pickup_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'cancelled', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: users see own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles: users can read own roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Shops: everyone can read
CREATE POLICY "Anyone can view shops" ON public.shops FOR SELECT USING (true);

-- Shop items: everyone can read
CREATE POLICY "Anyone can view shop items" ON public.shop_items FOR SELECT USING (true);

-- Shop staff: staff can see own assignments
CREATE POLICY "Staff can view own assignments" ON public.shop_staff FOR SELECT USING (auth.uid() = user_id);

-- Orders: customers see own orders
CREATE POLICY "Customers can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Orders: shopkeepers see their shop's orders
CREATE POLICY "Shopkeepers can view shop orders" ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.shop_staff WHERE shop_staff.user_id = auth.uid() AND shop_staff.shop_id = orders.shop_id));
CREATE POLICY "Shopkeepers can update shop orders" ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.shop_staff WHERE shop_staff.user_id = auth.uid() AND shop_staff.shop_id = orders.shop_id));

-- Seed demo shops
INSERT INTO public.shops (id, name, category, description, prep_time, image) VALUES
  ('shop-1', 'Sharma General Store', 'Grocery', 'Daily essentials and household items', '10-15 mins', '🏪'),
  ('shop-2', 'Annapurna Bakery', 'Bakery', 'Fresh bread, cakes and pastries', '15-20 mins', '🍞'),
  ('shop-3', 'Quick Stop Convenience', 'Convenience', 'Snacks, drinks and quick bites', '5-10 mins', '🏬'),
  ('shop-4', 'Green Basket Organics', 'Organic', 'Fresh organic fruits and vegetables', '10-15 mins', '🥬'),
  ('shop-5', 'Chai & Bites Cafe', 'Cafe', 'Tea, coffee and light snacks', '10-15 mins', '☕'),
  ('shop-6', 'Mumbai Snack Corner', 'Snacks', 'Street food and savory snacks', '10-15 mins', '🍿');

-- Seed demo items
INSERT INTO public.shop_items (id, shop_id, name, price, category) VALUES
  ('item-1', 'shop-1', 'Rice (1kg)', 60, 'Grains'),
  ('item-2', 'shop-1', 'Dal (1kg)', 120, 'Pulses'),
  ('item-3', 'shop-1', 'Sugar (1kg)', 45, 'Essentials'),
  ('item-4', 'shop-1', 'Tea Powder (250g)', 80, 'Beverages'),
  ('item-5', 'shop-1', 'Cooking Oil (1L)', 150, 'Essentials'),
  ('item-6', 'shop-2', 'Bread Loaf', 40, 'Bread'),
  ('item-7', 'shop-2', 'Butter Croissant', 60, 'Pastry'),
  ('item-8', 'shop-2', 'Chocolate Cake (500g)', 350, 'Cakes'),
  ('item-9', 'shop-2', 'Puff Pastry', 25, 'Pastry'),
  ('item-10', 'shop-2', 'Cookies (Pack)', 80, 'Biscuits'),
  ('item-11', 'shop-3', 'Chips (Large)', 30, 'Snacks'),
  ('item-12', 'shop-3', 'Cold Drink (500ml)', 40, 'Drinks'),
  ('item-13', 'shop-3', 'Instant Noodles', 15, 'Quick Meals'),
  ('item-14', 'shop-3', 'Biscuit Pack', 20, 'Snacks'),
  ('item-15', 'shop-3', 'Chocolate Bar', 50, 'Sweets'),
  ('item-16', 'shop-4', 'Organic Tomatoes (500g)', 40, 'Vegetables'),
  ('item-17', 'shop-4', 'Organic Spinach', 30, 'Vegetables'),
  ('item-18', 'shop-4', 'Organic Apples (500g)', 120, 'Fruits'),
  ('item-19', 'shop-4', 'Organic Honey (250g)', 200, 'Pantry'),
  ('item-20', 'shop-4', 'Brown Rice (1kg)', 90, 'Grains'),
  ('item-21', 'shop-5', 'Masala Chai', 20, 'Beverages'),
  ('item-22', 'shop-5', 'Cold Coffee', 60, 'Beverages'),
  ('item-23', 'shop-5', 'Samosa (2 pcs)', 30, 'Snacks'),
  ('item-24', 'shop-5', 'Sandwich', 50, 'Snacks'),
  ('item-25', 'shop-5', 'Vada Pav', 25, 'Snacks'),
  ('item-26', 'shop-6', 'Pani Puri', 30, 'Street Food'),
  ('item-27', 'shop-6', 'Bhel Puri', 40, 'Street Food'),
  ('item-28', 'shop-6', 'Sev Puri', 35, 'Street Food'),
  ('item-29', 'shop-6', 'Dahi Puri', 45, 'Street Food'),
  ('item-30', 'shop-6', 'Ragda Pattice', 50, 'Street Food');
