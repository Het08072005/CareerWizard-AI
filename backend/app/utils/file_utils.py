import io
from PyPDF2 import PdfReader
import docx

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        pages = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                cleaned = " ".join(page_text.replace("\x00", " ").split())
                if cleaned:
                    pages.append(cleaned)
        return "\n".join(pages)
    except Exception as exc:
        print(f"PDF text extraction failed: {exc}")
        return ""

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([p.text for p in doc.paragraphs])
