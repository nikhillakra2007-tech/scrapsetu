// ==============================================================================
// Kabadiwala Connect / ScrapSetu — Database & Domain TypeScript Definitions
// Directly aligned with Supabase schema (01_extensions_and_enums to 09_seed_data)
// ==============================================================================

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
