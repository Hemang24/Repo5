import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = path.startsWith('/journal') || path.startsWith('/reports') || path.startsWith('/settings')
  const isAuthPage = path.startsWith('/auth')
  const isOnboarding = path.startsWith('/onboarding')

  // Not logged in → send to login
  if (!user && (isProtected || isOnboarding)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Logged in → redirect away from auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/journal', request.url))
  }

  // Logged in → enforce onboarding for ALL protected routes, not just root
  if (user && (isProtected || path === '/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_completed && !isOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // At root with onboarding done → go to journal
    if (path === '/') {
      return NextResponse.redirect(new URL('/journal', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
