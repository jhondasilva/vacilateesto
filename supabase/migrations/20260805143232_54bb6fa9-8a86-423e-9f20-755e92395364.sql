CREATE TABLE public.press_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  outlet text NOT NULL,
  email text NOT NULL,
  phone text,
  request_type text NOT NULL,
  event text,
  preferred_date date,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nuevo',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.press_requests TO anon;
GRANT INSERT, SELECT ON public.press_requests TO authenticated;
GRANT ALL ON public.press_requests TO service_role;

ALTER TABLE public.press_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a press request"
ON public.press_requests FOR INSERT TO anon, authenticated
WITH CHECK (
  length(full_name) BETWEEN 2 AND 120
  AND length(outlet) BETWEEN 2 AND 160
  AND length(email) BETWEEN 5 AND 255
  AND length(message) BETWEEN 10 AND 2000
);

CREATE POLICY "Team can read press requests"
ON public.press_requests FOR SELECT TO authenticated
USING (public.is_allowed_user());