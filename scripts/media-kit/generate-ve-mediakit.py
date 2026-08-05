from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
import os
import json

# Fuente única de métricas (compartida con la web: src/data/mediaKitMetrics.json)
with open("src/data/mediaKitMetrics.json", encoding="utf-8") as _f:
    M = json.load(_f)
K = M["kpis"]
FB = M["facebook"]

OUT = "public/downloads/VacilateEsto-MediaKit-2026.pdf"
W, H = letter

LIB = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype"
pdfmetrics.registerFont(TTFont("Helvetica", f"{LIB}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Bold", f"{LIB}/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Oblique", f"{LIB}/LiberationSans-Italic.ttf"))

PINK = HexColor("#E91E63")
CYAN = HexColor("#22D3EE")
INK  = HexColor("#0A0A0A")
SOFT = HexColor("#F5F5F4")
MUT  = HexColor("#737373")

PAGES = 8
TITLE = "Vacílate Esto 2026 — Media Kit"

# ───────── LOGOS (identidad gráfica) ─────────
def _trim(src, dst):
    if os.path.exists(dst):
        return dst
    im = Image.open(src).convert("RGBA")
    bbox = im.split()[3].getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(dst)
    return dst

LOGO_VE  = _trim("src/assets/logo-vacilate-esto.png",  "/tmp/mk-logo-ve.png")
LOGO_VEF = _trim("src/assets/logo-vacilate-futbol.png", "/tmp/mk-logo-vef.png")

def draw_logo(c, path, x, y, max_w, max_h, align="left"):
    img = ImageReader(path)
    iw, ih = img.getSize()
    s = min(max_w/iw, max_h/ih)
    w, h = iw*s, ih*s
    if align == "right":
        x = x - w
    elif align == "center":
        x = x - w/2
    c.drawImage(img, x, y + (max_h-h)/2, width=w, height=h, mask="auto")
    return w

def logo_badge(c, path, x, y, w, h, shadow=CYAN, pad=8):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+3, y-3, w, h, 10, fill=1, stroke=1)
    c.setFillColor(white)
    c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    draw_logo(c, path, x+w/2, y+pad, w-2*pad, h-2*pad, align="center")

def header(c, page):
    draw_logo(c, LOGO_VE, 36, H-34, 24, 22)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(66, H-26,
        "VACÍLATE ESTO  ·  FUN EDUCAITMENT  ·  CARACAS — MIAMI — MADRID  ·  PODCAST · STREAMING · REELS · LIVE")
    c.drawRightString(W-36, H-26, f"MEDIA KIT 2026 · {page} / {PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6)
    c.line(36, H-40, W-36, H-40)

def footer(c, page):
    draw_logo(c, LOGO_VE, 36, 18, 20, 18)
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(62, 24, "vacilateesto.com  ·  elpatio@hacemosloquenosgusta.com")
    c.drawRightString(W-36, 24, f"{page}/{PAGES}")

def sticker_pill(c, x, y, w, h, text, fill=INK, fg=white, font="Helvetica-Bold", fs=8):
    c.setFillColor(fill); c.setStrokeColor(INK); c.setLineWidth(1)
    c.roundRect(x, y, w, h, h/2, fill=1, stroke=1)
    c.setFillColor(fg); c.setFont(font, fs)
    c.drawCentredString(x+w/2, y+(h-fs)/2+1, text)

def sticker_card(c, x, y, w, h, shadow=PINK):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+4, y-4, w, h, 12, fill=1, stroke=1)
    c.setFillColor(white)
    c.roundRect(x, y, w, h, 12, fill=1, stroke=1)

def wrap(c, text, x, y, max_w, font="Helvetica", fs=9, leading=12, color=INK):
    c.setFillColor(color); c.setFont(font, fs)
    words = text.split(); line=""; lines=[]
    for w in words:
        test=(line+" "+w).strip()
        if c.stringWidth(test, font, fs) <= max_w: line=test
        else: lines.append(line); line=w
    if line: lines.append(line)
    for i,ln in enumerate(lines): c.drawString(x, y - i*leading, ln)
    return y - len(lines)*leading

