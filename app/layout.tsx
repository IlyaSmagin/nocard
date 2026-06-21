import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local'
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const _ndot57 = localFont({ src: '../public/fonts/Ndot57-Regular.otf', weight: '400', variable: '--font-ndot57', })
const _ndot57caps = localFont({ src: '../public/fonts/Ndot57Caps-Regular.otf', weight: '400', variable: '--font-ndot57caps', })
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Cardholder",
  description: "Your digital loyalty cards, always offline.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cardholder",
    startupImage: "/icons/icon-192.png",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${_ndot57.variable} ${_ndot57caps.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Cardholder" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
