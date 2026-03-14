# Procurement Cockpit V1.5 — Complete Documentation

## 📋 Overview

**Route:** `/labs/procurement-cockpit-v1`  
**Version:** V1.5 (Labs)  
**Purpose:** Unified procurement workspace combining real-time market intelligence, inventory management, purchasing decision support, and multi-week trade forecasting.

**Target Users:** Professional procurement specialists (inkopers) who need comprehensive market oversight, data-driven purchasing decisions, and operational visibility across supply chains.

---

## 🏗️ Architecture & Structure

### Page Structure
The Procurement Cockpit is a **tabbed interface** with four strategic layers:

```
┌─────────────────────────────────────────────────────┐
│ 📊 Procurement Cockpit Header                      │
│ • Upload Controls (CSV matching)                   │
│ • Shop Sync Status (Koppelingen)                   │
│ • View Settings (Weergave)                         │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ 🗂️ Tab Navigation                                   │
│ • Inkooplijst (Purchase List)                      │
│ • Marktaanbod (Market Supply)                      │
│ • Handelsregister (Trade Registry)                 │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ 📄 Active Tab Content                              │
│ • Tab-specific filters                             │
│ • Data tables/panels                               │
│ • Context-specific insights                        │
└─────────────────────────────────────────────────────┘
```

---

## 📑 Tab 1: Inkooplijst (Purchase List)

### Purpose
Main operational interface for daily procurement activities. Provides hierarchical product overview with advanced matching between "Behoefte" (demand from orders) and "Voorraad" (available stock).

### Date Filter
- **Component:** `DayFilter.tsx`
- **Type:** Date range picker
- **Fields:**
  - **Van (From):** Start date
  - **Tot (To):** End date
- **Default:** Current day + 6 days (1 week view)
- **Interface:** Calendar popover with visual date selection

### CSV Upload & Matching System

#### Upload Flow
1. **Upload Inkooplijst (CSV)**
   - Contains customer orders (klanten)
   - Columns: datum, klant, artikel, soort, lengte, aantal, prijs
2. **Upload Voorraadlijst (CSV)**
   - Contains available stock
   - Columns: artikel, soort, lengte, aantal
3. **Click "Vergelijk & Afstrepen"**
   - Triggers automatic matching algorithm
   - Calculates coverage status per product

#### Matching Logic (`csv-parsers.ts`)
```typescript
// Normalization: clean artikel names for matching
normalizeArtikel(raw: string) → normalized key

// Grouping: group by artikel + soort + lengte
grouped entries → matched lines

// Status calculation:
behoefte vs voorraad → status:
  - "gedekt" (covered): voorraad >= behoefte
  - "deels_gedekt" (partial): 0 < voorraad < behoefte
  - "niet_gedekt" (uncovered): voorraad = 0
  - "overschot" (surplus): behoefte = 0, voorraad > 0
```

#### Manual Linking System
- **Purpose:** Link voorraad items to inkoop lines that didn't auto-match
- **Storage:** Local storage (`manualPurchaseLinks`)
- **Suggestions:** Smart algorithm finds potential matches based on:
  - Artikel similarity (fuzzy matching)
  - Soort keywords
  - Confidence score (0-100%)
- **Actions:**
  - **Koppel (Link):** Connect voorraad to inkoop line
  - **Ontkoppel (Unlink):** Remove manual link

### Data Hierarchy
```
Artikelgroep (first 2 words of artikel)
  └─ Soort (variety/type)
      └─ Lengte (stem length)
          └─ Kleur (color codes: PA, WI, RZ, etc.)
              └─ Klanten (individual customers)
```

### KPI Summary Cards
- **Totaal behoefte:** Sum of all required units
- **Totaal voorraad:** Sum of available stock
- **Nog nodig:** Total shortage (behoefte - voorraad)
- **Gedekt:** Count of fully covered products
- **Deels gedekt:** Count of partially covered products
- **Niet gedekt:** Count of uncovered products

### Table Structure
Split into two sections:

