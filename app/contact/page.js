// app/contact/page.js
import { Suspense } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import ContactClient from "@/components/ContactClient";

export const metadata = {
  title: "Contact — DamiOptica",
  description:
    "Get in touch with DamiOptica — appointments, questions and support.",
};

export default function ContactPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SiteNavbar overHero={false} offsetByPromo={false} />
      </Suspense>

      <ContactClient />

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
