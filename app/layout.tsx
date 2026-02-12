import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Dreams Saver - Track and Analyze Your Dreams",
  description: "Record your dreams and receive AI-powered insights to understand their meaning and significance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cormorant.variable} antialiased`}>
        <div className="min-h-screen relative">
          <div className="ethereal-bg fixed inset-0 pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
