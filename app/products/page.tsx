"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export default function ProductsPage() {
  const [category, setCategory] = useState("All products");
  const categories = ["All products", ...Array.from(new Set(products.map((p) => p.category)))];
  const filtered = useMemo(() => category === "All products" ? products : products.filter((p) => p.category === category), [category]);
  return (
    <main className="page-main"><div className="container">
      <div className="page-heading"><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Products</span></div><div className="eyebrow">THE CIPHERGUARD LINEUP</div><h1>Find your kind of protection.</h1><p>Explore our fictional security product range. Compare coverage, features, and plan prices to find the right fit for your demo shopping journey.</p></div>
      <div className="filters">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`filter-pill ${category === item ? "active" : ""}`}>{item}</button>)}</div>
      <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      <div className="notice" style={{marginTop:28}}>All listings are simulated product concepts. No software download, activation key, or real protection service is included.</div>
    </div></main>
  );
}
