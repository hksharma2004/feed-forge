import { ImageResponse } from "next/og";

export const alt =
  "FeedForge landing page preview with the headline Forge Every Post Before It Ships.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(circle at 50% 10%, #000 0%, #000 42%, rgba(121, 45, 24, 0.95) 76%, #de8238 100%)",
          color: "#fff",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: "54px 82px 64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.11)",
            paddingBottom: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: "2px solid rgba(255, 255, 255, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              F
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>FeedForge</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            <span>Agents</span>
            <span>Scoring</span>
            <span>Sign in</span>
            <span
              style={{
                background: "#fff",
                color: "#111",
                borderRadius: 16,
                padding: "12px 22px",
              }}
            >
              Sign up
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingTop: 26,
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 70,
              fontWeight: 700,
              lineHeight: 0.98,
              maxWidth: 720,
              letterSpacing: 0,
            }}
          >
            Forge Every Post Before It Ships
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.35,
              maxWidth: 700,
            }}
          >
            Build campaign agents, score drafts against your brand rules, and
            generate content that learns from every approval.
          </div>
          <div
            style={{
              marginTop: 42,
              background: "#fff",
              color: "#111",
              borderRadius: 12,
              padding: "16px 28px",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            Create campaign
          </div>
        </div>
      </div>
    ),
    size,
  );
}
