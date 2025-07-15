import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TemplateProvider } from "@/context/TemplateContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Constructor de Plantillas Web Interactivo",
  description: "Crea tu plantilla web paso a paso con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-100`}>
        <TemplateProvider>
          <main>{children}</main>
        </TemplateProvider>
      </body>
    </html>
  );
}
