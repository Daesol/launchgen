import React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from '@/lib/theme-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'LaunchGen Demo',
  description: 'Watch your idea become a landing page in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider defaultTheme="light">
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
} 