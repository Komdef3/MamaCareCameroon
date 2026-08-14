from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from core.database import Base, engine
from routers import auth, appointments, health, chat, analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MamaCare API",
    description="Maternal Care Platform — Backend API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002", "https://mama-blossom-guide.lovable.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus monitoring
Instrumentator().instrument(app).expose(app)

app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "MamaCare API running ✅", "version": "1.0.0"}

@app.get("/health")
def health_check(): 
    return {"status": "healthy"}