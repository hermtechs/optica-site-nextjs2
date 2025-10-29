// components/AboutHomeSection.js
"use client";

import Link from "next/link";
import useSiteContent from "@/lib/useSiteContent";

export default function AboutHomeSection() {
  const { getStrict, content } = useSiteContent();

  const title = getStrict("home_about_title");
  const body = getStrict("home_about_body");
  const img = content.home_about_image || "/images/home-about.jpg";

  return (
    <section className="container-tight py-10">
      <div className="grid gap-6 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5 md:grid-cols-2">
        <div className="relative">
          <img
            src={img}
            alt=""
            className="h-full w-full rounded-xl object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-ink/80 whitespace-pre-line">{body}</p>
          <div className="mt-5">
            <Link
              href="/our-story"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              Nuestra historia
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
