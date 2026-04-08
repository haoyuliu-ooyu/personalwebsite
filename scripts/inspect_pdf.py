import sys
try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf not installed")
    sys.exit(1)

reader = PdfReader("Haoyu_Liu_Resume.pdf")
for page in reader.pages:
    print(page.extract_text())
