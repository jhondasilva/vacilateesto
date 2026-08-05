# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
import os

OUT = "public/press/Nota_de_Prensa_Pico_Bolivar_2026.pdf"
W, H = letter
LIB = "/nix/store/0hdgmcjy7q8zn7h3amz8nf96l9qh7wv0-liberation-fonts-2.1.5/share/fonts/truetype"
pdfmetrics.registerFont(TTFont("Helvetica", f"{LIB}/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Bold", f"{LIB}/LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Helvetica-Oblique", f"{LIB}/LiberationSans-Italic.ttf"))

PINK = HexColor("#E91E63"); CYAN = HexColor("#22D3EE")
INK = HexColor("#0A0A0A"); SOFT = HexColor("#F5F5F4"); MUT = HexColor("#737373")
PAGES = 2

def _trim(src, dst):
    if os.path.exists(dst): return dst
    im = Image.open(src).convert("RGBA")
    bb = im.split()[3].getbbox()
    if bb: im = im.crop(bb)
    im.save(dst); return dst

LOGO = _trim("src/assets/logo-vacilate-esto.png", "/tmp/press-logo-ve.png")
LOGO_C = _trim("src/assets/logo-podcast-cumbre.avif", "/tmp/press-logo-cumbre.png")

def draw_logo(c, path, x, y, mw, mh, align="left"):
    img = ImageReader(path); iw, ih = img.getSize()
    s = min(mw/iw, mh/ih); w, h = iw*s, ih*s
    if align == "right": x -= w
    elif align == "center": x -= w/2
    c.drawImage(img, x, y+(mh-h)/2, width=w, height=h, mask="auto")

def logo_badge(c, path, x, y, w, h, shadow=CYAN, pad=8):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+3, y-3, w, h, 10, fill=1, stroke=1)
    c.setFillColor(white); c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    draw_logo(c, path, x+w/2, y+pad, w-2*pad, h-2*pad, align="center")

def header(c, page):
    draw_logo(c, LOGO, 36, H-34, 24, 22)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(66, H-26, "VACÍLATE ESTO  ·  PODCAST EN LA CUMBRE  ·  NOTA DE PRENSA  ·  PARA PUBLICACIÓN INMEDIATA")
    c.drawRightString(W-36, H-26, f"CARACAS · 05.08.2026 · {page}/{PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6); c.line(36, H-40, W-36, H-40)

def footer(c, page):
    draw_logo(c, LOGO, 36, 18, 20, 18)
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(62, 24, "vacilateesto.com/prensa/pico-bolivar  ·  elpatio@hacemosloquenosgusta.com")
    c.drawRightString(W-36, 24, f"{page}/{PAGES}")

def pill(c, x, y, w, h, text, fill=INK, fg=white, fs=8):
    c.setFillColor(fill); c.setStrokeColor(INK); c.setLineWidth(1)
    c.roundRect(x, y, w, h, h/2, fill=1, stroke=1)
    c.setFillColor(fg); c.setFont("Helvetica-Bold", fs)
    c.drawCentredString(x+w/2, y+(h-fs)/2+1.5, text)

def card(c, x, y, w, h, shadow=PINK, fill=white):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+4, y-4, w, h, 12, fill=1, stroke=1)
    c.setFillColor(fill); c.roundRect(x, y, w, h, 12, fill=1, stroke=1)

def wrap(c, text, x, y, w, font="Helvetica", fs=10, lead=14, color=INK):
    c.setFont(font, fs); c.setFillColor(color)
    words, line = text.split(), ""
    for wd in words:
        t = (line + " " + wd).strip()
        if pdfmetrics.stringWidth(t, font, fs) <= w:
            line = t
        else:
            c.drawString(x, y, line); y -= lead; line = wd
    if line: c.drawString(x, y, line); y -= lead
    return y

c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle("Nota de Prensa · Podcast en la Cumbre · Pico Bolívar 2026")

# ── PÁGINA 1
header(c, 1)
c.setFillColor(INK); c.rect(0, H-300, W, 250, fill=1, stroke=0)
logo_badge(c, LOGO_C, 36, H-140, 88, 78)
pill(c, 140, H-96, 210, 18, "PARA PUBLICACIÓN INMEDIATA", fill=PINK)
c.setFillColor(white); c.setFont("Helvetica-Bold", 22)
c.drawString(140, H-128, "Vacílate Esto va por el récord")
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 22)
c.drawString(140, H-152, "mundial del podcast más alto")
c.setFillColor(white)
c.drawString(140, H-176, "del mundo: Pico Bolívar, 4.978 m")
c.setFont("Helvetica", 9); c.setFillColor(HexColor("#D4D4D4"))
y = wrap(c, "Noviembre 2026 · Sierra Nevada de Mérida, Venezuela. Solicitud de récord introducida ante Guinness World Records.",
         140, H-198, W-176, fs=9, lead=12, color=HexColor("#D4D4D4"))

