import euVnrData from "../../data/eu-vnr-targets.json";

export type EuTargetKind = "vnr" | "ri";
export type EuTargetRole = "target" | "limit" | "energy";

export type EuTarget = {
  key: string;
  label_fr: string;
  unit: "kJ" | "kcal" | "g" | "mg" | "ug";
  target: number;
  kind: EuTargetKind;
  role: EuTargetRole;
};

export type EuVnrResult = EuTarget & {
  amount: number;
  percent: number;
  label: string;
};

const data = euVnrData as { targets: EuTarget[] };

export const EU_TARGETS = data.targets;

const aliases: Record<string, string> = {
  energy: "energy_kcal",
  energy_kcal: "energy_kcal",
  energy_kj: "energy_kj",
  fat: "fat_g",
  lipides: "fat_g",
  saturated_fat: "saturated_fat_g",
  saturated_fat_g: "saturated_fat_g",
  sucres: "sugars_g",
  sugars: "sugars_g",
  carbohydrates: "carbohydrates_g",
  glucides: "carbohydrates_g",
  protein: "protein_g",
  proteins: "protein_g",
  proteines: "protein_g",
  salt: "salt_g",
  sel: "salt_g",
  calcium: "calcium_mg",
  magnesium: "magnesium_mg",
  potassium: "potassium_mg",
  sodium: "salt_g",
  iron: "iron_mg",
  fer: "iron_mg",
  zinc: "zinc_mg",
  iodine: "iodine_ug",
  iode: "iodine_ug",
  selenium: "selenium_ug",
  vitamin_a: "vitamin_a_ug",
  vitamine_a: "vitamin_a_ug",
  vitamin_c: "vitamin_c_mg",
  vitamine_c: "vitamin_c_mg",
  vitamin_d: "vitamin_d_ug",
  vitamine_d: "vitamin_d_ug",
  vitamin_e: "vitamin_e_mg",
  vitamine_e: "vitamin_e_mg",
  vitamin_k: "vitamin_k_ug",
  vitamine_k: "vitamin_k_ug",
  vitamin_b6: "vitamin_b6_mg",
  vitamin_b12: "vitamin_b12_ug",
  folate: "folic_acid_ug",
  folates: "folic_acid_ug"
};

export function normalizeNutrientKey(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function resolveEuTarget(key: string) {
  const normalized = normalizeNutrientKey(key);
  const canonical = aliases[normalized] || normalized;
  return EU_TARGETS.find((target) => target.key === canonical) || null;
}

export function euVnrPercent(amount: number, target: EuTarget) {
  if (!Number.isFinite(amount) || target.target <= 0) return null;
  return Math.round((amount / target.target) * 100);
}

export function withEuVnrTarget(key: string, amount: number): EuVnrResult | null {
  const target = resolveEuTarget(key);
  if (!target) return null;
  const percent = euVnrPercent(amount, target);
  if (percent === null) return null;

  return {
    ...target,
    amount,
    percent,
    label: `${target.label_fr}: ${amount} ${target.unit} = ${percent}% ${target.kind.toUpperCase()} Europe`
  };
}
