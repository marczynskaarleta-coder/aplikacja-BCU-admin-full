import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Handle error from Supabase
  if (error) {
    const errorUrl = new URL('/auth/error', origin)
    errorUrl.searchParams.set('error', error)
    errorUrl.searchParams.set('error_description', error_description || 'Unknown error')
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // If there's an error exchanging the code, redirect to error page
    const errorUrl = new URL('/auth/error', origin)
    errorUrl.searchParams.set('error', 'auth_error')
    errorUrl.searchParams.set('error_description', error.message)
    return NextResponse.redirect(errorUrl)
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
