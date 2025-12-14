from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Backend URLs
    backend_base_url: str = "https://api.inspectiq.app"
    
    @property
    def inspection_webhook_url(self) -> str:
        return f"{self.backend_base_url}/api/v1/webhooks/inspection-complete"
    
    @property
    def diagnosis_webhook_url(self) -> str:
        return f"{self.backend_base_url}/api/v1/webhooks/diagnosis-complete"
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4-vision-preview"
    
    # Database
    database_url: str = "postgresql://inspectiq:password@localhost:5432/inspectiq"
    
    # JWT Auth
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Storage
    upload_dir: str = "uploads"
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: set = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
    
    # AWS S3 (optional)
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_s3_bucket: str = ""
    aws_region: str = "us-east-1"
    use_s3: bool = False
    
    # Stripe (for payments)
    stripe_api_key: str = ""
    stripe_webhook_secret: str = ""
    
    # Email
    resend_api_key: str = ""
    email_domain: str = "inspectiq.app"  # Your domain for sending emails
    
    # App
    app_env: str = "development"
    log_level: str = "INFO"
    frontend_url: str = "http://localhost:3000"
    cors_origins: str = "http://localhost:3000"  # Comma-separated list of allowed origins
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields in .env


@lru_cache()
def get_settings() -> Settings:
    return Settings()
