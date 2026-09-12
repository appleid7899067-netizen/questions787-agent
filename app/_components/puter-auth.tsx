"use client";

import Script from "next/script";

declare global {
  interface Window {
    puter?: {
      authToken?: string;
      auth?: {
        isSignedIn?: () => boolean;
        signIn?: () => Promise<{ success?: boolean; token?: string; username?: string }>;
        signOut?: () => void;
        getUser?: () => Promise<{ username?: string; email?: string; uuid?: string; [key: string]: unknown }>;
      };
    };
  }
}

export function PuterAuth() {
  return <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />;
}

export async function ensurePuterAuth() {
  if (typeof window === "undefined") throw new Error("Puter authentication is only available in the browser.");
  for (let attempt = 0; attempt < 50 && !window.puter?.auth; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const auth = window.puter?.auth;
  if (!auth?.signIn) throw new Error("Puter.js is still loading. Please try again.");
  if (auth.isSignedIn?.()) return;
  const result = await auth.signIn();
  if (result?.success === false) throw new Error("Puter sign-in was not completed.");
}

export function getPuterAuthToken() {
  if (typeof window === "undefined") return undefined;
  return window.puter?.authToken;
}
