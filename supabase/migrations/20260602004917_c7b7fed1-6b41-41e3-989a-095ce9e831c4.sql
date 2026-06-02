UPDATE public.trip_cities
SET 
  accommodation_name = 'The Code Hotel',
  accommodation_address = '2 Bedroom Deluxe Suite w/ Balcony, Austin, TX, Estados Unidos',
  accommodation_status = 'confirmed',
  accommodation_notes = E'Reserva confirmada — pagada con tarjeta de Samuel\nNúmero de confirmación: 5791599515\nCódigo PIN: 5697\nHabitación: 2 Bedroom Deluxe Suite w/ Balcony\nCheck-in: dom 14 jun 2026\nCheck-out: mar 16 jun 2026\nEmail de confirmación: jhondasilva@gmail.com',
  end_date = '2026-06-16',
  nights = 2,
  hotel_cost_usd = 364.51,
  nightly_rate_usd = 182.26,
  hotel_price_range = '$180 - $185',
  booking_url = 'https://www.booking.com/',
  updated_at = now()
WHERE id = '869c031d-0f86-4deb-aa79-652558847f80';