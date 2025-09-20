import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ClientOnly } from "@/components/client-only";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stacks Account History",
  description: "View your Stacks account history and transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col gap-8 w-full">
          <ClientOnly fallback={<div className="h-16 bg-slate-50" />}>
            <Navbar />
          </ClientOnly>
          {children}
        </div>
      </body>
    </html>
  );
}
