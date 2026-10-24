import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ProductResponse = {
  found: boolean;
  code: string;
  product?: {
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
};

function numberOrNull(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const rawCode = request.nextUrl.searchParams.get("code") || "";
  const code = rawCode.trim();

  // Only recognized barcode lengths; reject oversized or malformed input before fetch.
  if (!/^[0-9]{8,14}$/.test(code)) {
    return NextResponse.json({ found: false, code, error: "Code barre invalide" }, { status: 400 });
  }

  const fields = [
    "code",
    "product_name_fr",
    "product_name",
    "brands",
    "image_front_url",
    "nutriscore_grade",
    "nova_group",
    "nutriments"
  ].join(",");

  const url = `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${fields}`;
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "User-Agent": "NutriScan/0.1 contact=pharmaexport"
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 3600 }
    });
  } catch {
    return NextResponse.json({ found: false, code, error: "Source produit indisponible" }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ found: false, code, error: "Source produit indisponible" }, { status: 502 });
  }

  const data = await response.json();

  if (data.status !== 1 || !data.product) {
    return NextResponse.json({ found: false, code } satisfies ProductResponse);
  }

  const product = data.product;
  const nutriments = product.nutriments || {};

  return NextResponse.json({
    found: true,
    code,
    product: {
      name: product.product_name_fr || product.product_name || "Produit sans nom",
      brand: product.brands || "Marque inconnue",
      image: product.image_front_url || null,
      nutriscore: product.nutriscore_grade || null,
      nova: numberOrNull(product.nova_group),
      energyKcal: numberOrNull(nutriments["energy-kcal_100g"]),
      proteins: numberOrNull(nutriments.proteins_100g),
      sugars: numberOrNull(nutriments.sugars_100g),
      salt: numberOrNull(nutriments.salt_100g),
      fat: numberOrNull(nutriments.fat_100g),
      saturatedFat: numberOrNull(nutriments["saturated-fat_100g"])
    }
  } satisfies ProductResponse);
}
