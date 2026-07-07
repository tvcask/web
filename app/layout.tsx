import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { site } from "@/lib/site";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: `${site.displayName} — ${site.tagline}`,
  description: site.description,
  applicationName: site.displayName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.displayName
  }
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
