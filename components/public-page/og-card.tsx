import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

async function loadPoster(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    // Satori can't draw webp or avif, and one undrawable poster would fail the card.
    if (!/jpe?g|png/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/** The preview a chat app shows for a shared link: who it's from, and a row of posters. */
export async function ogCard({ heading, subheading, posters }: { heading: string; subheading: string; posters: string[] }) {
  const images = (await Promise.all(posters.slice(0, 5).map(loadPoster))).filter((src): src is string => src !== null);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0a0a0c", color: "#fff" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1 }}>{heading.slice(0, 48)}</div>
        <div style={{ marginTop: 12, fontSize: 28, color: "rgba(255,255,255,0.55)" }}>{subheading}</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {images.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={index} src={src} alt="" width={160} height={240} style={{ borderRadius: 14, objectFit: "cover" }} />
          ))}
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#C69C6D" }}>{site.displayName}</div>
      </div>
    </div>,
    ogSize
  );
}
