import Link from "next/link";
import { ArrowUpRight, Check, Shield, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
      <div className={`product-art art-${product.accent}`}>
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-glow" />
        <div className="art-shield"><ShieldCheck size={54} strokeWidth={1.15} /></div>
        <span className="art-kicker">CG / {product.id.toUpperCase()}</span>
        {product.featured && <span className="product-featured"><Sparkles size={12} /> MOST POPULAR</span>}
      </div>
      <div className="product-card-body">
        <div className="eyebrow">{product.category}</div>
        <h3>{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>
        <ul className="feature-list">
          {product.features.slice(0, compact ? 2 : 3).map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}
        </ul>
        <div className="product-card-bottom">
          <div><strong>{formatPrice(product.price)}</strong><span> / {product.period}</span></div>
          <Link href={`/products/${product.slug}`} className="circle-link" aria-label={`View ${product.name}`}><ArrowUpRight size={19} /></Link>
        </div>
      </div>
    </article>
  );
}
