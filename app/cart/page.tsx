"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, remove } = useCart();
  const cartItems = items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((item) => item.product);
  const total = cartItems.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);

  return <main className="page-main"><div className="container">
    <div className="page-heading"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Cart</span></div><div className="eyebrow">YOUR SELECTION</div><h1>Your demo cart.</h1><p>Review your selected products before continuing to the simulated checkout.</p></div>
    {cartItems.length === 0 ? <div className="empty-state"><ShoppingBag size={34}/><h2>Your cart is waiting.</h2><p>Explore the product range and add a plan to see how the demo checkout works.</p><Link href="/products" className="button button-primary" style={{marginTop:10}}>Explore products <ArrowRight size={15}/></Link></div> :
      <div className="cart-layout"><div className="cart-list"><div className="eyebrow">CART ITEMS · {cartItems.reduce((s,i)=>s+i.quantity,0)}</div>
        {cartItems.map(({product,quantity}) => <div className="cart-row" key={product!.id}><div><h3>{product!.name}</h3><p>{product!.devices} · Annual demo plan · Qty {quantity}</p></div><div className="cart-price">{formatPrice(product!.price * quantity)}</div><button className="remove-btn" onClick={() => remove(product!.id)} aria-label={`Remove ${product!.name}`}><Trash2 size={14}/></button></div>)}
      </div><aside className="summary-card"><h3>Order summary</h3><div className="summary-line"><span>Subtotal</span><span>{formatPrice(total)}</span></div><div className="summary-line"><span>Tax</span><span>₹0</span></div><div className="summary-line"><span>Checkout type</span><span>Simulation</span></div><div className="summary-line summary-total"><span>Total</span><span>{formatPrice(total)}</span></div><Link href="/checkout" className="button button-primary button-full">Continue to checkout <ArrowRight size={15}/></Link><p style={{fontSize:10,color:"#819087",lineHeight:1.7,marginTop:15}}>No payment details are collected. Checkout is a demo flow.</p></aside></div>}
  </div></main>;
}
