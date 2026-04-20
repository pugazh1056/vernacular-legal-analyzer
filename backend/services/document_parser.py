import io
import fitz  # PyMuPDF
import docx

def parse_pdf(file_bytes: bytes) -> str:
    """Extracts text from a PDF file."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    return text

def parse_docx(file_bytes: bytes) -> str:
    """Extracts text from a DOCX file."""
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])
