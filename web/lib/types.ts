// ---------------------------------------------------------------------------
// Shared TypeScript interfaces for Farm Story API shapes.
// All interfaces mirror the API envelope's `data` field.
// ---------------------------------------------------------------------------

export interface Farmer {
  id: number
  farmer_id: string
  full_name: string
  mobile_number: string
  email: string | null
  county: string
  preferred_language: string
  created_at: string
  updated_at: string
}

export interface Farm {
  id: number
  farmer_id: number
  farm_name: string
  location: string
  latitude: string
  longitude: string
  size_acres: string
  primary_crop: string
  coffee_varieties: string | null
  coffee_tree_count: number | null
  estimated_annual_production: string | null
  last_harvest_date: string | null
  challenges: string[]
  created_at: string
  updated_at: string
}

export interface Recommendation {
  category: string
  text: string
}

export interface FarmInsight {
  id: number
  farm_id: number
  score: number
  summary: string
  recommendations: Recommendation[]
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  id: number
  reference: string
  farmer_id: number
  farm_id: number
  type: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Admin shapes
// ---------------------------------------------------------------------------

export interface CountyCount {
  county: string
  total: number
}

export interface AdminDashboardData {
  farmers_count: number
  acres_total: number
  production_total: number
  requests_count: number
  farmers_by_county: CountyCount[]
}

// Admin farmer detail: farmer with farms nested, each farm has insight + requests
export type FarmWithDetail = Farm & {
  farm_insight:     FarmInsight | null
  service_requests: ServiceRequest[]
}

export type AdminFarmerDetail = Farmer & {
  farms: FarmWithDetail[]
}

// ---------------------------------------------------------------------------
// API envelope meta for paginated responses
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  next_cursor: string | null
  prev_cursor: string | null
  per_page: number
  has_more: boolean
}

// ---------------------------------------------------------------------------
// API envelope wrappers (used internally by lib/api.ts)
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

export interface ApiErrorResponse {
  success: false
  data: null
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  meta: PaginationMeta
  message: string | null
}
