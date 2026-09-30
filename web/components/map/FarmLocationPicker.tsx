'use client'

import { useEffect, useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { MapPin } from 'lucide-react'

interface Props {
  latitude: string
  longitude: string
  onChange: (lat: string, lng: string) => void
}

// Leaflet is loaded dynamically at runtime. Types are imported for
// annotation only and the actual import happens inside useEffect so
// this component can only be used via `dynamic(..., { ssr: false })`.
export default function FarmLocationPicker({ latitude, longitude, onChange }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // Store the Leaflet map and marker instances in refs so they are not
  // recreated on every render.
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markerRef = useRef<import('leaflet').Marker | null>(null)

  const [latInput, setLatInput] = useState(latitude)
  const [lngInput, setLngInput] = useState(longitude)
  const [latError, setLatError] = useState('')
  const [lngError, setLngError] = useState('')

  // Initialise Leaflet map once on mount
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return

    // Dynamic require so the module is never evaluated server-side
    const L = require('leaflet') as typeof import('leaflet')

    // Fix broken default icon paths that Webpack rewrites
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    // Default centre: Nyeri, Kenya
    const defaultLat = latitude ? parseFloat(latitude) : -0.4167
    const defaultLng = longitude ? parseFloat(longitude) : 36.9500

    const map = L.map(mapContainerRef.current, { zoomControl: true }).setView(
      [defaultLat, defaultLng],
      12,
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // If coordinates already exist, place a marker
    if (latitude && longitude) {
      markerRef.current = L.marker([defaultLat, defaultLng]).addTo(map)
    }

    // Click on map to place / move marker
    map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
      const lat = e.latlng.lat.toFixed(6)
      const lng = e.latlng.lng.toFixed(6)

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng)
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map)
      }

      setLatInput(lat)
      setLngInput(lng)
      onChange(lat, lng)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When parent updates coordinates (e.g. reset), sync the map
  useEffect(() => {
    setLatInput(latitude)
    setLngInput(longitude)
  }, [latitude, longitude])

  function validateAndCommitLat(value: string) {
    const num = parseFloat(value)
    if (isNaN(num) || num < -90 || num > 90) {
      setLatError('Enter a valid latitude between -90 and 90.')
      return
    }
    setLatError('')
    moveMarker(num, parseFloat(lngInput) || 0)
    onChange(num.toFixed(6), (parseFloat(lngInput) || 0).toFixed(6))
  }

  function validateAndCommitLng(value: string) {
    const num = parseFloat(value)
    if (isNaN(num) || num < -180 || num > 180) {
      setLngError('Enter a valid longitude between -180 and 180.')
      return
    }
    setLngError('')
    moveMarker(parseFloat(latInput) || 0, num)
    onChange((parseFloat(latInput) || 0).toFixed(6), num.toFixed(6))
  }

  function moveMarker(lat: number, lng: number) {
    const L = require('leaflet') as typeof import('leaflet')
    if (!mapRef.current) return

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current)
    }
    mapRef.current.setView([lat, lng], mapRef.current.getZoom())
  }

  return (
    <div className="space-y-4">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 300 }}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <p className="flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        Tap the map to place a pin, or enter coordinates manually below.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="latitude" required>Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="text"
            inputMode="decimal"
            placeholder="-0.4167"
            value={latInput}
            error={latError || undefined}
            onChange={(e) => setLatInput(e.target.value)}
            onBlur={(e) => validateAndCommitLat(e.target.value)}
          />
          {latError && <p className="text-xs text-crimson" role="alert">{latError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="longitude" required>Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="text"
            inputMode="decimal"
            placeholder="36.9500"
            value={lngInput}
            error={lngError || undefined}
            onChange={(e) => setLngInput(e.target.value)}
            onBlur={(e) => validateAndCommitLng(e.target.value)}
          />
          {lngError && <p className="text-xs text-crimson" role="alert">{lngError}</p>}
        </div>
      </div>

      {latitude && longitude && (
        <p className="text-xs font-mono text-gold bg-yellow-50 border border-gold/20 rounded-lg px-3 py-2">
          {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
        </p>
      )}
    </div>
  )
}
