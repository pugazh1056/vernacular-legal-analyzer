"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getStoredProfileLanguage,
  PREFERENCES_CHANGED_EVENT,
  setStoredProfileLanguage,
} from "@/lib/profile-preferences";

/**
 * Preferred language for upload/analysis/chat; synced with profile modal via localStorage + event.
 */
export function usePreferredOutputLanguage(): [string, (v: string) => void] {
  const [code, setCode] = useState("en-US");

  useEffect(() => {
    setCode(getStoredProfileLanguage());
  }, []);

  useEffect(() => {
    const fn = () => setCode(getStoredProfileLanguage());
    window.addEventListener(PREFERENCES_CHANGED_EVENT, fn);
    return () => window.removeEventListener(PREFERENCES_CHANGED_EVENT, fn);
  }, []);

  const persist = useCallback((v: string) => {
    setStoredProfileLanguage(v);
  }, []);

  return [code, persist];
}