# ───────── PAGE 1: COVER ─────────
def page_cover(c):
    header(c, 1)
    c.setFillColor(PINK); c.circle(60, H-220, 110, fill=1, stroke=0)
    c.setFillColor(CYAN); c.circle(W-60, H-160, 80, fill=1, stroke=0)
    cx, cy, cw, ch = 50, H-560, W-100, 400
    c.setFillColor(INK); c.setStrokeColor(INK); c.setLineWidth(1.5)
    c.roundRect(cx, cy, cw, ch, 16, fill=1, stroke=1)
    logo_badge(c, LOGO_VE, cx+cw-142, cy+ch-152, 120, 130, shadow=CYAN, pad=10)
    sticker_pill(c, cx+22, cy+ch-46, 130, 22, "FUN EDUCAITMENT", fill=CYAN, fg=INK)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 9)
    c.drawString(cx+22, cy+ch-72, "MEDIA KIT 2026  ·  ECOSISTEMA DE CONTENIDO")
    c.setFillColor(white); c.setFont("Helvetica-Bold", 52)
    c.drawString(cx+22, cy+ch-130, "VACÍLATE")
    c.setFillColor(PINK); c.drawString(cx+22, cy+ch-178, "ESTO")
    c.setFillColor(white); c.setFont("Helvetica-Bold", 9)
    c.drawString(cx+22, cy+ch-200,
        "PODCAST · STREAMING · REELS · LIVE  ·  CARACAS — MIAMI — MADRID")
    wrap(c,
        "El ecosistema de Fun Educaitment de Jhon & Juan. Conectamos marcas con una comunidad de más de 1.84M de seguidores a través de contenido auténtico, irreverente y entretenido — en podcast, streaming, reels y stories.",
        cx+22, cy+90, cw-44, font="Helvetica", fs=10, leading=14, color=white)
    sticker_pill(c, cx+22, cy+30, 90,  22, "PODCAST",       fill=PINK, fg=white)
    sticker_pill(c, cx+118,cy+30, 90,  22, "STREAMING",     fill=CYAN, fg=INK)
    sticker_pill(c, cx+214,cy+30, 90,  22, "REELS · STORIES", fill=white, fg=INK)
    sticker_pill(c, cx+310,cy+30, 80,  22, "TIKTOK LIVE",   fill=PINK, fg=white)
    c.setFillColor(PINK)
    c.roundRect(50, 80, W-100, 60, 12, fill=1, stroke=1)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 18)
    c.drawString(70, 108, "HACEMOS LO QUE NOS GUSTA")
    c.setFont("Helvetica", 9)
    c.drawString(70, 90, "2026  ·  vacilateesto.com  ·  @vacilateestopodcast")
    footer(c, 1)

# ───────── PAGE 2: QUÉ ES + PILARES ─────────
def page_about(c):
    header(c, 2)
    sticker_pill(c, 36, H-66, 80, 20, "¿QUÉ ES?", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "VACÍLATE ESTO")
    wrap(c,
        "Un ecosistema de contenido conducido por Jhon Da Silva (El Fiebrúo) y Juan Carlos Martínez (El Escéptico). Nacimos como podcast y crecimos a streaming, reels, stories y formatos verticales — siempre con el mismo ADN: humor, calle, data y autenticidad.",
        36, H-138, W-72, fs=10, leading=14)
    wrap(c,
        "Hablamos de fútbol, cultura pop, gastronomía, marcas y todo lo que pasa en la calle. Conectamos con una comunidad de 1.84M+ en LATAM, EE.UU. y España.",
        36, H-200, W-72, fs=10, leading=14, color=MUT)

    kpis = [("1.84M","COMUNIDAD"),("30+","PAÍSES"),("5","PLATAFORMAS"),("3","CIUDADES BASE")]
    cw = (W-72-30)/4; cy = H-330
    for i,(big,small) in enumerate(kpis):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 90, shadow=PINK if i%2==0 else CYAN)
        c.setFillColor(PINK if i%2==0 else CYAN); c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(cx+cw/2, cy+50, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cx+cw/2, cy+24, small)

    sticker_pill(c, 36, H-380, 70, 18, "PILARES", fill=INK, fg=white, fs=7)
    pilares = [
        ("HUMOR","Sátira, calle y vacile. Nuestra firma.", PINK),
        ("DATA","Investigación, contexto y data dura.", CYAN),
        ("CALLE","La voz de la gente, no el escritorio.", INK),
    ]
    cw = (W-72-30)/3; cy = H-510
    for i,(t,d,col) in enumerate(pilares):
        cx = 36 + i*(cw+15)
        sticker_card(c, cx, cy, cw, 110, shadow=col)
        c.setFillColor(col); c.rect(cx+16, cy+78, 18, 18, fill=1, stroke=0)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 18)
        c.drawString(cx+16, cy+54, t)
        wrap(c, d, cx+16, cy+38, cw-32, fs=8, leading=11, color=MUT)
    footer(c, 2)

