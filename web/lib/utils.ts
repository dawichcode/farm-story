// ---------------------------------------------------------------------------
// Pure utility functions. No side effects, no imports from other app modules.
// ---------------------------------------------------------------------------

/**
 * Format a decimal acres value for display.
 * e.g. "2.50 acres"
 */
export function formatAcres(value: string | number): string {
  return `${Number(value).toFixed(2)} acres`
}

/**
 * Format a kg production value for display.
 * e.g. "1,800 kg"
 */
export function formatKg(value: string | number | null | undefined): string {
  if (value == null) return 'Unknown'
  return `${Number(value).toLocaleString()} kg`
}

/**
 * Calculate production per tree and return a formatted string.
 * e.g. "1.64 kg/tree"
 */
export function productionPerTree(
  annualProduction: string | number | null | undefined,
  treeCount: number | null | undefined,
): string {
  if (!annualProduction || !treeCount || treeCount === 0) return 'N/A'
  const result = Number(annualProduction) / treeCount
  return `${result.toFixed(2)} kg/tree`
}

/**
 * Format a date string into a readable format.
 * Returns the raw value if it is "Unknown" or unparseable.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value || value === 'Unknown') return 'Unknown'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Format GPS coordinate for display.
 */
export function formatCoordinate(value: string | number): string {
  return Number(value).toFixed(6)
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a challenge key to a human-readable label.
 */
export function challengeLabel(key: string): string {
  const map: Record<string, string> = {
    low_yield:          'Low yield',
    pests_disease:      'Pests / disease',
    soil_quality:       'Soil quality',
    water_availability: 'Water availability',
    access_to_buyers:   'Access to buyers',
    access_to_finance:  'Access to finance',
    input_costs:        'Input costs',
  }
  return map[key] ?? key
}

/**
 * Convert a service request type key to a display label.
 */
export function serviceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    agronomist_visit:         'Agronomist Visit',
    soil_test:                'Soil Test',
    biochar_assessment:       'Biochar Assessment',
    coffee_quality_assessment:'Coffee Quality Assessment',
    buyer_offtake_support:    'Buyer / Offtake Support',
  }
  return map[type] ?? type
}

/**
 * Map a recommendation category to the most relevant service type key.
 * Used by TakeActionPanel to pre-highlight recommended services.
 */
export function recommendationToServiceType(category: string): string | null {
  const map: Record<string, string> = {
    'LOW YIELD':       'agronomist_visit',
    'SOIL':            'soil_test',
    'SOIL QUALITY':    'soil_test',
    'PESTS / DISEASE': 'agronomist_visit',
    'MARKET ACCESS':   'buyer_offtake_support',
    'COFFEE QUALITY':  'coffee_quality_assessment',
  }
  return map[category.toUpperCase()] ?? null
}

/**
 * Derive a relative "time ago" label from a Date.
 * e.g. "just now", "2 min ago", "1 hr ago"
 */
export function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000)
  if (secs < 10)  return 'just now'
  if (secs < 60)  return `${secs}s ago`
  const mins = Math.floor(secs / 60)
  if (mins < 60)  return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs} hr ago`
}
