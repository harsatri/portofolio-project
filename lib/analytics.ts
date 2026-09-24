export type AnalyticsEventType =
  | "page_view"
  | "cv_download"
  | "project_click"
  | "contact_click";

export interface AnalyticsPayload {
  eventType: AnalyticsEventType;
  pagePath?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
}

export function trackEvent(
  eventType: AnalyticsEventType,
  targetName: string = "",
  metadata: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  const payload: AnalyticsPayload = {
    eventType,
    pagePath: window.location.pathname || "/",
    targetName,
    metadata,
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently ignore analytics network failures
      });
    }
  } catch {
    // Silently ignore tracking errors
  }
}
