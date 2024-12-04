from io import BytesIO
from PIL import Image
import json
from openai import OpenAI
import base64
import os

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN') or "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"
ENDPOINT = os.getenv('ENDPOINT') or "https://models.inference.ai.azure.com"
MODEL_NAME = "gpt-4o"

HF_OCR_API_URL = os.getenv('HF_OCR_API_URL') or "https://api-inference.huggingface.co/models/microsoft/trocr-base-handwritten"
HF_HEADERS = {"Authorization": "Bearer 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"}

client = OpenAI(
    base_url=ENDPOINT,
    api_key=GITHUB_TOKEN
)

def encode_image_to_base64(image):
    """Convert PIL Image to base64 string"""
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

def extract_case_info_with_github_ai(text):
    """Extract structured medical case information using GitHub's GPT-4o"""
    try:
        system_prompt = """You are a medical case documentation specialist. Your task is to:
        1. Carefully analyze medical case documents
        2. Extract comprehensive case details with high accuracy
        3. Maintain patient data confidentiality
        4. Provide structured and detailed information
        5. Flag any unclear or ambiguous information
        """
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
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
        print(f"Error in GitHub AI processing: {str(e)}")
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
    
def extract_text_with_github_vision(image):
    """Extract text from image using GitHub's GPT-4o with vision capabilities"""
    try:
        base64_image = encode_image_to_base64(image)
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
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
        print(f"Error in GitHub AI Vision processing: {str(e)}")
        return ""

async def combine_and_process_images(images):
    """
    Process multiple images of the same prescription/case and combine their extracted text
    before analysis.
    
    Args:
        images: List of uploaded image files for the same case
    Returns:
        combined_text: Combined extracted text from all pages
        case_data: Extracted case information from combined text
    """
    combined_text = ""
    documents = []
    
    # First pass: Extract text from all images
    for idx, image_file in enumerate(images, 1):
        try:
            content = await image_file.read()
            image = Image.open(BytesIO(content))

            page_text = extract_text_with_github_vision(image)
            combined_text += f"\n\n=== Page {idx} ===\n{page_text}"

            buffer = BytesIO()
            image.save(buffer, format="PNG")
            documents.append(buffer.getvalue())
            
        except Exception as e:
            print(f"Error processing page {idx}: {str(e)}")
            continue
    
    print(combined_text)
    # Extract case information from combined text   
    case_data = extract_case_info_with_github_ai(combined_text)
    
    return combined_text, case_data, documents

async def generate_pre_therapy(uploaded_files):
            
    _, case_data, _ = await combine_and_process_images(uploaded_files)

    return case_data