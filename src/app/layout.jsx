import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "aidatasucks.com",
  description:
    "Which AI vendors actually let you track what you spend? A FinOps comparison of cost and usage APIs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} ${plexMono.variable} antialiased`}>
        <div className="noise" />
        <SiteHeader />
        <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
