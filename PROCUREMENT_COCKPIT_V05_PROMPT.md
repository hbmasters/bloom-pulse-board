# Procurement Cockpit V0.5 — Pagina Architectuur & Prompt

> **Versie:** V0.5 (BETA)  
> **Route:** `/labs/procurement-cockpit-v1`  
> **Hoofdbestand:** `src/pages/ProcurementCockpitV1.tsx` (~731 regels)  
> **Status:** Prototype met mock data, geen database-connectie

---

## 📐 Pagina Layout (van boven naar beneden)

### 1. Page Header
**Wat:** Titel + versie-badge + BETA-badge + actieknoppen  
**Waarom:** Geeft direct context: welke tool, welke versie, en dat het een experimentele versie is.

```
[🛒 Procurement Cockpit] [V0.5] [BETA]          [Koppelingen (3/4)] [⚙ Weergave]
```

- **"Procurement Cockpit"** — Enige naam, consistent in sidebar, topbar en pagina
- **V0.5 badge** — Mono font, `rounded-full`, laat zien dat dit een vroege versie is
- **BETA badge** — Primary kleur, benadrukt experimentele status
- **Koppelingen knop** — Toont shop sync status popup (4 externe leveranciersbronnen)
- **Weergave knop** — Settings popup voor view toggles en kolom-zichtbaarheid

