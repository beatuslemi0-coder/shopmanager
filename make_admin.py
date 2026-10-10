import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Pakua environment variables (ikiwa unatumia faili la .local.env au .env)
load_dotenv()

# Chukua DATABASE_URL kutoka kwenye environment variables au weka URL yako ya Render moja kwa moja hapa
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ Hitilafu: DATABASE_URL haijapatikana kwenye environment variables!")
    # Unaweza kuweka URL yako ya Render hapa moja kwa moja kwa kuondoa alama ya # chini:
    # DATABASE_URL = "postgresql://user:password@host/dbname"
else:
    # Tengeneza muunganiko wa database
    engine = create_engine(DATABASE_URL)

    target_email = "beatuslemi0@gmail.com"

    try:
        with engine.begin() as connection:
            # Badilisha role kuwa admin
            query = text("UPDATE users SET role = 'admin' WHERE email = :email")
            result = connection.execute(query, {"email": target_email})
            
            if result.rowcount > 0:
                print(f"✅ Mafanikio! Akaunti ya '{target_email}' imefanywa kuwa ADMIN.")
            else:
                print(f"⚠️ Hatukuta mtumiaji mwenye email '{target_email}' kwenye database.")
                
    except Exception as e:
        print(f"❌ Imeshindikana kuunganisha au kusasisha data: {e}")