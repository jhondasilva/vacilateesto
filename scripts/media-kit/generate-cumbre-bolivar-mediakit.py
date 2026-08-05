# -*- coding: utf-8 -*-
"""Media Kit · Podcast en la Cumbre · Pico Bolívar 2026"""
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
import os

OUT = "public/downloads/PodcastEnLaCumbre-PicoBolivar-MediaKit-2026.pdf"
W, H = letter
LIB = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype"
pdfmetrics.registerFont(TTFont("Helvetica", f"{LIB}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Bold", f"{LIB}/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Oblique", f"{LIB}/LiberationSans-Italic.ttf"))

PINK = HexColor("#E91E63"); CYAN = HexColor("#22D3EE")
INK = HexColor("#0A0A0A"); SOFT = HexColor("#F5F5F4"); MUT = HexColor("#737373")
GREY = HexColor("#D4D4D4")
PAGES = 5


def _trim(src, dst):
    if os.path.exists(dst):
        return dst
    im = Image.open(src).convert("RGBA")
    bb = im.split()[3].getbbox()
    if bb:
        im = im.crop(bb)
    im.save(dst)
    return dst


LOGO = _trim("src/assets/logo-vacilate-esto.png", "/tmp/mk-logo-ve.png")
LOGO_C = _trim("src/assets/logo-podcast-cumbre.avif", "/tmp/mk-logo-cumbre.png")


def draw_logo(c, path, x, y, mw, mh, align="left"):
    img = ImageReader(path); iw, ih = img.getSize()
    s = min(mw / iw, mh / ih); w, h = iw * s, ih * s
    if align == "right":
        x -= w
    elif align == "center":
        x -= w / 2
    c.drawImage(img, x, y + (mh - h) / 2, width=w, height=h, mask="auto")


def logo_badge(c, path, x, y, w, h, shadow=CYAN, pad=8):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x + 3, y - 3, w, h, 10, fill=1, stroke=1)
    c.setFillColor(white); c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    draw_logo(c, path, x + w / 2, y + pad, w - 2 * pad, h - 2 * pad, align="center")


def header(c, page, label):
    draw_logo(c, LOGO, 36, H - 34, 24, 22)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(66, H - 26, f"VACÍLATE ESTO  ·  PODCAST EN LA CUMBRE  ·  PICO BOLÍVAR 4.978 M  ·  {label.upper()}")
    c.drawRightString(W - 36, H - 26, f"MEDIA KIT 2026 · {page}/{PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6); c.line(36, H - 40, W - 36, H - 40)


def footer(c, page):
    draw_logo(c, LOGO, 36, 18, 20, 18)
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(62, 24, "vacilateesto.com/podcast-en-la-cumbre  ·  samira.rivas@hacemosloquenosgusta.com")
    c.drawRightString(W - 36, 24, f"{page}/{PAGES}")


def pill(c, x, y, w, h, text, fill=INK, fg=white, fs=8):
    c.setFillColor(fill); c.setStrokeColor(INK); c.setLineWidth(1)
    c.roundRect(x, y, w, h, h / 2, fill=1, stroke=1)
    c.setFillColor(fg); c.setFont("Helvetica-Bold", fs)
    c.drawCentredString(x + w / 2, y + (h - fs) / 2 + 1.5, text)


def card(c, x, y, w, h, shadow=PINK, fill=white):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x + 4, y - 4, w, h, 12, fill=1, stroke=1)
    c.setFillColor(fill); c.roundRect(x, y, w, h, 12, fill=1, stroke=1)


def wrap(c, text, x, y, w, font="Helvetica", fs=10, lead=14, color=INK):
    c.setFont(font, fs); c.setFillColor(color)
    line = ""
    for wd in text.split():
        t = (line + " " + wd).strip()
        if pdfmetrics.stringWidth(t, font, fs) <= w:
            line = t
        else:
            c.drawString(x, y, line); y -= lead; line = wd
    if line:
        c.drawString(x, y, line); y -= lead
    return y


def section_title(c, y, text):
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
    c.drawString(36, y, text)
    c.setStrokeColor(PINK); c.setLineWidth(2.5)
    c.line(36, y - 7, 36 + pdfmetrics.stringWidth(text, "Helvetica-Bold", 15), y - 7)
    return y - 26


c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle("Media Kit · Podcast en la Cumbre · Pico Bolívar 2026")
c.setAuthor("Vacílate Esto")

