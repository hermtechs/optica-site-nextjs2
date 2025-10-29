// app/admin/page.js
import { Suspense } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import AdminApp from "@/components/admin/AdminApp";

export const metadata = {
  title: "Admin — DamiOptica",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <Suspense fallback={null}>
        <SiteNavbar overHero={false} offsetByPromo={false} />
      </Suspense>
      <AdminApp />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
