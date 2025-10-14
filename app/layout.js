// app/layout.js
import "./globals.css";
import { headers } from "next/headers";
import LocaleProvider from "@/components/i18n/LocaleProvider";

export const metadata = {
  title: "DamiOptica",
  description: "Modern eyewear & care",
};

export default async function RootLayout({ children }) {
  // Detect preferred language from the request headers (server-side)
  let initial = "es";
  try {
    const h = await headers(); // <-- await here
    const al = (h.get("accept-language") || "").toLowerCase();
    if (al.startsWith("en")) initial = "en";
  } catch {
    // keep default "es" if headers() isn't available
  }

  return (
    <html lang={initial}>
      <body>
        {/* LocaleProvider is a client component that consumes initialLocale */}
        <LocaleProvider initialLocale={initial}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
