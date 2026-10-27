import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// These are proposal-contract and identity-model tests, NOT executed PostgreSQL/RLS tests.
const sql = readFileSync(new URL('../security-review/pan-readonly.proposal.sql', import.meta.url), 'utf8');
const PAN = '2d249115-874e-40c6-aa58-9cf66f05c651';
const PAN_ALIAS = '58721091-bc10-4a44-bd54-a8c1c3aafd5a';
const normalize = (s) => s?.trim().toLowerCase();
const matches = (user, link) => !!user && (link.userId === user.id ||
  (user.confirmed && normalize(link.email) === normalize(user.email)));
const strictMatch = (user, link) => matches(user, link) && (link.userId == null || link.userId === user.id);
const registryFor = (links) => links.filter((l) => l.mode === 'pan_readonly').map((l) => ({ userId: l.userId, email: normalize(l.email) }));
const isRestricted = (user, links, registry = registryFor(links)) => !!user && registry.some((r) =>
  (r.userId != null && r.userId === user.id) || (user.confirmed && r.email === normalize(user.email)));
const oldBrandAccess = (user, links, brandId) => links.some((l) => l.brand === brandId && matches(user, l));
const brandAccess = (user, links, brandId, registry = registryFor(links)) => links.some((l) => l.brand === brandId && matches(user, l) &&
  ((l.mode === 'standard' && !isRestricted(user, links, registry)) ||
   (l.mode === 'pan_readonly' && [PAN, PAN_ALIAS].includes(l.brand) && strictMatch(user, l))));
const context = (user, links, adminEmails = [], registry = registryFor(links)) => {
  const restricted = isRestricted(user, links, registry);
  const admin = !!user?.confirmed && !restricted && adminEmails.map(normalize).includes(normalize(user.email));
  const standardLink = links.some((l) => l.mode === 'standard' && matches(user, l));
  const pan = [PAN, PAN_ALIAS].some((b) => brandAccess(user, links, b, registry));
  return { access_mode: restricted ? 'pan_readonly' : (user?.confirmed && (admin || standardLink)) ? 'standard' : 'none',
    can_read_pan: !!user?.confirmed && (admin || pan) };
};
const user = { id: 'fixture-pan', email: 'pan@example.invalid', confirmed: true };
const restrictedLink = { userId: user.id, email: user.email, mode: 'pan_readonly', brand: PAN };

test('proposal is transaction-wrapped, has no individual grants or data writes', () => {
  assert.match(sql, /\nBEGIN;[\s\S]+\nCOMMIT;\s*$/);
  const topLevelSql = sql.replace(/\$function\$[\s\S]*?\$function\$/g, '');
  assert.doesNotMatch(topLevelSql, /^\s*(INSERT\s+INTO|UPDATE\s+public\.|DELETE\s+FROM)\b/im);
  assert.doesNotMatch(sql, /daniella\.rivero@|password\s*[:=]|service_role_key\s*[:=]/i);
  assert.match(sql, /ADD COLUMN access_mode text NOT NULL DEFAULT 'standard'/);
  assert.match(sql, /access_mode IN \('standard', 'pan_readonly'\)/);
  assert.match(sql, /brand_id IS NOT NULL AND brand_id IN/);
});

test('all raw datasets and Storage get restrictive ALL policies with USING and WITH CHECK', () => {
  for (const table of ['public.brand_metricool_cache', 'public.influencer_posts', 'public.apify_metrics',
    'public.brand_reports', 'storage.objects']) {
    const statement = sql.split(';').find((s) => s.includes(` ON ${table} AS RESTRICTIVE`));
    assert.ok(statement, table);
    assert.match(statement, /FOR ALL TO authenticated/);
    assert.match(statement, /USING \(NOT \(SELECT pan_access_private\.is_pan_readonly_user\(\)\)\)/);
    assert.match(statement, /WITH CHECK \(NOT \(SELECT pan_access_private\.is_pan_readonly_user\(\)\)\)/);
  }
  assert.doesNotMatch(sql, /AS PERMISSIVE/);
});

