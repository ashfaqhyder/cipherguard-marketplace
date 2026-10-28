import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { AddToCartButton } from "./purchase-actions";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return (
    <main className="page-main"><div className="container" style={{paddingTop:35,paddingBottom:85}}>
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{product.name}</span></div>
      <div className="detail-grid">
        <div className={`product-art detail-art art-${product.accent}`}><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-glow"/><div className="art-shield"><ShieldCheck size={100} strokeWidth={.8}/></div><span className="art-kicker">CIPHERGUARD / {product.id.toUpperCase()}</span></div>
        <div className="detail-content"><div className="eyebrow">{product.category}</div><h1>{product.name}</h1><p style={{fontSize:16,color:"#c1cec5"}}>{product.tagline}</p><p>{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)} <small>/ {product.period} · {product.devices}</small></div>
          <div className="detail-features"><div className="eyebrow">WHAT'S INCLUDED</div><ul className="feature-list">{product.features.map((feature) => <li key={feature}><Check size={16}/>{feature}</li>)}</ul></div>
          <AddToCartButton productId={product.id}/>
          <p style={{fontSize:11,color:"#829187",lineHeight:1.7,marginTop:17}}>This is a simulated product listing. Checkout is for demonstration only and does not charge a payment method.</p>
          <p style={{marginTop:20}}><Link href="/products" className="text-link"><ArrowLeft size={14}/> Back to products</Link></p>
        </div>
      </div>
    </div></main>
  );
}
