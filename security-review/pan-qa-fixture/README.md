# pan-qa-fixture — propuesta (NO aplicada, NO desplegada)

Base: HEAD `912d4bf` (commit "Pausó pruebas P.A.N. y cron", posterior a `8c18d2b`; solo añadió `security-review/`).

## Hallazgo de capacidades
No existe herramienta oficial de Lovable para crear, banear o cerrar sesión de usuarios Auth.
Las herramientas de auth disponibles solo configuran ajustes globales (registro, confirmación, proveedores)
o generan sesiones para cuentas existentes. La única vía oficial de Auth Admin es la API admin dentro de una
función del servidor. `brand-user-create` queda descartada (resetea contraseñas de cuentas existentes).

## Archivos
- `migration.sql` — tablas privadas singleton + 6 RPC solo `service_role`.
- `index.ts` — función de un solo uso (destino: `supabase/functions/pan-qa-fixture/index.ts`), `verify_jwt = false` en config, guard propio.
- `run-once.ts` — harness: contraseña aleatoria solo en memoria, try/finally.
- `invariants.test.mjs` — pruebas estáticas (`node --test security-review/pan-qa-fixture/`).

## Garantías
- Email `pan-qa-<16 hex>@example.invalid` y UUID generados en SQL; sin entradas de email/marca/user_id.
- Marcador restringido (user + email) insertado por el trigger existente ANTES de que exista Auth; GoTrue recibe `id` planificado y se verifica igualdad.
- Ligado al UUID del admin verificado; fila singleton: un solo run en toda la vida del proyecto.
- Plazo de creación 10 min (solo limita `confirm`; no expira JWT existentes).
- Fallos: banea solo el UUID recién creado; revoca solo la fila `brand_users` del run.
- Nunca borra el usuario Auth ni el marcador; auditoría con snapshot no secreto para re-otorgar.
- Tras `close`: 410 permanente; luego se elimina la función desplegada.

## Ciclo (un solo proceso)
```
begin → createUser(id) → confirm → [pruebas con sesión real]
finally: disable (ban + mark_banned + revoke) → JWT retenido debe dar 0/401 → signOut global → close → 410
```

## Recuperación si se interrumpe
`pan_qa_status()` conserva run_id y UUID. Volver a ejecutar solo `{"action":"disable"}` (idempotente, opera
sobre el UUID registrado) y luego `close`. Si el Auth user nunca se creó, `disable` falla en ban: entonces
`pan_qa_revoke` vía la misma función deja el estado `revoked`; el marcador persiste sin usuario (inofensivo).

## Próxima acción de herramientas (requiere aprobación explícita)
1. `lov_database--migration` name `pan_qa_fixture` con `migration.sql`.
2. Copiar `index.ts` a `supabase/functions/pan-qa-fixture/` + `[functions.pan-qa-fixture] verify_jwt = false`; `supabase--deploy_edge_functions ["pan-qa-fixture"]`.
3. `lovable auth-session --json --self` (admin) y `bun security-review/pan-qa-fixture/run-once.ts`.
4. `supabase--delete_edge_functions ["pan-qa-fixture"]` y retirar el archivo.
