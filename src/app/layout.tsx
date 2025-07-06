import type { Metadata } from "next";
import { Saira, Manrope } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
        className={`${saira.variable} ${manrope.variable} antialiased bg-gray-50`}
      >
        <header className="bg-soma-petroleo p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/">
                  <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} className="h-10 w-auto" />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                 <Link href="/sales" className="text-white hover:text-soma-aquamarina transition-colors font-medium">Sales</Link>
                 <Link href="/expenses" className="text-white hover:text-soma-aquamarina transition-colors font-medium">Expenses</Link>
                 <Link href="/projections" className="text-white hover:text-soma-aquamarina transition-colors font-medium">Projections</Link>
                 <Link href="/market-research" className="text-white hover:text-soma-aquamarina transition-colors font-medium">Market Intelligence</Link>
                 <Link href="/business-model" className="text-white hover:text-soma-aquamarina transition-colors font-medium">Business Model</Link>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
