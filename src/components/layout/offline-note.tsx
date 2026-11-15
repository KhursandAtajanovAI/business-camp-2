"use client";

import { useEffect, useState } from "react";
import { states } from "@/app/_strings/states";

// When the connection drops, say so calmly and say what still works.
// Reading and checking a paper happen on the device, so nothing is lost.
export function OfflineNote() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return <p role="status" className="mb-4 rounded-soft bg-amber-soft p-4">{states.offline}</p>;
}
