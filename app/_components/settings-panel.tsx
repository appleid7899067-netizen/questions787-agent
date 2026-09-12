"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcwIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const KEY = "slieloboss-settings-v2";
type SettingValue = boolean | string | number;
type Settings = Record<string, SettingValue>;

const models = [
  ["gpt-4o", "GPT-4o"],
  ["gpt-5.6-luna", "GPT-5.6 Luna"],
  ["gpt-5.6-sol", "GPT-5.6 Sol"],
  ["deepseek", "DeepSeek"],
  ["claude", "Claude"],
  ["gemini", "Gemini"],
  ["openrouter", "OpenRouter"],
  ["default", "Auto / Default"],
];

const defaults: Settings = {
  theme: "system", accent: "default", language: "auto", font: "geist", fontSize: 16, density: "comfortable", contrast: "normal", reducedMotion: false, compactMessages: false, wideChat: false,
  showTimestamps: true, showThinking: true, markdown: true, codeWrap: true, syntaxHighlight: true, linkPreview: true, enterToSend: true, shiftEnterNewline: true, autocorrect: true, spellcheck: true,
  saveDrafts: true, autoScroll: true, sounds: true, vibration: false, notifications: false, desktopNotifications: false, stopOnNavigate: false, confirmClear: true, saveHistory: true, autoSave: true,
  restoreSession: true, rememberLastChat: true, syncSettings: true, offlineMode: false, clipboard: true, privacyMode: false, analytics: false, contextMessages: 20, memory: true,
  model: "default", temperature: 0.7, maxTokens: 4096, streaming: true, systemPrompt: "",
  fileUpload: true, imageUpload: true, maxFileMb: 25, imagePreview: true, compressImages: true, dragDrop: true,
};

const groups = [
  ["บัญชีและประสบการณ์", [["language", "ภาษา", "auto", "select", ["auto", "ไทย", "English"]], ["theme", "ธีม", "system", "select", ["system", "light", "dark"]], ["accent", "สีเน้น", "default", "select", ["default", "blue", "green", "purple", "orange"]], ["font", "แบบอักษร", "geist", "select", ["geist", "system", "mono"]], ["fontSize", "ขนาดตัวอักษร", 16, "number"], ["density", "ความหนาแน่น UI", "comfortable", "select", ["compact", "comfortable", "spacious"]], ["contrast", "คอนทราสต์", "normal", "select", ["normal", "high"]], ["reducedMotion", "ลดแอนิเมชัน", false, "boolean"], ["compactMessages", "ข้อความแบบกะทัดรัด", false, "boolean"], ["wideChat", "ขยายความกว้างแชต", false, "boolean"]]],
  ["แชตและการเขียน", [["showTimestamps", "แสดงเวลา", true, "boolean"], ["showThinking", "แสดงสถานะกำลังคิด", true, "boolean"], ["markdown", "เปิด Markdown", true, "boolean"], ["codeWrap", "ตัดบรรทัดโค้ด", true, "boolean"], ["syntaxHighlight", "ไฮไลต์โค้ด", true, "boolean"], ["linkPreview", "พรีวิวลิงก์", true, "boolean"], ["enterToSend", "กด Enter เพื่อส่ง", true, "boolean"], ["shiftEnterNewline", "Shift+Enter ขึ้นบรรทัดใหม่", true, "boolean"], ["autocorrect", "แก้คำอัตโนมัติ", true, "boolean"], ["spellcheck", "ตรวจคำสะกด", true, "boolean"]]],
  ["การบันทึกและแจ้งเตือน", [["saveDrafts", "บันทึกร่างข้อความ", true, "boolean"], ["autoScroll", "เลื่อนตามข้อความใหม่", true, "boolean"], ["sounds", "เสียงแจ้งเตือน", true, "boolean"], ["vibration", "สั่นเมื่อเสร็จ", false, "boolean"], ["notifications", "แจ้งเตือนในแอป", false, "boolean"], ["desktopNotifications", "แจ้งเตือนเดสก์ท็อป", false, "boolean"], ["stopOnNavigate", "หยุดการตอบเมื่อเปลี่ยนหน้า", false, "boolean"], ["confirmClear", "ยืนยันก่อนล้างแชต", true, "boolean"], ["saveHistory", "บันทึกประวัติแชต", true, "boolean"], ["autoSave", "บันทึกอัตโนมัติ", true, "boolean"]]],
  ["เซสชันและข้อมูล", [["restoreSession", "กู้คืนเซสชันล่าสุด", true, "boolean"], ["rememberLastChat", "จำห้องแชตล่าสุด", true, "boolean"], ["syncSettings", "ซิงก์การตั้งค่า", true, "boolean"], ["offlineMode", "โหมดออฟไลน์", false, "boolean"], ["clipboard", "อนุญาตการคัดลอก", true, "boolean"], ["privacyMode", "โหมดความเป็นส่วนตัว", false, "boolean"], ["analytics", "สถิติการใช้งาน", false, "boolean"], ["contextMessages", "จำนวนข้อความในบริบท", 20, "number"], ["memory", "ใช้ความจำของแชต", true, "boolean"]]],
  ["AI · เลือกโมเดล", [["model", "โมเดล AI", "default", "model"], ["temperature", "Temperature", 0.7, "number"], ["maxTokens", "Max tokens", 4096, "number"], ["streaming", "ตอบแบบสตรีม", true, "boolean"], ["systemPrompt", "System prompt", "", "text"]]],
  ["ไฟล์และรูปภาพ", [["fileUpload", "อัปโหลดไฟล์", true, "boolean"], ["imageUpload", "อัปโหลดรูปภาพ", true, "boolean"], ["maxFileMb", "ขนาดไฟล์สูงสุด (MB)", 25, "number"], ["imagePreview", "พรีวิวรูปก่อนส่ง", true, "boolean"], ["compressImages", "บีบอัดรูปภาพ", true, "boolean"], ["dragDrop", "ลากวางไฟล์", true, "boolean"]]],
];

