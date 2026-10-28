"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [complete, setComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const cartItems = items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const total = cartItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!cartItems.length || !name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setOrderId(`CG-DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setComplete(true);
    clear();
  }

  if (complete) return <main className="page-main"><div className="container" style={{paddingTop:70,paddingBottom:100}}><div className="form-card" style={{maxWidth:620,margin:"0 auto"}}>
    <div className="success-mark"><Check size={30}/></div><div className="eyebrow">DEMO ORDER COMPLETE</div><h1 style={{font:"600 38px Manrope,sans-serif",letterSpacing:"-.05em"}}>You're all set, {name.split(" ")[0]}.</h1><p style={{color:"#9baaa2",lineHeight:1.8,fontSize:13}}>This simulated checkout has completed successfully. No payment was processed and no real subscription or license was created.</p><div className="order-code">ORDER REFERENCE · {orderId}</div><div className="notice">A demo confirmation would be shown here. This app does not send email or store personal details.</div><Link href="/products" className="button button-primary" style={{marginTop:22}}>Back to marketplace</Link></div></div></main>;

  if (!cartItems.length) return <main className="page-main"><div className="container"><div className="page-heading"><div className="eyebrow">SIMULATED CHECKOUT</div><h1>No items to check out.</h1><p>Add a demo product to your cart first.</p><Link href="/products" className="button button-primary">Browse products</Link></div></div></main>;

  return <main className="page-main"><div className="container">
    <div className="page-heading"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span><span>Checkout</span></div><div className="eyebrow">SAFE DEMO FLOW</div><h1>Complete your demo order.</h1><p>This checkout is simulated. Use fictional details only.</p></div>
    <div className="checkout-layout"><form className="form-card" onSubmit={submit}><h2>Contact details</h2><div className="notice" style={{marginBottom:22}}>Do not enter real payment details. This demo doesn't integrate a payment processor.</div><div className="field"><label htmlFor="full-name">Full name</label><input id="full-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Demo Customer" required maxLength={100}/></div><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="demo@example.com" required maxLength={254}/></div><button className="button button-primary button-full" type="submit"><ShieldCheck size={16}/> Place simulated order · {formatPrice(total)}</button><p style={{fontSize:10,color:"#829187",lineHeight:1.7,marginTop:14}}>Your name and email remain in this browser's current session and are not sent to a payment provider or saved to a database.</p><Link href="/cart" className="text-link" style={{marginTop:15}}><ArrowLeft size={14}/> Return to cart</Link></form>
      <aside className="summary-card"><h3>Order summary</h3>{cartItems.map((item)=><div className="summary-line" key={item.product!.id}><span>{item.product!.name} × {item.quantity}</span><span>{formatPrice(item.product!.price*item.quantity)}</span></div>)}<div className="summary-line"><span>Tax</span><span>₹0</span></div><div className="summary-line summary-total"><span>Total</span><span>{formatPrice(total)}</span></div></aside></div>
  </div></main>;
}