# ───────── PAGE 3: AUDIENCIA ENE–JUL 2026 ─────────
def page_audience(c):
    header(c, 3)
    sticker_pill(c, 36, H-66, 170, 20, "AUDIENCIA · ENE — JUL 2026", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LA COMUNIDAD EN NÚMEROS")
    wrap(c,
        "Datos reales medidos en Metricool (fuente principal) entre el 1 de enero y el 31 de julio de 2026 — Instagram (Feed + Reels + Stories), TikTok, YouTube y Facebook de Vacílate Esto. Apify se usa solo como verificación complementaria.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    kpis = [
        (K["totalViews"],        "VISTAS DE VIDEO",  PINK),
        (K["totalImpressions"],  "IMPRESIONES",      CYAN),
        (K["totalInteractions"], "INTERACCIONES",    INK),
        (K["totalPublications"], "POSTS PUBLICADOS", PINK),
    ]
    cw = (W-72-30)/4; cy = H-230
    for i,(big,small,col) in enumerate(kpis):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 80, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 21)
        c.drawCentredString(cx+cw/2, cy+44, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cx+cw/2, cy+22, small)

    sticker_pill(c, 36, H-275, 130, 18, "EVOLUCIÓN MENSUAL", fill=INK, fg=white, fs=7)
    months = [
        ("ENE", "1.10M", "187 posts", PINK),
        ("FEB", "3.05M", "276 posts", CYAN),
        ("MAR", "1.91M", "327 posts", PINK),
        ("ABR", "2.51M", "340 posts", CYAN),
        ("MAY", "5.59M", "449 posts", PINK),
        ("JUN", "1.60M", "370 posts", CYAN),
        ("JUL", "0.91M", "137 posts", PINK),
    ]
    cw = (W-72-60)/7; cy = H-400
    for i,(m,big,sub,col) in enumerate(months):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 100, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 10)
        c.drawString(cx+14, cy+82, m + " 2026")
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
        c.drawString(cx+14, cy+50, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 6)
        c.drawString(cx+14, cy+34, "VISTAS")
        c.setFillColor(INK); c.setFont("Helvetica", 7)
        c.drawString(cx+14, cy+16, sub)

    sticker_pill(c, 36, H-440, 100, 18, "POR PLATAFORMA", fill=CYAN, fg=INK, fs=7)
    plats = [
        ("INSTAGRAM", "4.23M",  "Reels + Stories + Feed",  "923 posts · 249K likes",  PINK),
        ("TIKTOK",    "5.44M",  "Vistas acumuladas",       "360 videos · 417K likes", INK),
        ("YOUTUBE",   "5.06M",  "Vistas shorts + videos",  "417 posts · 54K likes",   CYAN),
        ("FACEBOOK",  M["views"]["facebook"], "Reach + vistas (reels)",
         f"{FB['posts']} posts · {FB['reactions']} reacc. · {FB['impressions']} impresiones", PINK),
    ]
    cw = (W-72-30)/4; cy = H-580
    for i,(name,big,what,foot,col) in enumerate(plats):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 125, shadow=col)
        sticker_pill(c, cx+10, cy+125-28, cw-20, 18, name, fill=col, fg=INK if col==CYAN else white, fs=7)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 18)
        c.drawString(cx+10, cy+62, big)
        c.setFillColor(MUT); c.setFont("Helvetica", 7)
        c.drawString(cx+10, cy+50, what)
        c.setFillColor(INK)
        wrap(c, foot, cx+10, cy+34, cw-20, fs=7, leading=9, color=MUT)

    c.setFillColor(MUT); c.setFont("Helvetica-Oblique", 7)
    wrap(c, "Fuente principal: Metricool · Vacílate Esto · período 1 ene – 31 jul 2026. Vistas e impresiones se reportan por separado para evitar duplicidad. " + FB["note"] + " Comunidad total 1.84M+ acumulada históricamente. Apify se emplea únicamente como verificación complementaria video por video en TikTok (291 videos verificados · 5.07M vistas · perfil de 1.2M seguidores); no reemplaza ni se suma a las cifras de Metricool.",
         36, 150, W-72, font="Helvetica-Oblique", fs=7, leading=10, color=MUT)
    footer(c, 3)

