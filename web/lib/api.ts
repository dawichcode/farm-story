import type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedApiResponse,
  Farmer,
  Farm,
  FarmInsight,
  ServiceRequest,
  AdminDashboardData,
  AdminFarmerDetail,
  PaginationMeta,
} from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'

// ---------------------------------------------------------------------------
// Internal fetch wrapper
// Throws an ApiError (with field-level errors attached) on non-2xx responses.
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number
  errors: Record<string, string[]>

  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...init,
  })

  const json = await res.json() as ApiResponse<T> | ApiErrorResponse

  if (!res.ok || !json.success) {
    const err = json as ApiErrorResponse
    throw new ApiError(
      err.message ?? 'An unexpected error occurred.',
      res.status,
      err.errors ?? {},
    )
  }

  return (json as ApiResponse<T>).data
}

async function apiFetchPaginated<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data: T[]; meta: PaginationMeta }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...init,
  })

  const json = await res.json() as PaginatedApiResponse<T> | ApiErrorResponse

  if (!res.ok || !json.success) {
    const err = json as ApiErrorResponse
    throw new ApiError(
      err.message ?? 'An unexpected error occurred.',
      res.status,
      err.errors ?? {},
    )
  }

  const paginated = json as PaginatedApiResponse<T>
  return { data: paginated.data, meta: paginated.meta }
}

// ---------------------------------------------------------------------------
// Farmers
// ---------------------------------------------------------------------------

export async function createFarmer(payload: {
  full_name: string
  mobile_number: string
  email?: string
  county: string
  preferred_language: string
}): Promise<Farmer> {
  return apiFetch<Farmer>('/farmers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getFarmers(cursor?: string): Promise<{ data: Farmer[]; meta: PaginationMeta }> {
  const params = cursor ? `?cursor=${cursor}` : ''
  return apiFetchPaginated<Farmer>(`/farmers${params}`)
}

export async function getFarmerById(farmerId: string): Promise<Farmer> {
  return apiFetch<Farmer>(`/farmers/${farmerId}`)
}

// ---------------------------------------------------------------------------
// Farms
// ---------------------------------------------------------------------------

export async function createFarm(payload: {
  farmer_id: number
  farm_name: string
  location: string
  latitude: number
  longitude: number
  size_acres: number
  primary_crop: string
  coffee_varieties?: string
  coffee_tree_count?: number
  estimated_annual_production?: number
  last_harvest_date?: string
  challenges: string[]
}): Promise<Farm> {
  return apiFetch<Farm>('/farms', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getFarmById(farmId: string | number): Promise<Farm> {
  return apiFetch<Farm>(`/farms/${farmId}`)
}

export async function getFarms(farmerId: number): Promise<{ data: Farm[]; meta: PaginationMeta }> {
  return apiFetchPaginated<Farm>(`/farms?farmer_id=${farmerId}`)
}

// ---------------------------------------------------------------------------
// Farm Intelligence
// ---------------------------------------------------------------------------

export async function getFarmInsight(farmId: string | number): Promise<FarmInsight> {
  return apiFetch<FarmInsight>(`/farms/${farmId}/insight`)
}

// ---------------------------------------------------------------------------
// Service Requests
// ---------------------------------------------------------------------------

export async function createServiceRequest(payload: {
  farmer_id: number
  farm_id: number
  type: string
  notes?: string
}): Promise<ServiceRequest> {
  return apiFetch<ServiceRequest>('/service-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getServiceRequests(params?: {
  farmer_id?: number
  cursor?: string
}): Promise<{ data: ServiceRequest[]; meta: PaginationMeta }> {
  const query = new URLSearchParams()
  if (params?.farmer_id) query.set('farmer_id', String(params.farmer_id))
  if (params?.cursor) query.set('cursor', params.cursor)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return apiFetchPaginated<ServiceRequest>(`/service-requests${qs}`)
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return apiFetch<AdminDashboardData>('/admin/dashboard')
}

export async function getAdminFarmers(params?: {
  search?: string
  cursor?: string
}): Promise<{ data: Farmer[]; meta: PaginationMeta }> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.cursor) query.set('cursor', params.cursor)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return apiFetchPaginated<Farmer>(`/admin/farmers${qs}`)
}

export async function getAdminFarmerDetail(farmerId: string): Promise<AdminFarmerDetail> {
  return apiFetch<AdminFarmerDetail>(`/admin/farmers/${farmerId}`)
}

export async function getAdminRequests(cursor?: string): Promise<{ data: ServiceRequest[]; meta: PaginationMeta }> {
  const params = cursor ? `?cursor=${cursor}` : ''
  return apiFetchPaginated<ServiceRequest>(`/admin/requests${params}`)
}
