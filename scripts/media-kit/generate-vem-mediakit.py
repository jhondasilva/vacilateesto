from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
import os

OUT = "public/downloads/VacilateElFutbol-MediaKit-2026.pdf"
W, H = letter  # 612 x 792

# Register Liberation Sans (Helvetica-compatible TTF with full latin coverage)
LIB = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype"
pdfmetrics.registerFont(TTFont("Helvetica", f"{LIB}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Bold", f"{LIB}/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Oblique", f"{LIB}/LiberationSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-BoldOblique", f"{LIB}/LiberationSans-BoldItalic.ttf"))

# Brand palette
PINK = HexColor("#E91E63")
CYAN = HexColor("#22D3EE")
INK  = HexColor("#0A0A0A")
SOFT = HexColor("#F5F5F4")
MUT  = HexColor("#737373")
BG   = HexColor("#FAFAF9")

PAGES = 9
TITLE = "Vacílate El Mundial 2026 — Media Kit"

# ───────── LOGOS (identidad gráfica) ─────────
def _trim(src, dst):
    """Recorta el PNG al bounding box de su contenido para alinearlo con precisión."""
    if os.path.exists(dst):
        return dst
    im = Image.open(src).convert("RGBA")
    bbox = im.split()[3].getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(dst)
    return dst

LOGO_VEF = _trim("src/assets/logo-vacilate-futbol.png", "/tmp/mk-logo-vef.png")
LOGO_VE  = _trim("src/assets/logo-vacilate-esto.png",  "/tmp/mk-logo-ve.png")

def draw_logo(c, path, x, y, max_w, max_h, align="left"):
    """Dibuja el logo respetando su proporción dentro de la caja indicada."""
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
    """Tarjeta sticker blanca con el logo dentro — legible sobre fondos oscuros."""
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+3, y-3, w, h, 10, fill=1, stroke=1)
    c.setFillColor(white)
    c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    draw_logo(c, path, x+w/2, y+pad, w-2*pad, h-2*pad, align="center")

def header(c, page):
    draw_logo(c, LOGO_VEF, 36, H-34, 26, 22)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(68, H-26,
        "VACÍLATE EL FÚTBOL · EL MUNDIAL 2026  ·  MX · USA · FRA · VEN  ·  JUN — JUL 2026")
    c.drawRightString(W-36, H-26, f"MEDIA KIT · {page} / {PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6)
    c.line(36, H-40, W-36, H-40)

def footer(c, page):
    draw_logo(c, LOGO_VE, 36, 18, 20, 18)
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(62, 24, "vacilateesto.com  ·  vacilateelmundial.com")
    c.drawRightString(W-36, 24, f"{page}/{PAGES}")

def sticker_pill(c, x, y, w, h, text, fill=INK, fg=white, font="Helvetica-Bold", fs=8):
    c.setFillColor(fill); c.setStrokeColor(INK); c.setLineWidth(1)
    c.roundRect(x, y, w, h, h/2, fill=1, stroke=1)
    c.setFillColor(fg); c.setFont(font, fs)
    c.drawCentredString(x+w/2, y+(h-fs)/2+1, text)

def sticker_card(c, x, y, w, h, shadow=PINK):
    # shadow
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+4, y-4, w, h, 12, fill=1, stroke=1)
    # card
    c.setFillColor(white)
    c.roundRect(x, y, w, h, 12, fill=1, stroke=1)

def numbered_dot(c, cx, cy, r, n, fill=PINK, fg=white):
    c.setFillColor(fill); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.circle(cx, cy, r, fill=1, stroke=1)
    c.setFillColor(fg); c.setFont("Helvetica-Bold", r-2)
    c.drawCentredString(cx, cy-(r-2)/2+1, str(n))

