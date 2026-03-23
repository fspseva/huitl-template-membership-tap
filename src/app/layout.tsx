import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Membership",
  description: "Powered by HUITL Protocol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4">
        {children}
      </body>
    </html>
  );
}
