import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gerador de UTM Grátis | UTM Rápido",
    template: "%s | UTM Rápido",
  },
  description:
    "Crie links UTM rastreáveis em segundos. Grátis para uso básico. Plano Pro para gestores de tráfego com histórico, clientes e link compartilhável. Sem planilha.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://utmrapido.com.br"
  ),
  openGraph: {
    siteName: "UTM Rápido",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