def wrap(c, text, x, y, max_w, font="Helvetica", fs=9, leading=12, color=INK):
    c.setFillColor(color); c.setFont(font, fs)
    words = text.split()
    line=""; lines=[]
    for w in words:
        test = (line + " " + w).strip()
        if c.stringWidth(test, font, fs) <= max_w:
            line = test
        else:
            lines.append(line); line = w
    if line: lines.append(line)
    for i,ln in enumerate(lines):
        c.drawString(x, y - i*leading, ln)
    return y - len(lines)*leading

# ───────── PAGE 1: COVER ─────────
def page_cover(c):
    header(c, 1)
    # decorative blobs
    c.setFillColor(PINK); c.circle(60, H-220, 110, fill=1, stroke=0)
    c.setFillColor(CYAN); c.circle(W-60, H-160, 80, fill=1, stroke=0)
    # big dark hero card
    cx, cy, cw, ch = 50, H-560, W-100, 400
    c.setFillColor(INK); c.setStrokeColor(INK); c.setLineWidth(1.5)
    c.roundRect(cx, cy, cw, ch, 16, fill=1, stroke=1)
    # pill badge
    sticker_pill(c, cx+22, cy+ch-46, 130, 22, "FUN EDUCAITMENT", fill=CYAN, fg=INK)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 9)
    c.drawString(cx+22, cy+ch-72, "MEDIA KIT 2026  ·  GIRA PRESENCIAL")
    # title
    c.setFillColor(white); c.setFont("Helvetica-Bold", 44)
    c.drawString(cx+22, cy+ch-118, "VACÍLATE")
    c.setFillColor(PINK); c.drawString(cx+22, cy+ch-160, "EL MUNDIAL")
    c.setFillColor(white); c.drawString(cx+22, cy+ch-202, "2026")
    c.setFillColor(white); c.setFont("Helvetica-Bold", 9)
    c.drawString(cx+22, cy+ch-224,
        "MX · USA · FRA · VEN  ·  JUN — JUL 2026  ·  15 PARADAS  ·  4 PAÍSES")
    # subtitle
    wrap(c,
        "Cobertura no-oficial del Mundial FIFA 2026 con presencia presencial en México y Estados Unidos. Streaming en vivo en TikTok, Reels y Stories de Instagram, y Podcasts desde la cancha, los bares y la calle.",
        cx+22, cy+90, cw-44, font="Helvetica", fs=10, leading=14, color=white)
    # bottom pills
    sticker_pill(c, cx+22, cy+30, 110, 22, "TIKTOK LIVE", fill=PINK, fg=white)
    sticker_pill(c, cx+138, cy+30, 110, 22, "REELS · STORIES IG", fill=CYAN, fg=INK)
    sticker_pill(c, cx+254, cy+30, 100, 22, "PODCASTS", fill=white, fg=INK)
    # tagline strip
    c.setFillColor(PINK)
    c.roundRect(50, 80, W-100, 60, 12, fill=1, stroke=1)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 18)
    c.drawString(70, 108, "HACEMOS LO QUE NOS GUSTA")
    c.setFont("Helvetica", 9)
    c.drawString(70, 90, "2026  ·  vacilateelmundial.com  ·  vacilateesto.com")
    footer(c, 1)

