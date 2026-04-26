-- Tabla de reportes de gastos diarios
CREATE TABLE public.expense_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reporter_email TEXT NOT NULL,
  reporter_name TEXT,
  -- A quién pertenece el gasto: 'juan' | 'jhon' | 'conjunto'
  paid_by TEXT NOT NULL DEFAULT 'conjunto',
  -- Forma de pago: 'tarjeta_corp' | 'tarjeta_personal' | 'efectivo' | 'transferencia' | 'otro'
  payment_method TEXT NOT NULL DEFAULT 'tarjeta_corp',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT,
  description TEXT,
  merchant TEXT,
  amount_usd NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  amount_original NUMERIC(10,2),
  city_id UUID,
  receipt_url TEXT,
  ai_extracted JSONB,
  status TEXT NOT NULL DEFAULT 'submitted',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.expense_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowed users can view expense reports"
ON public.expense_reports FOR SELECT
TO authenticated
USING (is_allowed_user());

CREATE POLICY "Allowed users can insert their own expense reports"
ON public.expense_reports FOR INSERT
TO authenticated
WITH CHECK (is_allowed_user() AND auth.uid() = user_id);

CREATE POLICY "Allowed users can update their own expense reports"
ON public.expense_reports FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allowed users can delete their own expense reports"
ON public.expense_reports FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER expense_reports_updated_at
BEFORE UPDATE ON public.expense_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_expense_reports_date ON public.expense_reports(expense_date DESC);
CREATE INDEX idx_expense_reports_paid_by ON public.expense_reports(paid_by);
CREATE INDEX idx_expense_reports_user ON public.expense_reports(user_id);

-- Bucket de storage privado para los recibos
INSERT INTO storage.buckets (id, name, public)
VALUES ('expense-receipts', 'expense-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas del bucket: cada usuario gestiona su propio folder
CREATE POLICY "Allowed users can view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'expense-receipts' AND is_allowed_user());

CREATE POLICY "Allowed users can upload their own receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'expense-receipts'
  AND is_allowed_user()
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allowed users can delete their own receipts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'expense-receipts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);