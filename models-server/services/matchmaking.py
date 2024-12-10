import os
import fitz 
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def extract_text_from_pdf(pdf_file) -> str:
    """
    Extract text from a PDF file using PyMuPDF (fitz).
    """
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)  # Get a page
        text += page.get_text()  # Extract text from the page
    return text

def extract_text_from_folder(folder_path: str) -> dict:
    """
    Extract text from all PDFs in a specified folder and return a dictionary
    with file names as keys and extracted text as values.
    """
    extracted_texts = {}
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(folder_path, filename)
            with open(file_path, "rb") as f:
                text = extract_text_from_pdf(f)
                extracted_texts[filename] = text
    return extracted_texts

def compute_cosine_similarity(text1: str, text2: str) -> float:
    """
    Compute cosine similarity between two texts.
    """
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return similarity_matrix[0][0]
