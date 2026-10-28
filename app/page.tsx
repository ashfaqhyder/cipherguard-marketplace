import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Fingerprint, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">DIGITAL PROTECTION, REIMAGINED</div>
            <h1>More peace of mind.<br /><em>Less digital noise.</em></h1>
            <p className="hero-copy">Thoughtful security products for the way you live and work online. Explore the next generation of digital protection — without the complexity.</p>
            <div className="hero-actions">
              <Link href="/products" className="button button-primary">Explore protection <ArrowRight size={16} /></Link>
              <Link href="/pricing" className="button button-outline">Compare plans <ArrowUpRight size={15} /></Link>
            </div>
            <div className="trust-row">
              <span className="trust-item"><CheckCircle2 size={14} /> Clear plan options</span>
              <span className="trust-item"><LockKeyhole size={14} /> Privacy-first design</span>
              <span className="trust-item"><Sparkles size={14} /> Simple by design</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Abstract cybersecurity shield illustration">
            <div className="hero-rings"><div className="ring" /><div className="ring ring-two" /><div className="ring ring-three" />
              <div className="hero-core"><ShieldCheck /></div>
              <span className="visual-label label-top">PROTECTION / 001</span><span className="visual-label label-right">SYSTEM HEALTH: DEMO</span><span className="visual-label label-bottom">PRIVACY BY DESIGN</span>
              <div className="visual-card vcard-top"><strong><CheckCircle2 size={14} /> Protection overview</strong><span>Designed around clarity</span></div>
              <div className="visual-card vcard-bottom"><strong><Fingerprint size={14} /> Your digital space</strong><span>Security that feels simple</span></div>
            </div>
          </div>
        </div>
      </section>
      <div className="stats-strip"><div className="container stats-grid">
        <div className="stat"><strong>01—04</strong><span>Curated product concepts</span></div>
        <div className="stat"><strong>One view</strong><span>Compare plans clearly</span></div>
        <div className="stat"><strong>Demo-first</strong><span>Safe simulated checkout</span></div>
        <div className="stat"><strong>Built to test</strong><span>Valorynn security scenarios</span></div>
      </div></div>
      <section className="section"><div className="container">
        <div className="section-heading"><div><div className="eyebrow">THE PRODUCT LINEUP</div><h2>Protection for your<br />kind of digital life.</h2></div><div><p>Explore fictional product concepts across personal, family, privacy, and small-business security.</p><Link href="/products" className="text-link" style={{marginTop:17}}>View all products <ArrowRight size={15} /></Link></div></div>
        <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div></section>
      <section className="section" style={{paddingTop:0}}><div className="container"><div className="band">
        <div><div className="eyebrow">CLEAR CHOICES. CONFIDENT CLICKS.</div><h2>Find the right level of protection.</h2><p>Compare device limits, included features, and annual plan prices before choosing a product. This storefront uses simulated product data and checkout only.</p></div>
        <Link href="/pricing" className="button button-primary">Compare plans <ArrowRight size={15} /></Link>
      </div></div></section>
      <section className="section" style={{paddingTop:0}}><div className="container">
        <div className="section-heading"><div><div className="eyebrow">BUILT FOR TRANSPARENCY</div><h2>Security should feel<br />understandable.</h2></div></div>
        <div className="about-grid">
          <div className="about-card"><ShieldCheck size={24}/><h3>Protection, made clear</h3><p>Product pages explain the plan concept, device coverage, and included features in plain language.</p></div>
          <div className="about-card"><LockKeyhole size={24}/><h3>Privacy by default</h3><p>This demo doesn't ask for payment details or store real customer information.</p></div>
          <div className="about-card"><Fingerprint size={24}/><h3>Testable by design</h3><p>An administrator-only lab can generate controlled response scenarios for Valorynn to inspect.</p></div>
        </div>
      </div></section>
      <section className="section" style={{paddingTop:0}}><div className="container"><div className="notice"><strong>Demo notice:</strong> CipherGuard is a fictional brand. Product descriptions, pricing, checkout, and security status are demonstrations only. No real antivirus software is provided or sold.</div></div></section>
    </main>
  );
}
