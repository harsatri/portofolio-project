"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, type AnalyticsEventType } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  // 1. Record Page View on mount & route transition
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    // Prevent duplicate firing on same path
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;

    let targetTitle = "Home Portfolio";
    if (pathname.startsWith("/projects/")) {
      const slug = pathname.replace("/projects/", "");
      targetTitle = `Project Detail: ${slug}`;
    } else if (pathname !== "/") {
      targetTitle = `Page ${pathname}`;
    }

    // Small delay to ensure document.title is populated
    const timer = setTimeout(() => {
      const pageName = document.title ? document.title.split("|")[0].trim() : targetTitle;
      trackEvent("page_view", pageName);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  // 2. Global delegate click listener for elements with data-track-event
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;

      const target = (e.target as HTMLElement)?.closest("[data-track-event]");
      if (!target) return;

      const eventType = target.getAttribute(
        "data-track-event"
      ) as AnalyticsEventType;
      const targetName = target.getAttribute("data-track-target") || "";

      if (eventType) {
        trackEvent(eventType, targetName);
      }
    };

    window.addEventListener("click", handleDocumentClick, { passive: true });

    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return null;
}
