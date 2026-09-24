import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  err: unknown,
  fallback = "Terjadi kesalahan"
): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    if (
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    ) {
      return (err as { message: string }).message;
    }
    if (
      "error_description" in err &&
      typeof (err as { error_description: unknown }).error_description ===
        "string"
    ) {
      return (err as { error_description: string }).error_description;
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
