"use client";

import Link from "next/link";
import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) });
      if (!response.ok) throw new Error("Sign-in failed. Check the configured demo admin password.");
      window.location.href = "/admin";
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return <main className="page-main"><div className="container" style={{paddingTop:75,paddingBottom:100}}>
    <div className="admin-login form-card"><div className="success-mark" style={{width:52,height:52}}><LockKeyhole size={23}/></div><div className="eyebrow">RESTRICTED AREA</div><h1 style={{font:"600 34px Manrope,sans-serif",letterSpacing:"-.05em",margin:"10px 0"}}>Security lab access.</h1><p style={{color:"#9baaa2",fontSize:12,lineHeight:1.8}}>Sign in to configure controlled response scenarios for Valorynn testing. This area is not part of the public shopping flow.</p>
      <form onSubmit={submit} style={{marginTop:25}}><div className="field"><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required maxLength={200}/></div>{error && <p role="alert" style={{color:"#ff9f8c",fontSize:12}}>{error}</p>}<button className="button button-primary button-full" disabled={busy}>{busy ? "Signing in…" : "Unlock security lab"}</button></form>
      <div className="notice" style={{marginTop:18}}>Configure <code>DEMO_ADMIN_PASSWORD</code>, <code>DEMO_SESSION_SECRET</code>, and <code>DEMO_SCENARIO_SECRET</code> in your deployment environment before production use.</div>
      <Link href="/" className="text-link" style={{marginTop:20}}><ShieldCheck size={14}/> Return to storefront</Link>
    </div>
  </div></main>;
}
