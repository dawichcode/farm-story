import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body className="font-sans text-black bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
