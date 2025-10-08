export const metadata = {
  title: "Pic N Save – Eyewear",
  description: "Clean Next.js landing modeled from a screenshot.",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
