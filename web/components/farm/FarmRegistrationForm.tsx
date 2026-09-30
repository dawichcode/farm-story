'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { createFarm, ApiError } from '@/lib/api'
import { useFarmFormStore } from '@/store/useFarmFormStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

// Leaflet must only run in the browser
const FarmLocationPicker = dynamic(
  () => import('@/components/map/FarmLocationPicker'),
  { ssr: false, loading: () => <div className="h-[300px] rounded-xl bg-gray-100 flex items-center justify-center"><Spinner /></div> },
)

const CROPS = ['Coffee', 'Tea', 'Maize', 'Beans', 'Avocado', 'Banana', 'Other']

const CHALLENGE_OPTIONS: { key: string; label: string }[] = [
  { key: 'low_yield',          label: 'Low yield' },
  { key: 'pests_disease',      label: 'Pests / disease' },
  { key: 'soil_quality',       label: 'Soil quality' },
  { key: 'water_availability', label: 'Water availability' },
  { key: 'access_to_buyers',   label: 'Access to buyers' },
  { key: 'access_to_finance',  label: 'Access to finance' },
  { key: 'input_costs',        label: 'Input costs' },
]

const TOTAL_STEPS = 4

interface Props {
  farmerDbId: number
  onSuccess: (farmId: number) => void
}

// Per-step field error maps
interface Step1Errors { farm_name?: string; location?: string; size_acres?: string; primary_crop?: string }
interface Step2Errors { coffee_varieties?: string; coffee_tree_count?: string; estimated_annual_production?: string }
interface Step4Errors { latitude?: string; longitude?: string }

