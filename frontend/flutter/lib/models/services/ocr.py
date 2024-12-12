import pdfplumber
from io import BytesIO
from PIL import Image
import json
from openai import OpenAI
import base64
import pandas as pd
import io
import os

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# Configuration and API Keys (Replace with your actual keys)
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY') or "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"

HF_OCR_API_URL = os.getenv('HF_OCR_API_URL') or "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
HF_HEADERS = {"Authorization": "Bearer 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"}

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def encode_image_to_base64(image):
    """Convert PIL Image to base64 string"""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def extract_text_with_gpt_vision(image):
    """Extract text from image using GPT-4o with vision capabilities"""
    try:
        base64_image = encode_image_to_base64(image)
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Carefully analyze this medical document and extract all visible text, including both printed and handwritten content."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=4096,
            temperature=0.1
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print("Error in extract_text_with_gpt_vision: ", {str(e)})
        return ""

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF pages"""
    extracted_text = ""
    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            extracted_text += page.extract_text() or ""
    return extracted_text

def process_multiple_files(files):
    """Process multiple uploaded files and return their extracted data"""
    results = []
    for file in files:
        try:
            if file.type == "application/pdf":
                extracted_text = extract_text_from_pdf(file)
            else:
                image = Image.open(file)
                extracted_text = extract_text_with_gpt_vision(image)
            

            case_data = extract_case_info_with_gpt(extracted_text)
            
            file.seek(0)
            file_content = file.read()
            
            results.append({
                'file_name': file.name,
                'file_type': file.type,
                'file_content': file_content,
                'extracted_text': extracted_text,
                'case_data': case_data,
                'is_pdf': file.type == "application/pdf"
            })
            
        except Exception as e:
            print(f"Error processing {file.name}: {str(e)}")
            continue
            
    return results

def extract_case_info_with_gpt(text):
    """Extract structured medical case information using GPT-4o"""
    try:
        system_prompt = """You are a medical case documentation specialist. Your task is to:
        1. Carefully analyze medical case documents
        2. Extract comprehensive case details with high accuracy
        3. Maintain patient data confidentiality
        4. Provide structured and detailed information
        5. Flag any unclear or ambiguous information
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": f"""Please extract the following detailed information from this medical case document:
                    
                    Text to analyze: {text}
                    
                    Please provide the information in this exact JSON format:
                    {{
                        "case_name": "full case name or identifier",
                        "case_no": "unique case number",
                        "age_sex": "patient's age and sex",
                        "date_of_assignment": "date when case was assigned",
                        "student_clinician": "name of student clinician",
                        "supervisor": "name of supervising professional",
                        "provisional_diagnosis": "initial diagnosis or working hypothesis",
                        "findings": {{
                            "opme": "observation details",
                            "reception": "patient's initial reception or response",
                            "expression": "patient's communication and expressive details",
                            "pragmatics": "social communication and language use",
                            "attention": "patient's attention span and focus",
                            "auditory_skill": "hearing and auditory processing capabilities", 
                            "play_behavior": "observed play patterns or interactions",
                            "general_behavior": "overall behavioral observations",
                            "formal_testing": "results from standardized assessments",
                            "clinical_impression": "professional's overall assessment",
                            "additional_notes": "any other significant observations"
                        }},
                        "confidence_score": "high/medium/low based on data clarity and completeness"
                    }}"""
                }
            ],
            response_format={ "type": "json_object" },
            temperature=0.1,
            max_tokens=4096
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in extract_case_info_with_gpt: {str(e)}")
        return {
            "case_name": "Unknown",
            "case_no": "N/A",
            "age_sex": "Not Specified",
            "date_of_assignment": "Not Available",
            "student_clinician": "Not Recorded",
            "supervisor": "Not Assigned",
            "provisional_diagnosis": "Pending",
            "findings": {
                "opme": "No observations",
                "reception": "No data",
                "expression": "Not evaluated",
                "pragmatics": "Not assessed",
                "attention": "Not measured",
                "auditory_skill": "Not tested",
                "play_behavior": "No observations",
                "general_behavior": "Not documented",
                "formal_testing": "No tests performed",
                "clinical_impression": "Insufficient information",
                "additional_notes": f"Error in extraction: {str(e)}"
            },
            "confidence_score": "low"
        }

def create_pdf_report(records_df):
    """Create a concise PDF report of medical case records"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Define custom colors
    header_color = colors.Color(0.2, 0.4, 0.6)  # Dark blue
    row_color = colors.Color(0.96, 0.96, 0.86)  # Light beige

    # Title Style
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=header_color,
        spaceAfter=10,
        alignment=1
    )
    elements.append(Paragraph("Medical Case Records", title_style))

    # Subtitle with current date
    from datetime import datetime
    current_date = datetime.now().strftime("%B %d, %Y")
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=1
    )
    elements.append(Paragraph(f"Generated on: {current_date}", subtitle_style))
    elements.append(Spacer(1, 15))

    # Prepare detailed table data with limited columns
    table_data = [
        [
            'Case Name', 
            'Case No', 
            'Age/Sex', 
            'Student Clinician', 
            'Provisional Diagnosis'
        ]
    ]
    for _, row in records_df.iterrows():
        table_data.append([
            str(row.get('case_name', 'N/A'))[:20],  # Limit name length
            str(row.get('case_no', 'N/A')),
            str(row.get('age_sex', 'N/A')),
            str(row.get('student_clinician', 'N/A')),
            str(row.get('provisional_diagnosis', 'N/A'))[:25]  # Limit diagnosis length
        ])

    # Calculate column widths
    col_widths = [100, 70, 50, 100, 120]

    # Create table with improved styling
    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    table.setStyle(TableStyle([
        # Header Row Styling
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        
        # Data Rows Styling
        ('BACKGROUND', (0, 1), (-1, -1), row_color),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4)
    ]))

    elements.append(table)

    # Summary Section
    elements.append(Spacer(1, 15))
    summary_style = ParagraphStyle(
        'Summary',
        parent=styles['Normal'],
        fontSize=10,
        alignment=1
    )
    
    total_cases = len(records_df)
    elements.append(Paragraph(f"Total Cases Documented: {total_cases}", summary_style))

    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=1
    )
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("--- End of Report ---", footer_style))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer

