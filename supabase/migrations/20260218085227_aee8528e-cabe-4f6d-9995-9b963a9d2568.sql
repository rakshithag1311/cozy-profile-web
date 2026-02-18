
-- Allow shopkeepers to create shops
CREATE POLICY "Shopkeepers can create shops"
ON public.shops
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'shopkeeper'));

-- Allow shopkeepers to update their own shops
CREATE POLICY "Shopkeepers can update own shops"
ON public.shops
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM shop_staff
  WHERE shop_staff.user_id = auth.uid() AND shop_staff.shop_id = shops.id
));
