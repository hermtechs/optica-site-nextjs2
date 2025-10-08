import Link from "next/link";
import { Search } from "lucide-react";

/**
 * overHero  -> transparent style over hero
 * offsetByPromo -> if true, navbar sits below the promo bar (top-10). If false, it hugs the top.
 */
export default function SiteNavbar({ overHero = true, offsetByPromo = true }) {
  const wrap = overHero
    ? `absolute inset-x-0 ${offsetByPromo ? "top-10" : "top-0"} z-50 text-white`
    : "relative border-b bg-white text-ink";

  const link = overHero
    ? "text-white/90 hover:text-white"
    : "text-muted hover:text-ink";

  const iconBtn =
    "inline-flex items-center justify-center rounded-full w-10 h-10 " +
    (overHero
      ? "hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      : "hover:bg-surf focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40");

  return (
    <header className={wrap}>
      <div
        className={
          "container-tight h-20 flex items-center justify-between relative " +
          (overHero ? "bg-gradient-to-b from-black/20 to-transparent" : "")
        }
      >
        {/* LEFT: Search (Lucide) */}
        <div className="flex items-center gap-5">
          <button aria-label="Search" className={iconBtn}>
            <Search size={20} strokeWidth={2} />
          </button>
        </div>

        {/* CENTER: links • brand • links (desktop) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm">
          <nav className="flex items-center gap-6">
            <Link href="#" className={link}>
              HOME
            </Link>
            <Link href="#" className={link}>
              SHOPS
            </Link>
            <Link href="#" className={link}>
              PRODUCTS
            </Link>
          </nav>

          <Link
            href="/"
            className={
              (overHero ? "text-white" : "text-ink") +
              " text-2xl font-semibold tracking-wide"
            }
          >
            Eyese.
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="#" className={link}>
              BLOG
            </Link>
            <Link href="#" className={link}>
              PAGES
            </Link>
            <Link href="#" className={link}>
              FAQS
            </Link>
          </nav>
        </div>

        {/* RIGHT: intentionally empty */}
        <div className="flex items-center gap-5" />
      </div>
      {!overHero && <div className="border-b" />}
    </header>
  );
}
