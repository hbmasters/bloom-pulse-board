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

/** Parse a whole-number quantity: commas and dots are ALWAYS thousands separators.
 *  "50" → 50, "1,050" → 1050, "1.050" → 1050 */
function parseQuantity(raw: string): number {
  if (!raw || raw.trim() === "") return 0;
  const cleaned = raw.trim().replace(/[.,]/g, "");
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

/** Parse a price: auto-detects Dutch (1.234,56) vs English (1,234.56) decimals. */
function parsePrice(raw: string): number {
  if (!raw || raw.trim() === "") return 0;
  const trimmed = raw.trim();
  const lastComma = trimmed.lastIndexOf(",");
  const lastDot = trimmed.lastIndexOf(".");
  let cleaned: string;
  if (lastComma > lastDot && lastComma >= 0) {
    cleaned = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (lastDot > lastComma && lastDot >= 0) {
    cleaned = trimmed.replace(/,/g, "");
  } else if (lastComma >= 0 && lastDot === -1) {
    cleaned = trimmed.replace(",", ".");
  } else {
    cleaned = trimmed;
  }
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/* ── Auto-detect delimiter (comma or semicolon) ── */
function detectDelimiter(text: string): string {
  const firstLines = text.split("\n").slice(0, 5).join("\n");
  const semicolons = (firstLines.match(/;/g) || []).length;
  const commas = (firstLines.match(/,/g) || []).length;
  return semicolons >= commas ? ";" : ",";
}

/* ── CSV line parser (handles quoted fields, configurable delimiter) ── */
function parseCSVLine(line: string, delimiter = ","): string[] {
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
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

/* ── Parse datum like "1v(13/03)" or "2v(20/03)" ── */
function parseDatum(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  // Extract date from patterns like "1v(13/03)" or just "13/03"
  const match = trimmed.match(/\((\d{1,2}\/\d{1,2})\)/);
  if (match) return match[1];
  // Already a date-like string
  if (/\d{1,2}[\/\-]\d{1,2}/.test(trimmed)) return trimmed;
  return trimmed;
}

/* ── Detect format: legacy (many columns with markers) or simple (4 columns) ── */
function isLegacyInkoop(lines: string[], delimiter: string): boolean {
  for (const line of lines.slice(0, 10)) {
    const cols = parseCSVLine(line, delimiter);
    if (cols[0]?.trim() === "Inkooplijst" && cols.length >= 10) return true;
  }
  return false;
}

function isLegacyVoorraad(lines: string[], delimiter: string): boolean {
  for (const line of lines.slice(0, 10)) {
    const cols = parseCSVLine(line, delimiter);
    if (cols[0]?.trim() === "Voorraadlijst Snijbloemen" && cols.length >= 15) return true;
  }
  return false;
}

/* ── Parse Inkooplijst CSV ──
   Supports two formats:
   A) Simple: datum, aantal, product, prijs
   B) Legacy: Inkooplijst, subtitle, Soort, ..., Aantal, Artikel, Klant, Prijs, KleurCode, Datum
*/
export function parseInkooplijst(csvText: string): InkoopRow[] {
  const lines = csvText.split("\n").filter(l => l.trim().length > 0);
  const delimiter = detectDelimiter(csvText);
  const rows: InkoopRow[] = [];

  if (isLegacyInkoop(lines, delimiter)) {
    // Legacy format
    for (const line of lines) {
      const cols = parseCSVLine(line, delimiter);
      if (cols.length < 10) continue;
      if (cols[0]?.trim() !== "Inkooplijst") continue;

      const soort = cols[2]?.trim() || "";
      const artikel = cols[5]?.trim() || "";
      const klant = cols[6]?.trim() || "";
      const kleurCode = cols[8]?.trim() || "";
      const datum = cols[9]?.trim() || "";

      if (!soort || !artikel) continue;

      const aantal = parseQuantity(cols[4]);
      const prijs = parsePrice(cols[7]);

      rows.push({ soort, artikel, klant, prijs, kleurCode, datum, aantal });
    }
  } else {
    // Simple format: datum, aantal, product, prijs
    for (const line of lines) {
      const cols = parseCSVLine(line, delimiter);
      if (cols.length < 3) continue;

      const datumRaw = cols[0]?.trim() || "";
      // Skip header rows
      if (/^(datum|date|header)/i.test(datumRaw)) continue;
      // Must start with something that looks like a date marker
      if (!datumRaw) continue;

      const datum = parseDatum(datumRaw);
      const aantal = parseNumber(cols[1]);
      const artikel = cols[2]?.trim() || "";
      const prijs = cols.length >= 4 ? parseNumber(cols[3]) : 0;

      if (!artikel || aantal === 0) continue;

      // Extract soort from artikel (first word)
      const soort = artikel.split(/\s+/)[0] || "";

      rows.push({ soort, artikel, klant: "", prijs, kleurCode: "", datum, aantal });
    }
  }
  return rows;
}

/* ── Parse Voorraadlijst CSV ──
   Supports two formats:
   A) Simple: datum, aantal, product, prijs
   B) Legacy: Voorraadlijst Snijbloemen, ..., Soort, Lengte, Partij, Aantal, Artikel, Prijs, Opmerking
*/
export function parseVoorraadlijst(csvText: string): VoorraadRow[] {
  const lines = csvText.split("\n").filter(l => l.trim().length > 0);
  const delimiter = detectDelimiter(csvText);
  const rows: VoorraadRow[] = [];

  if (isLegacyVoorraad(lines, delimiter)) {
    // Legacy format
    for (const line of lines) {
      const cols = parseCSVLine(line, delimiter);
      if (cols.length < 15) continue;
      if (cols[0]?.trim() !== "Voorraadlijst Snijbloemen") continue;

      const soort = cols[10]?.trim() || "";
      const lengte = cols[11]?.trim() || "";
      const partij = cols[12]?.trim() || "";
      const artikel = cols[14]?.trim() || "";

      if (!soort || !artikel) continue;

      const aantal = parseNumber(cols[13]);
      const inkoopprijs = parseNumber(cols[15]);
      const opmerking = cols[16]?.trim() || "";

      rows.push({ soort, lengte, partij, aantal, artikel, inkoopprijs, opmerking });
    }
  } else {
    // Simple format: datum, aantal, product, prijs
    for (const line of lines) {
      const cols = parseCSVLine(line, delimiter);
      if (cols.length < 3) continue;

      const datumRaw = cols[0]?.trim() || "";
      if (/^(datum|date|header)/i.test(datumRaw)) continue;
      if (!datumRaw) continue;

      const aantal = parseNumber(cols[1]);
      const artikel = cols[2]?.trim() || "";
      const inkoopprijs = cols.length >= 4 ? parseNumber(cols[3]) : 0;

      if (!artikel || aantal === 0) continue;

      const soort = artikel.split(/\s+/)[0] || "";

      rows.push({ soort, lengte: "", partij: "", aantal, artikel, inkoopprijs, opmerking: "" });
    }
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

/* ── Manual link type ── */
export interface ManualLink {
  inkoopKey: string;   // normalized inkoop artikel key
  voorraadKey: string; // normalized voorraad artikel key
}

/* ── Fuzzy match suggestions ── */
export interface MatchSuggestion {
  voorraadKey: string;
  artikel: string;
  soort: string;
  aantal: number;
  score: number; // 0-100 similarity
}

function wordSet(s: string): Set<string> {
  return new Set(s.toUpperCase().replace(/[^A-Z0-9\s]/g, "").split(/\s+/).filter(Boolean));
}

function similarity(a: string, b: string): number {
  const wa = wordSet(a), wb = wordSet(b);
  if (wa.size === 0 && wb.size === 0) return 0;
  let overlap = 0;
  for (const w of wa) if (wb.has(w)) overlap++;
  return Math.round((overlap / Math.max(wa.size, wb.size)) * 100);
}

export function findSuggestions(
  inkoopKey: string,
  inkoopSoort: string,
  voorraad: VoorraadRow[],
  alreadyMatchedKeys: Set<string>,
  manualLinks: ManualLink[]
): MatchSuggestion[] {
  // Group voorraad
  const groups = new Map<string, { soort: string; artikel: string; total: number }>();
  for (const row of voorraad) {
    const key = normalizeArtikel(row.artikel);
    if (alreadyMatchedKeys.has(key)) continue; // already auto-matched
    if (manualLinks.some(l => l.voorraadKey === key && l.inkoopKey !== inkoopKey)) continue; // already linked elsewhere
    if (!groups.has(key)) groups.set(key, { soort: row.soort, artikel: row.artikel, total: 0 });
    groups.get(key)!.total += row.aantal;
  }

  const suggestions: MatchSuggestion[] = [];
  for (const [key, g] of groups) {
    // Same soort gets a bonus
    const nameSim = similarity(inkoopKey, key);
    const soortBonus = g.soort.toUpperCase() === inkoopSoort.toUpperCase() ? 30 : 0;
    const score = Math.min(100, nameSim + soortBonus);
    if (score >= 15) {
      suggestions.push({ voorraadKey: key, artikel: g.artikel, soort: g.soort, aantal: g.total, score });
    }
  }

  suggestions.sort((a, b) => b.score - a.score);
  return suggestions.slice(0, 8);
}

/* ── localStorage persistence for manual links ── */
const LINKS_STORAGE_KEY = "hbm-voorraad-links";

export function loadManualLinks(): ManualLink[] {
  try {
    const raw = localStorage.getItem(LINKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveManualLinks(links: ManualLink[]): void {
  localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(links));
}

/* ── Match inkooplijst against voorraadlijst ── */
export function matchLists(
  inkoop: InkoopRow[],
  voorraad: VoorraadRow[],
  manualLinks: ManualLink[] = []
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

  // Build a map from inkoop key -> linked voorraad keys
  const linkedVoorraad = new Map<string, string[]>();
  for (const link of manualLinks) {
    if (!linkedVoorraad.has(link.inkoopKey)) linkedVoorraad.set(link.inkoopKey, []);
    linkedVoorraad.get(link.inkoopKey)!.push(link.voorraadKey);
  }

  // Merge: start with all inkoop items + unlinked voorraad
  const allKeys = new Set([...inkoopGroups.keys(), ...voorraadGroups.keys()]);
  const results: MatchedLine[] = [];

  for (const key of allKeys) {
    const ig = inkoopGroups.get(key);
    const vg = voorraadGroups.get(key);

    // Calculate voorraad: auto-matched + manually linked
    let voorraadTotal = vg?.total ?? 0;
    let voorraadDetails = vg?.details ? [...vg.details] : [];
    let lengte = vg?.lengte ?? "";

    // Add manually linked voorraad
    const linkedKeys = linkedVoorraad.get(key) ?? [];
    for (const lk of linkedKeys) {
      const lvg = voorraadGroups.get(lk);
      if (lvg && lk !== key) { // don't double-count auto-matches
        voorraadTotal += lvg.total;
        voorraadDetails.push(...lvg.details);
        if (!lengte && lvg.lengte) lengte = lvg.lengte;
      }
    }

    const behoefte = ig?.total ?? 0;
    const benodigd = behoefte - voorraadTotal;

    // Skip voorraad-only items that are manually linked to an inkoop item
    if (!ig && manualLinks.some(l => l.voorraadKey === key)) continue;

    let status: MatchedLine["status"];
    if (behoefte === 0) status = "overschot";
    else if (voorraadTotal >= behoefte) status = "gedekt";
    else if (voorraadTotal > 0) status = "deels_gedekt";
    else status = "niet_gedekt";

    results.push({
      key,
      soort: ig?.soort ?? vg?.soort ?? "",
      artikel: ig?.artikel ?? vg?.artikel ?? "",
      lengte,
      kleurCodes: ig ? [...ig.kleurCodes] : [],
      klanten: ig?.klanten ?? [],
      behoefte,
      voorraad: voorraadTotal,
      benodigd: Math.max(0, benodigd),
      status,
      voorraadDetails,
    });
  }

  // Sort: niet_gedekt first, then deels_gedekt, then gedekt, then overschot
  const statusOrder: Record<string, number> = { niet_gedekt: 0, deels_gedekt: 1, gedekt: 2, overschot: 3 };
  results.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) || b.behoefte - a.behoefte);

  return results;
}
