from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel
from core.database import get_db
from core.security import get_current_user
from core.config import settings
from models.health import ChatMessage
from models.user import User
import httpx
import traceback

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are MamaCare AI, a compassionate maternal health assistant for pregnant women.
You help with pregnancy questions, symptoms, nutrition, emotional support, prenatal care, and labor guidance.
Always be warm, empathetic, and supportive. For urgent or serious medical concerns, always advise contacting a healthcare provider immediately.
Never diagnose. Keep responses concise, friendly, and easy to understand."""


class ChatRequest(BaseModel):
    message: str

class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


def call_groq(messages: list, api_key: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"

    formatted = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        formatted.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": formatted,
        "max_tokens": 1024,
        "temperature": 0.7
    }

    with httpx.Client(timeout=30) as client:
        res = client.post(url, json=payload, headers=headers)

    if res.status_code != 200:
        raise Exception(f"Groq API returned {res.status_code}: {res.text}")

    return res.json()["choices"][0]["message"]["content"]


@router.post("/")
def chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not settings.GROQ_API_KEY:
        raise HTTPException(500, "AI service not configured. Add GROQ_API_KEY to .env file")

    history = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at.desc()).limit(10).all()
    history.reverse()

    messages = [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": data.message})

    try:
        reply = call_groq(messages, settings.GROQ_API_KEY)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"AI error: {str(e)}")

    user_msg = ChatMessage(user_id=user.id, role="user", content=data.message)
    ai_msg = ChatMessage(user_id=user.id, role="assistant", content=reply)
    db.add(user_msg)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return {"response": reply, "id": ai_msg.id}


@router.get("/history", response_model=List[MessageOut])
def get_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at).all()


@router.delete("/history")
def clear_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    db.query(ChatMessage).filter(ChatMessage.user_id == user.id).delete()
    db.commit()
    return {"message": "Chat history cleared"}