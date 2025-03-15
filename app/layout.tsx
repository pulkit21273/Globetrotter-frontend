import type { Metadata } from "next";
import { Urbanist } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";

import "@/app/globals.css";
import Navbar from "@/components/navbar";

const urban = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Globetrotter",
  description: "A fun destination guessing game!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${urban.className} antialiased`}>
        <ModalProvider />
        <Navbar />
        <div className="h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}