import Link from 'next/link'
import Image from 'next/image'
import BrandLogo from '@/components/ui/BrandLogo'
import { ArrowRight, BarChart3, MapPin, ClipboardList, Sprout } from 'lucide-react'

const FEATURES = [
  {
    icon: Sprout,
    title: 'Farm registration',
    desc: 'Create a detailed farm profile with location, crop data, and production history.',
  },
  {
    icon: BarChart3,
    title: 'Farm Opportunity Score',
    desc: 'Receive a personalised score and targeted recommendations based on your farm data.',
  },
  {
    icon: ClipboardList,
    title: 'Service requests',
    desc: 'Request an agronomist visit, soil test, or buyer support in a few taps.',
  },
  {
    icon: MapPin,
    title: 'Farm location',
    desc: 'Pin your farm on a map or enter GPS coordinates manually, no geocoding required.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Nav */}
      <header className="border-b border-gray-100  fixed top-0 left-0 z-[900] w-full bg-white">
        <div className=' mt-5'/>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
          <BrandLogo size="md" />
          </div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-black transition-colors duration-150 font-medium"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center overflow-hidden min-h-[520px]">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1600&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 motion-safe:animate-fade-in">
          <p className="text-xs font-semibold tracking-widest text-agric-green uppercase mb-4">
            Nimfour Consulting Group
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight max-w-xl">
            Grow smarter with Farm Story
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-md leading-relaxed">
            Register your farm, get a personalised opportunity assessment, and connect with the support you need.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/farmer/register"
              className="inline-flex items-center gap-2 h-12 px-7 rounded-lg bg-agric-green text-white text-sm font-semibold transition-transform duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Register as farmer
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href={`/farmer/${process.env.NEXT_PUBLIC_DEMO_FARMER_ID ?? '1'}`}
              className="inline-flex items-center gap-2 h-12 px-7 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              View demo farm
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Demo farmer: John Mwangi, <span className="font-mono text-gold">FS-KEN-000001</span>
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-black text-center mb-10">
            Everything a smallholder farmer needs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm motion-safe:animate-jump-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-9 h-9 rounded-lg bg-agric-green/10 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-agric-green" aria-hidden="true" />
                </div>
                <p className="font-display text-sm font-semibold text-black mb-1">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>Farm Story, Nimfour Consulting Group</span>
          <Link href="/admin" className="hover:text-black transition-colors duration-150">
            Administrator access
          </Link>
        </div>
      </footer>

    </div>
  )
}
