import type { Metadata } from "next";
import { Saira, Manrope } from "next/font/google";
import "./globals.css";

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Soma Dashboard - Financial Analytics",
  description: "Financial dashboard for Soma - Real-time analytics from Google Sheets",
  icons: {
    icon: "/Assets/Soma_Logo.png",
    shortcut: "/Assets/Soma_Logo.png",
    apple: "/Assets/Soma_Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${saira.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
