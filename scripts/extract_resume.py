import json
import os
import re
from pypdf import PdfReader

def clean_text_block(text):
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_resume(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    text = re.sub(r'E\s*D\s*U\s*C\s*A\s*T\s*I\s*O\s*N', '\nEDUCATION\n', text)
    text = re.sub(r'W\s*O\s*R\s*K\s+E\s*X\s*P\s*E\s*R\s*I\s*E\s*N\s*C\s*E', '\nWORK EXPERIENCE\n', text)
    text = re.sub(r'P\s*R\s*O\s*J\s*E\s*C\s*T\s*S', '\nPROJECTS\n', text)
    text = re.sub(r'S\s*K\s*I\s*L\s*L\s+S\s*E\s*T', '\nSKILL SET\n', text)
    
    sections = re.split(r'\n(EDUCATION|WORK EXPERIENCE|PROJECTS|SKILL SET)\n', text)
    
    resume_data = {
        "header": {
            "name": "Haoyu Liu",
            "contact": "Tel: +12179740614 | Email: hliu8571@usc.edu",
            "links": [
                { "name": "LinkedIn", "url": "https://www.linkedin.com/in/liuhaoyuu/" },
                { "name": "Github", "url": "https://github.com/Haoyuliu-ooyu" }
            ]
        },
        "education": [],
        "work_experience": [],
        "projects": [],
        "skills": []
    }
    
    if len(sections) < 9:
        print("Warning: Section parsing failed. Reverting to basic schema.")
        return resume_data

    edu_text = sections[2]
    work_text = sections[4]
    proj_text = sections[6]
    skills_text = sections[8]
    
    date_regex = r'([A-Z][a-z]{2}\s+\d{4}\s*[–-]\s*[A-Z][a-z]{2}\s+\d{4}|[A-Z][a-z]{2}\s+\d{4}\s*[–-]\s*Present)'

    # --- EDUCATION ---
    edu_chunks = [c for c in re.split(r'\s{3,}', edu_text.strip()) if c.strip()]
    for i in range(0, len(edu_chunks) - 1, 2):
        school = clean_text_block(edu_chunks[i])
        details = clean_text_block(edu_chunks[i+1])
        date_match = re.search(date_regex, details)
        date = date_match.group(1) if date_match else ""
        
        degree_part = details.replace(date, '').replace('●', '', 1).strip()
        degree = degree_part
        courses = ""
        if "Related Courses" in degree_part:
            d_split = re.split(r'Related Courses\s*:', degree_part)
            degree = d_split[0].strip()
            if len(d_split) > 1:
                courses = d_split[1].strip()
                
        resume_data["education"].append({
            "school": school.strip(),
            "date": date.strip(),
            "degree": degree.strip(),
            "courses": courses.strip()
        })

    # --- WORK EXPERIENCE ---
    work_chunks = [c for c in re.split(r'\s{3,}|\n', work_text.strip()) if c.strip()]
    current_job = None
    for chunk in work_chunks:
        chunk = clean_text_block(chunk)
        if not chunk: continue
        
        if (" | " in chunk and ("Intern" in chunk or "Engineer" in chunk or "Assistant" in chunk)) or chunk.startswith("Software Engineering") or chunk.startswith("Research"):
            current_job = {"title": chunk, "date": "", "bullets": []}
            resume_data["work_experience"].append(current_job)
        elif re.search(date_regex, chunk) and current_job and not current_job["date"]:
            current_job["date"] = chunk
        elif chunk == "●":
            if current_job: current_job["bullets"].append("")
        else:
            if current_job and len(current_job["bullets"]) > 0:
                current_job["bullets"][-1] += (" " + chunk if current_job["bullets"][-1] else chunk)
                current_job["bullets"][-1] = clean_text_block(current_job["bullets"][-1])

    # --- PROJECTS ---
    # Since projects text is totally scrambled by newlines and spaces,
    # let's just recombine the entire project section into a single string.
    full_proj = clean_text_block(proj_text)
    # Projects bullets are separated by ●
    bullet_blocks = full_proj.split("●")
    for i, block in enumerate(bullet_blocks):
        block = clean_text_block(block)
        if i == 0:
            # The first block contains the first project name!
            # e.g., "Polyglot AI Document Pipeline | https://prism-reader.space"
            proj_name = block.split(" | ")[0].strip()
            resume_data["projects"].append({"name": proj_name, "url": "", "bullets": []})
        else:
            # Middle blocks contain bullet text AND the NEXT project name at the end.
            # E.g., "Architected a ... reading experience Cross-platform Stock Simulator App "
            # Project names are usually Title Case. Let's heuristically extract everything.
            # But the last bullet of a project includes the name of the next project.
            # We can map against existing names if possible, but let's assume we can't easily parse this without NLP.
            # Simple fallback: dump it into the current project bullet.
            resume_data["projects"][-1]["bullets"].append(block)

            # Look for double capitals which could be a project name
            # "experience Cross-platform Stock Simulator App"
            # It's better to manually edit projects if it fails, or we can use existing json!

    # --- SKILLS ---
    skills_lines = [s for s in skills_text.split('\n') if s.strip()]
    merged_skills = []
    for sl in skills_lines:
        if ":" in sl:
            merged_skills.append(sl.strip())
        else:
            if merged_skills:
                merged_skills[-1] += " " + sl.strip()
            else:
                merged_skills.append(sl.strip())
                
    # Further clean to fix missing words
    # Format: "Languages: Python... Frameworks & Libraries: React..."
    skill_text = " ".join(merged_skills)
    skill_categories = re.findall(r'([A-Za-z\s\&]+):(.*?(?=(?:[A-Za-z\s\&]+):|$))', skill_text)
    
    for cat, items in skill_categories:
        resume_data["skills"].append({
            "category": clean_text_block(cat).strip(),
            "items": clean_text_block(items).strip()
        })
        
    return resume_data

if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        sys.exit(1)
        
    new_data = parse_resume(pdf_path)
    output_path = "src/data/resume.json"
    
    if os.path.exists(output_path):
        with open(output_path, "r") as f:
            try:
                old_data = json.load(f)
                
                # Merge Projects entirely from old JSON to retain perfect formatting and URLs
                if "projects" in old_data and len(old_data["projects"]) > 0:
                    new_data["projects"] = old_data["projects"]
            except Exception as e:
                pass
                
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(new_data, f, indent=2)
    print(f"Successfully extracted resume into {output_path}")