#### 1. Behoefte (Demand) Section
- Products with active orders (behoefte > 0)
- **Columns:**
  - Expand/Collapse chevron
  - Artikelgroep (e.g., "R GR")
  - Artikel (full product name)
  - Lengte (stem length)
  - Kleur (color badge grid)
  - Status (Gedekt/Deels/Niet gedekt)
  - Behoefte (required quantity)
  - Voorraad (available stock)
  - Benodigd (shortage amount)
  - Dekking % (coverage percentage)
  
- **Expanded View:**
  - Customer breakdown (klant list)
  - Earliest datum + ISO week
  - Average historical price
  - Manual linking suggestions panel
  - Matching voorraad items with link/unlink actions

#### 2. Voorraad (Stock) Section
- Products with surplus stock (behoefte = 0, voorraad > 0)
- Shows overschot badge
- Simpler display without customer breakdown

### Filters & Controls
- **Search:** Filter by artikel or soort name
- **Artikelgroep filter:** Dropdown of unique article groups
- **Lengte filter:** Filter by stem length
- **Kleur filter:** Filter by color code
- **Status filter:** Filter by coverage status
- **Sort:** Click column headers (status, behoefte, voorraad, benodigd)
- **Large View Toggle:** 14px font for experienced users

---

## 📑 Tab 2: Marktaanbod (Market Supply)

### Purpose
Real-time market intelligence dashboard showing current supply conditions, pricing trends, and procurement opportunities across major product families.

### Components
- **Component:** `MarketSupplyPanel.tsx`
- **Data Source:** `marketSupplyData` (procurement-extended-data.ts)

### KPI Summary Cards
- **Totaal aanbod:** Total stems available across all products
- **Kritiek aanbod:** Count of products with critical supply pressure
- **Krap aanbod:** Count of products with high supply pressure
- **Gem. prijstrend:** Average price trend (MoM %)

### Market Supply Table
**Columns:**
1. **Product:** Product name
2. **Familie:** Product family (Roos, Chrysant, Tulp, etc.)
3. **Aanbod:** Available supply (stem count)
4. **Leveranciers:** Number of active suppliers
5. **Prijs laag:** Lowest market price
6. **Prijs hoog:** Highest market price
7. **Beste prijs:** Best available price (recommended)
8. **Trend:** Price trend % with arrow icon
   - Red (↑): Price increase
   - Green (↓): Price decrease
9. **Druk:** Supply pressure badge
   - **Ruim (Low):** Green — abundant supply
   - **Normaal (Normal):** Gray — balanced
   - **Krap (High):** Yellow — tight supply
   - **Kritiek (Critical):** Red — scarce supply
10. **Update:** Last update timestamp

### Business Intelligence
- **Price Trend Signals:**
  - >+3%: Destructive (red) — urgent procurement consideration
  - -1% to +3%: Muted — stable market
  - <-1%: Accent (green) — buying opportunity

- **Supply Pressure Logic:**
  - Critical: Immediate action needed, risk of shortage
  - High: Monitor closely, consider forward buying
  - Normal: Standard procurement flow
  - Low: Favorable conditions, volume opportunities

---

## 📑 Tab 3: Handelsregister (Trade Registry)

### Purpose
52-week forward-looking forecast calendar showing expected availability, pricing ranges, seasonality patterns, and supply risk across the year for each product.

### Week/Year Filter
- **Component:** `WeekYearFilter.tsx`
- **Controls:**
  - **Year Selector:** Dropdown (2026, 2027, etc.)
  - **Quarter Quick-Select:** Buttons Q1-Q4
  - **Week Selector:** Dropdown 1-52 (optional)
  - **Visible Weeks Range:** 8/12/16/20/24/52 weeks selector

### Filter Logic
```typescript
if (year selected):
  weeks = filter by selected year
if (week selected):
  weeks = slice from selected week onwards
weeks = slice to visible weeks count
```

### Product Selector
- Dropdown with all tracked products
- Format: "Product Name (Product Family)"

### Week Grid Table
**Columns:**
1. **Week:** Week number (W1-W52) with "NU" badge for current week
2. **Beschikbaarheid:** Availability level with dot indicator
   - **Hoog (High):** Green dot
   - **Medium:** Yellow dot
   - **Laag (Low):** Red dot
   - **Niet beschikbaar (None):** Gray dot