y = H-330
c.setFillColor(INK); c.setFont("Helvetica-Bold", 10)
c.drawString(36, y, "Caracas, Venezuela — 5 de agosto de 2026.")
y = wrap(c, "Vacílate Esto anunció que en noviembre de 2026 intentará grabar el podcast completo más alto del mundo desde la cima del Pico Bolívar (4.978 m), la montaña más alta de Venezuela. El intento cierra Podcast en la Cumbre, la travesía audiovisual que ya grabó episodios íntegros en el Pico Naiguatá (2.765 m) y en el Monte Roraima (2.810 m).",
         36, y-16, W-72)
y = wrap(c, "Las dos primeras cumbres suman 212 publicaciones, 2,6 millones de vistas y 137 mil interacciones, con un engagement promedio de 6,6%. La expedición al Pico Bolívar tendrá a Mérida como base de operaciones e incluirá un mes completo de contenidos: recorrido de comida e historias de la ciudad, un podcast grabado en Mérida con invitados locales, el ascenso documentado por la Sierra Nevada y, como cierre, un episodio de más de 60 minutos grabado íntegramente en la cumbre.",
         36, y-6, W-72)
y = wrap(c, "Para validar el logro, la producción introdujo la solicitud formal de récord ante Guinness World Records y registrará la grabación con testigos, GPS, timecode y material bruto completo, conforme a los requisitos de evidencia del organismo.",
         36, y-6, W-72)
y = wrap(c, "Podcast en la Cumbre es una producción de Vacílate Esto junto a El Patio Content Studio, conducida por JhonSnacks y JuanSofa, con dirección de producción de Andreína Ascensión, logística de Samira Rivas, y pauta y equipos a cargo de Estrella Rodríguez.",
         36, y-6, W-72)

# KPIs
kw = (W-72-3*10)/4
ky = y-70
for i, (v, l) in enumerate([("4.978 m","Altitud objetivo"),("Nov 2026","Expedición"),("60 min+","Podcast en cima"),("2,6M","Vistas previas")]):
    x = 36 + i*(kw+10)
    card(c, x, ky, kw, 56, shadow=CYAN if i % 2 else PINK)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(x+kw/2, ky+32, v)
    c.setFillColor(MUT); c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(x+kw/2, ky+16, l.upper())
footer(c, 1); c.showPage()

# ── PÁGINA 2
header(c, 2)
y = H-80
c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
c.drawString(36, y, "Marcas confirmadas")
brands = ["PLAN B", "HARINA P.A.N.", "CLUB SOCIAL", "RONCO", "PLANETA SPORT", "RESTAURANT ALAZÁN"]
bx, by = 36, y-32
for b in brands:
    w = pdfmetrics.stringWidth(b, "Helvetica-Bold", 8) + 26
    if bx + w > W-36:
        bx = 36; by -= 28
    pill(c, bx, by, w, 20, b, fill=SOFT, fg=INK)
    bx += w + 8

y = by - 46
c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
c.drawString(36, y, "El reto")
items = [
    "Aclimatación por etapas en la Sierra Nevada de Mérida.",
    "Equipo de audio y cámara resistente a frío extremo y viento.",
    "Energía autónoma para grabar más de 60 minutos continuos.",
    "Registro certificable: testigos, GPS, timecode y material bruto.",
]
yy = y-22
for it in items:
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10); c.drawString(36, yy, "▲")
    yy = wrap(c, it, 52, yy, W-100, fs=10, lead=13) - 2

y = yy - 26
c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
c.drawString(36, y, "La ruta de contenido")
route = [
    ("Semana 1", "Mérida: comida, historias y personajes de la ciudad."),
    ("Semana 2", "Podcast en Mérida con invitados locales."),
    ("Semana 3", "Ascenso: ruta, campamento y aclimatación en vivo."),
    ("Semana 4", "Cumbre: podcast completo a 4.978 m y cierre de la trilogía."),
]
yy = y-24
for k, v in route:
    card(c, 36, yy-16, W-72, 30, shadow=CYAN, fill=white)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8); c.drawString(48, yy-4, k.upper())
    c.setFillColor(INK); c.setFont("Helvetica", 9); c.drawString(110, yy-4, v)
    yy -= 42

# Contactos
cy = yy - 30
card(c, 36, cy-72, W-72, 92, shadow=PINK, fill=INK)
c.setFillColor(white); c.setFont("Helvetica-Bold", 12)
c.drawString(52, cy+4, "Contacto de prensa")
c.setFont("Helvetica", 8.5)
contacts = [
    "Andreína Ascensión · Dirección de producción · andreina.ascension@hacemosloquenosgusta.com",
    "Samira Rivas · Logística · samira.rivas@hacemosloquenosgusta.com",
    "Estrella Rodríguez · Pauta y equipos · estrella.rodriguez@hacemosloquenosgusta.com",
]
ty = cy-14
for t in contacts:
    c.setFillColor(HexColor("#E5E5E5")); c.drawString(52, ty, t); ty -= 14
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8)
c.drawString(52, ty-2, "vacilateesto.com/prensa/pico-bolivar")
footer(c, 2); c.save()
print("OK", OUT)
