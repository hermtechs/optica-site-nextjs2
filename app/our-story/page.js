// app/our-story/page.js
"use client";

import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import useSiteContent from "@/lib/useSiteContent";

export default function OurStoryPage() {
  const { getStrict, content } = useSiteContent();

  const title = getStrict("story_title");
  const body = getStrict("story_body");
  const hero = content.story_image || "";
  const gallery = Array.isArray(content.story_gallery)
    ? content.story_gallery
    : [];

  return (
    <>
      <SiteNavbar overHero={false} offsetByPromo={false} />
      <main className="container-tight py-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {hero ? (
            <img
              src={hero}
              alt=""
              className="w-full rounded-2xl object-cover border"
            />
          ) : (
            <div className="w-full h-64 rounded-2xl bg-mist border" />
          )}
          <div>
            <h1 className="text-3xl font-semibold text-ink">{title}</h1>
            <p className="mt-4 text-ink/80 whitespace-pre-line">{body}</p>
          </div>
        </div>

        {gallery.length > 0 && (
          <section className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-full h-56 object-cover rounded-xl border"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
