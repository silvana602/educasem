import type { Metadata } from "next";
import { geistSans, geistMono } from "@/config/fonts";
import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: "Educasem",
  description: "Plataforma educativa de Cecasem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>      </body>
    </html>
  );
}
