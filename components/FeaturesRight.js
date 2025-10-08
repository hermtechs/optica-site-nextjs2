export default function FeaturesRight() {
  const feats = [
    { title: "HINGE", desc: "Precision hinge with durability." },
    { title: "SILICONE PADS", desc: "Comfortable nose support." },
    { title: "COLOR", desc: "Premium lacquer finish." },
    { title: "INDIVIDUAL TEMPLES", desc: "Secure, ergonomic fit." },
  ];

  return (
    <section className="container-tight py-12 grid lg:grid-cols-2 gap-10 items-center">
      <div className="order-2 lg:order-1 grid grid-cols-2 gap-6">
        {feats.map((f) => (
          <div key={f.title} className="card p-5">
            <p className="text-xs text-yellow-500 font-semibold">{f.title}</p>
            <p className="text-sm font-semibold">Unique and elegant style</p>
            <p className="text-sm text-muted mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
          <img
            src="/hero-unique.jpg"
            alt="Unique Design"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <span className="bg-yellow-400 text-black font-extrabold text-3xl px-3 py-1 rounded">
              UNIQUE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
