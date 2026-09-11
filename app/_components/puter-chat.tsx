"use client";

import Script from "next/script";
import { FormEvent, useState } from "react";
import { SendIcon, SquareIcon } from "lucide-react";

const MODEL = "deepseek/deepseek-v4.1-flash";

type PuterResponse = {
  message?: { content?: string | unknown[] };
};

type PuterApi = {
  ai: {
    chat: (
      messages: { role: "user" | "assistant"; content: string }[],
      options: { model: string; stream?: boolean },
    ) => Promise<PuterResponse | AsyncIterable<PuterResponse>>;
  };
};

declare global {
  interface Window {
    puter?: PuterApi;
  }
}

type Message = { role: "user" | "assistant"; content: string };

function getContent(response: PuterResponse): string {
  const content = response.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function PuterChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setError(undefined);
    setInput("");
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setBusy(true);

    try {
      if (!window.puter) throw new Error("Puter is still loading. Please try again.");

      const result = await window.puter.ai.chat(nextMessages, {
        model: MODEL,
        stream: false,
      });

      const response = result as PuterResponse;
      const answer = getContent(response).trim() || "No response received.";
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Puter request failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-black text-white">
      <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">questions787</h1>
            <p className="text-xs text-lime-400">Puter · DeepSeek V4.1 Flash</p>
          </div>
          <span className="rounded-full border border-lime-400/30 px-3 py-1 text-xs text-lime-400">Connected</span>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">TEMPLATE OS Copilot</h2>
              <p className="mt-2 text-sm text-white/50">Chat with DeepSeek through Puter.js</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[85%] rounded-2xl bg-lime-400 px-4 py-3 text-black" : "max-w-[85%] rounded-2xl bg-white/10 px-4 py-3"}>
              <div className="whitespace-pre-wrap text-sm leading-6">{message.content}</div>
            </div>
          ))
        )}
        {busy ? <div className="text-sm text-lime-400">DeepSeek is thinking…</div> : null}
        {error ? <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      </section>

      <form onSubmit={send} className="sticky bottom-0 border-t border-white/10 bg-black/95 p-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={busy}
            rows={2}
            placeholder="Send a message…"
            className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/30"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label={busy ? "Working" : "Send"}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-lime-400 text-black disabled:opacity-40"
          >
            {busy ? <SquareIcon className="size-4 fill-current" /> : <SendIcon className="size-4" />}
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-white/30">Model: {MODEL}</p>
      </form>
    </main>
  );
}
