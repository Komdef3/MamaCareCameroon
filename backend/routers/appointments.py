from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from core.database import get_db
from core.security import get_current_user
from models.appointment import Appointment
from models.user import User

router = APIRouter(prefix="/api/appointments", tags=["appointments"])

class AppointmentCreate(BaseModel):
    doctor_name: str
    appointment_type: str
    appointment_date: str
    location: Optional[str] = None
    notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    doctor_name: str
    appointment_type: str
    appointment_date: str
    location: Optional[str] = None
    notes: Optional[str] = None
    completed: bool

    class Config:
        from_attributes = True

@router.get("/", response_model=List[AppointmentOut])
def get_appointments(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Appointment).filter(
        Appointment.user_id == user.id
    ).order_by(Appointment.appointment_date).all()

@router.post("/", response_model=AppointmentOut, status_code=201)
def create_appointment(data: AppointmentCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    appt = Appointment(
        user_id=user.id,
        doctor_name=data.doctor_name,
        appointment_type=data.appointment_type,
        appointment_date=data.appointment_date,
        location=data.location,
        notes=data.notes,
        completed=False,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt

@router.put("/{appt_id}/complete")
def complete_appointment(appt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    appt = db.query(Appointment).filter(
        Appointment.id == appt_id,
        Appointment.user_id == user.id
    ).first()
    if not appt:
        raise HTTPException(404, "Appointment not found")
    appt.completed = True
    db.commit()
    return {"message": "Marked complete"}

@router.delete("/{appt_id}")
def delete_appointment(appt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    appt = db.query(Appointment).filter(
        Appointment.id == appt_id,
        Appointment.user_id == user.id
    ).first()
    if not appt:
        raise HTTPException(404, "Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Deleted"}