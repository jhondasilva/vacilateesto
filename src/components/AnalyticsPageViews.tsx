import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const PRIVATE_PATH = /^\/(dashboard|gira|reset-password)(\/|$)/;

/** Sends a GA4 page_view on SPA route changes. The first view is sent by the initial config in index.html. */
const AnalyticsPageViews = () => {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (PRIVATE_PATH.test(pathname)) return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== "function") return;
    // Short delay so page titles set by Helmet are applied; only path is sent (no query/personal data).
    const t = setTimeout(() => {
      gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.origin + pathname,
        page_title: document.title,
      });
    }, 50);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
};

export default AnalyticsPageViews;
