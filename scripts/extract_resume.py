import json
import os
import re
from pypdf import PdfReader

def clean_text(text):
    # Remove weird spaces in headings
    text = re.sub(r'E\s+DUCATION', 'EDUCATION', text)
    text = re.sub(r'W\s+ORK\s+E\s+XPERIENCE', 'WORK EXPERIENCE', text)
    text = re.sub(r'P\s+ROJECTS', 'PROJECTS', text)
    text = re.sub(r'S\s+KILL\s+S\s+ET', 'SKILL SET', text)
    # Remove extra spaces but keep newlines
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    return lines

def parse_resume(pdf_path):
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    lines = clean_text(text)
    
    resume_data = {
        "header": {},
        "education": [],
        "work_experience": [],
        "projects": [],
        "skills": []
    }
    
    current_section = "header"
    temp_item = {}
    
    for line in lines:
        if line == "EDUCATION":
            current_section = "education"
            continue
        elif line == "WORK EXPERIENCE":
            current_section = "work_experience"
            continue
        elif line == "PROJECTS":
            current_section = "projects"
            continue
        elif line == "SKILL SET":
            current_section = "skills"
            continue
            
        if current_section == "header":
            if "Haoyu Liu" in line:
                resume_data["header"]["name"] = "Haoyu Liu"
            elif "Tel:" in line:
                resume_data["header"]["contact"] = line
        
        elif current_section == "education":
            if "|" in line and "University" in line:
                resume_data["education"].append({"school": line, "details": []})
            elif "●" in line and len(resume_data["education"]) > 0:
                resume_data["education"][-1]["details"].append(line.replace("●", "").strip())
            elif "Related Courses" in line and len(resume_data["education"]) > 0:
                resume_data["education"][-1]["details"].append(line)
        
        elif current_section == "work_experience":
            if "|" in line and "Intern" in line or "Engineer" in line:
                resume_data["work_experience"].append({"title": line, "bullets": []})
            elif "●" in line and len(resume_data["work_experience"]) > 0:
                resume_data["work_experience"][-1]["bullets"].append(line.replace("●", "").strip())
            elif len(resume_data["work_experience"]) > 0 and len(resume_data["work_experience"][-1]["bullets"]) > 0:
                 # append to last bullet if it's wrapped text
                 resume_data["work_experience"][-1]["bullets"][-1] += " " + line

        elif current_section == "projects":
            if "●" in line:
                if len(resume_data["projects"]) > 0:
                    resume_data["projects"][-1]["bullets"].append(line.replace("●", "").strip())
            elif line and not "●" in line:
                resume_data["projects"].append({"name": line, "bullets": []})
            elif len(resume_data["projects"]) > 0 and len(resume_data["projects"][-1]["bullets"]) > 0:
                 resume_data["projects"][-1]["bullets"][-1] += " " + line
                 
        elif current_section == "skills":
            if line:
                resume_data["skills"].append(line)

    return resume_data

if __name__ == "__main__":
    import sys
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else "resume.pdf"
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        sys.exit(1)
        
    data = parse_resume(pdf_path)
    
    os.makedirs("src/data", exist_ok=True)
    with open("src/data/resume.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Successfully extracted resume to src/data/resume.json")
