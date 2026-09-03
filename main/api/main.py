import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kabadiwala Connect (ScrapSetu) — AI Bot & Webhook Backend",
    description="Python service running on Render handling Gemini Multimodal Vision, Sarvam STT/TTS, Exotel IVR, and WhatsApp webhooks.",
    version="1.0.0",
)

# CORS setup for Next.js web application
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "ScrapSetu AI & Telephony Bot API",
        "status": "online",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "features": ["gemini_multimodal_vision", "sarvam_speech", "exotel_ivr", "whatsapp_webhook"],
    }

@app.get("/health")
def healthcheck():
    return {"status": "healthy"}

@app.post("/api/classify-lot")
async def classify_scrap_lot(request: Request):
    """
    Receives an image (URL or base64) and uses Gemini Vision to classify parent_code,
    sub_code, condition, hazard flags, and confidence.
    """
    return {
        "status": "endpoint_ready",
        "message": "Send scrap photo payload to classify via Gemini multimodal pipeline."
    }

@app.get("/webhook/whatsapp")
def verify_whatsapp_webhook(hub_mode: str = None, hub_challenge: str = None, hub_verify_token: str = None):
    verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "scrapsetu_verify_token")
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Verification token mismatch")

@app.post("/webhook/whatsapp")
async def handle_whatsapp_message(request: Request):
    data = await request.json()
    return {"status": "received", "data": data}

@app.post("/webhook/exotel")
async def handle_exotel_ivr(request: Request):
    return {"status": "call_connected", "action": "stream_audio_to_sarvam"}
