# Preflight PAN read-only access (sin mutaciones)

## Estado verificado
- HEAD = `3d4d809aba9288e23732952eda00378434a4a311`, sin cambios.
- SHA256 del parche coincide (`a5a0999d…ee7`), 2.484 líneas.
- Runtimes disponibles en el entorno: `deno` y `psql`. El `psql` apunta a la única base de Lovable Cloud, que sirve tanto a la vista previa como al sitio publicado. No hay base de staging.

## 1. Pruebas
- Build y typecheck: el sistema los corre solo después de aplicar los cambios. Las pruebas Deno y las unitarias se pueden correr aquí.
- SQL/RLS: no hay base que no sea de producción. Opción sin costo: un Postgres temporal en /tmp (`nix run nixpkgs#postgresql`) con roles `anon`/`authenticated`/`service_role` y `auth.uid()` simulados, fixtures y ROLLBACK, y luego se borra. Esto prueba la lógica de las políticas, pero no reproduce Supabase. Los fixtures nunca se corren contra producción. En producción solo se hacen chequeos negativos de solo lectura con una sesión real.

## 2. Credencial de los jobs 2 y 4
- La SERVICE_ROLE no está disponible en Lovable Cloud y `generate_secret` no deja ver el valor, así que no puede ponerse en el texto del cron.
- Ruta propuesta, sin que nadie vea el secreto ni haga falta un formulario: (a) por SQL, `vault.create_secret(encode(gen_random_bytes(32),'hex'),'pan_cron_token')`. El valor se genera dentro de la base y no se lee. (b) Una función `service_role`-only `pan_access_private.verify_cron_token(text) returns boolean`. (c) `cron.alter_job(2|4, command := …)` con el mismo id, horario, URL y payload. Solo se agrega un header `x-cron-token` que lee Vault al momento de ejecutarse. (d) Cambiar los guards de `brand-cache-refresh` y `vem-cache-refresh` para aceptar el Bearer de usuario/servicio O un token válido según (b). No hay fallback anónimo.
- Se necesita tu aprobación para el paso (c), por tocar jobs existentes con `run_sql`. Si prefieres no usar Vault, me detengo: no hay otro formulario oficial que sirva.

## 3. Orden seguro (en la siguiente vuelta)
1. Migración: helpers privados, `get_pan_access_context()`, `apify_metrics_by_month` INVOKER. Es aditiva y solo restringe al rol nuevo, que todavía no tiene usuarios.
2. Vault token, `verify_cron_token` y `alter_job` de los jobs 2 y 4. Comprobar con `cron.job` (sin leer `command`) y esperar o forzar una sola ejecución de verificación sin proveedor de pago. Los dos jobs solo leen caché, así que hay que confirmarlo antes.
3. Desplegar `pan-dashboard-read` (nuevo, solo SELECT) y probar 401/403 sin sesión y con sesión admin.
4. Desplegar los guards restrictivos de las dos funciones de caché y verificar el siguiente tick de cron por logs y estado.
5. Frontend y publicación.
- Bloqueo real: las funciones se despliegan cuando se escriben sus archivos. Por eso los archivos de los pasos 3 y 4 se escriben solo después de verificar los pasos 1 y 2.

## 4. Defectos materiales a revisar antes de aplicar
- `verify_jwt = true` en config para las funciones de caché: con las llaves de firma nuevas, el gateway puede rechazar tokens válidos. El guard del handler basta, así que propongo dejarlo en `false`.
- El parche asume que los jobs cron llevan Bearer de SERVICE_ROLE, y eso no se puede proveer. Se reemplaza por el token de Vault (punto 2).
- El clasificador sigue compartido en `panDashboard.ts`. Antes de publicar se verifica el conteo de 591 (436 + 155) sobre 2.095 filas con una consulta de solo lectura.
- No se crea ningún usuario ni membresía para Daniella.

## Aprobaciones requeridas
- Aprobar este plan, incluido el patrón de token generado en Vault (sin formulario y sin mostrar el secreto).
