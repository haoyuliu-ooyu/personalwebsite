import re
from pypdf import PdfReader
text = ''.join(p.extract_text() for p in PdfReader('resume.pdf').pages)
text = re.sub(r'E\s*D\s*U\s*C\s*A\s*T\s*I\s*O\s*N', '\nEDUCATION\n', text)
text = re.sub(r'W\s*O\s*R\s*K\s+E\s*X\s*P\s*E\s*R\s*I\s*E\s*N\s*C\s*E', '\nWORK EXPERIENCE\n', text)
text = re.sub(r'P\s*R\s*O\s*J\s*E\s*C\s*T\s*S', '\nPROJECTS\n', text)
text = re.sub(r'S\s*K\s*I\s*L\s*L\s+S\s*E\s*T', '\nSKILL SET\n', text)
sections = re.split(r'\n(EDUCATION|WORK EXPERIENCE|PROJECTS|SKILL SET)\n', text)
print(len(sections))
