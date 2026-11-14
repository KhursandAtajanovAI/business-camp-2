import localFont from "next/font/local";

// Nunito: round and easy to read. The file lives in the repository (see fonts/),
// so the site never waits for another server to show its text.
export const nunito = localFont({
  src: "./fonts/nunito.woff2",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});