function loadSettings(): Settings {
  if (typeof window === "undefined") return { ...defaults };
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch { return { ...defaults }; }
}

function applySettings(s: Settings) {
  const root = document.documentElement;
  root.dataset.themePreference = String(s.theme); root.dataset.density = String(s.density); root.dataset.contrast = String(s.contrast); root.dataset.compactMessages = String(s.compactMessages); root.dataset.wideChat = String(s.wideChat); root.dataset.reducedMotion = String(s.reducedMotion);
  root.style.setProperty("--slie-font-size", `${Number(s.fontSize) || 16}px`); root.style.setProperty("--slie-accent", String(s.accent)); root.style.setProperty("--slie-font-family", s.font === "mono" ? "var(--font-mono)" : s.font === "system" ? "system-ui" : "var(--font-sans)");
  if (s.theme === "dark") root.classList.add("dark"); else if (s.theme === "light") root.classList.remove("dark"); else root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
}

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const flat = useMemo(() => groups.flatMap(([, items]) => items), []);
  useEffect(() => { applySettings(settings); localStorage.setItem(KEY, JSON.stringify(settings)); }, [settings]);
  function setValue(key: string, value: SettingValue) { setSettings((current) => ({ ...current, [key]: value })); }
  function reset() { setSettings({ ...defaults }); }

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button variant="ghost" className="w-full justify-start"><SettingsIcon className="size-4" /> ตั้งค่า</Button></DialogTrigger>
    <DialogContent className="max-h-[85dvh] max-w-2xl overflow-hidden p-0">
      <DialogHeader className="border-b px-6 py-5"><DialogTitle>Settings · {flat.length} จุด</DialogTitle><DialogDescription>เลือกโมเดล AI และปรับค่าการทำงานของแอป</DialogDescription></DialogHeader>
      <div className="overflow-y-auto px-6 py-4">
        {groups.map(([group, items]) => <section className="mb-6" key={group as string}><h2 className="mb-2 text-sm font-semibold">{group as string}</h2><div className="divide-y rounded-lg border">{(items as Array<any>).map(([key, label, fallback, type, options]) => { const value = settings[key] ?? fallback; return <div className="flex items-center justify-between gap-4 px-3 py-3" key={key}><label className="min-w-0 text-sm" htmlFor={`setting-${key}`}>{label}</label>{type === "boolean" ? <input id={`setting-${key}`} type="checkbox" checked={Boolean(value)} onChange={(e) => setValue(key, e.target.checked)} className="size-4" /> : type === "model" ? <select id={`setting-${key}`} value={String(value)} onChange={(e) => setValue(key, e.target.value)} className="max-w-48 rounded-md border bg-background px-2 py-1 text-sm">{models.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select> : type === "select" ? <select id={`setting-${key}`} value={String(value)} onChange={(e) => setValue(key, e.target.value)} className="rounded-md border bg-background px-2 py-1 text-sm">{(options as string[]).map((option) => <option key={option}>{option}</option>)}</select> : type === "text" ? <input id={`setting-${key}`} value={String(value)} onChange={(e) => setValue(key, e.target.value)} className="w-44 rounded-md border bg-background px-2 py-1 text-sm" /> : <input id={`setting-${key}`} type="number" step={key === "temperature" ? "0.1" : "1"} min={key === "temperature" ? "0" : "1"} max={key === "temperature" ? "2" : undefined} value={Number(value)} onChange={(e) => setValue(key, Number(e.target.value))} className="w-24 rounded-md border bg-background px-2 py-1 text-sm" />}</div>; })}</div></section>)}
        <div className="flex items-center justify-between border-t pt-4"><span className="text-xs text-muted-foreground">เปิดใช้แล้ว {flat.length} จุด</span><Button variant="outline" size="sm" onClick={reset}><RotateCcwIcon /> คืนค่าเริ่มต้น</Button></div>
      </div>
    </DialogContent>
  </Dialog>;
}