# ───────── PAGE 4: HOSTS ─────────
def page_hosts(c):
    header(c, 4)
    sticker_pill(c, 36, H-66, 130, 20, "LOS PROTAGONISTAS", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LOS HOSTS")
    c.setFillColor(MUT); c.setFont("Helvetica", 10)
    c.drawString(36, H-128, "El dúo que lo hace posible.")

    hosts = [
        ("EL FIEBRÚO","Jhon Da Silva","@jhonsnacks",
         "Cabeza creativa, data dura y la pasión que sostiene cada formato. Conexión directa con el núcleo duro de la audiencia.", PINK),
        ("EL ESCÉPTICO","Juan Carlos Mtz.","@juansofa",
         "El balance racional, la calle y el entretenimiento que hace viral el contenido. Expande la audiencia hacia el mercado generalista.", CYAN),
    ]
    cw = (W-72-20)/2; cy = H-380
    for i,(role,name,handle,bio,col) in enumerate(hosts):
        cx = 36 + i*(cw+20)
        sticker_card(c, cx, cy, cw, 220, shadow=col)
        sticker_pill(c, cx+16, cy+220-32, 90, 20, role, fill=col, fg=INK if col==CYAN else white)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 18)
        c.drawString(cx+16, cy+150, name)
        c.setFillColor(MUT); c.setFont("Helvetica", 9)
        c.drawString(cx+16, cy+134, handle)
        wrap(c, bio, cx+16, cy+110, cw-32, fs=9, leading=12)

    cy2 = 130
    sticker_card(c, 36, cy2, W-72, 110, shadow=INK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 36)
    c.drawString(50, cy2+70, "“")
    wrap(c,
        "No buscamos audiencia desde cero. Somos una comunidad masiva, fiel y conversadora — lista para amplificar tu marca desde el día uno.",
        80, cy2+82, W-72-60, font="Helvetica-Oblique", fs=11, leading=15)
    footer(c, 4)

# ───────── PAGE 5: FORMATOS ─────────
def page_formats(c):
    header(c, 5)
    sticker_pill(c, 36, H-66, 130, 20, "EL ECOSISTEMA", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LOS FORMATOS")
    wrap(c,
        "Cuatro verticales que se alimentan entre sí — el podcast es el corazón, las redes amplifican y el streaming convierte. Tu marca puede entrar por donde mejor encaje.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    formats = [
        ("01","PODCAST",
         "Episodios largos en YouTube y Spotify. El corazón del proyecto: humor, invitados y conversación de marca posible vía branded segments.",
         "Semanal · 60–90 min · YouTube + Spotify", PINK),
        ("02","REELS · TIKTOKS",
         "Cápsulas verticales con highlights del podcast, sketches, opiniones y momentos virales. Formato pulido y compartible.",
         "Diario · 30–60 seg · IG + TikTok", CYAN),
        ("03","STORIES IG",
         "Cobertura cruda y al instante: behind the scenes, encuestas, polls, stickers de marca y entrevistas rápidas.",
         "24/7 · Polls · Stickers de marca", INK),
        ("04","TIKTOK LIVE",
         "Streaming en vivo con la comunidad: reacciones, watch parties, eventos especiales y activaciones con sponsors.",
         "Semanal · Eventos especiales", PINK),
    ]
    cw = (W-72-20)/2; ch = 175
    for i,(num,title,desc,meta,col) in enumerate(formats):
        col_i = i%2; row_i = i//2
        cx = 36 + col_i*(cw+20)
        cy = H-180 - row_i*(ch+18) - ch
        sticker_card(c, cx, cy, cw, ch, shadow=col)
        c.setFillColor(col); c.setStrokeColor(INK); c.setLineWidth(1.2)
        c.circle(cx+22, cy+ch-22, 14, fill=1, stroke=1)
        c.setFillColor(INK if col==CYAN else white); c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(cx+22, cy+ch-26, num)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 14)
        c.drawString(cx+46, cy+ch-28, title)
        wrap(c, desc, cx+16, cy+ch-58, cw-32, fs=9, leading=12)
        sticker_pill(c, cx+16, cy+16, cw-32, 22, meta, fill=SOFT, fg=INK, fs=7)

    footer(c, 5)

