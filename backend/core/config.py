from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://mamacare:mamacare123@localhost:5432/mamacare_db"
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    SECRET_KEY: str = "mamacare-secret-key-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"

settings = Settings()