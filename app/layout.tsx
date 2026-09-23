import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peak Gaming Suceava — 14 stații PS5 și PC",
  description:
    "Sală de gaming în Suceava: 5 stații PlayStation 5, 9 PC-uri și un post cu volan. Zilnic 12:00–24:00, Strada Leca Morariu 2B.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800;900&family=Manrope:wght@400;500;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
