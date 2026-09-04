// Google Analytics 4 (gtag.js). Lane16 uses a hand-rolled hash router with no
// full page reloads between routes, so automatic pageview detection can't be
// relied on — pageviews are fired manually from the router. See trackPageview.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]): void;
  interface Window {
    dataLayer: unknown[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag(...args: any[]): void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-X8C9LWJZCZ';

let isInitialized = false;

export function initAnalytics() {
  if (isInitialized || !GA_MEASUREMENT_ID) return;

  // GA4 requires window.gtag to be a real function (not an arrow function)
  // because the loaded gtag/js script looks for window.gtag and relies on
  // `arguments` being available. Arrow functions do not expose `arguments`.
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };

  // Queue config BEFORE injecting the script so commands are processed
  // in the correct order once gtag/js finishes loading.
  window.gtag('js', new Date());
  // send_page_view is disabled here because we fire page_view ourselves on
  // every route change via trackPageview — gtag's default only fires once,
  // on script load, which would undercount every SPA navigation.
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  isInitialized = true;
}

export function trackPageview(path: string, title?: string) {
  if (!isInitialized) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!isInitialized) return;
  window.gtag('event', name, params);
}
