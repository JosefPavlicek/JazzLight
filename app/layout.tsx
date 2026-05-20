import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JazzLight",
  description: "Komorní hudba pro koncerty, hotelové večery a společenské akce."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="cs"><body>{children}</body></html>;
}
