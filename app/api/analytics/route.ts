import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_EVENT_TYPES = [
  "page_view",
  "cv_download",
  "project_click",
  "contact_click",
] as const;

type AllowedEventType = (typeof ALLOWED_EVENT_TYPES)[number];

function isAllowedEventType(val: unknown): val is AllowedEventType {
  return (
    typeof val === "string" &&
    (ALLOWED_EVENT_TYPES as readonly string[]).includes(val)
  );
}

function detectDevice(userAgent: string): "Mobile" | "Tablet" | "Desktop" {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop|android/i.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

function detectBrowser(ua: string): string {
  if (/edg/i.test(ua)) return "Edge";
  if (/opr|opera/i.test(ua)) return "Opera";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Browser";
}

function detectOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "OS";
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const cfIp = request.headers.get("cf-connecting-ip");
  const realIp = request.headers.get("x-real-ip");

  let ip = "";
  if (forwarded) {
    ip = forwarded.split(",")[0].trim();
  } else if (cfIp) {
    ip = cfIp.trim();
  } else if (realIp) {
    ip = realIp.trim();
  } else {
    ip = "127.0.0.1";
  }

  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1 (Local)";
  }
  return ip;
}

function anonymizeIp(ip: string): string {
  if (!ip || ip === "127.0.0.1 (Local)") return "127.0.0.1";
  // Jika IPv4, kosongkan oktet terakhir (contoh: 192.168.1.123 -> 192.168.1.0)
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }
  // Jika IPv6, ambil prefix saja
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 3).join(":") + "::";
  }
  return "0.0.0.0";
}

export async function POST(request: NextRequest) {
  try {
    let body: { eventType?: unknown; pagePath?: unknown; targetName?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Bad Request: Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { eventType, pagePath = "/", targetName = "" } = body;

    // Strict validation of eventType
    if (!isAllowedEventType(eventType)) {
      return NextResponse.json(
        {
          error:
            "Bad Request: eventType is required and must be one of: 'page_view', 'cv_download', 'project_click', 'contact_click'",
        },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const anonymizedIp = anonymizeIp(clientIp);
    const userAgent = request.headers.get("user-agent") || "";
    const rawReferrer = request.headers.get("referer") || "";
    const deviceType = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);

    let cleanReferrer = "Direct";
    if (rawReferrer) {
      try {
        const refUrl = new URL(rawReferrer);
        cleanReferrer = refUrl.hostname || rawReferrer;
      } catch {
        cleanReferrer = rawReferrer;
      }
    }

    const formattedDevice = `${deviceType} • ${browser} on ${os}`;
    const formattedUserAgent = `[IP: ${anonymizedIp}] ${userAgent}`.slice(0, 500);

    const payload = {
      event_type: eventType,
      page_path: typeof pagePath === "string" ? pagePath : "/",
      target_name: typeof targetName === "string" ? targetName : "Page Interaction",
      device_type: formattedDevice,
      referrer: cleanReferrer,
      user_agent: formattedUserAgent,
      ip_address: anonymizedIp,
    };

    const supabase = await createClient();

    // Single validated insert into Supabase analytics_events
    const { error: insertErr } = await supabase
      .from("analytics_events")
      .insert(payload);

    if (insertErr) {
      return NextResponse.json(
        { success: false, error: insertErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