# ───────── PAGE 2: QUÉ ES + PILARES ─────────
def page_about(c):
    header(c, 2)
    sticker_pill(c, 36, H-66, 80, 20, "¿QUÉ ES?", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "VACÍLATE EL MUNDIAL")
    wrap(c,
        "La cobertura no-oficial del Mundial FIFA 2026 desde la mirada de Vacílate Esto. Un ecosistema de contenido que mezcla humor, data, gastronomía y calle para hablarle tanto al fanático duro del fútbol como al 80% del mercado que disfruta el Mundial sin ser futbolero.",
        36, H-138, W-72, fs=10, leading=14)
    wrap(c,
        "Streaming en vivo en TikTok, Reels y Stories de Instagram, y Podcasts — con presencia presencial en México y Estados Unidos durante toda la fase final.",
        36, H-200, W-72, fs=10, leading=14, color=MUT)

    # KPI cards
    kpis = [("2M+","SEGUIDORES"),("24/7","PRESENCIA"),("15","PARADAS"),("4","PAÍSES")]
    cw = (W-72-30)/4; cy = H-330
    for i,(big,small) in enumerate(kpis):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 90, shadow=PINK if i%2==0 else CYAN)
        c.setFillColor(PINK if i%2==0 else CYAN); c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(cx+cw/2, cy+50, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cx+cw/2, cy+24, small)

    # Pilares
    sticker_pill(c, 36, H-380, 70, 18, "PILARES", fill=INK, fg=white, fs=7)
    pilares = [
        ("HUMOR","Sátira informativa con Vacílalo News.",PINK),
        ("DATA","Historia, estadística y fiebre futbolera.",CYAN),
        ("CALLE","Cobertura on-the-road desde las sedes.",INK),
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

# ───────── PAGE 3: AUDIENCIA FEB–JUN 2026 ─────────
def page_audience(c):
    header(c, 3)
    sticker_pill(c, 36, H-66, 170, 20, "AUDIENCIA · FEB — JUN 2026", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LA COMUNIDAD EN NÚMEROS")
    wrap(c,
        "Datos reales medidos en Metricool entre el 1 de febrero y el 30 de junio de 2026 — Instagram (Feed + Reels + Stories), TikTok y YouTube de Vacílate Esto Podcast.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    # ── Top KPI row (totales 4 meses)
    kpis = [
        ("11.35M","VISTAS DE VIDEO",   PINK),
        ("2.71M", "ALCANCE INSTAGRAM", CYAN),
        ("700K",  "INTERACCIONES",     INK),
        ("1,441", "POSTS PUBLICADOS",  PINK),
    ]
    cw = (W-72-30)/4; cy = H-230
    for i,(big,small,col) in enumerate(kpis):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 80, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(cx+cw/2, cy+44, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cx+cw/2, cy+22, small)

    # ── Monthly evolution
    sticker_pill(c, 36, H-275, 130, 18, "EVOLUCIÓN MENSUAL", fill=INK, fg=white, fs=7)
    months = [
        ("FEB", "2.52M", "212 posts",  PINK),
        ("MAR", "1.61M", "264 posts",  CYAN),
        ("ABR", "1.98M", "259 posts",  PINK),
        ("MAY", "1.70M", "363 posts",  CYAN),
        ("JUN", "1.42M", "346 posts",  PINK),
    ]
    cw = (W-72-40)/5; cy = H-400
    for i,(m,big,sub,col) in enumerate(months):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 100, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 11)
        c.drawString(cx+14, cy+82, m + " 2026")
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 22)
        c.drawString(cx+14, cy+50, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawString(cx+14, cy+34, "VISTAS DE VIDEO")
        c.setFillColor(INK); c.setFont("Helvetica", 8)
        c.drawString(cx+14, cy+16, sub)

    # ── Plataformas (split)
    sticker_pill(c, 36, H-440, 100, 18, "POR PLATAFORMA", fill=CYAN, fg=INK, fs=7)
    plats = [
        ("INSTAGRAM",  "3.34M", "Reels + Stories + Feed",   "798 publicaciones · 193K likes",  PINK),
        ("TIKTOK",     "4.54M", "Vistas acumuladas",        "297 videos · 341K likes",         INK),
        ("YOUTUBE",    "3.47M", "Vistas shorts + videos",   "346 posts · 40K likes",           CYAN),
    ]
    cw = (W-72-30)/3; cy = H-580
    for i,(name,big,what,foot,col) in enumerate(plats):
        cx = 36 + i*(cw+15)
        sticker_card(c, cx, cy, cw, 125, shadow=col)
        sticker_pill(c, cx+14, cy+125-30, 80, 18, name, fill=col, fg=INK if col==CYAN else white, fs=7)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 22)
        c.drawString(cx+14, cy+62, big)
        c.setFillColor(MUT); c.setFont("Helvetica", 8)
        c.drawString(cx+14, cy+48, what)
        c.setFillColor(INK); c.setFont("Helvetica", 7.5)
        wrap(c, foot, cx+14, cy+30, cw-28, fs=7.5, leading=10, color=MUT)

    # ── Footnote
    c.setFillColor(MUT); c.setFont("Helvetica-Oblique", 7)
    c.drawString(36, 50, "Fuente: Metricool · Vacílate Esto Podcast · período 1 feb – 30 jun 2026. Métricas combinan reach orgánico y views totales por plataforma.")
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
         "Aporta la data dura, la historia y la pasión que todo fanático del fútbol respeta. Su conocimiento profundo del juego retiene al núcleo duro futbolero.", PINK),
        ("EL ESCÉPTICO","Juan Carlos Mtz.","@juansofa",
         "Sigue la vibra, la calle y el entretenimiento que hace el contenido viral. Su enfoque expande la audiencia hacia el 80% del mercado generalista.", CYAN),
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

    # Quote
    cy2 = 130
    sticker_card(c, 36, cy2, W-72, 110, shadow=INK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 36)
    c.drawString(50, cy2+70, "“")
    wrap(c,
        "El Mundial no se vive solo en la cancha. Se vive en la mesa, en el bar, en el chat y en la calle. Nosotros lo contamos como nadie: con humor, data y la calle bien puesta.",
        80, cy2+82, W-72-60, font="Helvetica-Oblique", fs=11, leading=15)
    footer(c, 4)

