import type { Metadata } from 'next'
import { Inter, Manrope, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

// ---------------------------------------------------------------------------
// Font loading via next/font/google
// Eliminates FOUT, enables automatic subsetting, adds preload hints.
// Each font is exposed as a CSS variable referenced by tailwind.config.ts.
// ---------------------------------------------------------------------------

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-inter',
  weight:   ['400', '500', '600', '700'],
})

const manrope = Manrope({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-manrope',
  weight:   ['600', '700', '800'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-ibm-plex-mono',
  weight:   ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Farm Story',
  description: 'Farmer onboarding and farm intelligence platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans text-black bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
