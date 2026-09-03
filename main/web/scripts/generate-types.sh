#!/usr/bin/env bash

# ==============================================================================
# Kabadiwala Connect (ScrapSetu) — Supabase TypeScript Type Generator
# Directly updates main/web/types/database.ts holding the live Supabase context
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

append_domain_helpers() {
  cat << 'EOF' >> "${TMP_FILE}"

// ==============================================================================
// Kabadiwala Connect / ScrapSetu — Application Domain Models & Aliases
// Re-exported and linked directly to the generated Supabase schema above
// ==============================================================================

export type DatabaseDefinitions = definitions;
export type UserRow = definitions["users"];
export type CollectorRow = definitions["collectors"];
export type RecyclerRow = definitions["recyclers"];
export type LotRow = definitions["lots"];
export type LotMatchRow = definitions["lot_matches"];
export type TransactionRow = definitions["transactions"];
export type HandoverRecordRow = definitions["handover_records"];
export type MaterialCategoryRow = definitions["material_categories"];
export type DelhiWardRow = definitions["delhi_wards"];
export type CustomerPickupRow = definitions["customer_pickup_requests"];
export type SafetyContentRow = definitions["safety_content"];

export type UserRole = 'collector' | 'recycler' | 'admin';
export type CollectorType = 'individual' | 'collection_point';
export type LotCondition = 'working' | 'damaged' | 'scrap' | 'burnt_unsafe';
export type LotStatus =
  | 'draft'
  | 'submitted'
  | 'matched'
  | 'quoted'
  | 'accepted'
  | 'handed_over'
  | 'confirmed'
  | 'paid'
  | 'disputed'
  | 'cancelled';

export type TransactionStatus =
  | 'pending'
  | 'quoted'
  | 'accepted'
  | 'handed_over'
  | 'confirmed'
  | 'paid'
  | 'disputed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid';
export type PaymentMode = 'cash' | 'upi';
export type AuthorizationStatus = 'verified' | 'pending_verification' | 'expired' | 'suspended';
export type SourceChannel = 'app' | 'voice' | 'admin';
export type PickupRequestStatus = 'pending' | 'assigned' | 'scheduled' | 'collected' | 'cancelled';

export interface DelhiWard {
  id: string;
  ward_name: string;
  zone_name: string;
  geometry?: any;
}

export interface MaterialCategory {
  parent_code: string;
  parent_name: string;
  sub_code: string;
  sub_name: string;
  is_hazardous: boolean;
  epr_schedule1_hint?: string | null;
}

export interface Recycler {
  id: string;
  business_name: string;
  facility_location: { lat: number; lng: number };
  registration_number: string;
  registration_authority: string;
  authorization_status: AuthorizationStatus;
  pickup_available: boolean;
  avg_rating: number;
}

export interface RecyclerRateCard {
  id: string;
  recycler_id: string;
  parent_code: string;
  sub_code: string;
  rate_per_kg: number;
  effective_date: string;
}

export interface Lot {
  id: string;
  collector_id: string;
  collector_name?: string;
  parent_code: string;
  sub_code: string;
  condition: LotCondition;
  weight_kg: number;
  hazard_flags: string[];
  ai_suggested_rate_per_kg: number;
  ai_confidence: number;
  estimated_value: number;
  quoted_price?: number | null;
  final_price?: number | null;
  location?: { lat: number; lng: number };
  ward_name?: string;
  status: LotStatus;
  primary_image_path?: string;
  client_created_at: string;
}

export interface LotMatch {
  id: string;
  lot_id: string;
  recycler_id: string;
  score: number;
  rank: number;
  status: 'offered' | 'expired' | 'accepted' | 'declined';
  offered_at: string;
  lot?: Lot;
}

export interface Transaction {
  id: string;
  lot_id: string;
  recycler_id: string;
  quoted_price: number;
  final_price?: number;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  transaction_status: TransactionStatus;
  created_at: string;
  completed_at?: string | null;
}

export interface HandoverRecord {
  id: string;
  transaction_id: string;
  lot_id: string;
  weight_at_handover: number;
  unique_reference_code: string;
  handover_timestamp: string;
  confirmation_method: 'app_tap' | 'otp' | 'qr_scan';
  status: string;
}

export interface CustomerPickupRequest {
  id: string;
  customer_phone: string;
  pickup_address: string;
  ward_id?: string;
  material_description: string;
  parent_code?: string;
  sub_code?: string;
  approx_weight_kg?: number;
  photo_url?: string;
  preferred_date: string;
  preferred_time_window?: string;
  is_bulk: boolean;
  status: PickupRequestStatus;
  assigned_collector_name?: string;
  created_at: string;
}

export interface PriceBoardItem {
  parent_code: string;
  parent_name: string;
  sub_code: string;
  sub_name: string;
  is_hazardous: boolean;
  avg_price_per_kg: number;
  min_price_per_kg: number;
  max_price_per_kg: number;
  data_points_count: number;
  trend_percentage?: number;
  latest_price_date: string;
}

export interface SafetyItem {
  id: string;
  parent_code: string;
  language: string;
  media_type: string;
  title: string;
  description: string;
}
EOF
}

# ------------------------------------------------------------------------------
# Method 1: Direct Supabase REST / OpenAPI generation (Fastest, No Docker needed)
# Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY over HTTPS
# ------------------------------------------------------------------------------
if [ -n "${NEXT_PUBLIC_SUPABASE_URL}" ] && [ -n "${SUPABASE_SERVICE_ROLE_KEY}" ] && [ "${SUPABASE_SERVICE_ROLE_KEY}" != "your-supabase-service-role-key-here" ]; then
  echo "[*] Connecting to Supabase Cloud API over secure HTTPS..."
  SCHEMA_URL="${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_SERVICE_ROLE_KEY}"
  
  if npx --yes openapi-typescript@5 "${SCHEMA_URL}" --output "${TMP_FILE}"; then
    if [ -s "${TMP_FILE}" ]; then
      append_domain_helpers
      mv "${TMP_FILE}" "${TARGET_FILE}"
      rm -f "types/supabase.ts"
      echo "[✓] SUCCESS: Generated ${TARGET_FILE} directly from live Supabase!"
      echo "[✓] All tables, columns, relations, and custom enums are fully typed."
      exit 0
    fi
  fi
  rm -f "${TMP_FILE}"
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
      append_domain_helpers
      mv "${TMP_FILE}" "${TARGET_FILE}"
      rm -f "types/supabase.ts"
      echo "[✓] SUCCESS: Generated ${TARGET_FILE} using Supabase project ID!"
      exit 0
    fi
  fi
  rm -f "${TMP_FILE}"
fi

echo ""
echo "[✗] Could not generate types. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in main/web/.env.local"
exit 1
