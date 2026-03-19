import type { Metadata, Viewport } from "next";
import StyledComponentsRegistry from "@/components/layout/Registry";
import ClientLayout from "@/components/layout/ClientLayout";
import { assetUrl } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Ordem Paranormal RPG",
  description:
    "Consulta de regras, tabelas, rolagens e ameaças do Escudo do Mestre.",
  manifest: assetUrl("/manifest.json"),
  appleWebApp: {
    capable: true,
    title: "Escudo Mestre",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: assetUrl("/icons/header-icon.png"),
    apple: assetUrl("/icons/icon-192.png"),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e1419",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