export default function FarmRegistrationForm({ farmerDbId, onSuccess }: Props) {
  const store = useFarmFormStore()

  const [step, setStep] = useState(store.step)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animKey, setAnimKey] = useState(0)

  const [s1errors, setS1Errors] = useState<Step1Errors>({})
  const [s2errors, setS2Errors] = useState<Step2Errors>({})
  const [s4errors, setS4Errors] = useState<Step4Errors>({})
  const [globalError, setGlobalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isCoffee = store.farmInfo.primary_crop.toLowerCase() === 'coffee'
  const effectiveTotalSteps = isCoffee ? 4 : 3

  function goTo(next: number, dir: 'forward' | 'back') {
    setDirection(dir)
    setAnimKey((k) => k + 1)
    setStep(next)
    store.setStep(next)
  }

  function advance() { goTo(step + 1, 'forward') }
  function retreat() { goTo(step - 1, 'back') }

  // ---- Step 1 validation ----
  function validateStep1(): boolean {
    const errs: Step1Errors = {}
    if (!store.farmInfo.farm_name.trim())  errs.farm_name   = 'Farm name is required.'
    if (!store.farmInfo.location.trim())   errs.location    = 'Location is required.'
    if (!store.farmInfo.size_acres.trim()) errs.size_acres  = 'Farm size is required.'
    else if (isNaN(Number(store.farmInfo.size_acres)) || Number(store.farmInfo.size_acres) <= 0)
      errs.size_acres = 'Enter a valid size greater than 0.'
    if (!store.farmInfo.primary_crop)      errs.primary_crop = 'Select a primary crop.'
    setS1Errors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Step 2 validation (coffee only) ----
  function validateStep2(): boolean {
    const errs: Step2Errors = {}
    if (!store.coffeeInfo.coffee_varieties.trim())
      errs.coffee_varieties = 'Enter at least one variety.'
    if (!store.coffeeInfo.coffee_tree_count.trim())
      errs.coffee_tree_count = 'Enter the number of trees.'
    else if (isNaN(Number(store.coffeeInfo.coffee_tree_count)) || Number(store.coffeeInfo.coffee_tree_count) < 1)
      errs.coffee_tree_count = 'Must be a whole number of at least 1.'
    if (!store.coffeeInfo.estimated_annual_production.trim())
      errs.estimated_annual_production = 'Enter estimated production.'
    else if (isNaN(Number(store.coffeeInfo.estimated_annual_production)) || Number(store.coffeeInfo.estimated_annual_production) < 0)
      errs.estimated_annual_production = 'Must be a non-negative number.'
    setS2Errors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Step 4 (location) validation ----
  function validateStep4(): boolean {
    const errs: Step4Errors = {}
    if (!store.coordinates.latitude)  errs.latitude  = 'Latitude is required.'
    if (!store.coordinates.longitude) errs.longitude = 'Longitude is required.'
    setS4Errors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext() {
    setGlobalError('')
    if (step === 1 && !validateStep1()) return
    if (step === 2 && isCoffee && !validateStep2()) return

    // If non-coffee, step 2 is challenges (step 3 in the UI numbering)
    const locationStep = isCoffee ? 4 : 3
    if (step === locationStep - 1) {
      advance()
      return
    }
    advance()
  }

  async function handleSubmit() {
    if (!validateStep4()) return
    setGlobalError('')
    setSubmitting(true)

    try {
      const farm = await createFarm({
        farmer_id:                    farmerDbId,
        farm_name:                    store.farmInfo.farm_name.trim(),
        location:                     store.farmInfo.location.trim(),
        latitude:                     parseFloat(store.coordinates.latitude),
        longitude:                    parseFloat(store.coordinates.longitude),
        size_acres:                   parseFloat(store.farmInfo.size_acres),
        primary_crop:                 store.farmInfo.primary_crop,
        challenges:                   store.challenges,
        ...(isCoffee && {
          coffee_varieties:            store.coffeeInfo.coffee_varieties.trim(),
          coffee_tree_count:           parseInt(store.coffeeInfo.coffee_tree_count, 10),
          estimated_annual_production: parseFloat(store.coffeeInfo.estimated_annual_production),
          last_harvest_date:           store.coffeeInfo.last_harvest_date.trim() || 'Unknown',
        }),
      })
      store.reset()
      onSuccess(farm.id)
    } catch (err) {
      if (err instanceof ApiError) {
        // Map any server field errors back to the right step
        const apiErrs = err.errors
        if (apiErrs.farm_name || apiErrs.location || apiErrs.size_acres || apiErrs.primary_crop) {
          const e: Step1Errors = {}
          if (apiErrs.farm_name?.[0])   e.farm_name   = apiErrs.farm_name[0]
          if (apiErrs.location?.[0])    e.location    = apiErrs.location[0]
          if (apiErrs.size_acres?.[0])  e.size_acres  = apiErrs.size_acres[0]
          if (apiErrs.primary_crop?.[0])e.primary_crop= apiErrs.primary_crop[0]
          setS1Errors(e)
          goTo(1, 'back')
        } else {
          setGlobalError(err.message)
        }
      } else {
        setGlobalError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const slideIn  = direction === 'forward' ? 'motion-safe:animate-slide-in-right' : 'motion-safe:animate-slide-in-left'

  const locationStep = isCoffee ? 4 : 3
  const challengeStep = isCoffee ? 3 : 2

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <StepIndicator current={step} total={isCoffee ? 4 : 3} />

      {/* Step panels */}
      <div key={animKey} className={slideIn}>
        {/* ---- Step 1: Farm Information ---- */}
        {step === 1 && (
          <div className="space-y-5">
            <StepHeading title="Farm information" subtitle="Tell us the basics about your farm." />

            {globalError && <ErrorBanner message={globalError} />}

            <Field label="Farm name" htmlFor="farm_name" required error={s1errors.farm_name}>
              <Input
                id="farm_name" name="farm_name" type="text"
                placeholder="John's Coffee Farm"
                value={store.farmInfo.farm_name}
                error={s1errors.farm_name}
                onChange={(e) => { store.setFarmInfo({ farm_name: e.target.value }); setS1Errors((p) => ({ ...p, farm_name: undefined })) }}
              />
            </Field>

            <Field label="Location" htmlFor="location" required error={s1errors.location}
              hint="County or sub-location description">
              <Input
                id="location" name="location" type="text"
                placeholder="Nyeri County"
                value={store.farmInfo.location}
                error={s1errors.location}
                onChange={(e) => { store.setFarmInfo({ location: e.target.value }); setS1Errors((p) => ({ ...p, location: undefined })) }}
              />
            </Field>

            <Field label="Farm size (acres)" htmlFor="size_acres" required error={s1errors.size_acres}>
              <Input
                id="size_acres" name="size_acres" type="text" inputMode="decimal"
                placeholder="2.5"
                value={store.farmInfo.size_acres}
                error={s1errors.size_acres}
                onChange={(e) => { store.setFarmInfo({ size_acres: e.target.value }); setS1Errors((p) => ({ ...p, size_acres: undefined })) }}
              />
            </Field>

            <Field label="Primary crop" htmlFor="primary_crop" required error={s1errors.primary_crop}>
              <Select
                id="primary_crop" name="primary_crop"
                value={store.farmInfo.primary_crop}
                error={s1errors.primary_crop}
                onChange={(e) => { store.setFarmInfo({ primary_crop: e.target.value }); setS1Errors((p) => ({ ...p, primary_crop: undefined })) }}
              >
                <option value="">Select crop</option>
                {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
          </div>
        )}

        {/* ---- Step 2: Coffee Information (coffee only) ---- */}
        {step === 2 && isCoffee && (
          <div className="space-y-5">
            <StepHeading title="Coffee details" subtitle="Enter production and variety information." />

            <Field label="Coffee varieties" htmlFor="coffee_varieties" required error={s2errors.coffee_varieties}
              hint="Separate multiple varieties with commas">
              <Input
                id="coffee_varieties" name="coffee_varieties" type="text"
                placeholder="SL28, Ruiru 11"
                value={store.coffeeInfo.coffee_varieties}
                error={s2errors.coffee_varieties}
                onChange={(e) => { store.setCoffeeInfo({ coffee_varieties: e.target.value }); setS2Errors((p) => ({ ...p, coffee_varieties: undefined })) }}
              />
            </Field>

            <Field label="Number of coffee trees" htmlFor="coffee_tree_count" required error={s2errors.coffee_tree_count}>
              <Input
                id="coffee_tree_count" name="coffee_tree_count" type="text" inputMode="numeric"
                placeholder="1100"
                value={store.coffeeInfo.coffee_tree_count}
                error={s2errors.coffee_tree_count}
                onChange={(e) => { store.setCoffeeInfo({ coffee_tree_count: e.target.value }); setS2Errors((p) => ({ ...p, coffee_tree_count: undefined })) }}
              />
            </Field>

            <Field label="Estimated annual production (kg)" htmlFor="estimated_annual_production" required error={s2errors.estimated_annual_production}>
              <Input
                id="estimated_annual_production" name="estimated_annual_production" type="text" inputMode="decimal"
                placeholder="1800"
                value={store.coffeeInfo.estimated_annual_production}
                error={s2errors.estimated_annual_production}
                onChange={(e) => { store.setCoffeeInfo({ estimated_annual_production: e.target.value }); setS2Errors((p) => ({ ...p, estimated_annual_production: undefined })) }}
              />
            </Field>

            <Field label="Last harvest date" htmlFor="last_harvest_date"
              hint="Enter a date or type Unknown">
              <Input
                id="last_harvest_date" name="last_harvest_date" type="text"
                placeholder="Unknown"
                value={store.coffeeInfo.last_harvest_date}
                onChange={(e) => store.setCoffeeInfo({ last_harvest_date: e.target.value })}
              />
            </Field>
          </div>
        )}

        {/* ---- Challenges step (step 2 non-coffee, step 3 coffee) ---- */}
        {step === challengeStep && (
          <div className="space-y-5">
            <StepHeading title="Current challenges" subtitle="Select all that apply to your farm." />

            <fieldset>
              <legend className="sr-only">Farm challenges</legend>
              <div className="space-y-3">
                {CHALLENGE_OPTIONS.map(({ key, label }) => {
                  const checked = store.challenges.includes(key)
                  return (
                    <label
                      key={key}
                      className={[
                        'flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors duration-150',
                        checked
                          ? 'border-agric-green bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors duration-150',
                          checked ? 'border-agric-green bg-agric-green' : 'border-gray-300 bg-white',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        value={key}
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? store.challenges.filter((c) => c !== key)
                            : [...store.challenges, key]
                          store.setChallenges(next)
                        }}
                      />
                      <span className="text-sm text-black">{label}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>
        )}

        {/* ---- Step 4 (or 3 non-coffee): Farm Location ---- */}
        {step === locationStep && (
          <div className="space-y-5">
            <StepHeading title="Farm location" subtitle="Tap the map to place a pin, or enter coordinates." />

            {(s4errors.latitude || s4errors.longitude) && (
              <ErrorBanner message="Please set the farm location before continuing." />
            )}

            <FarmLocationPicker
              latitude={store.coordinates.latitude}
              longitude={store.coordinates.longitude}
              onChange={(lat, lng) => {
                store.setCoordinates({ latitude: lat, longitude: lng })
                setS4Errors({})
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <Button variant="secondary" size="lg" className="flex-1" onClick={retreat}>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Back
          </Button>
        )}

        {step < locationStep ? (
          <Button size="lg" className={step > 1 ? 'flex-1' : 'w-full'} onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            size="lg"
            className={step > 1 ? 'flex-1' : 'w-full'}
            loading={submitting}
            onClick={handleSubmit}
          >
            Submit farm
          </Button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Small helper sub-components kept in the same file
// ---------------------------------------------------------------------------

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1
        const done    = n < current
        const active  = n === current
        return (
          <div key={n} className="flex items-center gap-2">
            <div
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-150',
                done   ? 'bg-agric-green text-white' :
                active ? 'bg-agric-green/10 border-2 border-agric-green text-agric-green' :
                         'bg-gray-100 text-gray-400',
              ].join(' ')}
              aria-current={active ? 'step' : undefined}
            >
              {done ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : n}
            </div>
            {n < total && (
              <div className={['h-px w-6 transition-colors duration-300', n < current ? 'bg-agric-green' : 'bg-gray-200'].join(' ')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-black">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  )
}

function Field({
  label, htmlFor, required, hint, error, children,
}: {
  label: string; htmlFor: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-crimson" role="alert">{error}</p>}
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-lg border border-crimson/30 bg-red-50 px-4 py-3 text-sm text-crimson">
      {message}
    </div>
  )
}
