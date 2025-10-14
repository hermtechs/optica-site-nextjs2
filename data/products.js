// data/products.js
const products = [
  // --- Originals ---
  {
    slug: "round-golden-glass-np20",
    name: "Round Golden – Premium",
    price: 123,
    image: "/glasses/round-gold.jpg",
    category: "Eyeglasses",
    shortDesc:
      "Ultralight alloy frame with silicone pads and UV400 coated lenses. Great everyday pair for work and weekends.",
    longDesc:
      "Balanced bridge fit, anti-glare treatment and scratch-resistant finish. Comfortable temples designed for long wear.",
    gallery: [
      "/glasses/round-gold.jpg",
      "/glasses/round-gold-2.jpg",
      "/glasses/round-gold-3.jpg",
    ],
    colors: ["#111827", "#6b7280", "#d1d5db", "#b45309"],
    features: [
      { title: "Hinge", desc: "Smooth stainless hinge for durability." },
      { title: "Silicone pads", desc: "Soft contact, anti-slip comfort." },
      { title: "Coating", desc: "Anti-glare, scratch-resistant lenses." },
      { title: "Fit", desc: "Balanced temples for all-day wear." },
    ],
  },
  {
    slug: "blue-light-classic",
    name: "Blue-Light Classic",
    price: 129,
    image: "/glasses/blue-classic.jpg",
    category: "Blue-Light Glasses",
    shortDesc:
      "Low color-shift blue-light filter that reduces digital eye strain without tinting your view.",
    longDesc:
      "Anti-reflective coating cuts reflections; ideal for office, gaming and late-night sessions. Lightweight, comfy fit.",
    gallery: ["/glasses/blue-classic.jpg"],
    colors: ["#111827", "#374151", "#f3f4f6"],
    features: [
      { title: "Filter", desc: "Blocks high-energy blue light." },
      { title: "AR coating", desc: "Up to 90% reflection reduction." },
    ],
  },
  {
    slug: "retro-block",
    name: "Retro Block – Bold",
    price: 99,
    image: "/glasses/retro-block.jpg",
    category: "Sunglasses",
    shortDesc:
      "Statement acetate silhouette with modern hinges; crisp lenses for a clean, sharp look.",
    longDesc:
      "High-gloss finish with replaceable lenses. Spring hinges and soft temple tips keep it comfy longer.",
    gallery: ["/glasses/retro-block.jpg"],
    colors: ["#111827", "#a3a3a3"],
    features: [
      { title: "Frame", desc: "Durable acetate construction." },
      { title: "Hinges", desc: "Modern spring hinges for flex." },
    ],
  },

  // --- Duplicates / Variants (reuse same images & structure) ---
  {
    slug: "round-golden-matte",
    name: "Round Golden – Matte",
    price: 119,
    image: "/glasses/round-gold.jpg",
    category: "Eyeglasses",
    shortDesc:
      "Matte finish on an ultralight alloy frame with silicone pads and UV400 lenses.",
    longDesc:
      "All-day comfort with balanced temples and anti-glare treatment; scratch-resistant coating included.",
    gallery: [
      "/glasses/round-gold.jpg",
      "/glasses/round-gold-2.jpg",
      "/glasses/round-gold-3.jpg",
    ],
    colors: ["#6b7280", "#d1d5db", "#b45309"],
    features: [
      { title: "Finish", desc: "Low-sheen matte gold finish." },
      { title: "Hinge", desc: "Stainless steel for durability." },
      { title: "Pads", desc: "Soft silicone, anti-slip." },
      { title: "Coating", desc: "Anti-glare, scratch-resistant." },
    ],
  },
  {
    slug: "round-golden-slim",
    name: "Round Golden – Slim",
    price: 129,
    image: "/glasses/round-gold.jpg",
    category: "Eyeglasses",
    shortDesc:
      "Slim-profile round frame with classic gold tone and UV400 lens coating.",
    longDesc:
      "Featherweight comfort, balanced bridge, and durable stainless hinges for daily wear.",
    gallery: [
      "/glasses/round-gold.jpg",
      "/glasses/round-gold-2.jpg",
      "/glasses/round-gold-3.jpg",
    ],
    colors: ["#d1d5db", "#111827"],
    features: [
      { title: "Profile", desc: "Slim silhouette reduces weight." },
      { title: "Pads", desc: "Silicone nose pads for grip." },
      { title: "Hinges", desc: "Smooth open/close action." },
      { title: "Protection", desc: "UV400 coated lenses." },
    ],
  },
  {
    slug: "blue-light-classic-pro",
    name: "Blue-Light Classic Pro",
    price: 139,
    image: "/glasses/blue-classic.jpg",
    category: "Blue-Light Glasses",
    shortDesc:
      "Enhanced blue-light filter with anti-smudge and anti-static AR layers.",
    longDesc:
      "Great for long desk sessions and gaming; reduces glare and micro dust sticking to lenses.",
    gallery: ["/glasses/blue-classic.jpg"],
    colors: ["#111827", "#374151", "#f3f4f6"],
    features: [
      { title: "Filter+", desc: "Higher blue-light attenuation." },
      { title: "AR layers", desc: "Anti-smudge, anti-static stack." },
    ],
  },
  {
    slug: "blue-light-classic-lite",
    name: "Blue-Light Classic Lite",
    price: 109,
    image: "/glasses/blue-classic.jpg",
    category: "Blue-Light Glasses",
    shortDesc:
      "Lightweight take on our classic blue-light blocker for daily screen use.",
    longDesc:
      "Low color shift, comfortable fit, and easy maintenance coating for clear vision.",
    gallery: ["/glasses/blue-classic.jpg"],
    colors: ["#f3f4f6", "#374151"],
    features: [
      { title: "Weight", desc: "Ultralight frame build." },
      { title: "Comfort", desc: "Flexible temples for long wear." },
    ],
  },
  {
    slug: "retro-block-tortoise",
    name: "Retro Block – Tortoise",
    price: 109,
    image: "/glasses/retro-block.jpg",
    category: "Sunglasses",
    shortDesc:
      "Bold retro shape with a classic tortoise vibe; crisp lenses for sunny days.",
    longDesc:
      "Spring hinges and soft tips; replaceable lenses let you keep the frame you love.",
    gallery: ["/glasses/retro-block.jpg"],
    colors: ["#111827", "#a3a3a3"],
    features: [
      { title: "Style", desc: "Vintage tortoise aesthetic." },
      { title: "Comfort", desc: "Spring hinges for flex." },
    ],
  },
  {
    slug: "retro-block-smoke",
    name: "Retro Block – Smoke",
    price: 99,
    image: "/glasses/retro-block.jpg",
    category: "Sunglasses",
    shortDesc:
      "Smoke-tinted lenses in a statement acetate silhouette; sharp and modern.",
    longDesc:
      "Durable construction with comfy temple tips and replaceable lenses.",
    gallery: ["/glasses/retro-block.jpg"],
    colors: ["#a3a3a3", "#111827"],
    features: [
      { title: "Lens", desc: "Smoke tint, UV protection." },
      { title: "Frame", desc: "High-gloss acetate." },
    ],
  },
  {
    slug: "round-golden-classic",
    name: "Round Golden – Classic",
    price: 115,
    image: "/glasses/round-gold.jpg",
    category: "Eyeglasses",
    shortDesc:
      "Classic round profile in polished gold with anti-glare lens coating.",
    longDesc:
      "Balanced fit and silicone pads keep it comfortable through the day.",
    gallery: [
      "/glasses/round-gold.jpg",
      "/glasses/round-gold-2.jpg",
      "/glasses/round-gold-3.jpg",
    ],
    colors: ["#b45309", "#111827"],
    features: [
      { title: "Finish", desc: "Polished golden tone." },
      { title: "Pads", desc: "Soft silicone nose pads." },
      { title: "Coating", desc: "Anti-glare, scratch-resistant." },
    ],
  },
  {
    slug: "blue-light-classic-amber",
    name: "Blue-Light Classic – Amber",
    price: 119,
    image: "/glasses/blue-classic.jpg",
    category: "Blue-Light Glasses",
    shortDesc:
      "Subtle amber tint to further cut harsh screen glare and improve contrast.",
    longDesc:
      "Perfect for late-night work and reading; keeps color shift minimal.",
    gallery: ["/glasses/blue-classic.jpg"],
    colors: ["#374151", "#f3f4f6"],
    features: [
      { title: "Tint", desc: "Subtle amber for contrast." },
      { title: "AR", desc: "Reduces reflections effectively." },
    ],
  },
  {
    slug: "retro-block-mirror",
    name: "Retro Block – Mirror",
    price: 119,
    image: "/glasses/retro-block.jpg",
    category: "Sunglasses",
    shortDesc:
      "Mirror-finish lenses on a bold retro frame; bright-light specialist.",
    longDesc:
      "Spring hinges, soft tips, and replaceable lenses keep these in rotation for years.",
    gallery: ["/glasses/retro-block.jpg"],
    colors: ["#111827", "#a3a3a3"],
    features: [
      { title: "Lens", desc: "Mirror finish for strong sun." },
      { title: "Hinges", desc: "Spring-loaded for comfort." },
    ],
  },
  {
    slug: "round-golden-luxe",
    name: "Round Golden – Luxe",
    price: 139,
    image: "/glasses/round-gold.jpg",
    category: "Eyeglasses",
    shortDesc:
      "Premium detailing, polished edges, and UV400 lens coating in a luxe build.",
    longDesc:
      "Anti-glare, scratch-resistant, and balanced for long sessions—work or weekend.",
    gallery: [
      "/glasses/round-gold.jpg",
      "/glasses/round-gold-2.jpg",
      "/glasses/round-gold-3.jpg",
    ],
    colors: ["#b45309", "#d1d5db"],
    features: [
      { title: "Detail", desc: "Polished edges & finish." },
      { title: "Comfort", desc: "Balanced bridge & temples." },
    ],
  },
  {
    slug: "blue-light-classic-slim",
    name: "Blue-Light Classic – Slim",
    price: 105,
    image: "/glasses/blue-classic.jpg",
    category: "Blue-Light Glasses",
    shortDesc:
      "Slimmed-down frame for lighter feel; same blue-light protection you love.",
    longDesc:
      "Ideal for extended screen time; AR coating keeps reflections in check.",
    gallery: ["/glasses/blue-classic.jpg"],
    colors: ["#111827", "#f3f4f6"],
    features: [
      { title: "Profile", desc: "Thinner temples reduce weight." },
      { title: "Protection", desc: "Blue-light filter + AR coat." },
    ],
  },
];

export default products;
