'use client'

import { useRouter } from 'next/navigation'
import FarmerRegistrationForm from '@/components/farmer/FarmerRegistrationForm'
import { Sprout } from 'lucide-react'

export default function FarmerRegisterPage() {
  const router = useRouter()

  function handleSuccess(farmerDbId: string) {
    router.push(`/farmer/${farmerDbId}/farm/new`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <Sprout className="w-5 h-5 text-agric-green" aria-hidden="true" />
          <span className="font-display font-semibold text-black text-sm tracking-wide">Farm Story</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Page heading */}
          <div className="mb-8 motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your details to register and receive your Farmer ID.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 motion-safe:animate-slide-in-up" style={{ animationDelay: '60ms' }}>
            <FarmerRegistrationForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
    </div>
  )
}
