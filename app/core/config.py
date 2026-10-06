from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    # Settings zote zinasomwa kutoka .env
    DATABASE_URL:str
    SECRET_KEY:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int=60
    CORS_ORIGINS:str="http://localhost:5500,http://127.0.0.1:5500"
    model_config=SettingsConfigDict(env_file=".env",extra="ignore")
    @property
    def cors_list(self): return [x.strip() for x in self.CORS_ORIGINS.split(",") if x.strip()]
settings=Settings()
