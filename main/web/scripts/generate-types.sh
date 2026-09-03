#!/usr/bin/env bash

# ==============================================================================
# Kabadiwala Connect (ScrapSetu) — Supabase TypeScript Type Generator
# Reads credentials from main/web/.env.local or main/web/.env
# ==============================================================================

set -e

# Change to the web directory (parent directory of scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${WEB_DIR}"

echo "=================================================================="
echo "  SCRAPSETU — SUPABASE TYPESCRIPT TYPE GENERATOR"
echo "=================================================================="

# Check for environment file
ENV_FILE=""
if [ -f ".env.local" ]; then
  ENV_FILE=".env.local"
elif [ -f ".env" ]; then
  ENV_FILE=".env"
fi

if [ -n "${ENV_FILE}" ]; then
  echo "[+] Loading environment from ${ENV_FILE}..."
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

mkdir -p types
TARGET_FILE="types/database.ts"
TMP_FILE="types/database.ts.tmp"

# ------------------------------------------------------------------------------
# Method 1: Direct Supabase REST / OpenAPI generation (Fastest, No Docker needed)
# Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY over HTTPS
# ------------------------------------------------------------------------------
if [ -n "${NEXT_PUBLIC_SUPABASE_URL}" ] && [ -n "${SUPABASE_SERVICE_ROLE_KEY}" ] && [ "${SUPABASE_SERVICE_ROLE_KEY}" != "your-supabase-service-role-key-here" ]; then
  echo "[*] Connecting to Supabase Cloud API over secure HTTPS..."
  SCHEMA_URL="${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_SERVICE_ROLE_KEY}"
  
  if npx --yes openapi-typescript@5 "${SCHEMA_URL}" --output "${TMP_FILE}"; then
    if [ -s "${TMP_FILE}" ]; then
      mv "${TMP_FILE}" "${TARGET_FILE}"
      echo "[✓] SUCCESS: Generated ${TARGET_FILE} directly from live Supabase!"
      echo "[✓] All tables, columns, relations, and custom enums are fully typed."
      exit 0
    fi
  fi
  rm -f "${TMP_FILE}"
  echo "[!] HTTPS OpenAPI generation failed, falling back to CLI..."
fi

# ------------------------------------------------------------------------------
# Method 2: Supabase Access Token + Project ID (No Docker needed)
# ------------------------------------------------------------------------------
PROJ_ID="${SUPABASE_PROJECT_ID}"
if [ -z "${PROJ_ID}" ] && [ -n "${NEXT_PUBLIC_SUPABASE_URL}" ]; then
  PROJ_ID=$(echo "${NEXT_PUBLIC_SUPABASE_URL}" | sed -E 's|https?://([^.]+)\.supabase\.co.*|\1|')
fi

if [ -n "${SUPABASE_ACCESS_TOKEN}" ] && [ -n "${PROJ_ID}" ]; then
  echo "[*] Generating types via Supabase Management API (Project ID: ${PROJ_ID})..."
  if npx --yes supabase gen types typescript --project-id "${PROJ_ID}" --schema public > "${TMP_FILE}"; then
    if [ -s "${TMP_FILE}" ]; then
      mv "${TMP_FILE}" "${TARGET_FILE}"
      echo "[✓] SUCCESS: Generated ${TARGET_FILE} using Supabase project ID!"
      exit 0
    fi
  fi
  rm -f "${TMP_FILE}"
fi

# ------------------------------------------------------------------------------
# Method 3: Direct Postgres Connection / Pooler URL (Requires Docker for pg-meta)
# ------------------------------------------------------------------------------
TARGET_DB_URL="${DATABASE_URL:-${SUPABASE_DB_URL}}"

if [ -z "${TARGET_DB_URL}" ] && [ -n "${SUPABASE_DB_PASSWORD}" ] && [ -n "${PROJ_ID}" ]; then
  # URL-encode password to handle special chars like @ and !
  ENCODED_PW=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "${SUPABASE_DB_PASSWORD}")
  # Use IPv4 pooler URL
  TARGET_DB_URL="postgresql://postgres.${PROJ_ID}:${ENCODED_PW}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
fi

if [ -n "${TARGET_DB_URL}" ]; then
  SAFE_URL=$(echo "${TARGET_DB_URL}" | sed -E 's|(:[^@/]+)@|:****@|')
  echo "[*] Connecting via DB URL: ${SAFE_URL}"

  if npx --yes supabase gen types typescript --db-url "${TARGET_DB_URL}" --schema public > "${TMP_FILE}"; then
    if [ -s "${TMP_FILE}" ]; then
      mv "${TMP_FILE}" "${TARGET_FILE}"
      echo "[✓] SUCCESS: Updated ${TARGET_FILE} via DB URL!"
      exit 0
    fi
  fi
  rm -f "${TMP_FILE}"
fi

echo ""
echo "[✗] Could not generate types. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in main/web/.env.local"
exit 1
