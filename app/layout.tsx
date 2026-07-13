import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Publi — Marketplace de influenciadores",
  description:
    "Conecte criadores, marcas e agências com sugestões inteligentes, negociação, contrato, pagamento seguro e resultados mensuráveis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(spaceGrotesk.variable, manrope.variable)}
    >
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
