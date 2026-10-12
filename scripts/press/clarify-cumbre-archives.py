"""Add an idempotent editorial preface to historical Cumbre releases; refresh their ZIP copies."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
import subprocess

MARKER = "ACLARACIÓN EDITORIAL · DOCUMENTO HISTÓRICO"
FONT = subprocess.check_output(["fc-match", "-f", "%{file}", "Liberation Sans"], text=True).strip()
pdfmetrics.registerFont(TTFont("ArchiveSans", FONT))
STYLE = ParagraphStyle("archive", fontName="ArchiveSans", fontSize=11, leading=16)
FILES = ["Podcast_en_la_Cumbre_NOTA_DE_PRENSA.pdf", "Nota_de_Prensa_Vacilate_Esto_conquista_la_cima.pdf"]

def clarify(path):
    original = PdfReader(BytesIO(path.read_bytes()))
    pages = list(original.pages)
    if MARKER in (pages[0].extract_text() or ""):
        pages = pages[1:]
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFillColor(HexColor("#E91E63"))
    c.rect(36, 735, 540, 4, fill=1, stroke=0)
    c.setFillColor(HexColor("#0A0A0A"))
    c.setFont("ArchiveSans", 12)
    c.drawString(36, 710, MARKER)
    y = 674
    for text in [
        "Podcast en la Cumbre · Revisión editorial del 12 de octubre de 2026.",
        "Las páginas siguientes se conservan como documento histórico, con su redacción original y sus citas atribuidas intactas. No constituyen confirmación actual de primicias mundiales, récords, categorías aceptadas, homologaciones o certificaciones.",
        "Pico Bolívar: el plan es grabar un episodio completo con un estudio de podcast en la cumbre, en la ventana del 15 al 23 de noviembre de 2026, sujeto a condiciones de seguridad y viabilidad. La montaña alcanza aproximadamente 4.978 m; la altitud exacta del punto de grabación está por certificar. No hay un mínimo continuo de duración confirmado.",
        "Cualquier posible reconocimiento como récord queda sujeto a verificación y a los criterios del organismo correspondiente. No se acredita una solicitud introducida ante Guinness por la sola redacción de estos documentos históricos.",
        "Roraima: duración del episodio editado, 1 h 01 min (1 h 01 min 29 s en el archivo). Incluye una introducción desde Santa Elena; no mide el tiempo íntegro grabado en la cima. Las referencias históricas a un primer podcast o primer streaming no se presentan como primicias comprobadas.",
        "Naiguatá: episodio 1 de la serie, no una primicia mundial. La duración del video editado no equivale al tiempo de grabación en cumbre; no se afirma que se grabara íntegramente allí sin evidencia.",
        "Las opiniones o citas históricas no son certificaciones. Los anexos de métricas se mantienen sin cambios. Redacción vigente: https://www.vacilateesto.com/podcast-en-la-cumbre",
    ]:
        paragraph = Paragraph(text, STYLE)
        _, height = paragraph.wrap(540, 700)
        paragraph.drawOn(c, 36, y-height)
        y -= height + 16
    if y < 40:
        raise RuntimeError("Editorial preface exceeds safe page margins")
    c.save()
    writer = PdfWriter()
    writer.append(PdfReader(buffer))
    for page in pages:
        writer.add_page(page)
    writer.add_metadata(dict(original.metadata or {}))
    with path.open("wb") as output:
        writer.write(output)

def refresh_zip():
    path = Path("public/press/VacilateEsto-PressKit-2026.zip")
    buffer = BytesIO()
    with ZipFile(path) as source, ZipFile(buffer, "w") as target:
        for entry in source.infolist():
            data = source.read(entry.filename)
            if entry.filename in ["documentos/Nota_de_Prensa_Pico_Bolivar_2026.pdf", "documentos/PodcastEnLaCumbre-PicoBolivar-MediaKit-2026.pdf"]:
                folder = "press" if "Nota_de_Prensa" in entry.filename else "downloads"
                data = (Path("public") / folder / Path(entry.filename).name).read_bytes()
            elif entry.filename == "BOILERPLATE.txt":
                text = data.decode("utf8")
                text = text.replace("la serie que graba episodios completos en las\nmontañas más altas del país", "la serie que documenta expediciones y grabaciones\nen cumbre")
                if "CRITERIO EDITORIAL DE CUMBRE" not in text:
                    text += "\nCRITERIO EDITORIAL DE CUMBRE\nPlan Pico Bolívar: grabar un episodio completo con un estudio de podcast en la cumbre del 15 al 23 de noviembre de 2026, sujeto a seguridad y viabilidad. Aproximadamente 4.978 m; altitud del punto de grabación por certificar. Sin mínimo continuo confirmado. Cualquier posible reconocimiento como récord queda sujeto a verificación y a los criterios del organismo correspondiente. Roraima: duración del episodio editado 1 h 01 min 29 s, incluida introducción desde Santa Elena. En Naiguatá y Roraima, duración editada no equivale a tiempo grabado en cumbre.\n"
                data = text.encode("utf8")
            target.writestr(entry, data)
    path.write_bytes(buffer.getvalue())

if __name__ == "__main__":
    for name in FILES:
        clarify(Path("public/press") / name)
    refresh_zip()