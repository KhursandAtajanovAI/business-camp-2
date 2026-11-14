import Link from "next/link";
import type { ReactNode } from "react";

// "main" is the one calm next step of a screen. Use it once per screen.
export type ButtonTone = "main" | "second" | "quiet";

const shape = "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-soft px-6 py-3 text-center font-bold sm:w-auto";
const tones: Record<ButtonTone, string> = {
  main: "bg-coral-deep text-surface shadow-soft hover:bg-ink",
  second: "border-2 border-lavender bg-surface text-ink hover:bg-lavender-soft",
  quiet: "text-lavender-deep underline decoration-lavender decoration-2 underline-offset-4 hover:bg-lavender-soft",
};

type ButtonProps = {
  children: ReactNode;
  tone?: ButtonTone;
  href?: string; // a link to another screen
  download?: string; // file name, for a link that saves a file
  onClick?: () => void;
  type?: "button" | "submit";
  waiting?: boolean; // true while we are working: the button rests and says so
  className?: string;
};

export function Button({ children, tone = "main", href, download, onClick, type = "button", waiting = false, className = "" }: ButtonProps) {
  const look = `${shape} ${tones[tone]} ${waiting ? "opacity-70" : ""} ${className}`;
  if (href && download) return <a href={href} download={download} className={look} onClick={onClick}>{children}</a>;
  if (href) return <Link href={href} className={look} onClick={onClick}>{children}</Link>;
  return (
    <button type={type} className={look} onClick={onClick} disabled={waiting} aria-busy={waiting}>
      {children}
    </button>
  );
}
