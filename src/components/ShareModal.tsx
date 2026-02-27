"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import type { Answers } from "@/lib/scoring";
import { encodeAnswers } from "@/lib/share";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  answers: Answers;
}

type ModalState = "idle" | "copied";

export default function ShareModal({
  open,
  onClose,
  answers,
}: ShareModalProps) {
  const [state, setState] = useState<ModalState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const encoded = encodeAnswers(answers);
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/diagnostic-demo?r=${encoded}`;

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setState("idle"), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      track("link_shared");
      setState("copied");
    } catch {
      // Fallback: select the input text
      inputRef.current?.select();
    }
  }, [shareUrl]);

  const isCopied = state === "copied";

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-6
        transition-all duration-250 ease-out
        ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
      `}
      style={{ background: "rgba(26, 26, 26, 0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`
          bg-[var(--color-white)] rounded-2xl w-full max-w-md
          shadow-[0_25px_60px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.04)]
          transition-transform duration-300
          ${open ? "scale-100 translate-y-0" : "scale-[0.97] translate-y-3"}
        `}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="p-8">
          {!isCopied ? (
            <>
              <h3
                id="share-modal-title"
                className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1"
              >
                Share Your Results
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mb-7">
                Copy the link below to share your ICP clarity profile
              </p>

              <div className="mb-6">
                <label className="block font-[family-name:var(--font-heading)] text-[0.8rem] font-bold mb-1.5">
                  Shareable link
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={shareUrl}
                  readOnly
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full px-4 py-3 text-[0.85rem] font-[family-name:var(--font-mono)] border border-[var(--color-grey-light)] rounded-xl bg-[var(--color-tag-bg)] text-[var(--color-foreground)] outline-none transition-all duration-200 focus:border-[var(--color-orange)] focus:shadow-[0_0_0_3px_rgba(255,95,31,0.12)] select-all"
                />
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3.5 font-[family-name:var(--font-heading)] text-[0.9rem] font-bold text-white bg-[var(--color-orange)] border-none rounded-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,95,31,0.3)] hover:scale-[1.01]"
              >
                Copy Link
              </button>

              <button
                onClick={onClose}
                className="block w-full text-center mt-4 font-[family-name:var(--font-heading)] text-[0.8rem] font-bold text-[var(--color-grey)] bg-transparent border-none cursor-pointer hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[rgba(90,154,110,0.12)] inline-flex items-center justify-center mb-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a9a6e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
                Link copied!
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] leading-relaxed mb-6">
                The shareable link has been copied to your clipboard.
                Anyone with this link can view your diagnostic results.
              </p>
              <button
                onClick={onClose}
                className="inline-block px-10 py-3 font-[family-name:var(--font-heading)] text-sm font-bold border border-[var(--color-grey-light)] rounded-xl bg-transparent text-[var(--color-foreground)] cursor-pointer hover:border-[var(--color-foreground)] hover:bg-[var(--color-tag-bg)] transition-all duration-200"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
