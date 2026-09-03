#!/usr/bin/env python3
"""
Kabadiwala Connect (ScrapSetu) — Gemini API Key & Model Availability Inspector
Tests an API key against the Google GenAI API and lists all models supported for multimodal generation.
"""

import sys
import os
import argparse
from dotenv import load_dotenv

# Load local environment
load_dotenv()

def inspect_models(api_key: str):
    print("=" * 70)
    print("  KABADIWALA CONNECT (SCRAPSETU) — GEMINI API KEY & MODEL AUDIT")
    print("=" * 70)
    print(f"[*] Testing API Key: {api_key[:6]}...{api_key[-4:] if len(api_key) > 10 else ''}")
    
    try:
        from google.genai import Client
    except ImportError:
        print("[!] Error: 'google-genai' package not found in current environment.")
        print("    Run with: ./venv/bin/python check_models.py")
        sys.exit(1)

    try:
        client = Client(api_key=api_key)
        print("[+] Connecting to Google GenAI service...")
        
        # Test basic connection and list models
        models = list(client.models.list())
        print(f"[+] Successfully authenticated! Found {len(models)} total models accessible.\n")

        gemini_models = []
        for m in models:
            name = getattr(m, "name", str(m))
            display_name = getattr(m, "display_name", "")
            methods = getattr(m, "supported_generation_methods", []) or []
            
            # Identify Gemini family models
            if "gemini" in name.lower():
                gemini_models.append({
                    "name": name,
                    "display_name": display_name,
                    "methods": methods,
                })

        print(f"{'MODEL NAME':<38} | {'DISPLAY NAME':<26}")
        print("-" * 70)
        for gm in gemini_models:
            print(f"{gm['name']:<38} | {gm['display_name']:<26}")
        print("-" * 70)

        # Recommendation based on availability
        model_names = [gm["name"] for gm in gemini_models]
        recommended = "gemini-2.5-flash"
        if "gemini-2.5-flash" in model_names or any("2.5-flash" in n for n in model_names):
            recommended = "gemini-2.5-flash"
        elif "gemini-2.0-flash" in model_names or any("2.0-flash" in n for n in model_names):
            recommended = "gemini-2.0-flash"
        elif "gemini-1.5-flash" in model_names or any("1.5-flash" in n for n in model_names):
            recommended = "gemini-1.5-flash"

        print(f"\n[★] Recommended model for ScrapSetu Multimodal Vision: '{recommended}'")

        # Smoke test generation
        print(f"\n[*] Running smoke test with '{recommended}'...")
        res = client.models.generate_content(
            model=recommended,
            contents="Confirm you are ready to classify e-waste scrap lots under Delhi pilot taxonomy in 1 short sentence.",
        )
        print(f"[✓] Live Response from {recommended}:")
        print(f"    \"{res.text.strip()}\"")
        print("\n[✓] API KEY IS 100% VALID AND OPERATIONAL FOR SCRAPSETU!")
        return True

    except Exception as e:
        print(f"\n[✗] API Key validation failed: {e}")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Check Gemini API Key and Models")
    parser.add_argument("--key", type=str, help="Gemini API Key to test (optional, defaults to .env GEMINI_API_KEY)")
    args = parser.parse_args()

    target_key = args.key or os.getenv("GEMINI_API_KEY")
    if not target_key or target_key.strip() in ("", "your-gemini-api-key-here"):
        print("[!] No Gemini API key provided.")
        print("    Either:")
        print("    1) Add GEMINI_API_KEY=AIzaSy... in main/api/.env")
        print("    2) Or pass it directly: ./venv/bin/python check_models.py --key AIzaSy...")
        sys.exit(1)

    inspect_models(target_key.strip())
