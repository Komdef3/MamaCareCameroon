from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    # Pregnancy profile
    weeks_pregnant = Column(Integer, nullable=True, default=0)
    due_date = Column(String, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    blood_type = Column(String, nullable=True, default="Unknown")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    appointments = relationship("Appointment", back_populates="user", cascade="all, delete")
    symptoms = relationship("Symptom", back_populates="user", cascade="all, delete")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete")