3. **Prijs range:** Expected price range (low - high)
4. **Leveranciers:** Supplier count
5. **Seizoen:** Seasonality indicator
   - **Seizoen (In Season):** Green — optimal supply
   - **Overgang (Shoulder):** Yellow — transitional
   - **Buiten seizoen (Off Season):** Red — limited/expensive
6. **Risico:** Supply risk level
   - **Laag (Low):** Green
   - **Medium:** Yellow
   - **Hoog (High):** Red

### Data Generation
- **Base Logic:** `generateWeeks()` function
- **Pattern Arrays:**
  - `seasonPattern`: Price multipliers per cycle
  - `availPattern`: Availability levels per cycle
  - `riskPattern`: Risk levels per cycle
- **Seasonal Calculation:**
  - Price multiplier >1.15 → Off Season
  - Price multiplier <0.9 → In Season
  - Otherwise → Shoulder

### Use Cases
1. **Forward Planning:** Identify optimal procurement windows
2. **Risk Management:** Anticipate supply constraints
3. **Budget Forecasting:** Price trend visibility
4. **Seasonal Strategy:** Align purchases with peak availability

---

## 🔧 Global Features

### Shop Sync Status (Koppelingen)
- **Purpose:** Monitor external supplier/shop integrations
- **Display:** Popup with connection cards
- **Status Types:**
  - **Connected (Wifi):** Active sync, real-time data
  - **Delayed (Clock):** Sync lag, data may be stale
  - **Outdated (AlertCircle):** Old data, refresh needed
  - **Error (WifiOff):** Connection failure

### View Settings (Weergave)
Modal with customization options:

#### Display Modes
- **Compacte weergave:** Reduced padding, denser layout
- **Grote weergave:** 14px font, optimized for experienced users

