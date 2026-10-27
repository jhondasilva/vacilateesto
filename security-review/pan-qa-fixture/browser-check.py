#!/usr/bin/env python3
"""REVIEW ONLY. Real browser QA, input via stdin; no screenshots/traces/storage-state files.
Never logs Playwright errors, page text, response bodies or credential-bearing input.
Only a cloned owner session is used; logout is guarded to the synthetic QA UUID.
"""
import asyncio
import json
import sys
import time
from urllib.parse import urlsplit

async def check(data):
    try:
        from playwright.async_api import async_playwright
    except Exception:
        return {"availability": "unavailable"}
    base = str(data.get("base", "")).rstrip("/")
    host = urlsplit(base).hostname
    if host not in ("localhost", "127.0.0.1", "id-preview--e605f7b3-13a8-4831-a700-f72f946f3344.lovable.app", "vacilateesto.com"):
        return {"availability": "invalid_target"}
    qa_id = data.get("expectedQaId")
    qa = data.get("qaSession") or {}
    owner = data.get("ownerSession") or {}
    if not qa_id or qa.get("user", {}).get("id") != qa_id or owner.get("user", {}).get("id") == qa_id:
        return {"availability": "invalid_identity"}
    if not isinstance(owner.get("expires_at"), (int, float)) or owner["expires_at"] < time.time() + 150:
        return {"availability": "owner_session_refresh_would_be_required"}
    checks = {}
    unexpected_functions = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context()  # never persists browser/session state
        page = await ctx.new_page()
        async def safe_route(route):
            url = urlsplit(route.request.url)
            if url.hostname not in (host, "dpgvanocynbrmqvgvgvd.supabase.co"):
                await route.abort()
            elif "/functions/v1/" in url.path and url.path.rstrip("/").split("/")[-1] != "pan-dashboard-read":
                unexpected_functions.append(True)  # do not record URL/body/headers
                await route.abort()
            else:
                await route.continue_()
        await ctx.route("**/*", safe_route)
        try:
            await page.goto(base + "/dashboard", wait_until="domcontentloaded")
            # Existing Vite development client, not an injected new privileged client or external CDN.
            available = await page.evaluate("""async () => {
              try { const m = await import('/src/integrations/supabase/client.ts'); window.__qaClient = m.supabase; await m.supabase.auth.stopAutoRefresh(); return !!m.supabase; }
              catch { return false; }
            }""")
            if not available:
                return {"availability": "source_client_unavailable"}
            owner_ok = await page.evaluate("""async s => {
              const r = await window.__qaClient.auth.setSession({access_token:s.access_token,refresh_token:s.refresh_token});
              return !r.error && r.data.user?.id === s.user.id;
            }""", owner)
            await page.wait_for_timeout(2500)
            links = await page.locator("a[href^='/dashboard/']").evaluate_all("els => els.map(e => e.getAttribute('href'))")
            brands = [x for x in links if x.count("/") == 2 and x.split("/")[-1] not in ("login", "admin", "comunidad")]
            checks["owner_home"] = bool(owner_ok and len(set(brands)) > 1)
            other = next((x for x in brands if x.split("/")[-1] not in ("harina-pan", "pan-pdg")), None)
            switched = await page.evaluate("""async s => {
              const r = await window.__qaClient.auth.setSession({access_token:s.access_token,refresh_token:s.refresh_token});
              return !r.error && r.data.user?.id === s.user.id;
            }""", qa)
            # No page reload: exercises identity changes and clearing the previous user's cached home.
            await page.wait_for_timeout(6500)
            now_links = await page.locator("a[href^='/dashboard/']").evaluate_all("els => els.map(e => e.getAttribute('href'))")
            checks["identity_cache_clear"] = bool(switched and not any(x in now_links for x in brands if x.split("/")[-1] not in ("harina-pan", "pan-pdg")))
            checks["pan_screen"] = bool("/dashboard/harina-pan" in page.url and await page.get_by_text("591", exact=True).count() > 0)
            if other:
                await page.goto(base + other, wait_until="domcontentloaded")
                await page.wait_for_timeout(4000)
                checks["other_brand_route"] = await page.get_by_text("Marca no disponible.", exact=True).count() > 0
            else:
                checks["other_brand_route"] = None
            for name, path in (("admin_route", "/dashboard/admin"), ("finance_route", "/gira")):
                await page.goto(base + path, wait_until="domcontentloaded")
                await page.wait_for_timeout(4000)
                denied_text = await page.locator("body").evaluate("e => /no autorizado|acceso denegado|no tienes permiso|sin acceso|iniciar sesión/i.test(e.innerText)")
                # Unknown/blank UI is inconclusive, never a fabricated authorization pass.
                checks[name] = True if urlsplit(page.url).path != path or denied_text else None
            await page.goto(base + "/dashboard/harina-pan", wait_until="domcontentloaded")
            await page.wait_for_timeout(3500)
            # Re-import after full-route reload. Verify synthetic ID before any logout call.
            logged_out = await page.evaluate("""async expected => {
              const m = await import('/src/integrations/supabase/client.ts');
              const before = await m.supabase.auth.getSession();
              if (before.data.session?.user.id !== expected) return false;
              const result = await m.supabase.auth.signOut({scope:'global'});
              const after = await m.supabase.auth.getSession();
              return !result.error && !after.data.session;
            }""", qa_id)
            checks["qa_logout"] = bool(logged_out)
            await page.wait_for_timeout(2500)
            checks["logout_private_screen_cleared"] = bool(logged_out and "/dashboard/login" in page.url
                and await page.get_by_text("591", exact=True).count() == 0)
            checks["no_unexpected_functions"] = not unexpected_functions
            return {"availability": "ready", "checks": checks}
        except Exception:
            # Partial browser checks are not enough to claim the sequence passed.
            return {"availability": "error", "checks": checks}
        finally:
            await ctx.close()
            await browser.close()

try:
    incoming = json.loads(sys.stdin.read())
    output = asyncio.run(check(incoming))
    incoming = None
except Exception:
    output = {"availability": "error"}
print(json.dumps(output))
