'use client'

import { useRouter } from 'next/navigation'
import FarmerRegistrationForm from '@/components/farmer/FarmerRegistrationForm'
import FarmerShell from '@/components/farmer/FarmerShell'

export default function FarmerRegisterPage() {
  const router = useRouter()

  function handleSuccess(farmerDbId: string) {
    router.push(`/farmer/${farmerDbId}/farm/new`)
  }

  return (
    <FarmerShell headerWidth="md">
      <div className="flex flex-col justify-center px-4 py-8 min-h-[calc(100vh-57px)]">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8 motion-safe:animate-slide-in-up">
            <h1 className="font-display text-2xl font-bold text-black">Create your account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your details to register and receive your Farmer ID.
            </p>
          </div>

          <div
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 motion-safe:animate-slide-in-up"
            style={{ animationDelay: '60ms' }}
          >
            <FarmerRegistrationForm onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </FarmerShell>
  )
}
