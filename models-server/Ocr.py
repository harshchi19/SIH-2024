import streamlit as st
import pdfplumber
from io import BytesIO
from PIL import Image
import sqlite3
import json
from openai import OpenAI
import base64
import pandas as pd
import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
import uuid

# Configuration and API Keys (Replace with your actual keys)
OPENAI_API_KEY = "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"  # Replace with your actual OpenAI API key

HF_OCR_API_URL = "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
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
        st.error(f"Error in GPT Vision processing: {str(e)}")
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
            st.error(f"Error processing {file.name}: {str(e)}")
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
        st.error(f"Error in GPT processing: {str(e)}")
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

def save_to_database(case_data, document_bytes, extracted_text, is_pdf=False):
    """Save detailed case data to SQLite database"""
    try:
        conn = sqlite3.connect('medical_cases.db')
        cursor = conn.cursor()
        
        # Create comprehensive table for medical cases
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_name TEXT,
            case_no TEXT,
            age_sex TEXT,
            date_of_assignment TEXT,
            student_clinician TEXT,
            supervisor TEXT,
            provisional_diagnosis TEXT,
            findings TEXT,
            document BLOB,
            is_pdf BOOLEAN,
            extracted_text TEXT,
            confidence_score TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Convert findings to JSON string for storage
        findings_json = json.dumps(case_data.get('findings', {}))
        
        # Insert comprehensive case record
        cursor.execute('''
        INSERT INTO cases (
            case_name, case_no, age_sex, date_of_assignment, 
            student_clinician, supervisor, provisional_diagnosis, 
            findings, document, is_pdf, extracted_text, confidence_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            case_data['case_name'],
            case_data['case_no'],
            case_data['age_sex'],
            case_data['date_of_assignment'],
            case_data['student_clinician'],
            case_data['supervisor'],
            case_data['provisional_diagnosis'],
            findings_json,
            document_bytes,
            is_pdf,
            extracted_text,
            case_data.get('confidence_score', 'medium')
        ))
        
        conn.commit()
        return True
    except Exception as e:
        st.error(f"Database error: {str(e)}")
        return False
    finally:
        conn.close()

def get_saved_cases():
    """Retrieve saved medical cases from database"""
    try:
        conn = sqlite3.connect('medical_cases.db')
        query = '''
        SELECT 
            id, case_name, case_no, age_sex, 
            date_of_assignment, student_clinician, 
            provisional_diagnosis, timestamp, is_pdf
        FROM cases
        ORDER BY timestamp DESC
        '''
        df = pd.read_sql_query(query, conn)
        conn.close()
        return df
    except Exception as e:
        st.error(f"Error retrieving cases: {str(e)}")
        return pd.DataFrame()

def get_case_details(case_id):
    """Retrieve detailed case information from database"""
    try:
        conn = sqlite3.connect('medical_cases.db')
        cursor = conn.cursor()
        cursor.execute('''
        SELECT document, is_pdf, extracted_text, findings, 
               case_name, case_no, age_sex, 
               date_of_assignment, student_clinician, 
               supervisor, provisional_diagnosis
        FROM cases WHERE id = ?
        ''', (case_id,))
        result = cursor.fetchone()
        conn.close()
        return result
    except Exception as e:
        st.error(f"Error retrieving case details: {str(e)}")
        return None

def main():
    st.set_page_config(
        page_title="Medical Case Analysis System", 
        page_icon="🩺", 
        layout="wide"
    )

    st.title("🩺 Advanced Medical Case Documentation System")
    
    # Tabs for different functionalities
    tab1, tab2, tab3 = st.tabs([
        "📤 Upload Case Document", 
        "📋 View Case Records", 
        "📊 Case Analytics"
    ])

    with tab1:
        st.header("Upload Medical Case Document")
        
        # File uploader with multiple file types
        uploaded_file = st.file_uploader(
            "Choose a medical case document (PDF or Image)", 
            type=['pdf', 'png', 'jpg', 'jpeg']
        )

        if uploaded_file:
            # Determine file type and process accordingly
            if uploaded_file.type == "application/pdf":
                # PDF processing
                with st.spinner("Processing PDF Case Document..."):
                    # Convert first page to image for preview
                    with pdfplumber.open(uploaded_file) as pdf:
                        first_page = pdf.pages[0]
                        img = first_page.to_image(resolution=300)
                        st.image(img.original, caption="Case Document First Page Preview")
                    
                    # Reset file pointer
                    uploaded_file.seek(0)
                    
                    # Extract text from PDF
                    extracted_text = extract_text_from_pdf(uploaded_file)
                    
                    # Preview extracted text
                    st.text_area("Extracted Text", extracted_text, height=200)
                    
                    # Process text with GPT
                    case_data = extract_case_info_with_gpt(extracted_text)
                    
                    # Display extracted case info
                    st.subheader("Extracted Case Information")
                    
                    # Create two columns for better display
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.text(f"Case Name: {case_data['case_name']}")
                        st.text(f"Case No: {case_data['case_no']}")
                        st.text(f"Age/Sex: {case_data['age_sex']}")
                        st.text(f"Date of Assignment: {case_data['date_of_assignment']}")
                        st.text(f"Student Clinician: {case_data['student_clinician']}")
                    
                    with col2:
                        st.text(f"Supervisor: {case_data['supervisor']}")
                        st.text(f"Provisional Diagnosis: {case_data['provisional_diagnosis']}")
                        st.text(f"Confidence Score: {case_data.get('confidence_score', 'N/A')}")
                    
                    # Expandable section for findings
                    with st.expander("View Detailed Findings"):
                        findings = case_data.get('findings', {})
                        for key, value in findings.items():
                            st.text(f"{key.replace('_', ' ').title()}: {value}")
                    
                    # Save button
                    if st.button("💾 Save Case Document"):
                        uploaded_file.seek(0)
                        pdf_bytes = uploaded_file.read()
                        if save_to_database(case_data, pdf_bytes, extracted_text, is_pdf=True):
                            st.success("Case document saved successfully!")
            
            else:
                # Image processing
                image = Image.open(uploaded_file)
                st.image(image, caption="Uploaded Case Document")
                
                with st.spinner("Analyzing case document image..."):
                    extracted_text = extract_text_with_gpt_vision(image)
                    
                    # Preview extracted text
                    st.text_area("Extracted Text", extracted_text, height=200)
                    
                    # Process text with GPT
                    case_data = extract_case_info_with_gpt(extracted_text)
                    
                    # Display extracted case info
                    st.subheader("Extracted Case Information")
                    
                    # Create two columns for better display
                    col1, col2 = st.columns(2)
                    with col1:
                        st.text(f"Case Name: {case_data['case_name']}")
                        st.text(f"Case No: {case_data['case_no']}")
                        st.text(f"Age/Sex: {case_data['age_sex']}")
                        st.text(f"Date of Assignment: {case_data['date_of_assignment']}")
                        st.text(f"Student Clinician: {case_data['student_clinician']}")
                    
                    with col2:
                        st.text(f"Supervisor: {case_data['supervisor']}")
                        st.text(f"Provisional Diagnosis: {case_data['provisional_diagnosis']}")
                        st.text(f"Confidence Score: {case_data.get('confidence_score', 'N/A')}")
                    
                    # Expandable section for findings
                    with st.expander("View Detailed Findings"):
                        findings = case_data.get('findings', {})
                        for key, value in findings.items():
                            st.text(f"{key.replace('_', ' ').title()}: {value}")
                    
                    # Save button
                    if st.button("💾 Save Case Document"):
                        image_bytes = BytesIO()
                        image.save(image_bytes, format='PNG')
                        image_bytes = image_bytes.getvalue()
                        if save_to_database(case_data, image_bytes, extracted_text, is_pdf=False):
                            st.success("Case document saved successfully!")

    with tab2:
        st.header("Case Records")
        
        # Retrieve and display saved cases
        cases_df = get_saved_cases()
        
        if not cases_df.empty:
            # Display cases in a table
            st.dataframe(cases_df[['case_name', 'case_no', 'age_sex', 'student_clinician', 'provisional_diagnosis', 'timestamp']])
            
            # Select a case for detailed view
            selected_case_id = st.selectbox("Select a case to view details", cases_df['id'])
            
            if selected_case_id:
                case_details = get_case_details(selected_case_id)
                
                if case_details:
                    document, is_pdf, extracted_text, findings, case_name, case_no, age_sex, date_of_assignment, student_clinician, supervisor, provisional_diagnosis = case_details
                    
                    # Display case details
                    st.subheader(f"Case Details: {case_name}")
                    
                    col1, col2 = st.columns(2)
                    
                    with col1:
                        st.text(f"Case No: {case_no}")
                        st.text(f"Age/Sex: {age_sex}")
                        st.text(f"Date of Assignment: {date_of_assignment}")
                    
                    with col2:
                        st.text(f"Student Clinician: {student_clinician}")
                        st.text(f"Supervisor: {supervisor}")
                        st.text(f"Provisional Diagnosis: {provisional_diagnosis}")
                    
                    # Display extracted text
                    with st.expander("Extracted Text"):
                        st.text_area("Document Text", extracted_text, height=200)
                    
                    # Display findings
                    with st.expander("Detailed Findings"):
                        findings_dict = json.loads(findings)
                        for key, value in findings_dict.items():
                            st.text(f"{key.replace('_', ' ').title()}: {value}")
                    
                    # Option to download original document
                    if st.button("📥 Download Original Document"):
                        if is_pdf:
                            st.download_button(
                                label="Download PDF",
                                data=document,
                                file_name=f"{case_name}_document.pdf",
                                mime="application/pdf"
                            )
                        else:
                            st.download_button(
                                label="Download Image",
                                data=document,
                                file_name=f"{case_name}_document.png",
                                mime="image/png"
                            )
        else:
            st.warning("No case records found.")
    
    with tab3:
        st.header("Case Analytics")
        
        # Generate PDF report of all cases
        if st.button("📄 Generate Case Records Report"):
            try:
                records_df = get_saved_cases()
                if not records_df.empty:
                    pdf_buffer = create_pdf_report(records_df)
                    st.download_button(
                        label="Download Case Records Report",
                        data=pdf_buffer,
                        file_name="Medical_Case_Records_Report.pdf",
                        mime="application/pdf"
                    )
                else:
                    st.warning("No case records available to generate report.")
            except Exception as e:
                st.error(f"Error generating report: {str(e)}")

if __name__ == "__main__":
    main()