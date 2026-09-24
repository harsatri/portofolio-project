import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = "Harsa Tri Novenda — Frontend & Full-Stack Web Developer";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Ambient Radial Glows */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(9, 9, 11, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "550px",
            height: "550px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(9, 9, 11, 0) 70%)",
          }}
        />

        {/* Top Header: Badge & Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",

          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "9999px",
              border: "1px solid #27272a",
              backgroundColor: "rgba(24, 24, 27, 0.85)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                color: "#e4e4e7",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Available for Engineering Projects
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              color: "#71717a",
              fontWeight: 600,
            }}
          >
            <span>Portfolio &bull; Engineering Showcase</span>
          </div>
        </div>

        {/* Middle Section: Main Headline, Role & Summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",

          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Harsa Tri Novenda
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 700,
                color: "#60a5fa",
                letterSpacing: "-0.01em",
              }}
            >
              Frontend &amp; Full-Stack Web Developer
            </div>
          </div>

          <div
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              maxWidth: "920px",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Crafting scalable web architectures, transactional backends, and data-driven systems with Next.js, Laravel, and PostgreSQL.
          </div>
        </div>

        {/* Bottom Section: Tech Stack Badges & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid #27272a",
            width: "100%",

          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {["Next.js", "TypeScript", "Laravel", "PostgreSQL", "Supabase"].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #3f3f46",
                    backgroundColor: "rgba(39, 39, 42, 0.6)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#f4f4f5",
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>

          <div
            style={{
              fontSize: "17px",
              color: "#a1a1aa",
              fontWeight: 600,
            }}
          >
            hasnatria.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
