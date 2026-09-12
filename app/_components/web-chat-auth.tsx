"use client";

import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SettingsPanel } from "./settings-panel";
import { ensurePuterAuth } from "./puter-auth";

const AGENT_NAME = "SlieLoBoss";

type PuterUser = { username?: string; email?: string; uuid?: string };

export function SignIn({ onSignedIn }: { readonly onSignedIn?: () => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function signIn() {
    setPending(true);
    setError(undefined);
    try {
      await ensurePuterAuth();
      onSignedIn?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Puter sign-in failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-8 text-foreground">
      <div className="flex w-full max-w-[22rem] flex-col gap-5">
        <div className="text-foreground opacity-[0.08] dark:opacity-[0.12]"><EveWordmark className="h-auto w-[4.875rem]" /></div>
        <section aria-label="Sign in" className="flex flex-col gap-2">
          <h1 className="max-w-full break-words font-medium text-sm leading-6">{AGENT_NAME}</h1>
          <p className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm leading-6"><span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />Ready</span><span aria-hidden="true" className="text-border">/</span><span>Sign in with Puter to start</span></p>
          <Button className="mt-3 w-full text-sm" disabled={pending} onClick={signIn}>{pending ? "Signing in…" : "Continue with Puter"}</Button>
          {error ? <p className="text-destructive text-sm" role="alert">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}

function EveWordmark({ className }: { readonly className?: string }) { return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 169 53" xmlns="http://www.w3.org/2000/svg"><path d="M169 8.47h-51.39L81.73 53H70.36L113 0H169zM169 44.51v8.47h-45.87V44.5zM45.87 52.98H0V44.5h45.87zM38.66 30.55H0v-8.47h38.66z" fill="currentColor" /><path d="M169 30.55h-38.66v-8.47H169zM75.52 8.47H0V0h75.52z" fill="currentColor" /></svg>; }

export function AccountControl() {
  const [user, setUser] = useState<PuterUser>();
  const [imageFailed] = useState(false);
  const [pending, setPending] = useState(false);

  useState(() => {
    void window.puter?.auth?.getUser?.().then((value) => setUser(value));
  });

  async function signOut() {
    setPending(true);
    try {
      window.puter?.auth?.signOut?.();
      window.location.assign("/");
    } finally {
      setPending(false);
    }
  }

  const name = user?.username ?? "Puter user";
  const email = user?.email ?? "Signed in with Puter";
  const initials = getInitials(name, email);

  return <div className="fixed top-3 left-4 z-30 flex h-8 items-center"><DropdownMenu><DropdownMenuTrigger asChild><Button aria-label={`Open account menu for ${name}`} className="relative size-7 cursor-pointer overflow-hidden rounded-full p-0" size="icon-sm" variant="ghost"><span aria-hidden="true" className="font-medium text-xs">{imageFailed ? initials : initials}</span><span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border border-black/20 dark:border-white/25" /></Button></DropdownMenuTrigger><DropdownMenuContent align="start" className="w-64"><div className="min-w-0 px-2 py-1.5 text-sm"><span className="block truncate font-medium leading-5">{name}</span><span className="block truncate text-muted-foreground leading-5">{email}</span></div><DropdownMenuSeparator /><SettingsPanel /><DropdownMenuSeparator /><DropdownMenuItem className="cursor-pointer justify-between" disabled={pending} onSelect={signOut}>{pending ? "Logging out…" : "Log out"}<LogOutIcon aria-hidden="true" /></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>;
}

function getInitials(name: string, email: string): string { const parts = name.trim().split(/\s+/).filter(Boolean); if (parts.length >= 2) return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase(); return (parts[0]?.[0] ?? email[0] ?? "?").toUpperCase(); }
