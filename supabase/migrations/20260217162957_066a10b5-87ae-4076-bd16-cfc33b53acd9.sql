
-- Allow authenticated users to insert their own role during signup
CREATE POLICY "Users can insert own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert their own shop_staff record during signup
CREATE POLICY "Users can insert own staff record"
ON public.shop_staff
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
