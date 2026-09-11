"use client";

import Script from "next/script";

declare global {
  interface Window {
    puter?: {
      auth?: {
        isSignedIn?: () => boolean;
        signIn?: () => Promise<unknown>;
      };
    };
  }
}

/**
 * Loads Puter.js without adding any UI.
 * The existing project authentication UI remains unchanged.
 */
export function PuterAuth() {
  return <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />;
}

/**
 * Starts Puter authentication from the user's existing sign-in click.
 * This intentionally does not render a separate Puter login button.
 */
export async function ensurePuterAuth() {
  if (typeof window === "undefined") return;

  const auth = window.puter?.auth;
  if (!auth?.signIn || auth.isSignedIn?.()) return;

  await auth.signIn();
}
