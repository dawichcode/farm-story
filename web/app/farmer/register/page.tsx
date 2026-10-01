'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FarmerRegistrationForm from '@/components/farmer/FarmerRegistrationForm'
import BrandLogo from '@/components/ui/BrandLogo'

export default function FarmerRegisterPage() {
  const router = useRouter()

  function handleSuccess(farmerDbId: string) {
    router.push(`/farmer/${farmerDbId}/farm/new`)
  }

  return (
    <div className="min-h-screen flex">

      {/* ---- Left panel: hero image (desktop only) ---- */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col">
        <Image
          src="https://images.unsplash.com/photo-1502084895870-f87de34b8d7c?w=1200&q=80&auto=format&fit=crop"
          alt="Coffee farm landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-agric-green/80 via-agric-green/50 to-black/30" aria-hidden="true" />

        {/* Brand overlay */}
        <div className="relative z-10 p-10 flex flex-col h-full">
          <Link href="/" aria-label="Farm Story home">
            <BrandLogo size="lg" className="[&_span]:text-white" />
          </Link>

          <div className="flex-1 flex flex-col justify-end pb-12">
            <blockquote className="max-w-sm">
              <p className="font-display text-2xl font-semibold text-white leading-snug">
                "Farm Story helped me understand my farm's potential in minutes."
              </p>
              <footer className="mt-4 text-sm text-green-100">
                John Mwangi, Nyeri County
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* ---- Right panel: form ---- */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-4">
          <Link href="/" aria-label="Farm Story home">
            <BrandLogo size="md" />
          </Link>
        </header>

        <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-12">
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <div className="mb-8 motion-safe:animate-slide-in-up">
              <h1 className="font-display text-3xl font-bold text-black">Create your account</h1>
              <p className="text-gray-500 text-base mt-2">
                Enter your details to register and receive your Farmer ID.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 motion-safe:animate-slide-in-up"
              style={{ animationDelay: '60ms' }}
            >
              <FarmerRegistrationForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
