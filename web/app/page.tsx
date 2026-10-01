import Link from 'next/link'
import Image from 'next/image'
import BrandLogo from '@/components/ui/BrandLogo'
import { ArrowRight, BarChart3, MapPin, ClipboardList, Sprout, Users, TrendingUp, Shield } from 'lucide-react'

const FEATURES = [
  {
    icon: Sprout,
    title: 'Farm registration',
    desc: 'Create a detailed farm profile with location, crop data, and production history in minutes.',
  },
  {
    icon: BarChart3,
    title: 'Farm Opportunity Score',
    desc: 'Receive a personalised score and targeted recommendations grounded in your farm data.',
  },
  {
    icon: ClipboardList,
    title: 'Service requests',
    desc: 'Request an agronomist visit, soil test, or buyer support with a single tap.',
  },
  {
    icon: MapPin,
    title: 'Farm location',
    desc: 'Pin your farm on a map or enter GPS coordinates manually — no geocoding required.',
  },
]

const STATS = [
  { icon: Users,      value: '10,000+', label: 'Farmers onboarded' },
  { icon: TrendingUp, value: '68 / 100', label: 'Avg opportunity score' },
  { icon: Shield,     value: '99.9%',   label: 'Data reliability' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Nav */}
      <header className="border-b border-gray-100 fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo size="md" />
          <nav className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-black transition-colors duration-150 font-medium"
            >
              Admin
            </Link>
            <Link
              href="/farmer/register"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-agric-green text-white text-sm font-medium transition-transform duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero — full viewport, content aligned left on desktop */}
      <section className="relative flex items-center overflow-hidden min-h-screen pt-16">
        <Image
          src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1600&q=80&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-20">
          <div className="max-w-2xl motion-safe:animate-fade-in">
            <p className="text-xs font-semibold tracking-widest text-agric-green uppercase mb-5">
              Nimfour Consulting Group
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Grow smarter<br className="hidden sm:block" /> with Farm Story
            </h1>
            <p className="mt-6 text-gray-300 text-lg lg:text-xl max-w-xl leading-relaxed">
              Register your farm, get a personalised opportunity assessment, and connect with the agricultural support you need.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/farmer/register"
                className="inline-flex items-center gap-2 h-13 px-8 rounded-xl bg-agric-green text-white text-base font-semibold transition-transform duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agric-green focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-lg shadow-agric-green/30"
              >
                Register as farmer
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                href={`/farmer/${process.env.NEXT_PUBLIC_DEMO_FARMER_ID ?? '1'}`}
                className="inline-flex items-center gap-2 h-13 px-8 rounded-xl border border-white/30 text-white text-base font-medium hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                View demo farm
              </Link>
            </div>

            <p className="mt-5 text-sm text-gray-400">
              Demo farmer: John Mwangi, <span className="font-mono text-gold">FS-KEN-000001</span>
            </p>
          </div>

          {/* Stats strip on large screens */}
          <div className="hidden lg:flex items-center gap-12 mt-20 pt-10 border-t border-white/10">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-agric-green flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-display text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-black">
              Everything a smallholder farmer needs
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
              A complete digital platform from registration to intelligent farm assessment.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-150 motion-safe:animate-jump-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-agric-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-agric-green" aria-hidden="true" />
                </div>
                <p className="font-display text-base font-semibold text-black mb-2">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-agric-green px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white">
              Ready to assess your farm?
            </h2>
            <p className="text-green-100 mt-2 text-base">
              Join thousands of smallholder farmers already using Farm Story.
            </p>
          </div>
          <Link
            href="/farmer/register"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-white text-agric-green text-sm font-semibold transition-transform duration-100 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white flex-shrink-0"
          >
            Get started for free
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>Nimfour Consulting Group</span>
          </div>
          <Link href="/admin" className="hover:text-black transition-colors duration-150">
            Administrator access
          </Link>
        </div>
      </footer>

    </div>
  )
}