#### Section Toggles (Inkooplijst only)
- **Kop informatie (KPI's):** Show/hide summary cards
- **Prijsvergelijking:** Price comparison details
- **Leveranciersaanbod:** Supplier offer panels
- **Markt & Design context:** Market and design advisory

#### Column Visibility (Inkooplijst only)
Toggle individual columns:
- Inkoper (Buyer)
- Benodigd (Required)
- Hist. Prijs (Historical Price)
- Offerteprijs (Offer Price)
- Adviesprijs (Advised Price)
- Marktprijs (Market Price)
- Δ Hist. (Variance)
- Lev. Voorkeur (Supplier Preference)
- Design (Design Advice)
- Markup/Down (Pricing Advice)

---

## 💾 Data Structure

### Inkooplijst Data (`procurement-cockpit-v1-data.ts`)
```typescript
ProcurementRow {
  id: string;
  buyer: string;
  product_family: string;
  product: string;
  product_sub: string;
  urgency: "high" | "medium" | "low";
  required_volume: number;
  available_stock: number;
  free_stock: number;
  reserved_stock: number;
  open_buy_need: number;
  supplier_count: number;
  preferred_supplier: string;
  historical_price: number;
  offer_price: number;
  advised_price: number;
  market_price: number;
  variance_vs_calculated: number;
  design_advice: string;
  markup_advice: string;
}
```

### Market Supply Data (`procurement-extended-data.ts`)
```typescript
MarketSupplyItem {
  product_family: string;
  product: string;
  available_supply: number;
  supplier_count: number;
  price_low: number;
  price_high: number;
  best_price: number;
  price_trend: number; // % MoM
  supply_pressure: "low" | "normal" | "high" | "critical";
  last_updated: string;
}
```

### Trade Registry Data
```typescript
TradeRegistryEntry {
  product_family: string;
  product: string;
  weeks: TradeWeek[];
}

TradeWeek {
  week: number;
  year: number;
  expected_availability: "high" | "medium" | "low" | "none";
  expected_price_low: number;
  expected_price_high: number;
  supplier_count: number;
  seasonality: "in_season" | "shoulder" | "off_season";
  risk_level: "low" | "medium" | "high";
}
```

### Design Advisory & Price Check Data
```typescript
DesignAdvisoryItem {
  product_id: string;
  product: string;
  design_advice: "good_choice" | "expensive" | "limited_availability" 
                 | "substitute_recommended" | "stable_option";
  advice_detail: string;
  substitute?: string;
  market_price: number;
  markup_advice: "markup_possible" | "markdown_advised" | "hold" | "none";
  markup_detail: string;
}

PriceCheckItem {
  product_id: string;
  product: string;
  offer_price: number;
  market_price: number;
  recent_purchase_price: number;
  advised_price: number;
  margin_safe: boolean;
  price_check_status: "ok" | "warning" | "critical";
  advice_text: string;
}
```

---

## 🎨 Design System

### Color Semantics
- **Accent (Green):** Positive indicators, opportunities, covered status
- **Destructive (Red):** Critical status, risks, shortages, price increases
- **Yellow:** Warnings, partial status, medium risk
- **Muted:** Neutral information, background context
- **Primary:** Actions, interactive elements, key data

### Status Badges
Consistent badge styling across all tables:
```css
.badge {
  font-size: 9px;
  font-weight: medium;
  padding: 2px 8px;
  border-radius: 9999px;
  border-width: 1px;
}
```

### Table Typography
- **Headers:** 10-11px, medium weight, muted foreground
- **Body:** 11px standard, 10px compact
- **Emphasis:** Font-semibold for key values
- **Mono:** Font-mono for numbers, prices, quantities

---

## 🔄 Data Flow & State Management

### Local State (React useState)
- Tab selection (`activeTab`)
- Filters (search, family, urgency, buyer, dates)
- Sort state (key, direction)
- Expanded rows (`expandedId`)
- View settings (compact, large, column visibility)
- CSV upload state (files, counts, processed flag)
- Manual links (localStorage persistence)

### Data Processing Pipeline
```
1. CSV Upload → 
2. Parse CSV (parseInkooplijst/parseVoorraadlijst) → 
3. Normalize & Group → 
4. Auto-match (matchLists) → 
5. Calculate status → 
6. User manual links → 
7. Final matched view
```

### Manual Links Storage
```typescript
// Stored in localStorage as JSON array
ManualLink {
  inkoopKey: string;  // normalized artikel key
  voorraadKey: string; // normalized voorraad key
}

// Persists across sessions
// Loaded on component mount
// Saved on every link/unlink action
```

---

## 🚀 Business Logic & Intelligence

### Coverage Calculation
```typescript
dekking_pct = min(100, (voorraad / behoefte) * 100)

status = 
  if behoefte = 0 && voorraad > 0: "overschot"
  else if voorraad >= behoefte: "gedekt"
  else if voorraad > 0: "deels_gedekt"
  else: "niet_gedekt"
```

### Price Deviation Logic
```typescript
variance_pct = ((offer_price - historical_price) / historical_price) * 100

color = 
  if variance <= -3%: green (accent)
  else if variance >= 3%: red (destructive)
  else: gray (neutral)
```

### Supply Pressure Assessment
Determines procurement urgency based on:
- Available supply volume
- Supplier count
- Price trend direction
- Historical patterns

### Substitution Suggestion Engine
Finds alternatives based on:
1. **Family Match:** Same product family
2. **Color Match:** Kleur code overlap
3. **Length Compatibility:** Equal or longer stem
4. **Availability Score:** Confidence 0-100%

---

## 📊 KPI Calculation Summary

### Inkooplijst KPIs
```typescript
totalRequired = sum(required_volume)
freeStock = sum(free_stock)
reserved = sum(reserved_stock)
openBuy = sum(open_buy_need)
avgOfferPrice = mean(offer_price)
avgHistoricalPrice = mean(historical_price)
offerVsHistorical = ((avgOffer - avgHistorical) / avgHistorical) * 100
actionNeeded = count(urgency="high" OR (open_buy > 0 && free_stock = 0))
```

### Marktaanbod KPIs
```typescript
totalSupply = sum(available_supply)
critical = count(supply_pressure = "critical")
high = count(supply_pressure = "high")
avgTrend = mean(price_trend)
```

---

## 🔍 Search & Filter Logic

### Search (Inkooplijst)
- Case-insensitive
- Searches in: `product` and `product_family`
- Partial match supported

### Filters
All filters combine with AND logic:
```
filtered_rows = rows
  .filter(search match)
  .filter(family match)
  .filter(urgency match)
  .filter(buyer match)
  .filter(artikelgroep match)  // in matched table
  .filter(lengte match)          // in matched table
  .filter(kleur match)           // in matched table
  .filter(status match)          // in matched table
```

### Sort Priority
1. **Urgency:** high → medium → low
2. **Status:** niet_gedekt → deels_gedekt → gedekt → overschot
3. **Numeric:** Descending for quantities, ascending for text
4. **Toggle:** Click header to reverse direction

---

## 🛠️ Technical Components

### Key Files
```
src/pages/ProcurementCockpitV1.tsx           — Main page
src/components/procurement-cockpit-v1/
  ├─ BehoesteVsVoorraad.tsx                  — CSV matching system
  ├─ DayFilter.tsx                           — Date range picker
  ├─ WeekYearFilter.tsx                      — Week/year selector
  ├─ MarketSupplyPanel.tsx                   — Market supply tab
  ├─ TradeRegistryPanel.tsx                  — Trade registry tab
  ├─ PriceCheckPanel.tsx                     — Price check insights
  ├─ csv-parsers.ts                          — CSV parsing & matching logic
  ├─ procurement-cockpit-v1-data.ts          — Mock procurement data
  └─ procurement-extended-data.ts            — Market/trade/design data
```

### Dependencies
- **React hooks:** useState, useMemo, useCallback
- **UI components:** Custom shadcn-based components
- **Icons:** Lucide React
- **Date utilities:** date-fns (getISOWeek)
- **Storage:** localStorage for manual links

---

## 📈 Future Enhancement Opportunities

### Database Integration
Currently mock data — ready for Supabase migration:
- `procurement_rows` table
- `market_supply` table
- `trade_registry` table
- `manual_links` table (user-specific)

### Real-time Sync
- WebSocket updates for market prices
- Live supplier feeds
- Automated CSV imports

### Advanced Analytics
- Machine learning price predictions
- Seasonality optimization algorithms
- Automated substitution recommendations
- Waste risk scoring

### Export Features
- Excel export for all tabs
- PDF reports
- Email digest summaries

---

## 🎯 Use Cases & Workflows

### Daily Procurement Flow
1. Upload today's Inkooplijst CSV
2. Upload current Voorraadlijst CSV
3. Click "Vergelijk & Afstrepen"
4. Review coverage status
5. Manually link suggested voorraad items
6. Identify "Niet gedekt" products
7. Check Marktaanbod for pricing/availability
8. Place orders for shortage items

### Strategic Planning Flow
1. Open Handelsregister tab
2. Select product of interest
3. Review 52-week forecast
4. Identify optimal purchase windows (in-season, low risk)
5. Note price trends and plan budget
6. Cross-reference with Marktaanbod for current conditions
7. Execute forward contracts during favorable periods

### Price Intelligence Flow
1. Review Marktaanbod for price trends
2. Check Design Advisory for substitution opportunities
3. Compare offer prices vs market prices
4. Identify markup/markdown candidates
5. Adjust quotations based on advised prices
6. Monitor supply pressure for urgency

---

## 🔐 Security & Data Privacy

### Current Implementation
- Client-side only (no backend)
- localStorage for manual links
- No authentication required (Labs version)

### Production Considerations
- User authentication via Supabase Auth
- Row-level security policies
- Encrypted CSV uploads
- Audit logging for procurement decisions
- Role-based access (inkoper, manager, admin)

---

## 📖 Summary

The **Procurement Cockpit V1.5** is a comprehensive, multi-dimensional procurement intelligence platform that unifies:

1. **Operational Execution** (Inkooplijst): Daily demand-supply matching with smart suggestions
2. **Market Intelligence** (Marktaanbod): Real-time supply conditions and pricing trends
3. **Strategic Forecasting** (Handelsregister): 52-week forward visibility for planning

It empowers procurement teams with:
- **Data-driven decisions** via KPI dashboards
- **Efficiency** through CSV automation and smart matching
- **Risk mitigation** via supply pressure monitoring
- **Cost optimization** via price trend analysis and substitution suggestions

The system follows a **modular, extensible architecture** ready for database integration, real-time feeds, and advanced analytics while maintaining a **professional, information-dense UI** optimized for experienced procurement specialists.
