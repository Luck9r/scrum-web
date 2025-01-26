import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Scrum Web App",
    description: "A simple scrum application.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="coffee">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className="bg-base-100 flex">

            <main className="p-10 flex-grow">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}
