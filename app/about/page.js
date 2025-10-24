// app/about/page.js
import { Suspense } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import AboutClient from "@/components/AboutClient";

export const metadata = {
  title: "About — DamiOptica",
  description: "Our story, mission and values at DamiOptica.",
};

export default function AboutPage() {
  return (
    <>
      {/* Client components that may use useSearchParams are wrapped in Suspense */}
      <Suspense fallback={null}>
        <SiteNavbar overHero={false} offsetByPromo={false} />
      </Suspense>

      <AboutClient />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