test('authorization helpers use current Auth state, not editable or stale claims', () => {
  assert.match(sql, /FROM auth\.users u/);
  assert.match(sql, /u\.id = \(SELECT auth\.uid\(\)\)/);
  assert.match(sql, /u\.email_confirmed_at IS NOT NULL/);
  assert.doesNotMatch(sql, /auth\.jwt\(|raw_user_meta_data|user_metadata|request\.jwt\.claims/);
  const functions = [...sql.matchAll(/CREATE(?: OR REPLACE)? FUNCTION[\s\S]*?\$function\$;/g)];
  assert.equal(functions.length, 7);
  for (const [fn] of functions) assert.match(fn, /SET search_path = ''/);
});

test('context RPC returns one self-scoped JSON object via an invoker wrapper', () => {
  assert.match(sql, /CREATE FUNCTION public\.get_pan_access_context\(\)\s+RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER/);
  assert.match(sql, /'access_mode',[\s\S]+WHEN restricted THEN 'pan_readonly'/);
  assert.match(sql, /'can_read_pan', confirmed AND \(admin OR pan\)/);
  assert.match(sql, /WHEN confirmed AND \(admin OR standard_link\) THEN 'standard'/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.get_pan_access_context\(\) FROM PUBLIC, anon/);
  assert.doesNotMatch(sql, /GRANT\s+EXECUTE[^;]+TO\s+(?:PUBLIC|anon)\b/i);
});

test('aggregate RPC cannot bypass RLS through SECURITY DEFINER or anonymous EXECUTE', () => {
  assert.match(sql, /ALTER FUNCTION public\.apify_metrics_by_month\(text, text\) SECURITY INVOKER/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.apify_metrics_by_month\(text, text\) FROM PUBLIC, anon/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.apify_metrics_by_month\(text, text\) TO authenticated, service_role/);
  assert.doesNotMatch(sql, /CREATE(?: OR REPLACE)? FUNCTION public\.apify_metrics_by_month/);
});

test('restricted mode blocks admin even if an accidental allowed_users entry exists', () => {
  assert.deepEqual(context(user, [restrictedLink], [user.email]), { access_mode: 'pan_readonly', can_read_pan: true });
  assert.match(sql, /SELECT NOT pan_access_private\.is_pan_readonly_user\(\) AND EXISTS/);
});

test('restricted mode wins over additional other-brand or standard PAN links', () => {
  const links = [restrictedLink, { ...restrictedLink, mode: 'standard', brand: 'other-brand' },
    { ...restrictedLink, mode: 'standard', brand: PAN_ALIAS }];
  assert.equal(brandAccess(user, links, PAN), true);
  assert.equal(brandAccess(user, links, PAN_ALIAS), false);
  assert.equal(brandAccess(user, links, 'other-brand'), false);
});

test('restricted UUID blocks raw access even before confirmation; endpoint access remains false', () => {
  const unconfirmed = { ...user, confirmed: false };
  assert.equal(isRestricted(unconfirmed, [restrictedLink]), true);
  assert.deepEqual(context(unconfirmed, [restrictedLink]), { access_mode: 'pan_readonly', can_read_pan: false });
});

test('email-only pending links require the current confirmed email', () => {
  const link = { ...restrictedLink, userId: null, email: ' PAN@EXAMPLE.INVALID ' };
  assert.equal(isRestricted(user, [link]), true);
  assert.equal(isRestricted({ ...user, confirmed: false }, [link]), false);
  assert.equal(isRestricted({ ...user, email: 'changed@example.invalid' }, [link]), false);
});

test('after UUID binding, a recycled or stale email cannot authorize a second identity', () => {
  const other = { ...user, id: 'different-user' };
  assert.equal(isRestricted(other, [restrictedLink]), true);
  assert.equal(brandAccess(other, [restrictedLink], PAN), false);
  assert.deepEqual(context(other, [restrictedLink]), { access_mode: 'pan_readonly', can_read_pan: false });
});

test('membership revocation never restores legacy wildcard raw access to an active token', () => {
  const registry = registryFor([restrictedLink]);
  assert.deepEqual(context(user, [], [], registry), { access_mode: 'pan_readonly', can_read_pan: false });
  assert.equal(isRestricted({ id: user.id, email: null, confirmed: false }, [], registry), true);
  const accidentalStandard = [{ ...restrictedLink, mode: 'standard' }];
  assert.equal(brandAccess(user, accidentalStandard, PAN, registry), false);
  assert.deepEqual(context(user, accidentalStandard, [user.email], registry), { access_mode: 'pan_readonly', can_read_pan: false });
  assert.match(sql, /CREATE TABLE pan_access_private\.restricted_principals/);
  assert.match(sql, /AFTER INSERT OR UPDATE OF access_mode, user_id, email ON public\.brand_users/);
  assert.doesNotMatch(sql, /(?:DELETE FROM|REFERENCES auth\.users)[^;]*restricted_principals/);
});

test('anonymous and unrelated users have no scoped PAN capability', () => {
  assert.deepEqual(context(null, [restrictedLink]), { access_mode: 'none', can_read_pan: false });
  assert.deepEqual(context({ id: 'unrelated', email: 'other@example.invalid', confirmed: true }, [restrictedLink]),
    { access_mode: 'none', can_read_pan: false });
});

test('verified users of another standard brand stay standard without gaining PAN', () => {
  const link = { ...restrictedLink, mode: 'standard', brand: 'other-brand' };
  assert.deepEqual(context(user, [link]), { access_mode: 'standard', can_read_pan: false });
  assert.deepEqual(context({ ...user, confirmed: false }, [link]), { access_mode: 'none', can_read_pan: false });
  assert.deepEqual(context(user, []), { access_mode: 'none', can_read_pan: false });
});

test('valid standard account brand access keeps the pre-change behavior', () => {
  for (const confirmed of [false, true]) {
    for (const linkUserId of [user.id, null, 'other-id']) {
      for (const linkEmail of [user.email, 'unrelated@example.invalid']) {
        const current = { ...user, confirmed };
        const links = [{ userId: linkUserId, email: linkEmail, mode: 'standard', brand: 'other-brand' }];
        assert.equal(brandAccess(current, links, 'other-brand'), oldBrandAccess(current, links, 'other-brand'));
      }
    }
  }
});
