import ScannerClient from "./ScannerClient";

export const metadata = {
  title: "Scan produit | NutriScan Extreme",
  description: "Scanner un code barre alimentaire et analyser le produit avec Open Food Facts."
};

export default function ScanPage() {
  return <ScannerClient />;
}
