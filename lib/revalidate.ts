/**
 * Utility helper to trigger cache revalidation securely from admin components
 */
export async function triggerRevalidation(path: string = "/"): Promise<boolean> {
  try {
    const token =
      process.env.NEXT_PUBLIC_REVALIDATION_SECRET || "portfolio-secret-key-2026";
    const res = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": token,
      },
      body: JSON.stringify({ path }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
