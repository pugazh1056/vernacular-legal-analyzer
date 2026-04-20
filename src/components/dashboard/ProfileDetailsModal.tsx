"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getStoredProfileLanguage,
  LANGUAGE_OPTIONS,
  setStoredProfileLanguage,
} from "@/lib/profile-preferences";

type ProfileDetailsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ProfileDetailsModal({ open, onClose }: ProfileDetailsModalProps) {
  const { user } = useAuth();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    if (!open) return;
    setLanguage(getStoredProfileLanguage());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  if (!open || !user) return null;

  const initial = user.username.charAt(0).toUpperCase() || "?";

  const onSave = () => {
    setStoredProfileLanguage(language);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close profile overlay"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/50"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-[101] w-full max-w-md rounded-2xl bg-white p-8 shadow-xl outline-none dark:border dark:border-slate-600 dark:bg-slate-900"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e8d48a] to-[#c9a227] text-xl font-semibold text-white shadow-md">
            {initial}
          </span>
          <h2 id={titleId} className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
            Profile Details
          </h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/90">
          <div className="border-b border-slate-200/90 px-4 py-3 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Full Name:</p>
            <p className="mt-0.5 font-bold text-slate-900 dark:text-slate-100">{user.username}</p>
          </div>
          <div className="border-b border-slate-200/90 px-4 py-3 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Email:</p>
            <p className="mt-0.5 break-all font-bold text-slate-900 dark:text-slate-100">{user.email}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status:</p>
            <p className="mt-0.5 font-bold text-emerald-600 dark:text-emerald-400">Active</p>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="profile-language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Preferred Language:
          </label>
          <div className="relative mt-2">
            <select
              id="profile-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="min-h-11 w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 outline-none ring-[#c9a227] focus:border-transparent focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onSave}
            className="min-h-11 flex-1 rounded-xl bg-gradient-to-b from-[#d4b84a] to-[#b8962e] px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 dark:from-amber-500 dark:to-amber-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-xl bg-slate-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
