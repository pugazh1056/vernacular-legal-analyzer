import os
import uuid
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.document_parser import parse_pdf, parse_docx
from services.llm_service import analyze_document, chat_document

app = FastAPI(title="Legal AI Backend MVP")

# Configure CORS to allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store to hold the session data (document text).
# For production, you should use Redis, Postgres, or an actual File Storage solution.
SESSION_STORE = {}

class AnalyzeRequest(BaseModel):
    session_id: str
    language: str = "English"
    role: str = "business"

class ChatHistoryMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    session_id: str
    message: str
    history: List[ChatHistoryMessage] = []

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FastAPI backend is running successfully!"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Parses a PDF or DOCX file, extracts text, and stores it in-memory.
    Returns a session_id for future analysis or chat requests.
    """
    try:
        content = await file.read()
        extracted_text = ""
        
        if file.filename.lower().endswith(".pdf"):
            extracted_text = parse_pdf(content)
        elif file.filename.lower().endswith(".docx"):
            extracted_text = parse_docx(content)
        else:
            # Fallback for plain text or unsupported types
            extracted_text = content.decode("utf-8", errors="ignore")
            
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from document.")
            
        session_id = str(uuid.uuid4())
        SESSION_STORE[session_id] = {
            "text": extracted_text,
            "filename": file.filename
        }
        
        # Return a preview snippet like the old Next.js route did
        preview_max = 5000
        preview = extracted_text[:preview_max] + "…" if len(extracted_text) > preview_max else extracted_text
        
        print(f"Stored session: {session_id} for file {file.filename}")
        return {
            "sessionId": session_id,
            "preview": preview,
            "previewLength": len(preview),
            "documentLength": len(extracted_text),
            "preferredLanguage": "English",
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    """
    Retrieves the document text by session_id and sends it to the LLM
    to generate an analysis structured as JSON (Summary, Risks, Clauses).
    """
    if request.session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Session not found or expired. Please upload again.")
        
    document_text = SESSION_STORE[request.session_id]["text"]
    
    try:
        analysis_result = analyze_document(
            text=document_text, 
            language=request.language,
            role=request.role
        )
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Retrieves document text and passes it alongside user chat input
    to the LLM for Q&A formatting.
    """
    if request.session_id not in SESSION_STORE:
        raise HTTPException(status_code=404, detail="Session not found or expired. Please upload again.")
        
    document_text = SESSION_STORE[request.session_id]["text"]
    
    try:
        # Convert Pydantic models back to dictionaries
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        reply = chat_document(
            text=document_text,
            query=request.message,
            history=history_dicts
        )
        
        # We simulate SSE/streaming in the frontend usually, but for this MVP,
        # we will return the full text block in one go.
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
