import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: { default: "CipherGuard — Security, simplified.", template: "%s | CipherGuard" },
  description: "Explore a premium cybersecurity software marketplace demo. Products, plans, and checkout are simulated for demonstration purposes.",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
        <CartProvider>
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="container">
              <div className="footer-top">
                <div>
                  <a href="/" className="brand"><span className="brand-mark">◇</span><span>CIPHER<span className="brand-light">GUARD</span><small>SECURITY, SIMPLIFIED</small></span></a>
                  <p className="footer-note">A fictional cybersecurity storefront built as a demonstration target for security testing and education.</p>
                  <div className="valorynn-credit"><span className="credit-label">DEVELOPER | Test app for</span><a className="developer-brand" href="https://ashfaqhydercs.vercel.app" target="_blank" rel="noreferrer" aria-label="Developer profile"><img src="/valorynn/developer.png" alt="Developer monogram"/></a><span className="credit-divider" aria-hidden="true"/><a className="valorynn-brand" href="https://github.com/ashfaqhyder/Valorynn" target="_blank" rel="noreferrer" aria-label="Valorynn project"><img className="valorynn-symbol" src="/valorynn/logo.png" alt="Valorynn shield logo"/><img className="valorynn-wordmark" src="/valorynn/wordmark.png" alt="Valorynn"/></a></div>
                </div>
                <div className="footer-links">
                  <a href="/products">Products</a><a href="/pricing">Compare plans</a><a href="/about">Our approach</a><a href="/cart">Cart</a><a href="/admin">Security lab</a>
                </div>
              </div>
              <div className="footer-bottom"><span>© 2026 CipherGuard Demo. Fictional brand.</span><span>No real antivirus engine or software license is sold on this demo.</span></div>
            </div>
          </footer>
        </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
