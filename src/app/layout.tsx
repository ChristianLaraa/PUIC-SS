import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema PUIC de Expedientes | UNAM - 475 Años",
  description: "Sistema institucional de gestión y seguimiento de expedientes de Servicio Social y Prácticas Profesionales - PUIC UNAM. 475 Aniversario de la Universidad de México.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#FBF9F5] text-[#0E1B2E] antialiased min-h-screen font-sans selection:bg-[#C68A2C]/25 selection:text-[#0A1E42]">
        <AppShell user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}