import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const onSubscribe = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") || "").toString().trim();
    if (!email) return;
    // TODO: wire to your email service (e.g., Resend, Mailchimp)
    alert(`Thanks! We'll keep you posted at ${email}.`);
    e.currentTarget.reset();
  };

  const linkBase =
    "text-sm text-muted hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded";

  const socialBtn =
    "inline-flex items-center justify-center w-9 h-9 rounded-full border border-brand/30 text-brand hover:bg-mist transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

  return (
    <footer className="mt-14 bg-white border-t border-white/60">
      {/* Top: grid */}
      <div className="container-tight py-12 grid gap-10 md:grid-cols-4">
        {/* Brand + blurb + socials */}
        <div className="space-y-4">
          <a href="/" className="text-2xl font-semibold text-ink">
            Dami Optica
          </a>
          <p className="text-sm text-muted">
            Modern, timeless eyewear and professional eye care. See better, feel
            better — every day.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <a aria-label="Facebook" href="#" className={socialBtn}>
              <Facebook size={18} />
            </a>
            <a aria-label="Instagram" href="#" className={socialBtn}>
              <Instagram size={18} />
            </a>
            <a aria-label="Twitter/X" href="#" className={socialBtn}>
              <Twitter size={18} />
            </a>
            <a aria-label="YouTube" href="#" className={socialBtn}>
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">Shop</h3>
          <ul className="space-y-2">
            <li>
              <a href="/category/mens-glasses" className={linkBase}>
                Men’s Glasses
              </a>
            </li>
            <li>
              <a href="/category/womens-glasses" className={linkBase}>
                Women’s Glasses
              </a>
            </li>
            <li>
              <a href="/category/kids-glasses" className={linkBase}>
                Kids’ Glasses
              </a>
            </li>
            <li>
              <a href="/category/sunglasses" className={linkBase}>
                Sunglasses
              </a>
            </li>
            <li>
              <a href="/category/blue-light" className={linkBase}>
                Blue-Light Glasses
              </a>
            </li>
            <li>
              <a href="/category/contact-lenses" className={linkBase}>
                Contact Lenses
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">Customer Care</h3>
          <ul className="space-y-2">
            <li>
              <a href="/help/shipping" className={linkBase}>
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="/help/returns" className={linkBase}>
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="/help/warranty" className={linkBase}>
                Warranty
              </a>
            </li>
            <li>
              <a href="/help/faq" className={linkBase}>
                FAQs
              </a>
            </li>
            <li>
              <a href="/book/exam" className={linkBase}>
                Book Eye Exam
              </a>
            </li>
            <li>
              <a href="/contact" className={linkBase}>
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-4">
            Stay in the loop
          </h3>
          <p className="text-sm text-muted mb-3">
            Get new drops, offers, and eye-care tips. No spam — unsubscribe
            anytime.
          </p>
          <form onSubmit={onSubscribe} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-md border border-brand/25 bg-mist text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <button type="submit" className="btn px-4 py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Middle: contact bar */}
      <div className="border-t border-white/60 bg-mist/50">
        <div className="container-tight py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">Call us</p>
              <a
                href="tel:+15551234567"
                className="text-muted hover:text-brand"
              >
                (555) 123-4567
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">Email</p>
              <a
                href="mailto:hello@damioptica.shop"
                className="text-muted hover:text-brand"
              >
                hello@ damioptica.shop
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">Visit</p>
              <p className="text-muted">123 Optica Ave, Suite 2, Vision City</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-brand mt-0.5" />
            <div>
              <p className="font-medium text-ink">Hours</p>
              <p className="text-muted">Mon–Sat 9:00–18:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: legal */}
      <div className="border-t border-white/60">
        <div className="container-tight py-6 text-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-muted">© {year} Eyese. All rights reserved.</p>
          <nav className="flex flex-wrap gap-4">
            <a href="/privacy" className={linkBase}>
              Privacy
            </a>
            <a href="/terms" className={linkBase}>
              Terms
            </a>
            <a href="/cookies" className={linkBase}>
              Cookies
            </a>
            <a href="/accessibility" className={linkBase}>
              Accessibility
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
