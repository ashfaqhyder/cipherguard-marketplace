import Link from "next/link";
import { Eye, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return <main className="page-main"><div className="container">
    <div className="page-heading"><div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Our approach</span></div><div className="eyebrow">SECURITY, SIMPLIFIED</div><h1>Designed to make security clearer.</h1><p>CipherGuard is a fictional cybersecurity marketplace created to demonstrate a realistic product journey and provide a controlled web target for defensive security testing.</p></div>
    <div className="about-grid" style={{paddingBottom:80}}>
      <div className="about-card"><ShieldCheck size={26}/><h3>Product clarity</h3><p>Sample plans make product comparison and checkout flows easy to demonstrate without selling or distributing actual security software.</p></div>
      <div className="about-card"><LockKeyhole size={26}/><h3>Safe by default</h3><p>Admin functions are protected by a signed session cookie. Demo scenario tokens are signed and time-limited; the security lab only changes predefined response behaviors.</p></div>
      <div className="about-card"><Eye size={26}/><h3>Testable responses</h3><p>Controlled target URLs return the selected headers and safe diagnostic markers so a scanner can compare the response across scenarios.</p></div>
    </div>
    <div className="notice" style={{marginBottom:70}}>This site is not affiliated with any real cybersecurity vendor. It does not include an antivirus engine, scan files for malware, sell genuine licenses, or accept payments.</div>
  </div></main>;
}
