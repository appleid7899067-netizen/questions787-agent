"use client";

import Script from "next/script";
import { useState } from "react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    puter?: {
      auth?: {
        signIn?: () => Promise<unknown>;
      };
    };
  }
}

export function PuterAuth() {
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState<string>();

  async function signIn() {
    if (!ready || !window.puter?.auth?.signIn) return;
    setPending(true);
    setError(undefined);
    try {
      await window.puter.auth.signIn();
      setSignedIn(true);
    } catch (err) {
      const code = typeof err === "object" && err && "error" in err ? String(err.error) : "";
      if (code !== "auth_window_closed") setError("Puter sign-in failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Script
        src="https://js.puter.com/v2/"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="fixed top-3 right-4 z-50 flex flex-col items-end gap-2">
        <Button
          disabled={!ready || pending || signedIn}
          onClick={signIn}
          type="button"
          variant="outline"
        >
          {signedIn ? "Puter connected" : pending ? "Signing in to Puter…" : "Login with Puter"}
        </Button>
        {error ? <p className="rounded-md bg-background px-2 py-1 text-destructive text-xs shadow" role="alert">{error}</p> : null}
      </div>
    </>
  );
}
