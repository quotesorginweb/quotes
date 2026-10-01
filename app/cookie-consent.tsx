"use client";
import { useEffect, useState } from "react";
const measurementId = "G-BZYWKQ0SX5";
const storageKey = "quotes-cookie-consent-v1";
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; } }
function startMeasurement() {
  if (document.getElementById("quotes-google-tag")) return;
  window.dataLayer = window.dataLayer || [];
  // Google's queue expects an Arguments object, not a normal array.
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function () { window.dataLayer?.push(arguments); };
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${location.origin}${location.pathname}`, page_referrer: document.referrer ? new URL(document.referrer).origin : "" });
  const script = document.createElement("script");
  script.id = "quotes-google-tag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let choice: string | null = null;
    try { choice = localStorage.getItem(storageKey); } catch {}
    if (choice === "accepted") startMeasurement();
    queueMicrotask(() => setOpen(!choice));
  }, []);
  const choose = (accepted: boolean) => {
    try { localStorage.setItem(storageKey, accepted ? "accepted" : "rejected"); } catch {}
    setOpen(false);
    if (accepted) startMeasurement();
    else {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!name.startsWith("_ga")) continue;
        for (const domain of ["", `; domain=${location.hostname}`, `; domain=.${location.hostname}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      }
      if (document.getElementById("quotes-google-tag")) location.reload();
    }
  };
  return <>
    <button className="cookie-settings" onClick={() => setOpen(true)}>Cookie settings</button>
    {open && <section className="cookie-banner" aria-label="Cookie consent">
      <h2>Cookie preferences</h2>
      <p>With your permission, Google Analytics cookies help us understand visits to Quotes.org.in. Optional Google measurement stays off until you accept. Saved quotes and essential features work either way. <a href="/privacy">Privacy notice</a></p>
      <div><button onClick={() => choose(false)}>Reject optional cookies</button><button onClick={() => choose(true)}>Accept cookies</button></div>
    </section>}
  </>;
}
