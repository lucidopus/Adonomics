import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Adonomics - AI-Powered Creative Analytics',
  description: 'Transform video ad creatives into data-backed insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
