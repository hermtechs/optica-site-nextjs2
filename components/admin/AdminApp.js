// components/admin/AdminApp.js
"use client";

import { useState } from "react";
import AuthGate from "@/components/admin/AuthGate";
import ProductsManager from "@/components/admin/ProductsManager";
import ContentManager from "@/components/admin/ContentManager";
import SiteSettings from "@/components/admin/SiteSettings";
import HeroManagerInSettings from "./HeroManagerInSettings";

export default function AdminApp() {
  const [tab, setTab] = useState("products"); // "products" | "content"

  return (
    <main className="container-tight py-8">
      <AuthGate>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-ink">Admin</h1>
          <p className="text-sm text-muted">Manage products and site content</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`btn-outline ${tab === "products" ? "bg-mist" : ""}`}
            onClick={() => setTab("products")}
          >
            Products
          </button>
          <button
            className={`btn-outline ${tab === "content" ? "bg-mist" : ""}`}
            onClick={() => setTab("content")}
          >
            Content
          </button>
        </div>

        <div className="mt-6">
          {tab === "products" ? <ProductsManager /> : <ContentManager />}
          <SiteSettings />
          <HeroManagerInSettings />
        </div>
      </AuthGate>
    </main>
  );
}
