"use client";

import { useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

const STORAGE_KEY = "ebenezer_form_draft";
const SAVE_DELAY = 1000; // 1s debounce

export function useFormPersistence<T extends object>(form: UseFormReturn<any>) {
  const { watch, reset } = form;

  // Restore saved data on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Don't restore file fields
        const { photo, ...rest } = parsed;
        reset(rest, { keepDefaultValues: true });
      }
    } catch {
      // Ignore corrupt storage data
    }
  }, [reset]);

  // Auto-save on change with debounce
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const subscription = watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (typeof window === "undefined") return;
        try {
          const { photo, ...rest } = values as any;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        } catch {
          // Storage full or unavailable
        }
      }, SAVE_DELAY);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [watch]);

  const clearSaved = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const hasSavedData = useCallback((): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return { clearSaved, hasSavedData };
}
