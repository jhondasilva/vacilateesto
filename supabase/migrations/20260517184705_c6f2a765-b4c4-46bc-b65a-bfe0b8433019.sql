
-- ============ ALTERNATIVA A (Portugal 1° Grupo K) ============
-- Ciudades: Kansas City (3 jul) → Vancouver (7 jul) → Kansas City (11 jul) → Atlanta SF propia (15 jul)
UPDATE trip_cities SET
  start_date='2026-07-02', end_date='2026-07-04',
  vibe='ALTERNATIVA A (Portugal 1°K) • R32 - Match 87 (Arrowhead)'
WHERE id='88963415-e9f7-4b2a-ab7e-d2e9f2b747c8';

UPDATE trip_cities SET
  start_date='2026-07-05', end_date='2026-07-08',
  vibe='ALTERNATIVA A (Portugal 1°K) • Octavos - Match 96 (BC Place)'
WHERE id='130f4cf2-0ced-497b-8186-e17cc581dfe3';

UPDATE trip_cities SET
  start_date='2026-07-09', end_date='2026-07-12',
  vibe='ALTERNATIVA A (Portugal 1°K) • Cuartos - Match 100 (Arrowhead)'
WHERE id='483eed7c-084b-41a2-a654-535e9a650985';

-- Atlanta SF2 (Match 102) es la SF "propia" de Alt A
UPDATE trip_cities SET
  vibe='ALTERNATIVA A (Portugal 1°K) • Semifinal - Match 102 (Mercedes-Benz, Atlanta)'
WHERE id='a1a71a47-1a47-4a01-b1a1-71a471a47101';

-- Dallas SF1 (Match 101) queda como side-trip
UPDATE trip_cities SET
  vibe='Semifinal 1 - Match 101 (AT&T Stadium, Dallas) - side-trip'
WHERE id='a1d4115a-5e51-4a01-b1a1-d4a115a5e510';

-- Activities Alt A
UPDATE trip_activities SET
  title='16avos de Final — Match 87',
  description='Portugal (1° Grupo K) vs mejor 3° de Grupos D/E/I/J/L. Arrowhead Stadium, Kansas City.',
  activity_date='2026-07-03', activity_time='20:30',
  location='Arrowhead Stadium, Kansas City MO'
WHERE id='d4228baf-4c1e-442b-9bfc-8b1c31805201';

UPDATE trip_activities SET
  title='Octavos de Final — Match 96',
  description='Ganador Match 87 (Portugal) vs Ganador Match 85 (1° Grupo B vs mejor 3° E/F/G/I/J). BC Place, Vancouver.',
  activity_date='2026-07-07', activity_time='13:00',
  location='BC Place Stadium, Vancouver BC'
WHERE id='4840c41e-914d-4e15-a25a-07f89baa6655';

UPDATE trip_activities SET
  title='Cuartos de Final — Match 100',
  description='Ganador Match 95 vs Ganador Match 96 (Portugal). Arrowhead Stadium, Kansas City.',
  activity_date='2026-07-11', activity_time='20:00',
  location='Arrowhead Stadium, Kansas City MO'
WHERE id='06c18674-4f5d-49c0-818e-a9a1471c1e17';

-- ============ ALTERNATIVA B (Portugal 2° Grupo K) ============
-- Ciudades: Toronto (2 jul) → Dallas (6 jul) → Los Angeles (10 jul) → Dallas SF propia (14 jul)
UPDATE trip_cities SET
  city='Toronto', country='Canadá',
  start_date='2026-07-01', end_date='2026-07-03',
  vibe='ALTERNATIVA B (Portugal 2°K) • R32 - Match 83 (BMO Field)'
WHERE id='095d39d9-a898-4c65-8ecc-2a17776406f9';

UPDATE trip_cities SET
  city='Dallas', country='USA',
  start_date='2026-07-04', end_date='2026-07-07',
  vibe='ALTERNATIVA B (Portugal 2°K) • Octavos - Match 93 (AT&T Stadium)'
WHERE id='fee72600-e84f-43c6-b70f-b1b183b77d5c';

UPDATE trip_cities SET
  city='Los Angeles', country='USA',
  start_date='2026-07-08', end_date='2026-07-11',
  vibe='ALTERNATIVA B (Portugal 2°K) • Cuartos - Match 98 (SoFi Stadium)'
WHERE id='67a8da12-c8d5-4b6e-828a-ca466eb49590';

-- Alt B SF propia: Match 101 en Dallas (AT&T). Reescribimos 204 como Dallas, y 205 (anteriormente Dallas) como side-trip Atlanta
UPDATE trip_cities SET
  city='Dallas', country='USA',
  start_date='2026-07-12', end_date='2026-07-15',
  vibe='ALTERNATIVA B (Portugal 2°K) • Semifinal - Match 101 (AT&T Stadium, Dallas)'
WHERE id='8bd70aa5-72ca-48cc-b38a-cd4c464a2545';

UPDATE trip_cities SET
  city='Atlanta', country='USA',
  start_date='2026-07-15', end_date='2026-07-16',
  vibe='Semifinal 2 - Match 102 (Mercedes-Benz, Atlanta) - side-trip'
WHERE id='b2d4115a-5e51-4b02-b2a1-d4a115a5e520';

-- Activities Alt B
UPDATE trip_activities SET
  title='16avos de Final — Match 83',
  description='Portugal (2° Grupo K) vs 2° Grupo L. BMO Field, Toronto.',
  activity_date='2026-07-02', activity_time='19:00',
  location='BMO Field, Toronto ON'
WHERE id='b16c3040-9ef2-4b6f-a727-d34de36318f2';

UPDATE trip_activities SET
  title='Octavos de Final — Match 93',
  description='Ganador Match 83 (Portugal) vs Ganador Match 84 (1° Grupo H vs 2° Grupo J). AT&T Stadium, Arlington/Dallas.',
  activity_date='2026-07-06', activity_time='14:00',
  location='AT&T Stadium, Arlington TX'
WHERE id='bb3ee07f-2a36-45ca-87e9-f533b3a62973';

UPDATE trip_activities SET
  title='Cuartos de Final — Match 98',
  description='Ganador Match 93 (Portugal) vs Ganador Match 94 (W81 vs W82). SoFi Stadium, Inglewood/Los Ángeles.',
  activity_date='2026-07-10', activity_time='12:00',
  location='SoFi Stadium, Inglewood CA'
WHERE id='4aecc28a-7d42-492b-9f17-50068dc2c464';
