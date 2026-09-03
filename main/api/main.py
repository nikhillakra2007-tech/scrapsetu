import os
import base64
import logging
from typing import Optional, Literal
from fastapi import FastAPI, Request, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from taxonomy_data import MATERIAL_TAXONOMY
from gemini_service import (
    classify_ewaste_image,
    simulate_ewaste_inspection,
    LotClassificationResponse,
    get_gemini_client,
)

load_dotenv()

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper())
logger = logging.getLogger("scrapsetu.api")

app = FastAPI(
    title="Kabadiwala Connect (ScrapSetu) — AI Bot & Webhook Backend",
    description="""
### SIH 2026 Problem Statement ID 26229
**Automated Multimodal E-Waste Classification & Informal Collector Formalization API**

This service provides:
* **Gemini 2.5 Flash Multimodal Vision Pipeline**: Inspects e-waste scrap photos, classifies into the closed 11-category Delhi pilot taxonomy, assesses condition, detects hazardous materials (lithium swelling, leaded CRT glass, mercury), and grounds fair pricing.
* **Multipart Image Upload & Base64 Endpoints**: Ready for direct Swagger UI testing and mobile/web app integration.
* **E-Waste Taxonomy & Benchmark Rates**: Standardized rates and hazard guidance across Delhi industrial clusters (Okhla, Mandoli, Patparganj).
* **Telephony & Chatbot Webhooks**: Integrations for WhatsApp Cloud API and Exotel IVR for low-literacy voice callers.
    """,
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup for Next.js web application
cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,https://scrapsetu.vercel.app").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassifyLotRequest(BaseModel):
    image_base64: str = Field(
        ...,
        description="Base64-encoded image string (raw base64 or prefixed with data:image/jpeg;base64,...)"
    )
    mime_type: Optional[str] = Field(default="image/jpeg", description="MIME type of the uploaded image")
    weight_kg: Optional[float] = Field(default=None, ge=0.0, description="Collector-reported physical weight in kg")
    ward_name: Optional[str] = Field(default="Okhla Phase 1", description="Delhi pilot cluster name")


@app.get("/", tags=["System"])
def root():
    api_key_configured = bool(get_gemini_client())
    return {
        "service": "ScrapSetu AI & Telephony Bot API",
        "status": "online",
        "version": "1.1.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "gemini_api_key_configured": api_key_configured,
        "active_mode": "live_gemini" if api_key_configured else "simulator_fallback (Add GEMINI_API_KEY in .env for live AI)",
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc",
    }


@app.get("/health", tags=["System"])
def healthcheck():
    return {
        "status": "healthy",
        "service": "scrapsetu-bot-api",
        "gemini_ready": bool(get_gemini_client()),
    }


@app.get("/api/taxonomy", tags=["Taxonomy & Pricing"])
def get_taxonomy():
    """
    Returns the official 11-parent e-waste category taxonomy with sub-categories,
    benchmark price ranges (INR/kg), hazard indicators, and DPCC safety instructions.
    """
    return {
        "pilot_region": "National Capital Territory of Delhi",
        "categories_count": len(MATERIAL_TAXONOMY),
        "taxonomy": MATERIAL_TAXONOMY,
    }


@app.post(
    "/api/classify-lot",
    response_model=LotClassificationResponse,
    tags=["Vision AI Pipeline"],
    summary="Classify scrap lot from Base64 Image payload",
)
def classify_scrap_lot_base64(payload: ClassifyLotRequest):
    """
    Receives base64-encoded scrap photograph and returns structured e-waste classification
    using Gemini 2.5 Flash (or simulator fallback if API key is not yet configured).
    """
    raw_b64 = payload.image_base64
    # Strip data URI prefix if present
    if "," in raw_b64:
        header, raw_b64 = raw_b64.split(",", 1)
        if "image/png" in header:
            payload.mime_type = "image/png"
        elif "image/webp" in header:
            payload.mime_type = "image/webp"

    try:
        image_bytes = base64.b64decode(raw_b64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {str(e)}")

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Image data cannot be empty.")

    result = classify_ewaste_image(
        image_bytes=image_bytes,
        mime_type=payload.mime_type or "image/jpeg",
        weight_kg=payload.weight_kg,
        ward_name=payload.ward_name,
    )
    return result


@app.post(
    "/api/classify-image-upload",
    response_model=LotClassificationResponse,
    tags=["Vision AI Pipeline"],
    summary="Classify scrap lot via Multipart File Upload (Interactive Swagger UI)",
)
async def classify_scrap_lot_upload(
    file: UploadFile = File(..., description="E-waste photograph to inspect (JPEG, PNG, WEBP)"),
    weight_kg: Optional[float] = Form(None, description="Collector-reported physical weight in kg"),
    ward_name: Optional[str] = Form("Okhla Phase 1", description="Delhi pilot ward/cluster"),
):
    """
    Direct file upload endpoint for testing via Swagger UI file-picker or form submission.
    Executes Gemini multimodal vision analysis on the uploaded file.
    """
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    mime_type = file.content_type or "image/jpeg"
    result = classify_ewaste_image(
        image_bytes=content,
        mime_type=mime_type,
        weight_kg=weight_kg,
        ward_name=ward_name,
    )
    return result


@app.post(
    "/api/test-sample",
    response_model=LotClassificationResponse,
    tags=["Vision AI Pipeline"],
    summary="1-Click Swagger Test using predefined Delhi pilot e-waste samples",
)
def test_sample_lot(
    sample_type: Literal["motherboard", "battery", "cables"] = Query(
        "motherboard",
        description="Pick an e-waste test sample: 'motherboard', 'battery', or 'cables'"
    ),
    weight_kg: float = Query(12.5, description="Test physical weight in kg"),
    ward_name: str = Query("Okhla Phase 1", description="Delhi cluster"),
):
    """
    Convenient 1-click test endpoint for Swagger UI demonstrations.
    Does not require uploading a file.
    """
    fake_bytes = b"SAMPLE_PAYLOAD_" + sample_type.encode()
    return simulate_ewaste_inspection(
        image_bytes=fake_bytes,
        weight_kg=weight_kg,
        ward_name=ward_name,
        sample_hint=sample_type,
    )


# ==============================================================================
# Telephony & Webhook Endpoints
# ==============================================================================

@app.get("/webhook/whatsapp", tags=["Telephony & Chatbots"])
def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
):
    """
    Verifies Meta WhatsApp Cloud API webhook callback subscription.
    """
    verify_token = os.getenv("WHATSAPP_VERIFY_TOKEN", "scrapsetu_verify_token")
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge) if hub_challenge and hub_challenge.isdigit() else hub_challenge
    raise HTTPException(status_code=403, detail="Verification token mismatch")


@app.post("/webhook/whatsapp", tags=["Telephony & Chatbots"])
async def handle_whatsapp_message(request: Request):
    """
    Receives incoming WhatsApp messages from informal collectors.
    """
    data = await request.json()
    logger.info(f"Incoming WhatsApp webhook payload: {data}")
    return {"status": "received", "data": data}


@app.post("/webhook/exotel", tags=["Telephony & Chatbots"])
async def handle_exotel_ivr(request: Request):
    """
    Inbound IVR hook from Exotel virtual number for voice-first collectors.
    """
    return {
        "status": "call_connected",
        "action": "stream_audio_to_sarvam",
        "message": "Welcome to ScrapSetu Voice Portal. Bolo scrap ka details."
    }
