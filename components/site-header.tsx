"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useThemeMode } from "@/components/theme-provider";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/pricing", label: "Compare plans" },
  { href: "/about", label: "Our approach" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useThemeMode();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="CipherGuard home">
          <span className="brand-mark"><ShieldCheck size={21} strokeWidth={2.2} /></span>
          <span>CIPHER<span className="brand-light">GUARD</span><small>SECURITY, SIMPLIFIED</small></span>
        </Link>
        <nav className={`main-nav ${open ? "nav-open" : ""}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={pathname === item.href ? "nav-link active" : "nav-link"}>{item.label}</Link>
          ))}
          <Link href="/cart" onClick={() => setOpen(false)} className="mobile-cart nav-link">Cart ({count})</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}</button>
          <Link href="/cart" className="cart-link" aria-label={`Shopping cart with ${count} items`}>
            <ShoppingBag size={18} /><span>Cart</span><b>{count}</b>
          </Link>
          <Link href="/products" className="button button-small button-dark header-cta">Explore protection <span>↗</span></Link>
        </div>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
