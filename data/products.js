// data/products.js
const products = [
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
];

export default products;
