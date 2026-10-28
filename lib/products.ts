export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  period: string;
  devices: string;
  accent: string;
  featured?: boolean;
  features: string[];
};

export const products: Product[] = [
  {
    id: "cg-one",
    slug: "cipherguard-one",
    name: "CipherGuard One",
    category: "Personal protection",
    tagline: "Quiet protection. Everyday confidence.",
    description: "A balanced security suite for everyday browsing, downloads, and digital life. This demo listing represents a software product; no real malware engine is included.",
    price: 1499,
    period: "year",
    devices: "1 device",
    accent: "lime",
    featured: true,
    features: ["Real-time protection (demo listing)", "Web and download safety", "Privacy health check", "Product updates"]
  },
  {
    id: "cg-family",
    slug: "cipherguard-family",
    name: "CipherGuard Family",
    category: "Family security",
    tagline: "One plan for the whole household.",
    description: "A family-focused plan concept with a simple overview of protection across multiple devices.",
    price: 2799,
    period: "year",
    devices: "5 devices",
    accent: "blue",
    featured: true,
    features: ["Coverage for up to 5 devices", "Family security overview", "Web safety tools (demo listing)", "Priority help centre"]
  },
  {
    id: "cg-privacy",
    slug: "cipherguard-private",
    name: "CipherGuard Private",
    category: "Privacy",
    tagline: "A little more privacy, by design.",
    description: "A privacy bundle concept for people who want to understand the tools that can accompany a security suite.",
    price: 999,
    period: "year",
    devices: "3 devices",
    accent: "violet",
    features: ["Privacy checklist", "Secure browsing guidance", "Tracker awareness", "3-device plan"]
  },
  {
    id: "cg-business",
    slug: "cipherguard-business",
    name: "CipherGuard Business",
    category: "Small business",
    tagline: "A clearer security baseline for small teams.",
    description: "A small-business endpoint protection product concept with a centralised overview and policy checklist.",
    price: 6499,
    period: "year",
    devices: "10 endpoints",
    accent: "orange",
    features: ["10 endpoint seats", "Central policy overview", "Security posture checklist", "Team-ready reporting"]
  }
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
