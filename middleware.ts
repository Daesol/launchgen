import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/auth') {
    const adminToken = request.cookies.get('admin-token')?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }

    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET)
      
      // Check if token is valid and user is admin
      if (!payload.role || payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/auth', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to auth
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 