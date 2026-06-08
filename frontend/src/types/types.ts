/**
 * Type definitions for gulfvista.properties frontend
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export type UserRole = 'buyer' | 'seller' | 'agent_pending' | 'agent_admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_agent_verified: boolean;
  company_name?: string;
  company_logo_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ============================================================================
// Property Types
// ============================================================================

export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'land' | 'commercial' | 'office';

export interface Property {
  id: number;
  title: string;
  description: string;
  property_type: PropertyType;
  price: number;
  currency: string;
  address: string;
  city: string;
  emirate: string;
  country: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  year_built?: number;
  furnishing?: string;
  images: string[];
  video_url?: string;
  floor_plans: string[];
  developer_name?: string;
  project_name?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  is_featured: boolean;
  views_count: number;
  owner_id?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyListResponse {
  items: Property[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PropertyFilters {
  skip?: number;
  limit?: number;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  city?: string;
  bedrooms?: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface CheckoutSessionResponse {
  session_id: string;
  client_secret?: string;
  url?: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  stripe_session_id: string;
  amount_cents: number;
  currency: string;
  transaction_type: string;
  status: PaymentStatus;
  created_at: string;
  completed_at?: string;
}

// ============================================================================
// Lead Types
// ============================================================================

export interface Lead {
  id: number;
  agent_id: number;
  property_id: number;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface PropertyCreateRequest {
  title: string;
  description: string;
  property_type: PropertyType;
  price: number;
  address: string;
  city: string;
  emirate: string;
  country?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  year_built?: number;
  furnishing?: string;
  images?: string[];
  video_url?: string;
  floor_plans?: string[];
  developer_name?: string;
  project_name?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  is_active?: boolean;
  is_featured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
}

export interface CreateCheckoutSessionRequest {
  success_url: string;
  cancel_url: string;
}

export interface LeadCreateRequest {
  property_id: number;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_phone: string;
  message?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiErrorResponse {
  detail: string;
  status_code: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiErrorResponse;
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page: number;
  page_size: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  filters: PropertyFilters;
  isLoading: boolean;
  error: string | null;
  total: number;
}

export interface AgentDashboardStats {
  total_listings: number;
  active_listings: number;
  total_leads: number;
  new_leads: number;
  conversion_rate: number;
  views_this_month: number;
}
