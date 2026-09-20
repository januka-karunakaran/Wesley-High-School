import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wesley High School, Kalmunai | Utmost for the Highest",
  description: "Official Web Portal of Wesley High School, Kalmunai, Sri Lanka. Established in 1885. Motto: 'Utmost for the Highest'. Dedicated to academic excellence, character building, and leadership.",
  keywords: ["Wesley High School", "Kalmunai", "Sri Lanka Schools", "Utmost for the Highest", "Wesley College Kalmunai", "National School Sri Lanka"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

