import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClientForServer } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const supabaseServer = createClientForServer();
  const response = await updateSession(request); 

  const isAuthenticated = response.status === 200 && (await supabaseServer.auth.getUser()).data.user?.id;

  // Redirect unauthenticated users on private routes to the sign-in page
  if (
    !["/signin", "/update-password"].some((path) => pathname.includes(path)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  // Redirect authenticated users trying to access sign-in page
  if (
    ["/signin", "/update-password"].some((path) => pathname.includes(path)) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
