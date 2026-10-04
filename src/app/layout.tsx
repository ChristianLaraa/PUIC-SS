import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema PUIC de Expedientes | UNAM",
  description: "Sistema institucional de gestión y seguimiento de expedientes de Servicio Social y Prácticas Profesionales - PUIC UNAM.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  return (
    <html lang="es" className={poppins.variable}>
      <body className="bg-[#FBF9F5] text-[#0E1B2E] antialiased min-h-screen font-sans selection:bg-[#C68A2C]/25 selection:text-[#0A1E42]">
        <AppShell user={user}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}