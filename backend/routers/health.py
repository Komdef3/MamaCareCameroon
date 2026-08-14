from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from core.database import get_db
from core.security import get_current_user
from models.health import Symptom
from models.user import User
from collections import Counter

router = APIRouter(prefix="/api/health", tags=["health"])

class SymptomCreate(BaseModel):
    symptom: str           # matches frontend field name exactly
    severity: int
    week: Optional[int] = None    # matches frontend field name exactly
    notes: Optional[str] = None

class SymptomOut(BaseModel):
    id: int
    symptom: str
    severity: int
    week: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    weeks_pregnant: Optional[int] = None
    due_date: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    blood_type: Optional[str] = None

@router.get("/symptoms", response_model=List[SymptomOut])
def get_symptoms(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Symptom).filter(Symptom.user_id == user.id).order_by(Symptom.created_at.desc()).all()

@router.post("/symptoms", response_model=SymptomOut, status_code=201)
def log_symptom(data: SymptomCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = Symptom(
        user_id=user.id,
        symptom=data.symptom,
        severity=data.severity,
        week=data.week,
        notes=data.notes,
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.put("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if data.weeks_pregnant is not None:
        user.weeks_pregnant = data.weeks_pregnant
    if data.due_date is not None:
        user.due_date = data.due_date
    if data.weight is not None:
        user.weight = data.weight
    if data.height is not None:
        user.height = data.height
    if data.blood_type is not None:
        user.blood_type = data.blood_type
    db.commit()
    return {"message": "Profile updated"}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    symptoms = db.query(Symptom).filter(Symptom.user_id == user.id).all()
    if not symptoms:
        return {"total": 0, "avg_severity": 0, "most_common": None}
    counts = Counter(s.symptom for s in symptoms)
    most_common = counts.most_common(1)[0][0]
    avg = round(sum(s.severity for s in symptoms) / len(symptoms), 1)
    return {
        "total": len(symptoms),
        "avg_severity": avg,
        "most_common": most_common,
    }
