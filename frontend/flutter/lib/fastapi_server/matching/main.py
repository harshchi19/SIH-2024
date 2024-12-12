from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import fitz  # PyMuPDF
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify a list of domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file) -> str:
    """
    Extract text from a PDF file using PyMuPDF (fitz).
    """
    try:
        doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
        text = ""
        for page_num in range(doc.page_count):
            page = doc.load_page(page_num)  # Get a page
            text += page.get_text()  # Extract text from the page
        return text.strip()  # Remove leading/trailing whitespace
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

# Function to extract text from PDFs in a folder
def extract_text_from_folder(folder_path: str) -> dict:
    """
    Extract text from all PDFs in a specified folder and return a dictionary
    with file names as keys and extracted text as values.
    """
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail=f"Folder '{folder_path}' not found.")

    extracted_texts = {}
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, "rb") as f:
                    text = extract_text_from_pdf(f)
                    extracted_texts[filename] = text
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Error processing file '{filename}': {str(e)}"
                )

    if not extracted_texts:
        raise HTTPException(
            status_code=404,
            detail="No valid PDF files found in the folder."
        )

    return extracted_texts

# Function to compute cosine similarity
def compute_cosine_similarity(text1: str, text2: str) -> float:
    """
    Compute cosine similarity between two texts.
    """
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return similarity_matrix[0][0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error computing similarity: {str(e)}")

# API endpoint for similarity calculation
@app.post("/calculate_similarity/")
async def calculate_similarity(pdf_file: UploadFile = File(...)):
    """
    API endpoint to calculate similarity scores between an uploaded PDF and
    therapist PDF data in a folder.
    """
    folder_path = "therapist_data"  # Therapist data folder path

    # Validate uploaded file
    if not pdf_file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        # Extract text from the uploaded PDF
        uploaded_pdf_text = extract_text_from_pdf(pdf_file.file)

        # Extract text from therapist PDFs
        therapist_data = extract_text_from_folder(folder_path)

        # Calculate similarities
        similarities = []
        for filename, text in therapist_data.items():
            similarity_score = compute_cosine_similarity(uploaded_pdf_text, text)
            similarities.append({"filename": filename, "similarity_score": similarity_score})

        # Sort by similarity score in descending order
        similarities.sort(key=lambda x: x["similarity_score"], reverse=True)

        # Return top 3 results
        top_similarities = similarities[:3]

        return JSONResponse(content={"top_similarities": top_similarities})

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8003)
