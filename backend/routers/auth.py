from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel, EmailStr
from typing import Optional
from core.database import get_db
from core.security import verify_password, get_password_hash, create_access_token, get_current_user
from core.config import settings
from models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    age: Optional[int] = None

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    age: Optional[int] = None
    weeks_pregnant: Optional[int] = None
    due_date: Optional[str] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    blood_type: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", status_code=201)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        full_name=data.full_name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        phone=data.phone,
        age=data.age,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Account created successfully"}

@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
