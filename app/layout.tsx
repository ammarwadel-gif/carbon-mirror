import type { Metadata } from "next";
import localFont from "next/font/local";
import NotificationManager from "@/components/Notification";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css" with { type: "css" };

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CarbonMirror - See Your Environmental Impact",
  description: "Watch your planet react to your daily choices. Track your carbon footprint in real-time with our interactive 3D Earth.",
  keywords: "carbon footprint, climate change, environment, sustainability, eco-friendly",
  authors: [{ name: "CarbonMirror" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NotificationManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}