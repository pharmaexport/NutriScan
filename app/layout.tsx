import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriScan Extreme",
  description: "Scanner nutritionnel sport extreme avec score performance, VNR Europe et analyse scientifique."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
