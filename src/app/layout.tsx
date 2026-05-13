import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "complAIs ISOSystem",
  description: "ISO 통합경영시스템 관리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#3B5BDB" />
        <meta name="apple-mobile-web-app-title" content="ISOSystem" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
