"use client";

import { useEffect } from "react";

// Catches failures in the root layout itself. It replaces the whole document,
// so it renders its own <html>/<body> with inline styles (no globals guaranteed).
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] error", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#08080a",
          color: "#fff",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center"
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, opacity: 0.6 }}>Please try again in a moment.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 999,
              border: 0,
              fontWeight: 700,
              cursor: "pointer",
              background: "#d0a066",
              color: "#1a130a"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
