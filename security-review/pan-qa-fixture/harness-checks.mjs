// Pure assertions only: safe to test locally without credentials or network.
export const denied = status => status === 401 || status === 403;
export const emptyRead = (status, body) => denied(status) || (status === 200 && Array.isArray(body) && body.length === 0);
export function validPan(status, body, userId) {
  return status === 200 && body?.schemaVersion === 1 && body?.authorization?.userId === userId
    && Array.isArray(body.posts) && body.posts.length === 591
    && body.posts.filter(p => p.initiative === 'pelotica').length === 436
    && body.posts.filter(p => p.initiative === 'cumbre').length === 155
    && body.posts.every(p => typeof p.key === 'string' && ['pelotica', 'cumbre'].includes(p.initiative));
}
export function sameCanonical(a, b) {
  if (!Array.isArray(a?.posts) || !Array.isArray(b?.posts)) return false;
  const sorted = xs => [...xs].sort((x, y) => String(x.key).localeCompare(String(y.key)));
  return JSON.stringify(sorted(a.posts)) === JSON.stringify(sorted(b.posts))
    && JSON.stringify(a.coverage) === JSON.stringify(b.coverage);
}
export const onlyPanBrand = (status, body) => status === 200 && Array.isArray(body)
  && body.length === 1 && body[0]?.slug === 'harina-pan';
export function storageDenied(status, body) {
  // Storage can intentionally return Object not found for an unauthorized EXISTING object.
  // The harness must first prove the identical path is signable by the owner.
  return denied(status) || ([400, 404].includes(status)
    && ['not_found', 'NoSuchKey', 'AccessDenied', 'Unauthorized', 'Forbidden'].includes(body?.code ?? body?.error));
}
