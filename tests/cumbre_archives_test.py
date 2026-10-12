"""Behavior checks for safe historical PDF clarification, not editorial copy checks."""
import importlib.util
from io import BytesIO
from pathlib import Path
import tempfile
import unittest
from pypdf import PdfReader, PdfWriter

spec = importlib.util.spec_from_file_location("clarifier", "scripts/press/clarify-cumbre-archives.py")
clarifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(clarifier)

class HistoricalPdfTests(unittest.TestCase):
    def test_original_pages_preserved_and_preface_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "historical.pdf"
            writer = PdfWriter()
            writer.add_blank_page(width=612, height=792)
            writer.add_blank_page(width=500, height=700)
            with path.open("wb") as output:
                writer.write(output)
            clarifier.clarify(path)
            first = PdfReader(BytesIO(path.read_bytes()))
            self.assertEqual(len(first.pages), 3)
            self.assertEqual(float(first.pages[1].mediabox.width), 612)
            self.assertEqual(float(first.pages[2].mediabox.width), 500)
            original_streams = [page.get_contents() for page in first.pages[1:]]
            clarifier.clarify(path)
            second = PdfReader(path)
            self.assertEqual(len(second.pages), 3)
            self.assertEqual([page.get_contents() for page in second.pages[1:]], original_streams)

if __name__ == "__main__":
    unittest.main()