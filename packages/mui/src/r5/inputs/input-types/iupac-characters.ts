/**
 * IUPAC characters that are commonly needed when typing chemical formulas and reactions,
 * grouped by domain.
 */
export type IupacCharacterGroup =
  | "default"
  | "operators"
  | "greek"
  | "greekCapital"
  | "romanNumerals";

function range(start: number, end: number, skip?: number): string[] {
  const characters: string[] = [];
  for (let codePoint = start; codePoint <= end; codePoint++) {
    if (codePoint === skip) {
      continue;
    }
    characters.push(String.fromCodePoint(codePoint));
  }
  return characters;
}

export const IUPAC_CHARACTER_GROUPS: Record<IupacCharacterGroup, string[]> = {
  // Isotope / stereochemistry prefixes
  default: ["\u1D05", "\u029F", "\u0274"],
  operators: [
    "\u00B1",
    "\u2264",
    "\u2265",
    "\u2190",
    "\u2192",
    "\u2194",
    "\u21CC",
  ],
  greek: range(945, 969, 962), // skip final sigma
  greekCapital: range(913, 937, 930), // skip final sigma
  romanNumerals: range(8544, 8555),
};

export const IUPAC_GROUP_LABELS: Record<IupacCharacterGroup, string> = {
  default: "\u1D05",
  operators: "\u00B1",
  greek: "\u03B1",
  greekCapital: "\u0391",
  romanNumerals: "\u216B",
};
