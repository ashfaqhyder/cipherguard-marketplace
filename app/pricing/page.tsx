import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { products, formatPrice } from "@/lib/products";

export default function PricingPage() {
  const plans = [products[0], products[1], products[3]];
  return <main className="page-main"><div className="container">
    <div className="page-heading"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Compare plans</span></div><div className="eyebrow">STRAIGHTFORWARD PRICING</div><h1>Choose what fits.</h1><p>Compare the demo plans side by side. Annual prices are illustrative and don't represent real software offers.</p></div>
    <div className="pricing-grid">{plans.map((product, index) => <article className={`price-card ${index === 1 ? "popular" : ""}`} key={product.id}>
      {index === 1 && <span className="product-featured" style={{position:"static",display:"inline-flex"}}>RECOMMENDED</span>}
      <div className="eyebrow" style={{marginTop:10}}>{product.category}</div><h3>{product.name}</h3><p>{product.tagline}</p>
      <div className="price">{formatPrice(product.price)} <small>/ year</small></div><div style={{color:"#87978e",fontSize:11}}>{product.devices}</div>
      <ul>{product.features.map((feature) => <li key={feature}><Check size={14}/>{feature}</li>)}</ul>
      <Link href={`/products/${product.slug}`} className={`button ${index === 1 ? "button-primary" : "button-outline"} button-full`}>View plan <ArrowRight size={14}/></Link>
    </article>)}</div>
    <div className="notice" style={{marginTop:25}}>Prices are sample INR amounts for UI demonstration. No real subscription or software license is created.</div>
  </div></main>;
}
