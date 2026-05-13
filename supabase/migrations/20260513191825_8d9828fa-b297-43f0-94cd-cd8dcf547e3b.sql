
CREATE TABLE public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_access_requests_status ON public.access_requests(status, created_at DESC);

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can submit a request
CREATE POLICY "Anyone can submit access request"
ON public.access_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(btrim(email)) BETWEEN 3 AND 255
  AND full_name IS NOT NULL
  AND length(btrim(full_name)) BETWEEN 1 AND 200
  AND status = 'pending'
);

-- Only admins (allowed_users) can view all requests
CREATE POLICY "Admins can view access requests"
ON public.access_requests
FOR SELECT
TO authenticated
USING (public.is_allowed_user());

-- Only admins can update (approve / reject)
CREATE POLICY "Admins can update access requests"
ON public.access_requests
FOR UPDATE
TO authenticated
USING (public.is_allowed_user())
WITH CHECK (public.is_allowed_user());

-- Only admins can delete
CREATE POLICY "Admins can delete access requests"
ON public.access_requests
FOR DELETE
TO authenticated
USING (public.is_allowed_user());

CREATE TRIGGER access_requests_updated_at
BEFORE UPDATE ON public.access_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
