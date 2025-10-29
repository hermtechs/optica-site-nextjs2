// components/EyeTestSection.js
"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import useSiteContent from "@/lib/useSiteContent";
import { useMemo } from "react";

function waLink(content) {
  const base = "https://wa.me/";
  const digits = (content.contact_phone || "").replace(/\D+/g, "");
  const text = encodeURIComponent(
    `Hola, quiero reservar un examen de la vista en DamiOptica. ¿Tienen disponibilidad?`
  );
  return `${base}${digits ? digits : ""}?text=${text}`;
}

export default function EyeTestSection() {
  const { getStrict, content } = useSiteContent();

  const title = getStrict("eye_title");
  const body = getStrict("eye_body");
  const img = content.eye_image || "/images/eye-exam.jpg";

  const wurl = useMemo(() => waLink(content), [content]);

  return (
    <section className="container-tight py-10">
      <div
        className="
          grid gap-6 overflow-hidden rounded-2xl bg-white p-5
          shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/5
          md:grid-cols-2
        "
      >
        <div className="order-last md:order-first">
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-ink/80 whitespace-pre-line">{body}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/eye-tests"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              Más información
            </Link>
            <a
              href={wurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[#25D366]/50"
            >
              <FaWhatsapp size={18} />
              Reservar por WhatsApp
            </a>
          </div>
        </div>

        <div className="relative">
          <img
            src={img}
            alt=""
            className="h-full w-full rounded-xl object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10" />
        </div>
      </div>
    </section>
  );
}