# ─────────────────────────── PÁGINA 1 · PORTADA
header(c, 1, "Media kit")
c.setFillColor(INK); c.rect(0, H - 400, W, 350, fill=1, stroke=0)
logo_badge(c, LOGO_C, 36, H - 160, 100, 88)
pill(c, 152, H - 112, 196, 18, "RÉCORD MUNDIAL · NOV 2026", fill=PINK)
c.setFillColor(white); c.setFont("Helvetica-Bold", 26)
c.drawString(152, H - 148, "El podcast más alto")
c.setFillColor(PINK)
c.drawString(152, H - 178, "del mundo")
c.setFillColor(white); c.setFont("Helvetica-Bold", 14)
c.drawString(152, H - 202, "Pico Bolívar · 4.978 m · Mérida, Venezuela")
wrap(c, "Podcast en la Cumbre cierra su trilogía grabando un episodio completo en la montaña más alta de Venezuela. Solicitud de récord introducida ante Guinness World Records.",
     36, H - 240, W - 72, fs=10, lead=14, color=GREY)

kw = (W - 72 - 3 * 10) / 4
ky = H - 330
for i, (v, l) in enumerate([("4.978 m", "Altitud objetivo"), ("Nov 2026", "Expedición"),
                            ("60 min+", "Podcast en cima"), ("1 mes", "De contenidos")]):
    x = 36 + i * (kw + 10)
    card(c, x, ky, kw, 58, shadow=CYAN if i % 2 else PINK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(x + kw / 2, ky + 33, v)
    c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(x + kw / 2, ky + 17, l.upper())

y = section_title(c, H - 430, "Qué es Podcast en la Cumbre")
y = wrap(c, "Una travesía audiovisual de Vacílate Esto que graba podcasts completos en las cumbres más emblemáticas de Venezuela. Ya conquistamos el Pico Naiguatá (2.765 m) y el Monte Roraima (2.810 m). El cierre es el Pico Bolívar: 4.978 metros, un episodio íntegro grabado en la cima y un intento formal de récord mundial.",
          36, y, W - 72)
y = wrap(c, "Conducido por JhonSnacks y JuanSofa, con producción de Vacílate Esto y El Patio Content Studio. Cada cumbre se documenta con podcast, reels, microdocumental, fotografía editorial y cobertura en vivo.",
          36, y - 6, W - 72)

card(c, 36, y - 78, W - 72, 62, shadow=CYAN, fill=SOFT)
c.setFillColor(INK); c.setFont("Helvetica-Bold", 11)
c.drawString(52, y - 34, "Aquí hay altura. Aquí hay historias. Aquí hay país.")
c.setFillColor(MUT); c.setFont("Helvetica", 9)
c.drawString(52, y - 50, "Naiguatá 2.765 m  ·  Roraima 2.810 m  ·  Pico Bolívar 4.978 m")
footer(c, 1); c.showPage()

# ─────────────────────────── PÁGINA 2 · RESULTADOS
header(c, 2, "Resultados")
y = section_title(c, H - 76, "Lo que ya logramos")
y = wrap(c, "Las dos primeras cumbres acumulan 212 publicaciones, 2,6 millones de vistas y 137 mil interacciones, con un engagement promedio de 6,6%: muy por encima del promedio de la categoría de entretenimiento en Venezuela.",
          36, y, W - 72)

ky = y - 82
for i, (v, l) in enumerate([("212", "Publicaciones"), ("2,6 M", "Vistas"),
                            ("137 K", "Interacciones"), ("6,6 %", "Engagement")]):
    x = 36 + i * (kw + 10)
    card(c, x, ky, kw, 62, shadow=CYAN if i % 2 else PINK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(x + kw / 2, ky + 35, v)
    c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(x + kw / 2, ky + 18, l.upper())

y = section_title(c, ky - 40, "Capítulos anteriores")
eps = [
    ("Pico Naiguatá · 2.765 m", "El techo de Caracas. 20 personas subiendo con micrófonos, cámaras y humor venezolano.",
     "youtube.com/watch?v=NdrcKpsD0UU"),
    ("Monte Roraima · 2.810 m", "Un tepuy de 2.000 millones de años. Viaje al origen del tiempo y a la cultura Pemón.",
     "youtube.com/watch?v=NZWSKJvOdXg"),
]
yy = y
for t, d, u in eps:
    card(c, 36, yy - 52, W - 72, 66, shadow=PINK, fill=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 11); c.drawString(52, yy - 6, t)
    c.setFillColor(MUT); c.setFont("Helvetica", 9); c.drawString(52, yy - 22, d)
    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 8); c.drawString(52, yy - 40, u)
    yy -= 80

y = section_title(c, yy - 12, "Perfil de audiencia")
aud = [
    ("Venezuela", "Audiencia principal, con comunidad activa en la diáspora."),
    ("18 – 44 años", "Núcleo de consumo en YouTube, TikTok e Instagram."),
    ("Alta afinidad", "Aventura, comida, cultura venezolana y orgullo país."),
]
yy = y
for k, v in aud:
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10); c.drawString(36, yy, "▲")
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10); c.drawString(52, yy, k)
    c.setFillColor(MUT); c.setFont("Helvetica", 9.5); c.drawString(146, yy, v)
    yy -= 20
