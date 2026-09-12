"use client";

import { useEffect, useState } from "react";
import { AgentChat } from "./agent-chat";
import { AccountControl, SignIn } from "./web-chat-auth";

export function AuthenticatedAgentChat({
  sessionId,
  sessionless,
}: {
  readonly sessionId?: string;
  readonly sessionless?: boolean;
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setSignedIn(Boolean(window.puter?.auth?.isSignedIn?.()));
    check();
    const timer = window.setInterval(check, 500);
    return () => window.clearInterval(timer);
  }, []);

  if (signedIn !== true) return <SignIn onSignedIn={() => setSignedIn(true)} />;

  return (
    <>
      <AgentChat sessionId={sessionId} sessionless={sessionless} />
      <AccountControl />
    </>
  );
}