#### Weergave-instellingen (popup)
| Toggle | Wat doet het |
|--------|-------------|
| Compacte weergave | Kleinere row padding |
| Grote weergave | 14px font i.p.v. 11px |
| Kop informatie (KPI's) | *Momenteel verwijderd* |
| Prijsvergelijking | Toont/verbergt prijskaarten in expanded row |
| Leveranciersaanbod | Toont/verbergt leverancierstabel in expanded row |
| Markt & Design context | Toont/verbergt marktcontext in expanded row |
| Kolom toggles | Per kolom aan/uit zetten |

#### Koppelingen popup
Toont 4 externe leveranciersbronnen met status per bron:
- **Connected** (groene Wifi icon) — Real-time data
- **Delayed** (klok icon) — Sync vertraging
- **Outdated** (alert icon) — Oude data
- **Error** (WifiOff icon) — Connectie probleem

---

### 2. Tab Navigatie + Datumfilter
**Wat:** 2 tabs + DayFilter rechts uitgelijnd  
**Waarom:** Scheidt operationele inkoop (dagelijks) van marktintelligentie.

```
[🛒 Inkooplijst] [📊 Marktaanbod]                    [📅 Van: 15 mrt — Tot: 21 mrt]
```

- **Inkooplijst** — Dagelijkse inkoop: behoefte vs voorraad
- **Marktaanbod** — Marktprijzen, 52-weken forecast, leverancierskwaliteit
- **DayFilter** — Van/tot datumkiezer, default = vandaag + 6 dagen

---

## 🛒 TAB 1: Inkooplijst

### 3. Filterbalk
**Wat:** Zoekbalk + dropdown filters + urgentie-chips + reset knop  
**Waarom:** Snel focussen op relevante producten.

```
[🔍 Zoek product...] [Alle families ▾] [Alle inkopers ▾] [Urgent] [Medium] [Laag] [↻ Reset]
```

- **Zoek** — Filtert op product- en familienaam
- **Families** — Dropdown: Roos, Chrysant, Tulp, Gerbera, etc.
- **Inkopers** — Dropdown: Pieter, Maria, Jan, etc.
- **Urgentie chips** — Toggle filters, visueel gestyled per urgentieniveau
- **Reset** — Verschijnt alleen bij actieve filters

---

### 4. Inkooplijst Tabel (IHSectionShell)
**Wat:** Hoofdtabel met alle inkoopregels, klikbaar voor detail  
**Waarom:** Kernfunctionaliteit — overzicht van alle inkoopbehoeften met status.

**Shell:** `IHSectionShell` component met icon, titel, subtitle, en badge (aantal gefilterde rijen).

#### Tabelkolommen (configureerbaar via Weergave)

| Kolom | Data | Beschrijving |
|-------|------|-------------|
| ▶ | Expand icon | Klik om detailpaneel te openen |
| **Dekking** | Badge + progress bar + % | Dekkingsstatus: Volledig/Deels/Gedekt/Overschot |
| **Product** | Naam + steellengte + familie | Productnaam met blauwe steellengte-badge |
| **Benodigd** | Getal | `required_volume - available_stock` |
| **Kwal.** | A/B/C badge | Leveranciers kwaliteitsklasse |
| **Eff. Prijs** | €0.xxx | Effectieve prijs (incl. waste risk) |
| **Hist. Prijs** | €0.xxx | Historische gemiddelde prijs |
| **Offerteprijs** | €0.xxx | Huidige offerteprijs |
| **Adviesprijs** | €0.xxx | Berekende adviesprijs |
| **Marktprijs** | €0.xxx | Beste marktprijs uit MarketSupply data |
| **Δ Hist.** | +x.x% | Afwijking offerte vs historisch (kleur: groen <-3%, rood >+3%) |
| **Markup/Down** | Badge | Markup mogelijk / Markdown geadviseerd / Hold |
| **Actie** | Koop knop | Disabled knop (toekomstige functionaliteit) |
| **Urgentie** | Badge | Hoog (rood) / Medium (geel) / Laag (grijs) |

#### Dekkingsberekening
```
dekking_pct = min(100, (available_stock / required_volume) * 100)

Status:
  available_stock >= required_volume AND open_buy_need === 0 AND free_stock > required_volume → "Overschot"
  available_stock >= required_volume AND open_buy_need === 0 → "Volledig"  
  free_stock > 0 AND open_buy_need > 0 → "Deels"
  else → "Niet gedekt" (label: "Gedekt" — verwarrend, mogelijk bug)
```

---

### 5. Expanded Row (Detailpaneel)
**Wat:** Uitklapbaar paneel per productregel met volledige inkoopintelligentie  
**Waarom:** Alle beslissingsinformatie op één plek zonder paginaverwissel.

Het detailpaneel bevat 4 secties van boven naar beneden:

#### 5a. Dekkingsbalk
```
Dekking [████████████░░░░░] 72%  [Deels]
```
- Visuele progress bar met kleur op basis van percentage
- Badge met dekkingsstatus

#### 5b. Context Cards (grid: 7 kolommen op desktop)
```
[Behoefte: 8.000] [Voorraad: 5.800 | Vrij: 3.200 · Gereserv: 2.600] [Nog nodig: 2.200]
[Hist. prijs: €0.112 referentie] [Offerteprijs: €0.118 +5.4%] [Adviesprijs: €0.105 -6.3%] [Marktprijs: €0.112 0.0%]
```

- **Behoefte** — Totaal benodigde stelen
- **Voorraad** — Beschikbaar + onderverdeling vrij/gereserveerd
- **Nog nodig** — Openstaand tekort (rood als >0, groen als 0)
- **Prijskaarten** (4 stuks, conditioneel via `showPriceComparison`):
  - Historische prijs (met "referentie" label + ring)
  - Offerteprijs (met Δ% t.o.v. historisch)
  - Adviesprijs (met Δ% t.o.v. historisch)
  - Marktprijs (met Δ% t.o.v. historisch, alleen als marktdata beschikbaar)

#### 5c. Klanten & Producten
```
Klanten & Producten (4)
├── Bloemenhal Rotterdam – HBM Charme XL  60cm  2.000 st  16 mrt
├── Groen & Co – HBM Trend              50cm  1.500 st  17 mrt
├── Floral Direct – HBM Lovely           40cm  2.500 st  16 mrt
└── Bloemist Plus – HBM Elegance         55cm  2.000 st  18 mrt
```
- Toont welke klanten welke producten nodig hebben
- Per regel: klant, productnaam, steellengte, aantal, vertrekdatum
- 2-koloms grid op desktop

#### 5d. Leveranciersaanbod (conditioneel via `showSupplierOffers`)
```
👁 Leveranciersaanbod (4)
┌─────────────────┬────────┬───────┬──────────┬─────────┬──────────┬──────────┬────────┬──────────┬─────────┐
│ Leverancier     │ Prijs  │Aantal │Levering  │Kwaliteit│Betrouwb. │Prijsstab.│Δ Hist. │Δ Offerte │         │
├─────────────────┼────────┼───────┼──────────┼─────────┼──────────┼──────────┼────────┼──────────┼─────────┤
│ Bloem & Blad NL │€0.112  │10.000 │Ma+Do     │97%      │96%       │94%       │+0.0%   │-5.1%     │[Bekijk][Koop]│
│ ★ Voorkeur      │        │       │          │         │          │          │        │          │         │
│ Van der Berg    │€0.118  │8.000  │Ma+Wo+Vr  │95%      │94%       │91%       │+5.4%   │+0.0%     │[Bekijk][Koop]│
└─────────────────┴────────┴───────┴──────────┴─────────┴──────────┴──────────┴────────┴──────────┴─────────┘
```

- **Voorkeursleverancier** — Gemarkeerd met groene achtergrond, ring, en "Voorkeur" badge
- **Kolommen:** Prijs, Aantal, Levering, Kwaliteit%, Betrouwbaarheid%, Prijsstabiliteit%, Δ Historisch, Δ Offerte
- **Actieknoppen:** "Bekijk" (actief, primary border) + "Koop" (disabled, grayed out)
- Knoppen staan in een flex container naast elkaar

#### 5e. Substituut opties (conditioneel)
```
🔄 Substituut opties (2)
├── Roos Avalanche+  [Fam] [Klr] [Len]  €0.130  85%
└── Roos Freedom     [Fam] [Klr] [Len]  €0.115  78%
```

- Verschijnt alleen als er kandidaten zijn
- Per kandidaat: naam, compatibiliteitsbadges (Familie/Kleur/Lengte), prijs, confidence%
- Confidence kleuring: ≥80% groen, ≥60% geel, <60% grijs

---

## 📊 TAB 2: Marktaanbod

### MarketSupplyPanel Component
**Bestand:** `src/components/procurement-cockpit-v1/MarketSupplyPanel.tsx`  
**Wat:** Twee sub-secties: Marktprijzen overzicht + 52-weken Handelsregister  
**Waarom:** Strategische marktintelligentie voor inkoopbeslissingen.

Het Marktaanbod panel bevat:

1. **Marktprijzen tabel** — Actueel overzicht van alle producten met:
   - Product, Familie, Aanbod (stelen), Leveranciers, Prijs laag/hoog, Beste prijs
   - Trend (MoM %), Supply Pressure badge (Ruim/Normaal/Krap/Kritiek)
   - Expandable rows met leverancierskwaliteit en effectieve prijzen

2. **52-weken Handelsregister** — Seizoensplanning kalender met:
   - Week-voor-week data per product
   - Beschikbaarheid, Prijsrange, Seizoenstype, Risiconiveau
   - Design Stability badges, Supplier Stability waarschuwingen
   - WeekYearFilter (jaar, kwartaal, week, range 8-52 weken)

---

## 📂 Data Architectuur

### Databestanden
| Bestand | Inhoud |
|---------|--------|
| `procurement-cockpit-v1-data.ts` | Kern mock data: `procurementRows` (10 producten), `supplierOffers`, `shopStatuses`, types |
| `procurement-extended-data.ts` | Markt: `marketSupplyData`, `tradeRegistry` (52-weken), `designAdvisoryData`, `priceCheckData` |
| `procurement-intelligence-data.ts` | Intelligence: `inventoryPressureData`, `substituteSuggestions`, `purchaseMixSuggestions`, `supplierQualityData`, `effectivePriceData` |
| `supplier-intelligence-data.ts` | Leverancier: `supplierIntelligenceData` (per product), `supplierMixProposals`, `productSupplierStabilityData` |
| `procurement-decision-data.ts` | Decision engine: `mockDecisionRows`, `computeKPIs` (voor Supply Radar signalen) |

### Producten (10 stuks, mock)
1. Chrysant Ringa Yellow (60cm)
2. Roos Red Naomi (50cm)
3. Tulp Strong Gold (35cm)
4. Gerbera Kimsey (45cm)
5. Lisianthus Rosita White (60cm)
6. Alstroemeria Virginia (55cm)
7. Zonnebloem Sunrich (70cm)
8. Roos Avalanche+ (60cm)
9. Chrysant Baltica White (55cm)
10. Lelie Stargazer (80cm)

### Key Types
```typescript
ProcurementRow {
  id, product, stem_length, product_family,
  customer_product_lines[], buyer,
  required_volume, available_stock, reserved_stock, free_stock, open_buy_need,
  historical_price, offer_price, advised_price, preferred_supplier,
  supplier_quality, supplier_reliability, supplier_score,
  external_quality, internal_quality, variance_vs_calculated,
  ai_advice, urgency, status
}
```

---

## 🎨 Design System Gebruik

### Kleursemantiek
- **Groen (`text-accent`):** Positief — gedekt, prijsdaling, hoge betrouwbaarheid
- **Rood (`text-destructive`):** Negatief — tekort, prijsstijging, risico
- **Geel (`text-yellow-500`):** Waarschuwing — deels gedekt, medium risico
- **Grijs (`text-muted-foreground`):** Neutraal — geen actie nodig
- **Blauw (`text-primary`):** Interactief — knoppen, badges, steellengte

### Typography
- Tabel: `text-[11px]` standaard, `text-[14px]` in grote weergave
- Labels: `text-[9px] uppercase tracking-wide`
- Mono: `font-mono` voor prijzen, percentages, aantallen
- Badges: `text-[8px]` of `text-[9px]` met `rounded-full` of `rounded`

### Component Patronen
- **IHSectionShell** — Wrapper met icon, titel, subtitle, badge
- **Badges** — `px-2 py-0.5 rounded-full border` met semantische kleuren
- **Cards** — `rounded-lg border border-border bg-background p-3`
- **Tabellen** — `border-b border-border/40` voor rows, `border-border` voor headers

---

## 🔧 State Management

Alle state is lokaal (`useState`), geen database, geen global state:

| State | Type | Default | Doel |
|-------|------|---------|------|
| `activeTab` | `"inkooplijst" \| "marktaanbod"` | `"inkooplijst"` | Tab selectie |
| `expandedId` | `string \| null` | `null` | Welke rij is uitgeklapt |
| `search` | `string` | `""` | Zoekterm |
| `sortKey` | `keyof ProcurementRow` | `"urgency"` | Sorteerkolom |
| `sortDir` | `"asc" \| "desc"` | `"desc"` | Sorteerrichting |
| `familyFilter` | `string \| null` | `null` | Productfamilie filter |
| `urgencyFilter` | `string \| null` | `null` | Urgentie filter |
| `buyerFilter` | `string \| null` | `null` | Inkoper filter |
| `dateFrom/dateTo` | `Date` | Vandaag +6d | Datumrange |
| `showPriceComparison` | `boolean` | `true` | Prijskaarten tonen |
| `showSupplierOffers` | `boolean` | `true` | Leverancierstabel tonen |
| `showMarketContext` | `boolean` | `true` | Marktcontext tonen |
| `compactView` | `boolean` | `false` | Compacte rows |
| `largeView` | `boolean` | `false` | 14px font |
| `visibleColumns` | `Set<string>` | Alle kolommen | Kolom zichtbaarheid |

---

## 🚧 Wat is verwijderd / niet meer actief

| Feature | Status | Reden |
|---------|--------|-------|
| KPI-kaarten bovenaan (Totaal behoefte, Vrije voorraad, etc.) | **Verwijderd** | UI vereenvoudiging |
| Voorraaddruk card in expanded row | **Verwijderd** | Overbodig met kolom data |
| Substituut advies card in expanded row | **Verwijderd** | Vervangen door Substituut opties sectie |
| Inkoopmix card (Aanbevolen mix) in expanded row | **Verwijderd** | UI vereenvoudiging |
| Prijsvergelijking als aparte sectie onderaan | **Verwijderd** | Verplaatst naar context cards inline |
| CSV upload functionaliteit | **Code verwijderd** | Dekking berekend uit statische data |
| Handelsregister als 3e tab | **Verplaatst** | Nu onderdeel van Marktaanbod tab |

---

## 🗺️ Navigatie-integratie

De pagina is bereikbaar via:
- **Sidebar:** LABS sectie → "Procurement Cockpit V0.5"
- **Mobile menu:** LABS → "Procurement Cockpit V0.5"  
- **TopBar:** Toont "Procurement Cockpit V0.5" als paginanaam
- **Route:** `/labs/procurement-cockpit-v1`

Bestanden die de naam bevatten:
- `src/components/mission-control/MCSidebar.tsx`
- `src/components/mission-control/MCMobileMenu.tsx`
- `src/components/mission-control/MCTopBar.tsx`
