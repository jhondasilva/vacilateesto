from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

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

PAGES = 7
TITLE = "Vacílate Esto 2026 — Media Kit"

def header(c, page):
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(36, H-24,
        "VACÍLATE ESTO  ·  FUN EDUCAITMENT  ·  CARACAS — MIAMI — MADRID  ·  PODCAST · STREAMING · REELS · LIVE")
    c.drawRightString(W-36, H-24, f"MEDIA KIT 2026 · {page} / {PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6)
    c.line(36, H-32, W-36, H-32)

def footer(c, page):
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(36, 24, "vacilateesto.com  ·  elpatio@hacemosloquenosgusta.com")
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

# ───────── PAGE 3: AUDIENCIA ENE–ABR 2026 ─────────
def page_audience(c):
    header(c, 3)
    sticker_pill(c, 36, H-66, 170, 20, "AUDIENCIA · ENE — ABR 2026", fill=PINK, fg=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 28)
    c.drawString(36, H-110, "LA COMUNIDAD EN NÚMEROS")
    wrap(c,
        "Datos reales medidos en Metricool entre el 1 de enero y el 30 de abril de 2026 — Instagram (Feed + Reels + Stories), TikTok, YouTube, Threads y Facebook de Vacílate Esto.",
        36, H-130, W-72, fs=10, leading=13, color=MUT)

    kpis = [
        ("9.1M",  "ALCANCE + VISTAS",  PINK),
        ("244K",  "INTERACCIONES",     CYAN),
        ("776",   "POSTS PUBLICADOS",  INK),
        ("5",     "PLATAFORMAS",       PINK),
    ]
    cw = (W-72-30)/4; cy = H-230
    for i,(big,small,col) in enumerate(kpis):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 80, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(cx+cw/2, cy+44, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cx+cw/2, cy+22, small)

    sticker_pill(c, 36, H-275, 130, 18, "EVOLUCIÓN MENSUAL", fill=INK, fg=white, fs=7)
    months = [
        ("ENE", "1.20M",  "126 posts",  PINK),
        ("FEB", "2.94M",  "198 posts",  CYAN),
        ("MAR", "2.53M",  "209 posts",  PINK),
        ("ABR", "2.46M",  "243 posts",  CYAN),
    ]
    cw = (W-72-30)/4; cy = H-400
    for i,(m,big,sub,col) in enumerate(months):
        cx = 36 + i*(cw+10)
        sticker_card(c, cx, cy, cw, 100, shadow=col)
        c.setFillColor(col); c.setFont("Helvetica-Bold", 11)
        c.drawString(cx+14, cy+82, m + " 2026")
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 22)
        c.drawString(cx+14, cy+50, big)
        c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
        c.drawString(cx+14, cy+34, "ALCANCE + VISTAS")
        c.setFillColor(INK); c.setFont("Helvetica", 8)
        c.drawString(cx+14, cy+16, sub)

    sticker_pill(c, 36, H-440, 100, 18, "POR PLATAFORMA", fill=CYAN, fg=INK, fs=7)
    plats = [
        ("INSTAGRAM", "4.1M",   "Reels + Stories + Feed",   "233 posts · 148K likes",   PINK),
        ("TIKTOK",    "3.4M",   "Alcance acumulado",        "192 videos · alto share",  INK),
        ("YOUTUBE",   "1.06M",  "Vistas en shorts + videos","24K likes · canal activo", CYAN),
        ("THREADS",   "478K",   "Vistas acumuladas",        "102 posts · 3.5K likes",   PINK),
        ("FACEBOOK",  "249",    "Publicaciones del periodo","Reels + feed",             INK),
    ]
    cw = (W-72-40)/5; cy = H-580
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
    c.drawString(36, 50, "Fuente: Metricool · Vacílate Esto · período 1 ene – 30 abr 2026. Combina reach orgánico y views totales por plataforma. Comunidad total 1.84M+ acumulada históricamente.")
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

# ───────── PAGE 7: TRABAJA + CONTACTO ─────────
def page_contact(c):
    header(c, 7)
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

    footer(c, 7)

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
page_contact(c);   c.showPage()
c.save()
print("written", OUT)