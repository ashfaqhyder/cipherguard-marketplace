"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ productId }: { productId: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <button className="button button-primary" onClick={() => { add(productId); setAdded(true); }}>
    {added ? <><Check size={16}/> Added to cart</> : <><ShoppingBag size={16}/> Add to demo cart</>}
  </button>;
}
