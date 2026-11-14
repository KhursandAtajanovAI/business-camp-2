import Link from "next/link";
import type { ReactNode } from "react";
import { common } from "@/app/_strings/common";
import { Sprout } from "@/design/illustrations";
import { Backdrop } from "./backdrop";
import { BackLater } from "./back-later";
import { SiteFooter } from "./site-footer";

// The frame every screen sits in: name, "Back later", the screen itself, the disclaimer.
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-8">
      <Backdrop />
      <header className="flex items-center justify-between gap-2 py-3">
        <Link href="/" className="inline-flex min-h-12 items-center gap-2 font-extrabold text-ink">
          <Sprout stage={2} className="h-10 w-10 shrink-0" />
          {common.brand}
        </Link>
        <BackLater />
      </header>
      <main className="flex flex-1 flex-col gap-6 pt-2">{children}</main>
      <SiteFooter />
    </div>
  );
}
