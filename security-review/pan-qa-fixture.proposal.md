# Propuesta (NO desplegada): helper `pan-qa-fixture`

Este helper solo existe para la prueba de aislamiento P.A.N. No hay ninguna función actual que sirva sin riesgo: `brand-user-create` hace `updateUserById(..., { password })` cuando el correo ya existe, así que podría resetear la contraseña de una persona real.

## Límites del helper
- Solo lo puede llamar un admin estándar con sesión confirmada (`get_pan_access_context` = standard y `is_allowed_user`). Cualquier sesión `pan_readonly` recibe 403.
- Solo acepta correos que cumplan `^pan-qa-[a-z0-9]{12}@example\.invalid$`. No hay otros parámetros de identidad ni de marca. La marca está fija en harina-pan (`2d249115-…`).
- Acción `create`, con la contraseña aleatoria enviada por el runtime de prueba:
  1. Aborta si el correo ya existe en Auth o en `brand_users`. Nunca actualiza un usuario existente.
  2. Inserta primero `brand_users(brand_id=harina-pan, user_id=NULL, email, access_mode='pan_readonly')`. El trigger registra el marcador restringido por correo antes de que exista cualquier identidad.
  3. Llama a `auth.admin.createUser({ email, password, email_confirm: true })`. No envía invitación ni correo.
  4. Vincula `user_id` en esa fila. El trigger agrega el marcador por UUID.
  5. Si falla el paso 3 o el 4, borra solo la fila del paso 2 (el marcador por correo se queda).
  6. Devuelve solo `{ userId }`, nunca la contraseña.
- Acción `disable`, recibe `userId`:
  - Solo actúa si ese usuario tiene un correo con el patrón QA y un marcador restringido.
  - Llama a `auth.admin.updateUserById(id, { ban_duration: '876000h' })`, que es reversible.
  - Borra solo su fila `pan_readonly` de `brand_users` y conserva los marcadores.
  - Inserta un registro de auditoría con `{ user_id, email, revoked_brand_id, at }`.
  - No borra nunca al usuario de Auth.
- No hace logs de cuerpos ni de tokens. Las respuestas llevan `Cache-Control: no-store`.

## Cambio de base de datos que se necesita (pendiente)
```sql
CREATE TABLE pan_access_private.qa_fixture_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, email text NOT NULL, action text NOT NULL,
  revoked_brand_id uuid, at timestamptz NOT NULL DEFAULT now());
ALTER TABLE pan_access_private.qa_fixture_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pan_access_private.qa_fixture_audit FROM PUBLIC, anon, authenticated;
GRANT INSERT, SELECT ON pan_access_private.qa_fixture_audit TO service_role;
```

## Flujo de prueba después de aprobarlo
El runtime genera el correo y la contraseña, llama a `create` con tu sesión de admin e inicia sesión con la cuenta QA, todo en memoria. Después corre la batería de pruebas, luego `disable`, luego confirma que el JWT retenido ya no da acceso, y descarta las credenciales. Al final, el helper se elimina del proyecto o queda deshabilitado.
