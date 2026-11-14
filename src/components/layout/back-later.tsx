"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { writeStored } from "@/app/_session/storage";
import { common } from "@/app/_strings/common";

// A tired parent can stop at any moment. Everything is already saved on the device;
// this button remembers the screen and the home page offers the way back in one tap.
export function BackLater() {
  const pathname = usePathname();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const onHome = pathname === "/";

  function leave() {
    if (!onHome) writeStored("resume", pathname + window.location.search);
    setSaved(true);
    if (!onHome) router.push("/");
  }

  return (
    <div className="relative shrink-0">
      <button type="button" onClick={leave} className="min-h-12 rounded-soft px-3 font-bold text-lavender-deep hover:bg-lavender-soft">
        {common.backLater}
      </button>
      {saved && onHome && (
        <p role="status" className="absolute right-0 top-full z-10 w-60 rounded-soft bg-sage-soft p-3 text-ink shadow-soft">
          {common.backLaterSaved}
        </p>
      )}
    </div>
  );
}
