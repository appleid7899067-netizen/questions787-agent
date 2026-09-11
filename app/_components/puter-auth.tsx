"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    puter?: {
      auth?: {
        isSignedIn?: () => boolean;
        getUser?: () => Promise<unknown>;
      };
    };
  }
}

/**
 * Loads Puter.js and silently initializes its existing session.
 * No sign-in UI is rendered. If the visitor is not signed in to Puter,
 * Puter will handle authentication when an authenticated Puter API is used.
 */
export function PuterAuth() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !window.puter?.auth) return;

    // Touch the auth state so an existing Puter session is initialized.
    // Do not call signIn() here: Puter requires signIn() to be triggered
    // by a user action because it opens a popup.
    window.puter.auth.isSignedIn?.();
    void window.puter.auth.getUser?.().catch(() => undefined);
  }, [ready]);

  return <Script src="https://js.puter.com/v2/" strategy="afterInteractive" onLoad={() => setReady(true)} />;
}
