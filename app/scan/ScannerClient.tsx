"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./scan.module.css";

type Product = {
  name: string;
  brand: string;
  image: string | null;
  nutriscore: string | null;
  nova: number | null;
  energyKcal: number | null;
  proteins: number | null;
  sugars: number | null;
  salt: number | null;
  fat: number | null;
  saturatedFat: number | null;
};

type ApiResult = {
  found: boolean;
  code: string;
  error?: string;
  product?: Product;
};

type ScannerInstance = {
  start: (...args: any[]) => Promise<unknown>;
  stop: () => Promise<unknown>;
  clear: () => Promise<unknown>;
};

const scannerId = "nutriscan-reader";

function sportScore(product: Product) {
  let score = 70;
  if ((product.proteins || 0) >= 10) score += 12;
  if ((product.sugars || 0) > 15) score -= 12;
  if ((product.saturatedFat || 0) > 5) score -= 8;
  if ((product.salt || 0) > 1.2) score -= 7;
  if (product.nova && product.nova >= 4) score -= 10;
  if (product.nutriscore === "a") score += 8;
  if (product.nutriscore === "e") score -= 14;
  return Math.max(0, Math.min(100, score));
}

export default function ScannerClient() {
  const scannerRef = useRef<ScannerInstance | null>(null);
  const [manualCode, setManualCode] = useState("3017620422003");
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("Pret a scanner un EAN / GTIN alimentaire.");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  const score = useMemo(() => result?.product ? sportScore(result.product) : null, [result]);

  async function lookup(code: string) {
    const cleaned = code.replace(/[^0-9]/g, "");
    if (cleaned.length < 8) {
      setMessage("Code trop court. Scanne ou saisis un EAN valide.");
      return;
    }

    setLoading(true);
    setMessage(`Recherche produit ${cleaned}...`);

    try {
      const response = await fetch(`/api/product?code=${cleaned}`);
      const data = await response.json() as ApiResult;
      setResult(data);
      setManualCode(cleaned);
      setMessage(data.found ? "Produit trouve." : "Produit absent de la base ouverte.");
    } catch {
      setMessage("Erreur reseau pendant la recherche produit.");
    } finally {
      setLoading(false);
    }
  }

  async function startScanner() {
    setMessage("Ouverture camera...");

    try {
      const module = await import("html5-qrcode");
      const scanner = new module.Html5Qrcode(scannerId) as ScannerInstance;
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 160 }, aspectRatio: 1.6 },
        async (decodedText: string) => {
          const code = decodedText.replace(/[^0-9]/g, "");
          if (code.length >= 8) {
            await stopScanner();
            await lookup(code);
          }
        },
        () => undefined
      );

      setScanning(true);
      setMessage("Camera active. Place le code barre dans le cadre.");
    } catch {
      setMessage("Camera indisponible. Autorise la camera ou utilise la saisie manuelle.");
      setScanning(false);
    }
  }

  async function stopScanner() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setScanning(false);

    if (!scanner) return;
    try {
      await scanner.stop();
      await scanner.clear();
    } catch {
      // Ignore camera cleanup errors.
    }
  }

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, []);

  return (
    <main className={`pageShell ${styles.scannerPage}`}>
      <nav className="topbar">
        <a className="brand" href="/"><span>NS</span> NutriScan</a>
        <div className="navLinks"><a href="/">Accueil</a><a href="#result">Resultat</a></div>
      </nav>

      <section className={styles.scannerHero}>
        <div>
          <p className="eyebrow">Scan reel</p>
          <h1>Scanne le code barre. NutriScan analyse le produit.</h1>
          <p className="lead">Camera mobile, lookup Open Food Facts, puis score sport extreme base sur proteines, sucres, sel, graisses saturees, NOVA et Nutri-Score.</p>
        </div>
      </section>

      <section className={styles.scannerGrid}>
        <div className={styles.scannerPanel}>
          <div id={scannerId} className={styles.reader} />
          <p className={styles.scanMessage}>{message}</p>
          <div className={styles.scanActions}>
            {!scanning ? <button className={`primary ${styles.button}`} onClick={startScanner}>Ouvrir la camera</button> : <button className={`secondary ${styles.button}`} onClick={stopScanner}>Stop camera</button>}
          </div>
        </div>

        <div className={styles.manualPanel}>
          <h2>Saisie manuelle</h2>
          <p>Utile sur mobile si le navigateur bloque la camera.</p>
          <input value={manualCode} onChange={(event) => setManualCode(event.target.value)} inputMode="numeric" placeholder="EAN / UPC / GTIN" />
          <button className={`primary ${styles.button}`} onClick={() => lookup(manualCode)} disabled={loading}>{loading ? "Recherche..." : "Analyser"}</button>
        </div>
      </section>

      <section className={styles.resultPanel} id="result">
        {!result && <p className="muted">Aucun produit analyse pour l'instant.</p>}
        {result && !result.found && <div className={styles.stateBox}><h2>Produit non trouve</h2><p>Code {result.code}. On pourra ajouter un formulaire contribution Open Food Facts ensuite.</p></div>}
        {result?.found && result.product && (
          <article className={styles.scanResult}>
            <div>
              <p className="eyebrow">Produit detecte</p>
              <h2>{result.product.name}</h2>
              <p className="muted">{result.product.brand}</p>
              <div className={styles.resultTags}><span>Nutri-Score {result.product.nutriscore || "?"}</span><span>NOVA {result.product.nova || "?"}</span></div>
            </div>
            <div className={`scoreRing ${styles.compact}`}><strong>{score}</strong><span>Sport</span></div>
            <div className={styles.nutrientList}>
              <p>Energie: {result.product.energyKcal ?? "?"} kcal / 100 g</p>
              <p>Proteines: {result.product.proteins ?? "?"} g</p>
              <p>Sucres: {result.product.sugars ?? "?"} g</p>
              <p>Sel: {result.product.salt ?? "?"} g</p>
              <p>Satures: {result.product.saturatedFat ?? "?"} g</p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
