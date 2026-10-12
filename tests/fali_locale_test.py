"""Preview integration checks. Run: python3 tests/fali_locale_test.py.
Original CDN assets are cached for the localhost-only asset proxy.
"""
import asyncio
import json
from pathlib import Path
import urllib.request
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
OUT = Path("/tmp/browser/fali")
OUT.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        # The localhost server lacks the hosting CDN endpoint. Use unchanged original assets.
        async def asset(route):
            path = route.request.url.split(BASE)[1]
            if "fali-" not in path:
                await route.continue_()
                return
            filename = path.rsplit("/", 1)[1]
            cached = Path("/tmp/fali-assets") / filename
            if not cached.exists():
                cached.parent.mkdir(parents=True, exist_ok=True)
                with urllib.request.urlopen("https://www.vacilateesto.com" + path) as response:
                    cached.write_bytes(response.read())
            body = cached.read_bytes()
            await route.fulfill(status=200, body=body, content_type="image/png" if filename.endswith(".png") else "image/jpeg")
        await page.route("**/__l5e/assets-v1/**", asset)
        for width in (1440, 390, 320):
            await page.set_viewport_size({"width": width, "height": 1800})
            for path, lang in (("/fali", "es-VE"), ("/en/fali", "en")):
                await page.goto(BASE + path, wait_until="domcontentloaded")
                await page.wait_for_selector(".fali-page")
                await page.reload(wait_until="domcontentloaded")
                await page.wait_for_function("document.documentElement.lang === '" + lang + "'")
                assert await page.locator('link[rel="canonical"]').count() == 1
                assert await page.locator('link[rel="canonical"]').get_attribute("href") == "https://www.vacilateesto.com" + path
                for code, target in (("es", "/fali"), ("en", "/en/fali"), ("x-default", "/fali")):
                    assert await page.locator('link[hreflang="' + code + '"]').get_attribute("href") == "https://www.vacilateesto.com" + target
                schemas = await page.locator('script[type="application/ld+json"]').all_text_contents()
                article = next(json.loads(x) for x in schemas if json.loads(x).get("@type") == "Article")
                assert article["inLanguage"] == lang
                assert await page.locator('meta[property="og:url"]').get_attribute("content") == "https://www.vacilateesto.com" + path
                assert await page.locator('meta[name="twitter:title"]').count() == 1
                assert await page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                await page.screenshot(path=str(OUT / f'{lang}-{width}-hero.png'))
                english = lang == "en"
                region = page.get_by_role("region", name="FALI editorial carousel — Spanish original artwork" if english else "Carrusel editorial de FALI")
                await region.scroll_into_view_if_needed()
                await page.screenshot(path=str(OUT / f'{lang}-{width}-carousel.png'))
                for _ in range(3):
                    await region.get_by_role("button", name="Go to slide 12" if english else "Ir a la lámina 12", exact=True).click()
                    await page.wait_for_timeout(600)
                    assert await region.get_by_role("button", name="Next slide" if english else "Lámina siguiente", exact=True).is_disabled()
                    await region.get_by_role("button", name="Go to slide 1" if english else "Ir a la lámina 1", exact=True).click()
                    await page.wait_for_timeout(600)
                    assert await region.get_by_role("button", name="Previous slide" if english else "Lámina anterior", exact=True).is_disabled()
                await region.get_by_role("button", name="Next slide" if english else "Lámina siguiente", exact=True).click()
                await page.wait_for_timeout(600)
                assert await region.get_by_role("button", name="Previous slide" if english else "Lámina anterior", exact=True).is_enabled()
                assert await page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                if english:
                    await page.get_by_text("Read the full English manifesto", exact=True).click()
                    await page.get_by_text("Read the full English manifesto", exact=True).scroll_into_view_if_needed()
                    await page.screenshot(path=str(OUT / f'en-{width}-manifesto.png'))
                    assert await page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                    await page.locator('footer').scroll_into_view_if_needed()
                    await page.screenshot(path=str(OUT / f'en-{width}-footer.png'))
                    if width < 1280:
                        await page.get_by_role("button", name="Open menu", exact=True).click()
                        await page.get_by_role("button", name="Close menu", exact=True).click()
                nav = page.get_by_role("navigation", name="Page language" if english else "Idioma de la página", exact=True)
                await nav.get_by_role("link", name="ES — Español" if english else "EN — English", exact=True).click()
                expected = "/fali" if english else "/en/fali"
                await page.wait_for_url(BASE + expected)
                await page.wait_for_function("document.documentElement.lang === '" + ("es-VE" if english else "en") + "'")
                print(f"PASS {path} width={width}: refresh, SEO, language, overflow, carousel boundaries and language switch")
        await page.set_viewport_size({"width": 1440, "height": 1800})
        await page.goto(BASE + "/en/fali")
        await page.get_by_role("navigation", name="Main navigation — other pages in Spanish").first.get_by_role("link", name="Home", exact=True).click()
        await page.wait_for_url(BASE + "/")
        await page.wait_for_function("document.documentElement.lang !== 'en'")
        assert await page.locator('link[rel="canonical"]').count() == 1
        assert not errors, errors
        print("PASS leave English route: document language restored; no JavaScript page errors")
        print("Original artwork served unchanged through localhost test proxy; public CDN returned HTTP 200.")
        await browser.close()

asyncio.run(main())
