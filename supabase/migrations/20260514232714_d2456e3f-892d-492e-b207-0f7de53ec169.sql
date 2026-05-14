
UPDATE public.trip_activities
SET
  title = 'IAH → MUC (UA102)',
  airline = 'United Airlines',
  flight_number = 'UA102',
  departure_time = '16:40',
  arrival_time = '09:45',
  cost_usd = 0,
  cabin_class = 'Economy Plus',
  duration = '10h 5min',
  status = 'confirmed',
  description = 'Confirmación ANYY3D · Solo Jhon (DASILVA/JHON) · Asiento Economy Plus · Llegada vie 19 jun · Visa ****3894',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'destination_city', 'Munich',
    'confirmation', 'ANYY3D',
    'passengers', jsonb_build_array('DASILVA/JHON'),
    'eticket', '0162102797304'
  ),
  updated_at = now()
WHERE id = '8ebf11cc-292e-4904-930c-9ebd4ab1ca90';

UPDATE public.trip_activities
SET
  title = 'MUC → NCE (UA9481)',
  airline = 'United Airlines (operado por Lufthansa)',
  flight_number = 'UA9481',
  departure_time = '11:05',
  arrival_time = '12:35',
  cost_usd = 0,
  cabin_class = 'Classic seat',
  duration = '1h 30min',
  status = 'confirmed',
  description = 'Confirmación ANYY3D · Solo Jhon · Operado por Lufthansa · Visa ****3894',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'destination_city', 'Cannes',
    'confirmation', 'ANYY3D',
    'passengers', jsonb_build_array('DASILVA/JHON'),
    'operated_by', 'Lufthansa'
  ),
  updated_at = now()
WHERE id = '32e0cffb-58f2-466f-9f93-38739c596363';

INSERT INTO public.expense_reports (
  user_id, reporter_email, reporter_name,
  paid_by, payment_method, expense_date,
  category, description, merchant,
  amount_usd, currency, city_id,
  status, notes
) VALUES (
  'ab2884a3-4b86-4f6e-a922-e5ebaf85302e',
  'jhondasilva@gmail.com',
  'Jhon DaSilva',
  'jhon',
  'tarjeta_corp',
  '2026-05-14',
  'transporte',
  'Asientos vuelo UA102/UA9481 IAH→MUC→NCE (18-19 jun) · Solo Jhon · Conf. ANYY3D',
  'United Airlines',
  240.44,
  'USD',
  '108d4e1f-5d01-4ebf-898f-425c46dc49b8',
  'submitted',
  'Visa ****3894. Economy Plus IAH-MUC $223.99 + Classic seat (Lufthansa) MUC-NCE $16.45 = $240.44. NO incluye airfare base (no aparece en captura).'
);