# ───────── PAGE 6: PLATAFORMAS + COMUNIDAD ─────────
def page_platforms(c):
    header(c, 6)
    sticker_pill(c, 36, H-66, 150, 20, "PRESENCIA DIGITAL", fill=INK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "COMUNIDAD 1.84M+")
    c.setFillColor(MUT); c.setFont("Helvetica", 10)
    c.drawString(36, H-128, "Seguidores acumulados al cierre de abril 2026 · 30+ países")

    plats = [
        ("TIKTOK",    "1.16M",  "+3.88%",  PINK),
        ("INSTAGRAM", "285K",   "+23.59%", CYAN),
        ("FACEBOOK",  "214K",   "+13.58%", INK),
        ("YOUTUBE",   "119K",   "+7.21%",  PINK),
        ("THREADS",   "61K",    "+19.88%", CYAN),
    ]
    cw = (W-72-40)/5; cy = H-280
    for i,(name,big,grow,col) in enumerate(plats):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 130, shadow=col)
        sticker_pill(c, cx+10, cy+130-28, cw-20, 18, name, fill=col, fg=INK if col==CYAN else white, fs=7)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 22)
        c.drawString(cx+10, cy+62, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawString(cx+10, cy+48, "SEGUIDORES")
        sticker_pill(c, cx+10, cy+18, cw-20, 18, grow, fill=SOFT, fg=INK, fs=7)

    sticker_pill(c, 36, H-340, 130, 18, "CRECIMIENTO TOTAL", fill=PINK, fg=white, fs=7)
    bar_y = H-400
    sticker_card(c, 36, bar_y, W-72, 110, shadow=INK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 42)
    c.drawString(56, bar_y+50, "+8.34%")
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10)
    c.drawString(56, bar_y+32, "vs. PERIODO ANTERIOR")
    c.setFillColor(MUT); c.setFont("Helvetica", 9)
    c.drawString(56, bar_y+18, "Cierre: 30 abril 2026 · Fuente: Metricool")

    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 42)
    c.drawRightString(W-56, bar_y+50, "30+")
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10)
    c.drawRightString(W-56, bar_y+32, "PAÍSES CON AUDIENCIA")
    c.setFillColor(MUT); c.setFont("Helvetica", 9)
    c.drawRightString(W-56, bar_y+18, "LATAM · EE.UU. · España como cores")

    # Bottom: impresiones + interacciones banda
    sticker_pill(c, 36, H-560, 140, 18, "ALCANCE E IMPACTO", fill=CYAN, fg=INK, fs=7)
    impact = [
        ("89.6M",  "IMPRESIONES ANUALES",   "Acumulado 12 meses",  PINK),
        ("5.2M",   "INTERACCIONES",          "Likes · Comments · Shares", CYAN),
        ("6,705",  "PUBLICACIONES",          "Volumen histórico",   INK),
    ]
    cw = (W-72-20)/3; cy = H-690
    for i,(big,t,s,col) in enumerate(impact):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 100, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 24)
        c.drawString(cx+14, cy+62, big)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 9)
        c.drawString(cx+14, cy+42, t)
        c.setFillColor(MUT); c.setFont("Helvetica", 8)
        c.drawString(cx+14, cy+26, s)
    footer(c, 6)

# ───────── PAGE 7: MARCAS ALIADAS ─────────
import urllib.request

BRAND_LOGOS = {
    "Plumrose": "plumrose.png",
    "Nestea": "nestea.png",
    "Empire Keeway": "empire.png",
    "Vatel": "vatel.webp",
    "Maggi": "maggi.png",
}
BRAND_DIR = "/tmp/mk-brands"

def _brand_logo(fname):
    os.makedirs(BRAND_DIR, exist_ok=True)
    path = os.path.join(BRAND_DIR, fname)
    if not os.path.exists(path):
        urllib.request.urlretrieve(
            "https://dpgvanocynbrmqvgvgvd.supabase.co/storage/v1/object/public/brand-logos/" + fname,
            path)
    rgba = os.path.join(BRAND_DIR, "rgba-" + fname)
    if not os.path.exists(rgba):
        Image.open(path).convert("RGBA").save(rgba)
    return rgba

