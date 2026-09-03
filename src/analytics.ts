// Google Analytics 4 (gtag.js). Lane16 uses a hand-rolled hash router with no
// full page reloads between routes, so automatic pageview detection can't be
// relied on — pageviews are fired manually from the router. See trackPageview.

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-X8C9LWJZCZ';

let isInitialized = false;

const gtag = (...args: unknown[]) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
};

export function initAnalytics() {
  if (isInitialized || !import.meta.env.PROD || !GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag('js', new Date());
  // send_page_view is disabled here because we fire page_view ourselves on
  // every route change via trackPageview — gtag's default only fires once,
  // on script load, which would undercount every SPA navigation.
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  isInitialized = true;
}

export function trackPageview(path: string, title?: string) {
  if (!isInitialized) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!isInitialized) return;
  gtag('event', name, params);
}
