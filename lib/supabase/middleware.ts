import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function sanitizeSupabaseUrl(url: string | undefined): string {
  if (!url) return "";
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // FAIL-CLOSED: If Supabase keys are not set, strictly forbid unauthenticated access to admin routes
  if (!supabaseUrl || !supabaseKey) {
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // IMPORTANT: Check user session via supabase.auth.getUser()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // If session error or no user, fail closed on protected admin routes
    if ((error || !user) && isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // If user is already signed in and accesses /admin/login, redirect to /admin
    if (user && isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch {
    // Fail-Closed: On unexpected auth failure, block access to protected routes
    if (isAdminRoute && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
