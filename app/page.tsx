const metrics = [
  { label: "Performance", value: "91", detail: "Carburant propre pour effort long" },
  { label: "Recup", value: "84", detail: "Proteines + magnesium + B12" },
  { label: "Glycemie", value: "A-", detail: "Sucres rapides sous controle" }
];

const vnr = [
  { nutrient: "Magnesium", amount: "120 mg", percent: 32 },
  { nutrient: "Vitamine B12", amount: "1.8 ug", percent: 72 },
  { nutrient: "Fer", amount: "4.2 mg", percent: 30 },
  { nutrient: "Proteines", amount: "24 g", percent: 48 }
];

const science = [
  "VNR Europe integrees pour micronutriments et apports de reference.",
  "Score sport separe : energie utile, proteines, sel, sucres, densite micronutritionnelle.",
  "Lecture scientifique : NOVA, charge glycemique, qualite proteique, niveau de preuve.",
  "Sources prevues : Open Food Facts, CIQUAL, ANSES et references UE."
];

export default function HomePage() {
  return (
    <main className="pageShell">
      <nav className="topbar">
        <div className="brand"><span>NS</span> NutriScan</div>
        <div className="navLinks"><a href="#scan">Scan</a><a href="#science">Science</a><a href="#vnr">VNR Europe</a></div>
      </nav>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Nutrition sport extreme</p>
          <h1>Scanne ton produit. Vois s'il tient la route en performance reelle.</h1>
          <p className="lead">Une interface consumer simple, mais un moteur plus scientifique : carburant, recuperation, micronutriments, glycemie et niveau de preuve.</p>
          <div className="actions"><a className="primary" href="#scan">Simuler un scan</a><a className="secondary" href="#science">Voir le moteur science</a></div>
        </div>

        <div className="phone" id="scan">
          <div className="scanHeader"><span className="dot" /> Scan produit</div>
          <div className="barcode"><span /><span /><span /><span /><span /><span /><span /></div>
          <div className="productCard">
            <div><p className="muted">Produit test</p><h2>Barre endurance cacao</h2></div>
            <div className="grade">A</div>
          </div>
          <div className="scoreRing"><strong>91</strong><span>Score extreme</span></div>
          <div className="warning good">Bon choix avant sortie longue</div>
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
