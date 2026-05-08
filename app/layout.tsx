import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hospedaje Rich & Eissa B",
  description: "Reserva tu estadía en un hospedaje hogareño y acogedor en San Miguel",
  
  openGraph: {
  title: "Hospedaje Rich & Eissa B",
  description:
    "Reserva tu estadía en un hospedaje hogareño y acogedor en San Miguel, Lima.",
  images: ["/og-image.jpg"],
},


};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* MATERIAL SYMBOLS */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
      </head>

      <body className="font-sans bg-white text-gray-900">
        <Navbar />
        <WhatsAppButton />
        {children}
      </body>
    </html>
  );
}