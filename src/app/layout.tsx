import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VieNeu TTS Studio",
  description: "Vietnamese Text-to-Speech with instant voice cloning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-[var(--sidebar-width)]">
            <Header />
            <main className="flex-1 p-6 pt-[calc(var(--header-height)+24px)]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