footer(c, 2); c.showPage()

# ─────────────────────────── PÁGINA 3 · EL RETO Y LA RUTA
header(c, 3, "El reto")
y = section_title(c, H - 76, "El reto del Pico Bolívar")
for it in [
    "Aclimatación por etapas en la Sierra Nevada de Mérida.",
    "Equipo de audio y cámara resistente a frío extremo y viento.",
    "Energía autónoma para grabar más de 60 minutos continuos en cima.",
    "Registro certificable: testigos, GPS, timecode y material bruto completo.",
    "Solicitud formal introducida ante Guinness World Records.",
]:
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10); c.drawString(36, y, "▲")
    y = wrap(c, it, 52, y, W - 100, fs=10, lead=13) - 2

y = section_title(c, y - 24, "La ruta de contenido · 1 mes")
route = [
    ("Semana 1", "Mérida: comida, historias y personajes de la ciudad."),
    ("Semana 2", "Podcast grabado en Mérida con invitados locales."),
    ("Semana 3", "Ascenso: ruta, campamento y aclimatación documentados."),
    ("Semana 4", "Cumbre: podcast completo a 4.978 m y cierre de la trilogía."),
]
for k, v in route:
    card(c, 36, y - 18, W - 72, 32, shadow=CYAN, fill=white)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8); c.drawString(48, y - 5, k.upper())
    c.setFillColor(INK); c.setFont("Helvetica", 9); c.drawString(112, y - 5, v)
    y -= 46

y = section_title(c, y - 12, "Formatos que produce la expedición")
fmt = ["Podcast largo (YouTube)", "Reels y TikToks", "Historias de Instagram",
       "Microdocumental", "Fotografía editorial", "Cobertura en vivo"]
bx, by = 36, y - 4
for f in fmt:
    w = pdfmetrics.stringWidth(f, "Helvetica-Bold", 8) + 26
    if bx + w > W - 36:
        bx = 36; by -= 28
    pill(c, bx, by, w, 20, f, fill=SOFT, fg=INK)
    bx += w + 8

y = section_title(c, by - 40, "Marcas confirmadas")
bx, by = 36, y - 4
for b in ["PLAN B", "HARINA P.A.N.", "CLUB SOCIAL", "RONCO", "PLANETA SPORT", "RESTAURANT ALAZÁN"]:
    w = pdfmetrics.stringWidth(b, "Helvetica-Bold", 8) + 26
    if bx + w > W - 36:
        bx = 36; by -= 28
    pill(c, bx, by, w, 20, b, fill=INK, fg=white)
    bx += w + 8
footer(c, 3); c.showPage()

# ─────────────────────────── PÁGINA 4 · PROPUESTA COMERCIAL
header(c, 4, "Propuesta para marcas")
y = section_title(c, H - 76, "Sé parte de la cumbre")
y = wrap(c, "Un paquete único de un mes de actividades alrededor de Podcast en la Cumbre · Pico Bolívar, con presencia de marca en la expedición completa y en el episodio del récord mundial.",
          36, y, W - 72)

incl = [
    "2 podcasts con presencia de marca: uno grabado en Mérida y uno en la cima del Pico Bolívar.",
    "Posts en Instagram, Facebook y TikTok sobre la ruta, la comida y las historias de Mérida.",
    "Historias de Instagram dedicadas durante todo el mes de actividades.",
    "Posts dedicados a la marca dentro del contenido de los podcasts.",
    "2 reels dedicados exclusivamente a la marca.",
    "Mención de marca en todos los posts relacionados a Podcast en la Cumbre · Pico Bolívar.",
]
cy = y - 10
box_h = 26 + len(incl) * 26
card(c, 36, cy - box_h + 20, 330, box_h, shadow=PINK, fill=white)
c.setFillColor(INK); c.setFont("Helvetica-Bold", 11)
c.drawString(52, cy, "Qué incluye")
iy = cy - 22
for it in incl:
    c.setFillColor(CYAN); c.setFont("Helvetica-Bold", 9); c.drawString(52, iy, "●")
    iy = wrap(c, it, 64, iy, 288, fs=8.5, lead=11) - 4

