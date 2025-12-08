export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "hoodies" | "tshirts" | "polos";
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNew?: boolean;
  isLimited?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: "hoodie-essential-black",
    name: "Essential Hoodie",
    description: "Premium heavyweight cotton hoodie with signature SAWA embroidery. Oversized fit for ultimate comfort.",
    price: 149,
    category: "hoodies",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Obsidian", hex: "#1a1a1a" },
      { name: "Bone", hex: "#f5f5dc" },
      { name: "Sage", hex: "#8a9a7b" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestSeller: true,
  },
  {
    id: "hoodie-gold-edition",
    name: "Gold Edition Hoodie",
    description: "Limited edition hoodie with gold metallic accents and premium finish. A statement piece.",
    price: 249,
    category: "hoodies",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Black Gold", hex: "#1a1a1a" },
      { name: "Cream Gold", hex: "#f5f5dc" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isLimited: true,
    isNew: true,
  },
  {
    id: "tshirt-classic-white",
    name: "Classic Tee",
    description: "Essential everyday tee crafted from 100% organic cotton. Clean lines, perfect fit.",
    price: 69,
    category: "tshirts",
    images: ["/placeholder.svg"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Charcoal", hex: "#36454f" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    isBestSeller: true,
  },
  {
    id: "tshirt-oversized-graphic",
    name: "Oversized Graphic Tee",
    description: "Relaxed fit tee with exclusive SAWA artwork. Bold expression meets comfort.",
    price: 89,
    category: "tshirts",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Vintage Black", hex: "#2d2d2d" },
      { name: "Washed Grey", hex: "#808080" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: "tshirt-longsleeve",
    name: "Long Sleeve Essential",
    description: "Elevated long sleeve tee with subtle branding. Perfect layering piece.",
    price: 79,
    category: "tshirts",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Off White", hex: "#faf0e6" },
      { name: "Deep Navy", hex: "#0a1128" },
      { name: "Forest", hex: "#228b22" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "polo-signature",
    name: "Signature Polo",
    description: "Refined polo with premium piqué fabric. Elevated casual wear.",
    price: 119,
    category: "polos",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Navy", hex: "#0a1128" },
      { name: "White", hex: "#ffffff" },
      { name: "Olive", hex: "#556b2f" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isBestSeller: true,
  },
  {
    id: "polo-premium-knit",
    name: "Premium Knit Polo",
    description: "Luxury knit polo with textured fabric and gold-tipped collar. Statement elegance.",
    price: 159,
    category: "polos",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Cream", hex: "#fffdd0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    isLimited: true,
  },
  {
    id: "hoodie-tech-fleece",
    name: "Tech Fleece Hoodie",
    description: "Performance-meets-style hoodie with innovative fabric technology. Breathable warmth.",
    price: 179,
    category: "hoodies",
    images: ["/placeholder.svg"],
    colors: [
      { name: "Stone", hex: "#928e85" },
      { name: "Carbon", hex: "#2d2d2d" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
  },
];

export const getProductsByCategory = (category: Product["category"]) =>
  products.filter((p) => p.category === category);

export const getNewArrivals = () => products.filter((p) => p.isNew);

export const getBestSellers = () => products.filter((p) => p.isBestSeller);

export const getLimitedEdition = () => products.filter((p) => p.isLimited);
