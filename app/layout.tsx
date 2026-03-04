import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config/site";
import { ToastsProvider } from "@/components/ui/Toasts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-family",
});

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.tagline,
  openGraph: { type: "website", siteName: SITE.name },
  icons: { icon: SITE.faviconPath, apple: SITE.faviconPath },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={`${inter.className} antialiased`}>
        <ToastsProvider>{children}</ToastsProvider>
      </body>
    </html>
  );
}
