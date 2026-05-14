
-- 1) Trigger BEFORE INSERT: bloquea duplicados recientes (mismas claves, últimos 10 min)
CREATE OR REPLACE FUNCTION public.prevent_duplicate_expense_reports()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id
  FROM public.expense_reports
  WHERE user_id = NEW.user_id
    AND expense_date = NEW.expense_date
    AND paid_by = NEW.paid_by
    AND payment_method = NEW.payment_method
    AND ROUND(amount_usd::numeric, 2) = ROUND(NEW.amount_usd::numeric, 2)
    AND COALESCE(merchant, '') = COALESCE(NEW.merchant, '')
    AND created_at > now() - interval '10 minutes'
  LIMIT 1;

  IF existing_id IS NOT NULL THEN
    RAISE NOTICE 'Duplicate expense_report ignored (existing id: %)', existing_id;
    RETURN NULL;  -- cancela el INSERT silenciosamente
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_duplicate_expense_reports ON public.expense_reports;
CREATE TRIGGER trg_prevent_duplicate_expense_reports
BEFORE INSERT ON public.expense_reports
FOR EACH ROW
EXECUTE FUNCTION public.prevent_duplicate_expense_reports();

-- 2) Función de limpieza para duplicados ya existentes
CREATE OR REPLACE FUNCTION public.cleanup_duplicate_expense_reports()
RETURNS TABLE(deleted_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt integer;
BEGIN
  WITH ranked AS (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, expense_date, paid_by, payment_method,
                     ROUND(amount_usd::numeric, 2), COALESCE(merchant, '')
        ORDER BY created_at ASC
      ) AS rn
    FROM public.expense_reports
  ),
  del AS (
    DELETE FROM public.expense_reports
    WHERE id IN (SELECT id FROM ranked WHERE rn > 1)
    RETURNING 1
  )
  SELECT COUNT(*)::int INTO cnt FROM del;

  RETURN QUERY SELECT cnt;
END;
$$;
