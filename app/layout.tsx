import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ToastProvider} from "@/components/providers/toast-provider";
import {ModalProvider} from "@/components/providers/modal-provider";
import {SpeedInsights} from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bagian Corps | Dashboard Invoice and Management",
  description: "Created by Bagian Corps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights />
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