# ───────── PAGE 5: FORMATOS DE COBERTURA ─────────
def page_formats(c):
    header(c, 5)
    sticker_pill(c, 36, H-66, 160, 20, "COBERTURA PRESENCIAL", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LOS FORMATOS")
    wrap(c,
        "Cuatro canales para llevar el Mundial desde México y EE.UU. hasta tu pantalla — en vivo, todo el día.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    formats = [
        ("01","TIKTOK LIVE",
         "Streaming en vivo desde fan zones, bares, estadios y la calle. Reacciones a los partidos y watch parties con la comunidad.",
         "Diario · Pre/post partidos · Watch parties", PINK),
        ("02","REELS DE INSTAGRAM",
         "Resúmenes editados, memes, momentos virales y highlights de la jornada. Formato pulido y compartible para feed.",
         "2–3 reels al día · 30–60 seg", CYAN),
        ("03","HISTORIAS DE INSTAGRAM",
         "Cobertura cruda y al instante: behind the scenes, encuestas, polls de pronósticos, stickers de marca y entrevistas rápidas.",
         "Stories 24/7 · Polls · Stickers de marca", INK),
        ("04","PODCASTS",
         "Episodios desde la ruta — análisis con humor, invitados locales y la crónica de cada parada. Spotify, YouTube y FM Center.",
         "2 episodios/semana · 30–45 min", PINK),
    ]
    cw = (W-72-20)/2; ch = 175
    for i,(num,title,desc,meta,col) in enumerate(formats):
        col_i = i%2; row_i = i//2
        cx = 36 + col_i*(cw+20)
        cy = H-180 - row_i*(ch+18) - ch
        sticker_card(c, cx, cy, cw, ch, shadow=col)
        numbered_dot(c, cx+22, cy+ch-22, 14, num, fill=col, fg=INK if col==CYAN else white)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 14)
        c.drawString(cx+46, cy+ch-28, title)
        wrap(c, desc, cx+16, cy+ch-58, cw-32, fs=9, leading=12)
        # meta pill
        sticker_pill(c, cx+16, cy+16, cw-32, 22, meta, fill=SOFT, fg=INK, fs=7)

    # Radio · FM Center callout strip
    ry = 70
    c.setFillColor(INK); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(36, ry, W-72, 70, 12, fill=1, stroke=1)
    sticker_pill(c, 50, ry+44, 130, 18, "RADIO · FM CENTER", fill=PINK, fg=white, fs=7)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 13)
    c.drawString(50, ry+24, "CUENTOS DE 1 MINUTO  ·  HOT SPORTS  ·  6 ROTACIONES DIARIAS")
    c.setFillColor(CYAN); c.setFont("Helvetica", 8.5)
    c.drawString(50, ry+10, "Bases desde las sedes de EE.UU. siguiendo la ruta del Mundial.")

    footer(c, 5)

