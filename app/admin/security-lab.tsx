"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, LogOut, ShieldCheck, AlertTriangle, Activity, FileSearch } from "lucide-react";

type Config = { csp:boolean; nosniff:boolean; referrerPolicy:boolean; corsWildcard:boolean; debugExposure:boolean; permissionsPolicy:boolean; frameOptions:boolean; cookieFlags:boolean; cachePolicy:boolean; serverBanner:boolean; scenarioName:string };
const defaults: Config = { csp:false, nosniff:false, referrerPolicy:false, corsWildcard:true, debugExposure:true, permissionsPolicy:false, frameOptions:false, cookieFlags:false, cachePolicy:false, serverBanner:true, scenarioName:"Vulnerable baseline" };
const secure: Config = { csp:true, nosniff:true, referrerPolicy:true, corsWildcard:false, debugExposure:false, permissionsPolicy:true, frameOptions:true, cookieFlags:true, cachePolicy:true, serverBanner:false, scenarioName:"Secure baseline" };
const partial: Config = { csp:true, nosniff:false, referrerPolicy:true, corsWildcard:true, debugExposure:false, permissionsPolicy:false, frameOptions:true, cookieFlags:false, cachePolicy:false, serverBanner:true, scenarioName:"Partially repaired scenario" };
type ControlKey = Exclude<keyof Config,"scenarioName">;
const controls: {key:ControlKey;title:string;desc:string;finding:string;severity:"High"|"Medium"|"Low"}[] = [
  {key:"csp",title:"Content Security Policy (CSP)",desc:"When off, the target omits the CSP response header.",finding:"Missing Content-Security-Policy",severity:"Medium"},
  {key:"nosniff",title:"MIME sniffing protection",desc:"When off, X-Content-Type-Options is omitted.",finding:"Missing X-Content-Type-Options",severity:"Low"},
  {key:"referrerPolicy",title:"Referrer policy",desc:"When off, the Referrer-Policy header is omitted.",finding:"Missing Referrer-Policy",severity:"Low"},
  {key:"corsWildcard",title:"Wildcard CORS",desc:"When on, Access-Control-Allow-Origin: * is returned.",finding:"Overly permissive CORS policy",severity:"Medium"},
  {key:"debugExposure",title:"Diagnostic information exposure",desc:"When on, a fictional diagnostic marker appears in the JSON body.",finding:"Verbose diagnostic information exposed",severity:"Low"},
  {key:"permissionsPolicy",title:"Permissions Policy",desc:"When off, camera/microphone/geolocation policy is omitted.",finding:"Missing Permissions-Policy",severity:"Low"},
  {key:"frameOptions",title:"Clickjacking protection",desc:"When off, X-Frame-Options is omitted.",finding:"Missing X-Frame-Options (legacy signal)",severity:"Low"},
  {key:"cookieFlags",title:"Demo cookie security flags",desc:"When off, a non-sensitive training cookie lacks Secure, HttpOnly and SameSite.",finding:"Cookie missing security attributes",severity:"Medium"},
  {key:"cachePolicy",title:"Sensitive-response cache policy",desc:"When off, the target advertises public caching for 60 seconds.",finding:"Cacheable security-test response",severity:"Medium"},
  {key:"serverBanner",title:"Server banner exposure",desc:"When on, a fictional X-Demo-Server banner is returned.",finding:"Unnecessary server banner disclosure",severity:"Low"}
];

