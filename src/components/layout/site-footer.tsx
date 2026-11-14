import Link from "next/link";
import { common } from "@/app/_strings/common";
import { footerLinks } from "@/app/_strings/links";

// The same honest sentence under every screen, plus quiet links to the calm corners of the site.
export function SiteFooter() {
  return (
    <footer className="mt-10 flex flex-col gap-3 border-t-2 border-lavender-soft pt-5 text-ink-soft">
      {footerLinks.length > 0 && (
        <nav aria-label="More" className="flex flex-wrap gap-x-5">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-12 items-center font-bold text-lavender-deep underline decoration-lavender decoration-2 underline-offset-4">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      <p>{common.disclaimer}</p>
    </footer>
  );
}
