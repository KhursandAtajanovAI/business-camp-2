"use client";

import { useCallback, useEffect, useState } from "react";
import { readStored, writeStored, type StoreKey } from "./storage";

// Reads a saved value after the page is on screen ("ready"), and saves changes back.
export function useStored<T>(key: StoreKey) {
  const [state, setState] = useState<{ value: T | null; ready: boolean }>({ value: null, ready: false });

  useEffect(() => {
    setState({ value: readStored<T>(key), ready: true });
  }, [key]);

  const save = useCallback(
    (value: T | null) => {
      writeStored(key, value);
      setState({ value, ready: true });
    },
    [key],
  );

  return { ...state, save };
}
