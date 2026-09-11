import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PuterAuth } from "./_components/puter-auth";
import "./globals.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], weight: "variable", display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], weight: "variable", display: "swap" });

export const metadata: Metadata = { title: "SlieLoBoss", description: "SlieLoBoss AI agent." };

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return <html className={cn(sans.variable, mono.variable)} lang="en"><body><PuterAuth /><TooltipProvider>{children}</TooltipProvider></body></html>;
}
