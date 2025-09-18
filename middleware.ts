import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    // If there's an error getting the user, let the request continue
    if (error) {
      console.log('Middleware auth error:', error.message)
      return res
    }

    // If user is authenticated and trying to access the home page, redirect to dashboard
    if (user && req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not authenticated and trying to access protected routes, redirect to signin
    if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Allow auth pages to be accessed by anyone
    if (req.nextUrl.pathname.startsWith('/auth/')) {
      return res
    }

  } catch (error) {
    console.log('Middleware error:', error)
    // If there's any error, let the request continue
    return res
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
