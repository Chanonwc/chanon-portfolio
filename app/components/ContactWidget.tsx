"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, Send, X } from "lucide-react";
import { socials } from "../content";

const address = socials.email.replace(/^mailto:/, "");

// Floating "Contact me" button (bottom-right) that opens a small mail composer.
// Sending opens the visitor's email app with everything filled in (mailto:), so no backend is needed.
export default function ContactWidget() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Esc closes; focus the first field when opening.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = name ? `${message}\n\n— ${name}` : message;
    const params = new URLSearchParams({
      subject: subject || "Hello from your portfolio",
      body,
    });
    // URLSearchParams encodes spaces as "+", which mail apps show literally.
    window.location.href = `mailto:${address}?${params.toString().replace(/\+/g, "%20")}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the address is still visible in the "To" field.
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {/* Composer */}
      <div
        role="dialog"
        aria-label="New message"
        inert={!open}
        className={`contact-panel ${open ? "is-open" : ""}`}
      >
        <div className="flex items-center border-b border-[var(--panel-line)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
            >
              <X size={8} strokeWidth={3} className="opacity-0 group-hover:opacity-70" />
            </button>
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <p className="flex-1 pr-12 text-center text-sm font-semibold">New Message</p>
        </div>

        <form onSubmit={send} className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-[var(--panel-line)] px-4 py-2.5">
            <button type="submit" className="contact-send">
              <Send size={14} /> send
            </button>
            <button type="button" onClick={copy} className="contact-ghost">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "copied!" : "copy address"}
            </button>
          </div>

          <div className="contact-row">
            <span className="contact-label">To:</span>
            <span className="rounded-full bg-primary-500/12 px-2.5 py-0.5 text-sm font-medium text-primary-500">
              {address}
            </span>
          </div>
          <label className="contact-row">
            <span className="contact-label">From:</span>
            <input
              ref={firstFieldRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              className="contact-input"
            />
          </label>
          <label className="contact-row">
            <span className="contact-label">Subject:</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Hello from your portfolio"
              className="contact-input"
            />
          </label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your project…"
            className="contact-input min-h-40 flex-1 resize-none px-4 py-3"
          />
          <p className="px-4 pb-3 text-xs text-gray-400 dark:text-gray-500">
            Opens in your email app, ready to send.
          </p>
        </form>
      </div>

      {/* Launcher */}
      {/* The "Contact me" label only slides in while the button is hovered or keyboard-focused. */}
      <div className="group pointer-events-none flex items-center gap-3">
        <span
          className={`contact-hint pointer-events-none translate-x-2 opacity-0 transition-all duration-300 ${
            open ? "" : "group-hover:translate-x-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100"
          }`}
        >
          Contact me
        </span>
        <button
          type="button"
          aria-label={open ? "Close contact form" : "Open contact form"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="contact-fab pointer-events-auto"
        >
          <Mail size={22} className={`absolute transition-all duration-300 ${open ? "rotate-90 scale-50 opacity-0" : ""}`} />
          <X size={22} className={`absolute transition-all duration-300 ${open ? "" : "-rotate-90 scale-50 opacity-0"}`} />
        </button>
      </div>
    </div>
  );
}
