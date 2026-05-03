import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Monceri | Letreros neon, acrilico y MDF",
  description:
    "Letreros personalizados de neon LED, acrilico y MDF con cotizacion por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