# Inversión
px = 386
card(c, px, cy - 170 + 20, W - 36 - px, 170, shadow=CYAN, fill=INK)
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8)
c.drawString(px + 16, cy - 4, "INVERSIÓN")
c.setFillColor(white); c.setFont("Helvetica-Bold", 40)
c.drawString(px + 16, cy - 46, "$3.500")
c.setFillColor(GREY); c.setFont("Helvetica-Bold", 8)
c.drawString(px + 16, cy - 62, "USD · 1 MES DE ACTIVIDADES")
ty = cy - 84
for line in ["Incluye producción, cobertura", "editorial y distribución en todas",
             "nuestras plataformas durante el", "mes de la expedición."]:
    c.setFillColor(HexColor("#E5E5E5")); c.setFont("Helvetica", 8.5)
    c.drawString(px + 16, ty, line); ty -= 12
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8)
c.drawString(px + 16, ty - 6, "Cupos limitados por categoría")

y = section_title(c, min(iy, cy - 190) - 24, "Por qué sumarse")
for k, v in [
    ("Hito histórico", "Un récord mundial venezolano con cobertura de prensa nacional."),
    ("Contenido premium", "Producción documental, no publicidad convencional."),
    ("Vida útil larga", "El episodio y el microdocumental siguen sumando vistas por años."),
]:
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10); c.drawString(36, y, "▲")
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 10); c.drawString(52, y, k)
    c.setFillColor(MUT); c.setFont("Helvetica", 9.5); c.drawString(160, y, v)
    y -= 20
footer(c, 4); c.showPage()

# ─────────────────────────── PÁGINA 5 · EQUIPO Y CONTACTO
header(c, 5, "Equipo y contacto")
y = section_title(c, H - 76, "Equipo de producción")
team = [
    ("JuanSofa", "Juan Carlos Martínez · Co-host"),
    ("JhonSnacks", "Jhon Da Silva · Co-host"),
    ("Andreína Ascensión", "Dirección de producción"),
    ("Samira Rivas", "Logística"),
    ("Estrella Rodríguez", "Pauta y equipos"),
    ("Darwins y Daniel", "Producción audiovisual"),
]
cw = (W - 72 - 12) / 2
for i, (n, r) in enumerate(team):
    col, row = i % 2, i // 2
    x = 36 + col * (cw + 12)
    yy = y - row * 56
    card(c, x, yy - 34, cw, 46, shadow=CYAN if (i % 2) else PINK, fill=white)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 11); c.drawString(x + 14, yy - 4, n)
    c.setFillColor(MUT); c.setFont("Helvetica", 8.5); c.drawString(x + 14, yy - 20, r)

y = y - 3 * 56 - 10
y = section_title(c, y, "Sobre Vacílate Esto")
y = wrap(c, "Vacílate Esto es una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela: podcast, social media y eventos en vivo. Conducido por JhonSnacks y JuanSofa, produce contenido semanal en YouTube, TikTok, Instagram y Facebook, además de formatos propios como Guerra de Comerciales, Vacílate El Fútbol y Podcast en la Cumbre.",
          36, y, W - 72, fs=9.5, lead=13)

cy = y - 30
card(c, 36, cy - 92, W - 72, 112, shadow=PINK, fill=INK)
c.setFillColor(white); c.setFont("Helvetica-Bold", 13)
c.drawString(52, cy + 4, "Contacto comercial y de prensa")
ty = cy - 16
for t in [
    "Samira Rivas · Logística · samira.rivas@hacemosloquenosgusta.com",
    "Andreína Ascensión · Dirección de producción · andreina.ascension@hacemosloquenosgusta.com",
    "Estrella Rodríguez · Pauta y equipos · estrella.rodriguez@hacemosloquenosgusta.com",
]:
    c.setFillColor(HexColor("#E5E5E5")); c.setFont("Helvetica", 8.5)
    c.drawString(52, ty, t); ty -= 15
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8.5)
c.drawString(52, ty - 4, "vacilateesto.com/podcast-en-la-cumbre  ·  vacilateesto.com/prensa/pico-bolivar")
footer(c, 5); c.save()
print("OK", OUT)