"use client";

import Script from "next/script";

/**
 * Loads Puter.js without adding any UI.
 * The existing project authentication UI remains unchanged.
 */
export function PuterAuth() {
  return <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />;
}