# ───────── PAGE 6: ECOSISTEMA + CALENDARIO ─────────
def page_eco(c):
    header(c, 6)
    sticker_pill(c, 36, H-66, 150, 20, "TODO, TODO EL TIEMPO", fill=INK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "EL ECOSISTEMA")

    cols = [
        ("REDES", ["Reels IG","Stories IG","TikToks","Shorts YouTube"], PINK),
        ("STREAMING", ["TikTok Live","Watch parties","Reacciones","Multi-cam"], CYAN),
        ("PODCAST", ["Episodios semanales","Especiales Mundial","Spotify · YouTube","FM Center"], INK),
        ("RADIO FM", ["FM Center · Hot Sports","Cuentos de 1 minuto","6 veces al día","Bases en sedes USA"], PINK),
    ]
    cw = (W-72-45)/4; cy = H-310
    for i,(t,items,col) in enumerate(cols):
        cx = 36 + i*(cw+15)
        sticker_card(c, cx, cy, cw, 150, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 12)
        c.drawString(cx+16, cy+125, t)
        c.setFillColor(INK); c.setFont("Helvetica", 9)
        for j,it in enumerate(items):
            c.drawString(cx+16, cy+100 - j*15, "•  " + it)

    # Calendario
    sticker_pill(c, 36, H-360, 120, 20, "CALENDARIO 2026", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 22)
    c.drawString(36, H-400, "JUN → JUL 2026")
    months = [
        ("JUN 9–28","Fase de grupos","México · NY · Austin · Houston · Miami · Caracas", PINK),
        ("JUN 19–26","Cannes Lions","Cortesía Hôtel Martinez · paralelo a la ruta", CYAN),
        ("JUL 2–16","Eliminatorias","Kansas City · Dallas · Boston · Atlanta · NY", PINK),
        ("JUL 17–20","Final + cierre","New York · cierre triunfal en Caracas", INK),
    ]
    cw = (W-72-30)/4; cy = H-510
    for i,(m,t,d,col) in enumerate(months):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 95, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 10)
        c.drawString(cx+12, cy+78, m)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 11)
        c.drawString(cx+12, cy+60, t)
        wrap(c, d, cx+12, cy+44, cw-24, fs=7.5, leading=10, color=MUT)

    footer(c, 6)

