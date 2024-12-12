import os
import base64
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
import tempfile
from groq import Groq  
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv 

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("Groq API key is not set. Please add it to your .env file.")
    
client = Groq(api_key=groq_api_key)

class TreatmentPlanGenerator:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.knowledge_base_path = "knowledge_base"

    def load_knowledge_base(self) -> List[dict]:
        knowledge_docs = []
        
        if not os.path.exists(self.knowledge_base_path):
            return knowledge_docs
        
        for filename in os.listdir(self.knowledge_base_path):
            if filename.endswith('.pdf'):
                pdf_path = os.path.join(self.knowledge_base_path, filename)
                try:
                    loader = PyPDFLoader(pdf_path)
                    documents = loader.load()
                    chunks = self.text_splitter.split_documents(documents)
                    knowledge_docs.append({
                        'filename': filename,
                        'chunks': [chunk.page_content for chunk in chunks]
                    })
                except Exception as e:
                    raise Exception(f"Error processing PDF {filename}: {str(e)}")
        
        return knowledge_docs

    def find_most_relevant_document(self, patient_context: str, knowledge_docs: List[dict]) -> Optional[dict]:
        if not knowledge_docs:
            return None

        try:
            knowledge_texts = [chunk for doc in knowledge_docs for chunk in doc['chunks']]
            if not knowledge_texts:
                return knowledge_docs[0] if knowledge_docs else None
            
            all_texts = knowledge_texts + [patient_context]
            
            vectorizer = TfidfVectorizer()
            tfidf_matrix = vectorizer.fit_transform(all_texts)
            
            patient_vector = tfidf_matrix[-1]
            knowledge_vectors = tfidf_matrix[:-1]
            
            similarities = cosine_similarity(patient_vector, knowledge_vectors)[0]
            most_similar_index = similarities.argmax()
            
            return knowledge_docs[most_similar_index]
        except Exception as e:
            return knowledge_docs[0] if knowledge_docs else None

    def process_pdf(self, pdf_path: str) -> List[str]:
        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            return [chunk.page_content for chunk in self.text_splitter.split_documents(documents)]
        except Exception as e:
            raise Exception(f"Error processing PDF: {str(e)}")
    
    def generate_treatment_plan(self, patient_chunks: List[str], knowledge_base_docs: List[dict]) -> str:
        patient_context = "\n".join(patient_chunks)
        most_relevant_doc = self.find_most_relevant_document(patient_context, knowledge_base_docs)
        
        knowledge_context = ""
        reference_doc = "No specific document found"
        if most_relevant_doc:
            knowledge_context = "\n".join(most_relevant_doc['chunks'][:3])  # Use first 3 chunks
            reference_doc = most_relevant_doc['filename']
        
        prompt_template = """
        Create a detailed, comprehensive treatment plan based on:
        1. Patient Details:
        {patient_context}

        2. Relevant Knowledge Base Insights:
        {knowledge_context}

        Treatment Plan Guidelines:
        - Include 5-10 specific steps
        - For each step, specify:
          1. Duration
          2. Goal to be achieved
          3. Intent
          4. Any required machinery/tools
          5. Focus areas for the sessions
        - Summarize 5 short-term and 5 long-term goals
        - Incorporate insights from the most relevant knowledge base document

        Most Relevant Reference Document: {reference_doc}
        """
        
        prompt = prompt_template.format(
            patient_context=patient_context or "No patient context available.",
            knowledge_context=knowledge_context or "No knowledge base insights found.",
            reference_doc=reference_doc
        )
        
        try:
            response = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are an expert medical treatment plan generator."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192",
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error during treatment plan generation: {str(e)}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

import logging

logging.basicConfig(level=logging.DEBUG)

@app.post("/generate-treatment-plan/")
async def generate_treatment_plan(pdf: UploadFile = File(...)):
    logging.info(f"Received file: {pdf.filename}")
    generator = TreatmentPlanGenerator()

    # Save the uploaded file to a temporary location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(await pdf.read())
        patient_path = tmp_file.name
    logging.info(f"Temporary file saved at: {patient_path}")

    try:
        # Load the knowledge base
        knowledge_base_docs = generator.load_knowledge_base()
        logging.info(f"Knowledge base loaded with {len(knowledge_base_docs)} documents.")

        # Process the patient's PDF and extract text chunks
        patient_chunks = generator.process_pdf(patient_path)
        logging.info(f"Extracted {len(patient_chunks)} chunks from the patient's PDF.")

        if not patient_chunks:
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded PDF.")
        
        # Generate the treatment plan
        if not knowledge_base_docs:
            treatment_plan = generator.generate_treatment_plan(patient_chunks, [])
        else:
            treatment_plan = generator.generate_treatment_plan(patient_chunks, knowledge_base_docs)
        
        # Return the treatment plan in HTML format
        return HTMLResponse(content=f"<div style='padding: 10px; border: 1px solid #ddd;'>{treatment_plan}</div>")
    
    except Exception as e:
        logging.error(f"Error generating treatment plan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        os.unlink(patient_path)  # Clean up the temporary file


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