def process_batch_upload(uploaded_files):
    """Process multiple files in a batch and return consolidated results"""
    batch_results = []
    
    # Process all files first
    for uploaded_file in uploaded_files:
        try:
            if uploaded_file.type == "application/pdf":
                extracted_text = extract_text_from_pdf(uploaded_file)
                uploaded_file.seek(0)
                file_content = uploaded_file.read()
                is_pdf = True
            else:
                image = Image.open(uploaded_file)
                extracted_text = extract_text_with_gpt_vision(image)
                buffer = BytesIO()
                image.save(buffer, format='PNG')
                file_content = buffer.getvalue()
                is_pdf = False
            
            case_data = extract_case_info_with_gpt(extracted_text)
            
            batch_results.append({
                'file_name': uploaded_file.name,
                'case_data': case_data,
                'file_content': file_content,
                'extracted_text': extracted_text,
                'is_pdf': is_pdf
            })
            
        except Exception as e:
            print(f"Error in process_batch_upload: {e}")
            continue

    return batch_results

def generate_pre_therapy(uploaded_file):
    case_data = []

    if uploaded_file:
        file_content = uploaded_file.file.read()

        if uploaded_file.content_type == "application/pdf":
            
            pdf_file = BytesIO(file_content)
            
            extracted_text = extract_text_from_pdf(pdf_file)
            
            case_data = extract_case_info_with_gpt(extracted_text)
        else:
            image = Image.open(BytesIO(file_content))
            
            extracted_text = extract_text_with_gpt_vision(image)
            
            case_data = extract_case_info_with_gpt(extracted_text)
    
    print("CASE DATA: ", case_data)
    return case_data