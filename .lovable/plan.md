# Autenticación interna de los dos cron y activación segura de PAN

Estado: no aplicado. El alcance PAN y la publicación ya están autorizados. Esta revisión reemplaza el plan anterior, que tenía errores, y cambia el mecanismo de credencial del bundle.

## Correcciones al plan anterior
- `brand-cache-refresh` y `vem-cache-refresh` ya tienen `verify_jwt=false`, así que no se cambia. `pan-dashboard-read` conserva la verificación de sesión. Si aparece una incompatibilidad real, se diagnostica antes de tocar nada.
- Los dos cron no son solo lectura: llaman a `metricool-brand-mentions`. No se ejecutan, no se fuerza ningún tick y no se usa un refresh como prueba.
- El parche no afirma que los cron tengan SERVICE_ROLE; señala que no llevan Authorization.
- El Postgres temporal local prueba RLS real con fixtures y rollback, pero no equivale a Auth/REST/Storage de Supabase. En la base de producción no se corren fixtures ni escrituras de prueba.

## Operación propuesta
1. Generar una credencial aleatoria de 256 bits dentro de una transacción SQL y guardarla directamente en Vault con un nombre versionado. El valor no se devuelve, no se imprime y no entra al código ni al chat. No se reutilizan ni se leen secretos existentes.
2. Guardar solo su SHA-256 y el alcance fijo (`brand-cache-refresh`, `vem-cache-refresh`) en una tabla del esquema privado, con RLS y sin grants a anon ni authenticated.
3. Crear un RPC de lectura del digest solo para `service_role`, sin parámetros. Será un wrapper invoker más un helper definer con search_path fijo. PUBLIC, anon y authenticated quedan sin EXECUTE.
4. Solo esas dos funciones aceptan el header `x-cron-token`. Comparan el SHA-256 del token contra el digest en tiempo constante, sin registrar headers ni tokens. Se conservan el Bearer de servicio y el control de usuario estándar. Si el token falta, es inválido o el verificador no está disponible, se niega el acceso antes de llamar al proveedor. Los otros siete gates no aceptan este token.
5. Dentro de una transacción, `cron.alter_job` para los jobs 2 y 4 cambia solo la parte de autenticación, con referencia a Vault en tiempo de ejecución. Se conservan id, nombre, estado, URL, payload y los horarios `0 10 * * *` / `0 6 * * *`. Se guarda una copia privada para recuperación. Si el comando tiene una forma inesperada, se aborta. Los postchecks internos verifican que el resto quedó idéntico.

## Pruebas y orden
1. Pruebas Deno y unitarias, más SQL/RLS en un Postgres temporal local, aplicando el parche en una copia en /tmp antes de escribir funciones en rutas que se despliegan solas. Se reporta qué es real, qué es simulado y qué falta.
2. Transacción de SQL con preflight y postchecks; ante cualquier fallo, ROLLBACK. La tabla de restringidos empieza vacía.
3. Configurar credencial y cron antes de los gates. La comprobación de autenticación termina tras validar la identidad, antes de cualquier lectura, escritura o llamada externa, y solo devuelve éxito o negación. Si necesita endpoint o flag nuevo, se muestra el diff exacto antes de desplegar.
4. Desplegar el endpoint PAN y correr pruebas negativas con una identidad legítima. Un JWT admin no prueba el aislamiento PAN. Si no existe una identidad de prueba limitada, se reporta como dependencia y no se da acceso a Daniella antes de tiempo.
5. Después: gates, frontend y publicación. Validar sesiones, logout, API cruda, exports, otras marcas, admin/finanzas y la equivalencia de 591 publicaciones (436 + 155). La invitación queda para después de QA.

## Rotación y recuperación
- Rotación (acción aparte): nueva versión interna, digest viejo y nuevo aceptados temporalmente solo para los dos targets, actualizar cron, verificar sin proveedores y desactivar el viejo. No se borran secretos.
- Si falla la transacción inicial: rollback, sin desplegar ni activar.
- Si falla después del cron: no se vuelve a un bypass anónimo ni se cambian horarios; se corrige hacia adelante o se detiene la publicación dependiente.
- Hoy no existe ningún usuario limitado.

## Decisión requerida
Aprobar la creación interna de esta credencial en Vault y del verificador por digest restringido.
