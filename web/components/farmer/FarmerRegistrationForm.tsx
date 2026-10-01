'use client'

import { useState } from 'react'
import { createFarmer, ApiError } from '@/lib/api'
import { useFarmerStore } from '@/store/useFarmerStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import Select from '@/components/ui/Select'
import FarmerIdCard from '@/components/farmer/FarmerIdCard'
import { CheckCircle } from 'lucide-react'

const LANGUAGES = ['English', 'Swahili', 'Kikuyu', 'Luo', 'Kamba', 'Other']

const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]

interface FormData {
  full_name: string
  mobile_number: string
  email: string
  county: string
  preferred_language: string
}

interface FieldErrors {
  full_name?: string
  mobile_number?: string
  email?: string
  county?: string
  preferred_language?: string
}

interface Props {
  onSuccess?: (farmerId: string) => void
}

export default function FarmerRegistrationForm({ onSuccess }: Props) {
  const setFarmer = useFarmerStore((s) => s.setFarmer)

  const [form, setForm] = useState<FormData>({
    full_name: '',
    mobile_number: '',
    email: '',
    county: '',
    preferred_language: '',
  })

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)

  // Confirmed farmer data shown on the success screen
  const [confirmed, setConfirmed] = useState<{
    farmerId: string
    farmerName: string
    farmerDbId: number
    county: string
  } | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear the field error as the user types
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    setFieldErrors({})
    setLoading(true)

    try {
      const farmer = await createFarmer({
        full_name:          form.full_name.trim(),
        mobile_number:      form.mobile_number.trim(),
        email:              form.email.trim() || undefined,
        county:             form.county,
        preferred_language: form.preferred_language,
      })

      setFarmer(farmer.id, farmer.farmer_id, farmer.full_name)

      setConfirmed({
        farmerId:    farmer.farmer_id,
        farmerName:  farmer.full_name,
        farmerDbId:  farmer.id,
        county:      farmer.county,
      })
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.errors).length > 0) {
          // Map API field errors to individual fields
          const mapped: FieldErrors = {}
          for (const [key, msgs] of Object.entries(err.errors)) {
            mapped[key as keyof FieldErrors] = msgs[0]
          }
          setFieldErrors(mapped)
        } else {
          setGlobalError(err.message)
        }
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Compute form completion progress (required fields only)
  const REQUIRED_FIELDS: (keyof FormData)[] = ['full_name', 'mobile_number', 'county', 'preferred_language']
  const filled = REQUIRED_FIELDS.filter((f) => form[f].trim().length > 0).length
  const progress = Math.round((filled / REQUIRED_FIELDS.length) * 100)

  // ---- Confirmation screen ----
  if (confirmed) {
    return (
      <div className="motion-safe:animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-agric-green flex-shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-display text-xl font-semibold text-black">Registration successful</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your unique Farmer ID has been generated.</p>
          </div>
        </div>

        <FarmerIdCard
          farmerId={confirmed.farmerId}
          farmerName={confirmed.farmerName}
          county={confirmed.county}
        />

        <Button
          className="w-full"
          size="lg"
          onClick={() => onSuccess?.(String(confirmed.farmerDbId))}
        >
          Continue to Farm Registration
        </Button>
      </div>
    )
  }

  // ---- Registration form ----
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 motion-safe:animate-fade-in">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-gray-400 font-medium">Farmer details</p>
          <p className="text-xs text-gray-400">{filled} / {REQUIRED_FIELDS.length} required fields</p>
        </div>
        <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-agric-green rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Form completion"
          />
        </div>
      </div>
      {globalError && (
        <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
          {globalError}
        </div>
      )}

      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="full_name" required>Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          value={form.full_name}
          onChange={handleChange}
          error={fieldErrors.full_name}
          placeholder="Jane Wanjiku"
        />
        {fieldErrors.full_name && (
          <p className="text-xs text-crimson" role="alert">{fieldErrors.full_name}</p>
        )}
      </div>

      {/* Mobile number */}
      <div className="space-y-1.5">
        <Label htmlFor="mobile_number" required>Mobile number</Label>
        <Input
          id="mobile_number"
          name="mobile_number"
          type="tel"
          autoComplete="tel"
          value={form.mobile_number}
          onChange={handleChange}
          error={fieldErrors.mobile_number}
          placeholder="+254 700 000 000"
        />
        {fieldErrors.mobile_number && (
          <p className="text-xs text-crimson" role="alert">{fieldErrors.mobile_number}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email <span className="text-gray-400 font-normal">(optional)</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder="jane@example.com"
        />
        {fieldErrors.email && (
          <p className="text-xs text-crimson" role="alert">{fieldErrors.email}</p>
        )}
      </div>

      {/* County */}
      <div className="space-y-1.5">
        <Label htmlFor="county" required>County</Label>
        <Select
          id="county"
          name="county"
          value={form.county}
          onChange={handleChange}
          error={fieldErrors.county}
        >
          <option value="">Select county</option>
          {COUNTIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        {fieldErrors.county && (
          <p className="text-xs text-crimson" role="alert">{fieldErrors.county}</p>
        )}
      </div>

      {/* Preferred language */}
      <div className="space-y-1.5">
        <Label htmlFor="preferred_language" required>Preferred language</Label>
        <Select
          id="preferred_language"
          name="preferred_language"
          value={form.preferred_language}
          onChange={handleChange}
          error={fieldErrors.preferred_language}
        >
          <option value="">Select language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </Select>
        {fieldErrors.preferred_language && (
          <p className="text-xs text-crimson" role="alert">{fieldErrors.preferred_language}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        Register
      </Button>
    </form>
  )
}
