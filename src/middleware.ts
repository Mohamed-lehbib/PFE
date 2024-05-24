import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClientForServer } from "./utils/supabase/server";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseServer = createClientForServer();
    const response = await updateSession(request); 

    const isAuthenticated = response.status === 200 && (await supabaseServer.auth.getUser()).data.user?.id;

    // Redirect unauthenticated users on private routes to the sign-in page
    if (
      !["/auth"].some((path) => pathname.includes(path)) &&
      !isAuthenticated
    ) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    if (
      ["/auth"].some((path) => pathname.includes(path)) &&
      isAuthenticated
    ) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}