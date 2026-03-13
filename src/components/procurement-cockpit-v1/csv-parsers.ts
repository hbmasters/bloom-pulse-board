/* ── CSV Parsers for Inkooplijst & Voorraadlijst ── */

export interface InkoopRow {
  soort: string;
  artikel: string;
  klant: string;
  prijs: number;
  kleurCode: string;
  datum: string;
  aantal: number;
}

export interface VoorraadRow {
  soort: string;
  lengte: string;
  partij: string;
  aantal: number;
  artikel: string;
  inkoopprijs: number;
  opmerking: string;
}

export interface MatchedLine {
  key: string; // normalized article base name
  soort: string;
  artikel: string;
  lengte: string;
  kleurCodes: string[];
  klanten: { klant: string; aantal: number; datum: string; prijs: number }[];
  behoefte: number; // total from inkooplijst
  voorraad: number; // total from voorraadlijst
  benodigd: number; // behoefte - voorraad
  status: "gedekt" | "deels_gedekt" | "niet_gedekt" | "overschot";
  voorraadDetails: { partij: string; aantal: number; prijs: number }[];
}

/* ── Number parsing helpers ── */
// Dutch formatted number: dots = thousands, comma = decimal
function parseDutchNumber(raw: string): number {
  if (!raw || raw.trim() === "") return 0;
  const cleaned = raw.trim().replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/* ── Simple CSV line parser (handles quoted fields) ── */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/* ── Parse Inkooplijst CSV ──
   Column mapping (0-indexed):
   0: "Inkooplijst" (skip)
   1: subtitle (skip)
   2: Soort (flower family)
   3: (empty)
   4: Aantal (quantity, dots = thousands)
   5: Artikel (article name)
   6: Klant (customer)
   7: Prijs (price, comma = decimal)
   8: Kleur code (PA, WI, RZ, etc.)
   9: Datum (delivery date)
   10+: stock ref / footer (skip)
*/
export function parseInkooplijst(csvText: string): InkoopRow[] {
  const lines = csvText.split("\n").filter(l => l.trim().length > 0);
  const rows: InkoopRow[] = [];

  for (const line of lines) {
    const cols = parseCSVLine(line);
    if (cols.length < 10) continue;
    if (cols[0]?.trim() !== "Inkooplijst") continue;

    const soort = cols[2]?.trim() || "";
    const artikel = cols[5]?.trim() || "";
    const klant = cols[6]?.trim() || "";
    const kleurCode = cols[8]?.trim() || "";
    const datum = cols[9]?.trim() || "";

    if (!soort || !artikel) continue;

    const aantal = parseDutchNumber(cols[4]);
    const prijs = parseDutchNumber(cols[7]);

    rows.push({ soort, artikel, klant, prijs, kleurCode, datum, aantal });
  }
  return rows;
}

/* ── Parse Voorraadlijst CSV ──
   Column mapping (0-indexed):
   0-9: repeated headers (skip)
   10: Soort (flower family)
   11: Lengte (stem length, may be empty)
   12: Partij (batch number)
   13: Aantal / AVE x APE (quantity, commas = thousands)
   14: Artikel (article name)
   15: Inkoopprijs (price, comma = decimal)
   16: Opmerking (notes, optional)
   17-18: footer (skip)
*/
export function parseVoorraadlijst(csvText: string): VoorraadRow[] {
  const lines = csvText.split("\n").filter(l => l.trim().length > 0);
  const rows: VoorraadRow[] = [];

  for (const line of lines) {
    const cols = parseCSVLine(line);
    if (cols.length < 15) continue;
    if (cols[0]?.trim() !== "Voorraadlijst Snijbloemen") continue;

    const soort = cols[10]?.trim() || "";
    const lengte = cols[11]?.trim() || "";
    const partij = cols[12]?.trim() || "";
    const artikel = cols[14]?.trim() || "";

    if (!soort || !artikel) continue;

    const aantal = parseDutchNumber(cols[13]);
    const inkoopprijs = parseDutchNumber(cols[15]);
    const opmerking = cols[16]?.trim() || "";

    rows.push({ soort, lengte, partij, aantal, artikel, inkoopprijs, opmerking });
  }
  return rows;
}

/* ── Normalize article name for matching ──
   Strips length info (e.g. "65cm", "70cm 35gr") and normalizes whitespace
*/
export function normalizeArtikel(name: string): string {
  return name
    .toUpperCase()
    .replace(/\d+\s*cm(\s+\d+\s*gr)?/gi, "") // remove "65cm", "70cm 35gr"
    .replace(/\d+\s*gr/gi, "") // remove standalone "35gr"
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Match inkooplijst against voorraadlijst ── */
export function matchLists(
  inkoop: InkoopRow[],
  voorraad: VoorraadRow[]
): MatchedLine[] {
  // Group inkoop by normalized artikel
  const inkoopGroups = new Map<string, {
    soort: string;
    artikel: string;
    kleurCodes: Set<string>;
    klanten: { klant: string; aantal: number; datum: string; prijs: number }[];
    total: number;
  }>();

  for (const row of inkoop) {
    const key = normalizeArtikel(row.artikel);
    if (!inkoopGroups.has(key)) {
      inkoopGroups.set(key, {
        soort: row.soort,
        artikel: row.artikel,
        kleurCodes: new Set(),
        klanten: [],
        total: 0,
      });
    }
    const g = inkoopGroups.get(key)!;
    if (row.kleurCode) g.kleurCodes.add(row.kleurCode);
    g.klanten.push({ klant: row.klant, aantal: row.aantal, datum: row.datum, prijs: row.prijs });
    g.total += row.aantal;
  }

  // Group voorraad by normalized artikel
  const voorraadGroups = new Map<string, {
    soort: string;
    artikel: string;
    lengte: string;
    total: number;
    details: { partij: string; aantal: number; prijs: number }[];
  }>();

  for (const row of voorraad) {
    const key = normalizeArtikel(row.artikel);
    if (!voorraadGroups.has(key)) {
      voorraadGroups.set(key, {
        soort: row.soort,
        artikel: row.artikel,
        lengte: row.lengte,
        total: 0,
        details: [],
      });
    }
    const g = voorraadGroups.get(key)!;
    g.total += row.aantal;
    g.details.push({ partij: row.partij, aantal: row.aantal, prijs: row.inkoopprijs });
    if (!g.lengte && row.lengte) g.lengte = row.lengte;
  }

  // Merge: start with all inkoop items
  const allKeys = new Set([...inkoopGroups.keys(), ...voorraadGroups.keys()]);
  const results: MatchedLine[] = [];

  for (const key of allKeys) {
    const ig = inkoopGroups.get(key);
    const vg = voorraadGroups.get(key);

    const behoefte = ig?.total ?? 0;
    const voorraadTotal = vg?.total ?? 0;
    const benodigd = behoefte - voorraadTotal;

    let status: MatchedLine["status"];
    if (behoefte === 0) status = "overschot";
    else if (voorraadTotal >= behoefte) status = "gedekt";
    else if (voorraadTotal > 0) status = "deels_gedekt";
    else status = "niet_gedekt";

    results.push({
      key,
      soort: ig?.soort ?? vg?.soort ?? "",
      artikel: ig?.artikel ?? vg?.artikel ?? "",
      lengte: vg?.lengte ?? "",
      kleurCodes: ig ? [...ig.kleurCodes] : [],
      klanten: ig?.klanten ?? [],
      behoefte,
      voorraad: voorraadTotal,
      benodigd: Math.max(0, benodigd),
      status,
      voorraadDetails: vg?.details ?? [],
    });
  }

  // Sort: niet_gedekt first, then deels_gedekt, then gedekt, then overschot
  const statusOrder: Record<string, number> = { niet_gedekt: 0, deels_gedekt: 1, gedekt: 2, overschot: 3 };
  results.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) || b.behoefte - a.behoefte);

  return results;
}