export function AdminLab() {
  const [config,setConfig] = useState<Config>(defaults);
  const [targetUrl,setTargetUrl] = useState("");
  const [message,setMessage] = useState("");
  const [busy,setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/lab/scenario", { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load saved configuration.");
        if (active) { setConfig(data.config); setTargetUrl(data.targetUrl); }
      })
      .catch(error => { if (active) setMessage(error instanceof Error ? error.message : "Unable to load saved configuration."); });
    return () => { active = false; };
  }, []);
  const update = (key: ControlKey, value: boolean) => setConfig(old => ({...old,[key]:value,scenarioName:"Custom scenario"}));

  async function generate() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/lab/scenario", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(config)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save active configuration.");
      setTargetUrl(data.targetUrl);
      setMessage("Active configuration saved. Valorynn can scan this same target URL again to compare results.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unexpected error."); }
    finally { setBusy(false); }
  }
  async function logout() { await fetch("/api/admin/logout",{method:"POST"}); window.location.href="/admin/login"; }
  async function copy() { try { await navigator.clipboard.writeText(targetUrl); setMessage("Target URL copied."); } catch { setMessage("Copy was blocked by your browser. Select and copy the URL manually."); } }
  const enabledProtections = [config.csp,config.nosniff,config.referrerPolicy,config.permissionsPolicy,config.frameOptions,config.cookieFlags,config.cachePolicy].filter(Boolean).length;
  const expectedFindings = controls.filter(c => c.key === "corsWildcard" || c.key === "debugExposure" || c.key === "serverBanner" ? config[c.key] : !config[c.key]);

  return <main className="page-main"><div className="container lab-shell">
    <div className="lab-top"><div><div className="breadcrumb"><Link href="/">Storefront</Link><span>/</span><span>Admin security lab</span></div><div className="eyebrow">ADMINISTRATOR ONLY · CONTROLLED TESTS</div><h1>Security scenario lab.</h1><p>Configure ten safe, predefined response behaviors and save them as the active configuration for one permanent Valorynn target. After saving, the same endpoint returns the updated headers and test signals.</p></div><button className="button button-outline button-small" onClick={logout}><LogOut size={14}/> Sign out</button></div>
    <div className="lab-warning"><strong>Controlled training target:</strong> all exposures are fictional and limited to this demo endpoint. The cookie contains no identity or session data. No exploit payloads, arbitrary code execution, real credentials, or third-party targets are involved. Findings are signals for testing—not proof of exploitability.</div>
    <div className="lab-metrics"><div><span>Response controls</span><strong>10</strong><small>independent toggles</small></div><div><span>Protections enabled</span><strong>{enabledProtections}/7</strong><small>header and cookie controls</small></div><div><span>Expected lab signals</span><strong>{expectedFindings.length}</strong><small>based on current switches</small></div></div>
    <div className="lab-grid"><section className="lab-card"><h2>Response controls</h2><div className="sub">Protection controls should be enabled. For wildcard CORS, diagnostic exposure and server banner, turning them on intentionally introduces the demo weakness.</div>
      <div className="scenario-buttons"><button className="scenario-btn" onClick={()=>setConfig({...defaults})}>Vulnerable baseline</button><button className="scenario-btn" onClick={()=>setConfig({...partial})}>Partially repaired</button><button className="scenario-btn" onClick={()=>setConfig({...secure})}>Secure baseline</button></div>
      {controls.map((control)=><div className="lab-control" key={control.key}><div><strong>{control.title}</strong><span>{control.desc}</span></div><button className={`switch ${config[control.key] ? "on" : ""}`} aria-label={`${control.title}: ${config[control.key] ? "enabled" : "disabled"}`} aria-pressed={config[control.key]} onClick={()=>update(control.key,!config[control.key])}><span/></button></div>)}
      <button className="button button-primary button-full" style={{marginTop:22}} onClick={generate} disabled={busy}>{busy ? "Saving configuration…" : "Save active configuration"} <ExternalLink size={15}/></button>
    </section>
    <aside className="lab-card"><h2>Valorynn test target</h2><div className="sub">Scan this permanent URL in Valorynn. Save a configuration here, then scan the same URL again to compare before and after results.</div>
      <div className="lab-result"><div className="result-title"><ShieldCheck size={14} style={{display:"inline",verticalAlign:"middle",marginRight:6}}/>Current configuration</div><p>Scenario: {config.scenarioName}</p><p>Header protections enabled: {[config.csp,config.nosniff,config.referrerPolicy,config.permissionsPolicy,config.frameOptions].filter(Boolean).length} / 5</p><p>Cookie flags: {config.cookieFlags ? "ON" : "OFF"} · Cache policy: {config.cachePolicy ? "no-store" : "public max-age=60"}</p><p>Wildcard CORS: {config.corsWildcard ? "ON — intentionally permissive" : "OFF"}</p><p>Diagnostic exposure: {config.debugExposure ? "ON — fictional marker present" : "OFF"}</p></div>
      <div className="expected-findings"><div className="expected-heading"><FileSearch size={15}/> Expected lab signals <span>{expectedFindings.length}</span></div>{expectedFindings.length ? expectedFindings.map(f=><div className="expected-row" key={f.key}><AlertTriangle size={13}/><span>{f.finding}</span><small className={`severity severity-${f.severity.toLowerCase()}`}>{f.severity}</small></div>) : <p className="no-findings"><Check size={15}/> No intentionally configured weaknesses in this baseline.</p>}<p className="sub" style={{margin:"10px 0 0"}}>This list is an educational preview, not a claim that Valorynn will detect every signal. Detection depends on the scanner's current rules.</p></div>
      {targetUrl && <div className="target-url"><input aria-label="Generated Valorynn target URL" readOnly value={targetUrl}/><button className="button button-outline button-small" onClick={copy} aria-label="Copy target URL"><Copy size={15}/></button></div>}
      {message && <p role="status" style={{fontSize:11,color:"var(--lime)",lineHeight:1.7,marginTop:12}}>{message}</p>}
      <div className="lab-warning" style={{marginTop:20}}>Platform caveat: Vercel can add or manage some response headers. Inspect the actual response headers after deployment. This lab intentionally does not pretend it can disable platform-managed HSTS.</div>
      <div className="notice"><strong>Suggested test:</strong> scan Vulnerable baseline, Partially repaired, and Secure baseline in Valorynn. Compare findings, severity, confidence and score; note which of these ten signals your current scanner detects and which rules need development.</div>
    </aside></div>
    <p style={{fontSize:11,color:"var(--muted)",lineHeight:1.8,marginTop:22}}><Activity size={13} style={{display:"inline",verticalAlign:"middle",marginRight:6}}/>The target URL is permanent. Saving a configuration changes the response served at that endpoint for subsequent requests. Use only for authorized tests. The lab helps assess implemented scanner coverage; it does not imply comprehensive vulnerability detection.</p>
  </div></main>;
}
