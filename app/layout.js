// app/layout.js
import "./globals.css";
import { headers } from "next/headers";
import { Suspense } from "react";
import LocaleProvider from "@/components/i18n/LocaleProvider";

export const metadata = {
  title: "DamiOptica",
  description: "Modern eyewear & care",
};

export default async function RootLayout({ children }) {
  // Detect preferred language from the request headers (server-side)
  let initial = "es";
  try {
    const h = await headers(); // IMPORTANT: await headers()
    const al = (h.get("accept-language") || "").toLowerCase();
    if (al.startsWith("en")) initial = "en";
  } catch {
    // keep "es" if headers() isn't available (e.g., during static export)
  }

  return (
    <html lang={initial}>
      <body>
        {/* Wrap the app in Suspense so any useSearchParams down the tree is compliant */}
        <Suspense fallback={null}>
          <LocaleProvider initialLocale={initial}>{children}</LocaleProvider>
        </Suspense>
      </body>
    </html>
  );
}
