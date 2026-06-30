const metrics = [
  { label: "Performance", value: "Scan", detail: "Camera EAN / UPC active sur mobile" },
  { label: "Base", value: "OFF", detail: "Recherche produit via Open Food Facts" },
  { label: "Science", value: "VNR", detail: "Targets Europe et score sport" }
];

const vnr = [
  { nutrient: "Magnesium", amount: "120 mg", percent: 32 },
  { nutrient: "Vitamine B12", amount: "1.8 ug", percent: 72 },
  { nutrient: "Fer", amount: "4.2 mg", percent: 30 },
  { nutrient: "Proteines", amount: "24 g", percent: 48 }
];

const science = [
  "Scan reel par camera sur la page /scan.",
  "Lookup produit via Open Food Facts, sans base proprietaire copiee.",
  "Score sport separe : proteines, sucres, sel, satures, NOVA et Nutri-Score.",
  "Targets Europe integrees pour VNR et apports de reference."
];

export default function HomePage() {
  return (
    <main className="pageShell">
      <nav className="topbar">
        <div className="brand"><span>NS</span> NutriScan</div>
        <div className="navLinks"><a href="/scan">Scan reel</a><a href="#science">Science</a><a href="#vnr">VNR Europe</a></div>
      </nav>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Nutrition sport extreme</p>
          <h1>Scanne un vrai code barre alimentaire.</h1>
          <p className="lead">La home ne simule plus de produit. Clique sur le bouton, autorise la camera, puis scanne un EAN / UPC reel ou saisis le code manuellement.</p>
          <div className="actions"><a className="primary" href="/scan">Ouvrir la camera</a><a className="secondary" href="#science">Voir le moteur science</a></div>
        </div>

        <div className="phone" id="scan">
          <div className="scanHeader"><span className="dot" /> Scanner reel</div>
          <div className="liveScanCard">
            <span className="cameraIcon">⌁</span>
            <h2>Aucun faux code-barres</h2>
            <p>Le scan fonctionne sur la page dediee avec camera mobile et saisie manuelle de secours.</p>
            <a className="primary" href="/scan">Aller au scan</a>
          </div>
          <div className="warning good">Source produit : Open Food Facts</div>
        </div>
      </section>

      <section className="metricsGrid">
        {metrics.map((item) => <article className="metric" key={item.label}><span>{item.label}</span><strong>{item.value}</strong><p>{item.detail}</p></article>)}
      </section>

      <section className="split" id="vnr">
        <div><p className="eyebrow">Targets Europe</p><h2>% VNR et apports de reference lisibles en un coup d'oeil.</h2><p>Le site utilise les targets ajoutees dans le repo pour transformer les nutriments en pourcentages exploitables par portion.</p></div>
        <div className="vnrCard">
          {vnr.map((row) => <div className="vnrRow" key={row.nutrient}><div><strong>{row.nutrient}</strong><span>{row.amount}</span></div><div className="bar"><i style={{ width: `${row.percent}%` }} /></div><b>{row.percent}%</b></div>)}
        </div>
      </section>

      <section className="science" id="science">
        <p className="eyebrow">Differenciation</p><h2>Comme un scanner grand public, mais pense pour athletes, trail, combat, musculation et ultra.</h2>
        <div className="scienceGrid">{science.map((text) => <article key={text}>{text}</article>)}</div>
      </section>
    </main>
  );
}
