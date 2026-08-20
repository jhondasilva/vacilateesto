# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image
import os

OUT = "public/press/Nota_de_Prensa_FIAP_2026.pdf"
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

def draw_logo(c, path, x, y, mw, mh, align="left"):
    img = ImageReader(path); iw, ih = img.getSize()
    s = min(mw/iw, mh/ih); w, h = iw*s, ih*s
    if align == "right": x -= w
    elif align == "center": x -= w/2
    c.drawImage(img, x, y+(mh-h)/2, width=w, height=h, mask="auto")

def logo_badge(c, path, x, y, w, h, shadow=PINK, pad=8):
    c.setFillColor(shadow); c.setStrokeColor(INK); c.setLineWidth(1.2)
    c.roundRect(x+3, y-3, w, h, 10, fill=1, stroke=1)
    c.setFillColor(white); c.roundRect(x, y, w, h, 10, fill=1, stroke=1)
    draw_logo(c, path, x+w/2, y+pad, w-2*pad, h-2*pad, align="center")

def header(c, page):
    draw_logo(c, LOGO, 36, H-34, 24, 22)
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 7)
    c.drawString(66, H-26, "VACÍLATE ESTO  ·  FIAP 2026  ·  NOTA DE PRENSA  ·  PARA PUBLICACIÓN INMEDIATA")
    c.drawRightString(W-36, H-26, f"CARACAS · 20.08.2026 · {page}/{PAGES}")
    c.setStrokeColor(INK); c.setLineWidth(0.6); c.line(36, H-40, W-36, H-40)

def footer(c, page):
    draw_logo(c, LOGO, 36, 18, 20, 18)
    c.setFillColor(MUT); c.setFont("Helvetica", 7)
    c.drawString(62, 24, "vacilateesto.com/prensa/fiap-2026  ·  elpatio@hacemosloquenosgusta.com")
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
c.setTitle("Nota de Prensa · Vacílate Esto · 5 finalistas FIAP 2026")

# ── PÁGINA 1
header(c, 1)
c.setFillColor(INK); c.rect(0, H-300, W, 250, fill=1, stroke=0)
logo_badge(c, LOGO, 36, H-140, 88, 78, shadow=PINK, pad=10)
pill(c, 140, H-96, 210, 18, "PARA PUBLICACIÓN INMEDIATA", fill=PINK)
c.setFillColor(white); c.setFont("Helvetica-Bold", 22)
c.drawString(140, H-128, "Vacílate Esto suma 5")
c.setFillColor(PINK); c.setFont("Helvetica-Bold", 22)
c.drawString(140, H-152, "finalistas en los FIAP 2026")
c.setFillColor(white)
c.setFont("Helvetica", 9); c.setFillColor(HexColor("#D4D4D4"))
y = wrap(c, "20 de agosto de 2026 · Caracas, Venezuela. Los proyectos Streaming from the Lost World, Walking Ads Above the Algorithm y Pelotica de Goma: The Legacy fueron seleccionados en cinco categorías del Festival Iberoamericano de Publicidad.",
         140, H-198, W-176, fs=9, lead=12, color=HexColor("#D4D4D4"))

y = H-330
c.setFillColor(INK); c.setFont("Helvetica-Bold", 10)
c.drawString(36, y, "Caracas, Venezuela — 20 de agosto de 2026.")
y = wrap(c, "Vacílate Esto anunció que cinco de sus proyectos fueron seleccionados como finalistas en la edición 2026 de los FIAP (Festival Iberoamericano de Publicidad), el certamen que reconoce las mejores piezas y estrategias de comunicación de Iberoamérica.",
         36, y-16, W-72)
y = wrap(c, "Las nominaciones reconocen el trabajo de tres formatos propios del ecosistema Vacílate Esto: la docuserie Streaming from the Lost World, la campaña Walking Ads Above the Algorithm y el evento en vivo Pelotica de Goma: The Legacy. Las categorías abarcan técnicas de producción de contenidos, estrategia digital, lanzamiento de programas, promoción de broadcast y eventos en vivo o híbridos.",
         36, y-6, W-72)
y = wrap(c, "Los FIAP 2026 consolidan a Vacílate Esto como una de las marcas de entretenimiento digital más relevantes de Venezuela, hecha en Venezuela, con capacidad de crear formatos propios que compiten a nivel iberoamericano en creatividad, ejecución y estrategia.",
         36, y-6, W-72)

# KPIs
kw = (W-72-3*10)/4
ky = y-70
for i, (v, l) in enumerate([("5","Finalistas"),("3","Proyectos"),("5","Categorías"),("FIAP","2026")]):
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
c.drawString(36, y, "Listado de finalistas")

finalists = [
    ("Técnicas de Producción de Contenidos", "Contenido con mejor estrategia digital", "Streaming from the Lost World", "Vacílate Esto Podcast"),
    ("Formatos", "Mejor estrategia de lanzamiento de programa", "Walking Ads Above the Algorithm", "Vacílate Esto"),
    ("Producción", "Técnicas de Producción — Promoción de Broadcast", "Walking Ads Above the Algorithm", "Vacílate Esto Podcast"),
    ("Formatos", "Evento en Vivo o Híbrido", "Pelotica de Goma: The Legacy", "Vacílate Esto Podcast"),
    ("Formatos", "Contenido con mejor estrategia digital", "Walking Ads Above the Algorithm", "Vacílate Esto Podcast"),
]

yy = y-28
for disc, cat, proj, brand in finalists:
    card(c, 36, yy-52, W-72, 56, shadow=CYAN, fill=white)
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 8)
    c.drawString(48, yy-10, disc.upper())
    c.setFillColor(INK); c.setFont("Helvetica-Bold", 11)
    c.drawString(48, yy-26, proj)
    c.setFillColor(MUT); c.setFont("Helvetica", 8.5)
    c.drawString(48, yy-40, f"{cat}  ·  {brand}")
    yy -= 68

y = yy - 30
c.setFillColor(INK); c.setFont("Helvetica-Bold", 15)
c.drawString(36, y, "Sobre los proyectos")
items = [
    "Streaming from the Lost World: docuserie de viajes y exploración que lleva a Juan y Jhon a lugares fuera del estudio.",
    "Walking Ads Above the Algorithm: campaña de contenido que demuestra cómo las marcas pueden romper la lógica de los algoritmos.",
    "Pelotica de Goma: The Legacy: evento en vivo que celebra la cultura del béisbol venezolano.",
]
yy = y-22
for it in items:
    c.setFillColor(PINK); c.setFont("Helvetica-Bold", 10); c.drawString(36, yy, "▲")
    yy = wrap(c, it, 52, yy, W-100, fs=10, lead=13) - 2

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
c.drawString(52, ty-2, "vacilateesto.com/prensa/fiap-2026")
footer(c, 2); c.save()
print("OK", OUT)