# ───────── PAGE 7: LA RUTA ─────────
def page_route(c):
    header(c, 7)
    sticker_pill(c, 36, H-66, 130, 20, "JUN — JUL 2026", fill=CYAN, fg=INK)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LA RUTA · ALTERNATIVA 1")
    c.setFillColor(MUT); c.setFont("Helvetica", 10)
    c.drawString(36, H-128, "15 paradas · 4 países · base en Caracas · presencial en México y EE.UU.")

    stops = [
        (1,"MX","CIUDAD DE MÉXICO","9–12 jun"),
        (2,"US","NEW YORK","12–14 jun"),
        (3,"US","AUSTIN","14–16 jun"),
        (4,"US","HOUSTON","16–20 jun"),
        (5,"FR","CANNES","19–26 jun"),
        (6,"US","MIAMI","26–28 jun"),
        (7,"VE","CARACAS","28 jun – 1 jul"),
        (8,"US","KANSAS CITY","2–5 jul"),
        (9,"US","DALLAS","5–7 jul"),
        (10,"US","BOSTON","7–10 jul"),
        (11,"US","KANSAS CITY","10–13 jul"),
        (12,"US","DALLAS","13–15 jul"),
        (13,"US","ATLANTA","15–16 jul"),
        (14,"US","NEW YORK","17–20 jul"),
        (15,"VE","CARACAS","20 jul"),
    ]
    cols = 4; cw = (W-72-30)/cols; ch = 78
    start_y = H-160
    for i,(n,co,city,date) in enumerate(stops):
        col_i = i%cols; row_i = i//cols
        cx = 36 + col_i*(cw+10)
        cy = start_y - (row_i+1)*ch - row_i*10
        shadow = PINK if i%2==0 else CYAN
        sticker_card(c, cx, cy, cw, ch, shadow=shadow)
        numbered_dot(c, cx-2, cy+ch-2, 11, n, fill=shadow, fg=INK if shadow==CYAN else white)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawRightString(cx+cw-10, cy+ch-15, co)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 11.5)
        c.drawString(cx+12, cy+40, city)
        c.setFillColor(MUT); c.setFont("Helvetica", 8.5)
        c.drawString(cx+12, cy+22, date)

    # Bottom strip
    cy = 90
    c.setFillColor(INK)
    c.roundRect(36, cy, W-72, 50, 10, fill=1, stroke=1)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 10)
    c.drawString(50, cy+28, "JUN > A LAS SEDES   ·   JUL > LA LOCURA   ·   CIERRE EN CARACAS · 20 JUL")
    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 8)
    c.drawString(50, cy+12, "Presencia presencial: 13 paradas en MÉXICO + EE.UU.")
    footer(c, 7)

# ───────── PAGE 8: PLANES DE PARTICIPACIÓN ─────────
def page_plans(c):
    header(c, 8)
    sticker_pill(c, 36, H-66, 170, 20, "PLANES DE PARTICIPACIÓN", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "¿QUÉ INCLUYE TU MARCA?")
    wrap(c,
        "Dos planes para activar tu marca dentro del ecosistema Vacílate El Fútbol 2026. Cada uno combina piezas en redes, historias, show en vivo, podcast y radio FM.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    # Dos planes lado a lado
    planes = [
        ("BOMBO DE ORO", PINK, [
            "10 Piezas con Product Placement",
            "6 piezas personalizadas",
            "7 historias (Stories IG)",
            "1 show en vivo semanal",
            "1 podcast",
            "Logo en comunicaciones oficiales",
        ]),
        ("BOMBO DE PLATA", CYAN, [
            "6 Piezas con Product Placement",
            "2 piezas personalizadas",
            "2 historias (Stories IG)",
            "1 show en vivo semanal",
            "1 podcast",
            "Logo en comunicaciones oficiales",
        ]),
    ]
    cw = (W-72-20)/2; ch = 215; cy = H-380
    for i,(nombre,col,items) in enumerate(planes):
        cx = 36 + i*(cw+20)
        sticker_card(c, cx, cy, cw, ch, shadow=col)
        sticker_pill(c, cx+16, cy+ch-34, 130, 22, "PLAN", fill=INK, fg=white, fs=8)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 20)
        c.drawString(cx+16, cy+ch-62, nombre)
        # underline
        c.setStrokeColor(col); c.setLineWidth(3)
        c.line(cx+16, cy+ch-68, cx+16+140, cy+ch-68)
        # items
        ty = cy+ch-92
        for it in items:
            c.setFillColor(col)
            c.circle(cx+22, ty+3, 2.5, fill=1, stroke=0)
            c.setFillColor(INK); c.setFont("Helvetica", 9.5)
            c.drawString(cx+32, ty, it)
            ty -= 18

    # Incluido en ambos
    sticker_pill(c, 36, H-410, 150, 18, "INCLUIDO EN AMBOS PLANES", fill=INK, fg=white, fs=7)
    bens = [
        ("DURACIÓN", "20 seg. aprox. por mención integrada al contenido.", PINK),
        ("FASES", "Pre-mundial (mayo) y mundial (junio). Coordinamos día.", CYAN),
        ("VISIBILIDAD", "Menciones en momentos épicos y eventos relevantes.", PINK),
        ("RADIO FM", "6 cuentos diarios en Hot Sport (FM Center).", CYAN),
    ]
    cw = (W-72-30)/4; cy = H-530
    for i,(t,d,col) in enumerate(bens):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 90, shadow=col)
        c.setFillColor(col); c.rect(cx+12, cy+90-22, 14, 14, fill=1, stroke=0)
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 10)
        c.drawString(cx+32, cy+90-19, t)
        wrap(c, d, cx+12, cy+52, cw-24, fs=8, leading=11, color=MUT)

    # Ejemplo de mención
    ry = 70
    c.setFillColor(INK); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(36, ry, W-72, 80, 12, fill=1, stroke=1)
    sticker_pill(c, 50, ry+56, 130, 18, "EJEMPLO DE MENCIÓN", fill=PINK, fg=white, fs=7)
    c.setFillColor(white); c.setFont("Helvetica-BoldOblique", 11)
    c.drawString(50, ry+34, "\"Porque estamos fuera de casa, pero nada mejor que celebrarlo con [tu marca]...\"")
    c.setFillColor(CYAN); c.setFont("Helvetica", 8.5)
    c.drawString(50, ry+16, "Adaptamos el guión a tu rubro y al momento del partido.")
    footer(c, 8)

