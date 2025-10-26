// components/EyeTestSection.js
"use client";
import useSiteContent from "@/lib/useSiteContent";

export default function EyeTestSection() {
  const { getStrict } = useSiteContent();
  const title = getStrict("eye_title");
  const body = getStrict("eye_body");
  const image = getStrict("eye_image");

  if (!title && !body && !image) return null;

  return (
    <section className="container-tight py-12">
      <div className="rounded-2xl border bg-white p-6 grid md:grid-cols-3 gap-6 items-center">
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full rounded-xl object-cover border md:col-span-1"
          />
        ) : (
          <div className="w-full h-40 rounded-xl bg-mist border md:col-span-1" />
        )}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-ink/80 whitespace-pre-line">{body}</p>
        </div>
      </div>
    </section>
  );
}
