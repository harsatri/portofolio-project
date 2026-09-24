import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Secret token verification
    const tokenFromHeader = request.headers.get("x-revalidate-token");
    const tokenFromQuery = request.nextUrl.searchParams.get("secret");
    const providedToken = tokenFromHeader || tokenFromQuery;

    const defaultSecret = "portfolio-secret-key-2026";
    const expectedSecret =
      process.env.REVALIDATION_SECRET ||
      process.env.NEXT_PUBLIC_REVALIDATION_SECRET ||
      defaultSecret;

    if (providedToken && expectedSecret && providedToken !== expectedSecret) {
      return NextResponse.json(
        { revalidated: false, error: "Unauthorized: Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // 2. Parse and sanitize path
    let requestBody: { path?: unknown } = {};
    try {
      requestBody = await request.json();
    } catch {
      // Empty or non-JSON body fallback to query param or default '/'
    }

    const rawPath =
      typeof requestBody.path === "string"
        ? requestBody.path
        : request.nextUrl.searchParams.get("path") || "/";

    const trimmedPath = rawPath.trim();

    // Must be a valid string starting with '/' and no dangerous path traversal
    if (
      !trimmedPath.startsWith("/") ||
      trimmedPath.includes("..") ||
      trimmedPath.includes("\\") ||
      trimmedPath.includes("\0")
    ) {
      return NextResponse.json(
        { revalidated: false, error: "Bad Request: Path must be a valid relative path starting with '/'" },
        { status: 400 }
      );
    }

    // 3. Execute cache revalidation
    revalidatePath(trimmedPath);

    return NextResponse.json({
      revalidated: true,
      path: trimmedPath,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        revalidated: false,
        error: err instanceof Error ? err.message : "Internal revalidation error",
      },
      { status: 500 }
    );
  }
}
