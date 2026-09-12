import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SuppressThreeClockWarning from "@/components/ui/SuppressThreeClockWarning";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohit // Minecraft 3D Voxel Web Portfolio",
  description:
    "Interactive 3D Minecraft voxel adventure portfolio featuring a walking voxel character, opening 3D chests, crafting tables, and 60fps creative engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full bg-[#38bdf8] text-slate-100 flex flex-col selection:bg-lime-500 selection:text-black">
        <SuppressThreeClockWarning />
        {children}
      </body>
    </html>
  );
}