# ───────── PAGE 9: TRABAJA + CONTACTO ─────────
def page_contact(c):
    header(c, 9)
    sticker_pill(c, 36, H-66, 160, 20, "TRABAJA CON NOSOTROS", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "ACTIVA TU MARCA")
    wrap(c,
        "Integraciones nativas en streaming, reels, stories y podcasts — con presencia presencial en las sedes que importan. Hablemos de cómo activar tu marca en la conversación del Mundial.",
        36, H-138, W-72, fs=10, leading=14, color=MUT)

    benefits = [
        ("VISIBILIDAD 24/7","Presencia constante durante 6 semanas de cobertura en vivo.", PINK),
        ("AUDIENCIA SEGMENTADA","Fans del fútbol + audiencia generalista que disfruta el Mundial.", CYAN),
        ("ENGAGEMENT ALTO","Contenido que genera conversación, memes y viralidad orgánica.", INK),
        ("BRANDED CONTENT","Integración natural en cápsulas, stories y episodios.", PINK),
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

    # Contact block
    cy = 110
    c.setFillColor(INK)
    c.roundRect(36, cy, W-72, 120, 14, fill=1, stroke=1)
    c.setFillColor(white); c.setFont("Helvetica-Bold", 18)
    c.drawString(56, cy+88, "HABLEMOS")
    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 10)
    c.drawString(56, cy+68, "CONTACTO COMERCIAL")
    c.setFillColor(white); c.setFont("Helvetica", 10)
    c.drawString(56, cy+52, "elpatio@hacemosloquenosgusta.com")
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10)
    c.drawString(56, cy+32, "WEB")
    c.setFillColor(white); c.setFont("Helvetica", 10)
    c.drawString(56, cy+16, "vacilateelmundial.com  ·  vacilateesto.com")

    footer(c, 9)

# Build PDF
c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle(TITLE)
c.setAuthor("Vacílate Esto")
c.setSubject("Media Kit · Vacílate El Mundial 2026 · Gira presencial")
page_cover(c);   c.showPage()
page_about(c);   c.showPage()
page_audience(c);c.showPage()
page_hosts(c);   c.showPage()
page_formats(c); c.showPage()
page_eco(c);     c.showPage()
page_route(c);   c.showPage()
page_plans(c);   c.showPage()
page_contact(c); c.showPage()
c.save()
print("written", OUT)
