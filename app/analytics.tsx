"use client";

import { useEffect } from "react";

type AnalyticsProperties = Record<string, string>;
type MetricRating = "good" | "needs-improvement" | "poor";

declare global {
  interface Window {
    quotesTrack?: (eventName: string, properties?: AnalyticsProperties) => void;
  }
}

function send(eventName: string, properties: AnalyticsProperties = {}, metricValue?: number, metricRating?: MetricRating) {
  const payload = JSON.stringify({
    eventName,
    path: `${location.pathname}${location.search}`.slice(0, 240),
    properties,
    metricValue,
    metricRating,
  });
  if (document.visibilityState === "hidden" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

function rating(metric: "CLS" | "INP" | "LCP" | "FCP" | "TTFB", value: number): MetricRating {
  const limits = {
    CLS: [0.1, 0.25],
    INP: [200, 500],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  } as const;
  const [good, poor] = limits[metric];
  return value <= good ? "good" : value <= poor ? "needs-improvement" : "poor";
}

export function Analytics() {
  useEffect(() => {
    window.quotesTrack = (eventName, properties = {}) => send(eventName, properties);
    send("page_view", { referrerHost: document.referrer ? new URL(document.referrer).hostname : "direct" });

    const observers: PerformanceObserver[] = [];
    let cls = 0;
    let lcp = 0;
    let inp = 0;
    let flushed = false;

    const observe = (type: string, callback: (entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => void) => {
      try {
        const observer = new PerformanceObserver((list) => list.getEntries().forEach((entry) => callback(entry)));
        observer.observe({ type, buffered: true });
        observers.push(observer);
      } catch {}
    };

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation) send("web_vital", { metric: "TTFB" }, navigation.responseStart, rating("TTFB", navigation.responseStart));
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    if (fcp) send("web_vital", { metric: "FCP" }, fcp.startTime, rating("FCP", fcp.startTime));

    observe("largest-contentful-paint", (entry) => { lcp = entry.startTime; });
    observe("layout-shift", (entry) => { if (!entry.hadRecentInput) cls += entry.value || 0; });
    observe("event", (entry) => { inp = Math.max(inp, entry.duration); });

    const flush = () => {
      if (flushed) return;
      flushed = true;
      if (lcp) send("web_vital", { metric: "LCP" }, lcp, rating("LCP", lcp));
      send("web_vital", { metric: "CLS" }, cls, rating("CLS", cls));
      if (inp) send("web_vital", { metric: "INP" }, inp, rating("INP", inp));
    };
    addEventListener("pagehide", flush, { once: true });
    return () => {
      flush();
      observers.forEach((observer) => observer.disconnect());
      delete window.quotesTrack;
    };
  }, []);

  return null;
}
