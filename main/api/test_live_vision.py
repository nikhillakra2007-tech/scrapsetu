#!/usr/bin/env python3
"""
Test script to send a synthesized electronic circuit board image to the live Gemini 2.5 Flash pipeline.
"""
import io
import base64
from PIL import Image, ImageDraw
import httpx

def create_mock_circuit_board_image() -> bytes:
    # 300x300 green PCB image with IC chips, traces, and solder pads
    img = Image.new("RGB", (300, 300), color=(14, 82, 36))
    draw = ImageDraw.Draw(img)

    # Traces
    for y in range(40, 260, 20):
        draw.line([(20, y), (280, y), (260, y + 10)], fill=(184, 134, 11), width=2)
    
    # Microchip / CPU
    draw.rectangle([(90, 90), (210, 210)], fill=(20, 20, 20), outline=(200, 200, 200), width=2)
    draw.text((105, 140), "INTEL CORE\ni7-4770K", fill=(220, 220, 220))
    
    # Capacitors / Solder points
    for x in range(30, 80, 15):
        draw.ellipse([(x, 30), (x + 10, 40)], fill=(192, 192, 192))
        draw.ellipse([(x, 240), (x + 10, 250)], fill=(192, 192, 192))
        
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()

def run_test():
    print("[*] Generating scrap circuit board image...")
    img_bytes = create_mock_circuit_board_image()
    b64_str = base64.b64encode(img_bytes).decode("utf-8")

    print("[*] Sending request to local API (http://127.0.0.1:8000/api/classify-lot)...")
    payload = {
        "image_base64": b64_str,
        "mime_type": "image/jpeg",
        "weight_kg": 14.5,
        "ward_name": "Okhla Industrial Area Phase 1"
    }

    with httpx.Client(timeout=30.0) as client:
        res = client.post("http://127.0.0.1:8000/api/classify-lot", json=payload)
        print(f"[+] Status: {res.status_code}")
        data = res.json()
        print("\n" + "=" * 60)
        print("  LIVE GEMINI 2.5 FLASH MULTIMODAL INFERENCE RESULT")
        print("=" * 60)
        for k, v in data.items():
            print(f"{k:<25}: {v}")
        print("=" * 60)

if __name__ == "__main__":
    run_test()
