import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { nunito } from "@/design/font";
import { common } from "./_strings/common";
import "./globals.css";

export const metadata: Metadata = { title: common.brand, description: common.description };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
