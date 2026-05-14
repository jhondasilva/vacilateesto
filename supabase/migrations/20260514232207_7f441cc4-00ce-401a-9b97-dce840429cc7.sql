
UPDATE public.trip_activities
SET
  title = 'MEX → EWR',
  airline = 'United Airlines',
  flight_number = 'UA1064',
  departure_time = '07:10',
  arrival_time = '14:15',
  cost_usd = 1639.48,
  cost_estimate_usd = 1639.48,
  cabin_class = 'Economy (H)',
  duration = '5h 5min',
  status = 'confirmed',
  description = 'Confirmación APNXN2 · Asientos 20D (Juan) y 20F (Jhon) · Economy Plus · Visa ****3894',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'destination_city', 'New York',
    'confirmation', 'APNXN2',
    'passengers', jsonb_build_array('MARTINEZ/JUANCARLOS','DASILVA/JHON'),
    'fare_breakdown', jsonb_build_object(
      'airfare_per_pax', 511,
      'taxes_per_pax', 140.74,
      'total_per_pax', 651.74,
      'seats_total', 336,
      'grand_total', 1639.48
    )
  ),
  updated_at = now()
WHERE id = 'adc649e9-47c1-4957-bc29-13bc57260326';

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
  'conjunto',
  'tarjeta_corp',
  '2026-05-14',
  'transporte',
  'Vuelo UA1064 MEX→EWR (12 jun) · 2 pax · Economy + Economy Plus seats · Conf. APNXN2',
  'United Airlines',
  1639.48,
  'USD',
  '70a00eef-27c0-4bcc-b5b0-a5b4d7806b08',
  'submitted',
  'Visa ****3894. Airfare 2x$511 + taxes 2x$140.74 + Economy Plus seats 2x$168 = $1,639.48'
);