def page_brands(c):
    header(c, 7)
    sticker_pill(c, 36, H-66, 150, 20, "MARCAS ALIADAS", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "TRABAJAN CON NOSOTROS")
    wrap(c,
        "Marcas líderes que ya activan dentro del ecosistema Vacílate Esto — integraciones nativas en podcast, reels, stories, rutas y streaming en vivo.",
        36, H-138, W-72, fs=10, leading=14, color=MUT)

    brands = [
        ("Plumrose", "Integraciones en podcast, shorts y activaciones gastronómicas.", PINK),
        ("Nestea", "Branded content en reels, stories y contenido de calle.", CYAN),
        ("Empire Keeway", "Rutas, metrajes y cobertura Vacílate El Fútbol.", INK),
        ("Vatel", "Branded content, lives de TikTok y activaciones en calle.", CYAN),
        ("Maggi", "Integraciones en podcast, recetas y lives de TikTok.", PINK),
    ]
    cw = (W-72-40)/3; ch = 190
    row_y = [H-360, H-580]
    for i,(name,desc,col) in enumerate(brands):
        row, colidx = divmod(i, 3)
        cy = row_y[row]
        cx = 36 + colidx*(cw+20)
        sticker_card(c, cx, cy, cw, ch, shadow=col)
        logo_badge(c, _brand_logo(BRAND_LOGOS[name]), cx+16, cy+ch-106, cw-32, 92, shadow=col, pad=12)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
        c.drawString(cx+16, cy+62, name)
        wrap(c, desc, cx+16, cy+44, cw-32, fs=9, leading=12, color=MUT)

    cy2 = 90
    sticker_card(c, 36, cy2, W-72, 110, shadow=INK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 13)
    c.drawString(56, cy2+82, "TAMBIÉN HEMOS ACTIVADO CON")
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 13)
    c.drawString(56, cy2+56, "Buchanan's · KFC · BNC · Covencaucho")
    c.setFillColor(MUT); c.setFont("Helvetica", 9)
    c.drawString(56, cy2+34, "Campañas 2025–2026 en podcast, shorts, lives de TikTok y Vacílate El Fútbol.")
    footer(c, 7)

# ───────── PAGE 8: TRABAJA + CONTACTO ─────────
def page_contact(c):
    header(c, 8)
    sticker_pill(c, 36, H-66, 160, 20, "TRABAJA CON NOSOTROS", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "ACTIVA TU MARCA")
    wrap(c,
        "Integraciones nativas en podcast, reels, stories y streaming. Diseñamos activaciones a medida — desde un branded segment hasta una temporada completa.",
        36, H-138, W-72, fs=10, leading=14, color=MUT)

    benefits = [
        ("MENCIONES EN PODCAST","Branded segments orgánicos dentro de episodios.", PINK),
        ("CÁPSULAS DE MARCA","Reels y TikToks producidos a medida.", CYAN),
        ("STREAMING EN VIVO","TikTok Lives con activación en tiempo real.", INK),
        ("STORIES + STICKERS","Polls, encuestas y stickers con tu marca.", PINK),
    ]
    cw = (W-72-20)/2; ch = 90
    for i,(t,d,col) in enumerate(benefits):
        col_i = i%2; row_i = i//2
        cx = 36 + col_i*(cw+20)
        cy = H-260 - row_i*(ch+15)
        sticker_card(c, cx, cy, cw, ch, shadow=col)
        c.setFillColor(col); c.rect(cx+14, cy+ch-26, 16, 16, fill=1, stroke=0)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 12)
        c.drawString(cx+36, cy+ch-22, t)
        wrap(c, d, cx+14, cy+ch-44, cw-28, fs=9, leading=12, color=MUT)

    cy = 110
    c.setFillColor(INK)
    c.roundRect(36, cy, W-72, 120, 14, fill=1, stroke=1)
    logo_badge(c, LOGO_VE, W-36-130, cy+14, 110, 92, shadow=PINK, pad=8)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 18)
    c.drawString(56, cy+88, "HABLEMOS")
    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 10)
    c.drawString(56, cy+68, "CONTACTO COMERCIAL")
    c.setFillColor(white); c.setFont("Helvetica", 10)
    c.drawString(56, cy+52, "elpatio@hacemosloquenosgusta.com")
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10)
    c.drawString(56, cy+32, "WEB · REDES")
    c.setFillColor(white); c.setFont("Helvetica", 10)
    c.drawString(56, cy+16, "vacilateesto.com  ·  @vacilateestopodcast  ·  TikTok @vacilateesto")

    footer(c, 8)

c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle(TITLE)
c.setAuthor("Vacílate Esto")
c.setSubject("Media Kit · Vacílate Esto 2026")
page_cover(c);     c.showPage()
page_about(c);     c.showPage()
page_audience(c);  c.showPage()
page_hosts(c);     c.showPage()
page_formats(c);   c.showPage()
page_platforms(c); c.showPage()
page_brands(c);    c.showPage()
page_contact(c);   c.showPage()
c.save()
print("written", OUT)