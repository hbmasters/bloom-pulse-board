
-- Procurement Snapshot Rows table
CREATE TABLE public.procurement_snapshot_rows (
  id text PRIMARY KEY,
  product text NOT NULL,
  stem_length text,
  product_family text NOT NULL,
  buyer text,
  required_volume integer NOT NULL DEFAULT 0,
  available_stock integer NOT NULL DEFAULT 0,
  reserved_stock integer NOT NULL DEFAULT 0,
  free_stock integer NOT NULL DEFAULT 0,
  open_buy_need integer NOT NULL DEFAULT 0,
  historical_price real DEFAULT 0,
  offer_price real DEFAULT 0,
  advised_price real DEFAULT 0,
  market_price real,
  variance_vs_calculated real DEFAULT 0,
  preferred_supplier text,
  supplier_quality integer,
  supplier_reliability integer,
  supplier_score integer,
  external_quality text,
  internal_quality integer,
  ai_advice text,
  urgency text NOT NULL DEFAULT 'low',
  status_label text NOT NULL DEFAULT 'onbekend',
  procurement_status text DEFAULT 'current',
  execution_intent_id text,
  execution_status text,
  action_summary text,
  reasoning text,
  procurement_rule_id text,
  customer_product_lines jsonb DEFAULT '[]',
  supplier_offers jsonb DEFAULT '[]',
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.procurement_snapshot_rows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read procurement snapshots"
ON public.procurement_snapshot_rows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin and bandleider can update procurement snapshots"
ON public.procurement_snapshot_rows FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'bandleider'));

CREATE POLICY "Admin and bandleider can insert procurement snapshots"
ON public.procurement_snapshot_rows FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'bandleider'));

-- Seed with existing procurement data
INSERT INTO public.procurement_snapshot_rows (id, product, stem_length, product_family, buyer, required_volume, available_stock, reserved_stock, free_stock, open_buy_need, historical_price, offer_price, advised_price, market_price, variance_vs_calculated, preferred_supplier, supplier_quality, supplier_reliability, supplier_score, external_quality, internal_quality, ai_advice, urgency, status_label, procurement_status, action_summary, reasoning, procurement_rule_id, customer_product_lines, supplier_offers) VALUES
('1', 'Chrysant Ringa Yellow', '70cm', 'Chrysant', 'Jan de Vries', 12000, 3200, 1800, 1400, 5600, 0.075, 0.072, 0.074, 0.065, -4.0, 'Van der Berg Flowers', 97, 96, 95, 'A1', 96, 'buy_now', 'medium', 'deels', 'current', 'Inkoop aanbevolen: deels gedekt, vraag stijgt', 'Offerteprijs onder historisch gemiddelde. Voorraad dekt 27% van behoefte.', 'PR-001',
  '[{"customer":"Bloemenveiling NL","product_name":"HBM Charme XL","stem_length":"70cm","quantity":8000,"departure_date":"14 mrt"},{"customer":"Albert Heijn","product_name":"HBM Field L","stem_length":"65cm","quantity":4000,"departure_date":"15 mrt"}]',
  '[{"supplier_name":"Van der Berg Flowers","offer_price":0.072,"offer_quantity":4000,"delivery_timing":"Morgen","supplier_quality_score":97,"supplier_reliability_score":96,"price_stability_index":94,"variance_vs_historical":-4.0,"variance_vs_offer":0.0},{"supplier_name":"Flora Holland Pool","offer_price":0.078,"offer_quantity":6000,"delivery_timing":"Morgen","supplier_quality_score":93,"supplier_reliability_score":91,"price_stability_index":82,"variance_vs_historical":4.0,"variance_vs_offer":8.3},{"supplier_name":"Kenya Direct BV","offer_price":0.065,"offer_quantity":8000,"delivery_timing":"3 dagen","supplier_quality_score":88,"supplier_reliability_score":82,"price_stability_index":68,"variance_vs_historical":-13.3,"variance_vs_offer":-9.7}]'),
('2', 'Roos Red Naomi', '50cm', 'Roos', 'Pieter Bakker', 18000, 2100, 2100, 0, 7900, 0.125, 0.118, 0.122, 0.112, -5.6, 'Bloem & Blad NL', 99, 97, 98, 'A1', 98, 'buy_now', 'high', 'actie_nodig', 'urgent', 'Directe actie: geen vrije voorraad, hoge vraag', 'Volledige voorraad gereserveerd. 7900 stelen open behoefte. Prijs gunstig vs historisch.', 'PR-002',
  '[{"customer":"Fleurop DE","product_name":"HBM De Luxe","stem_length":"50cm","quantity":6000,"departure_date":"13 mrt"},{"customer":"Bloemenveiling NL","product_name":"HBM Elegance","stem_length":"50cm","quantity":7000,"departure_date":"14 mrt"},{"customer":"Albert Heijn","product_name":"HBM Lovely","stem_length":"45cm","quantity":5000,"departure_date":"15 mrt"}]',
  '[{"supplier_name":"Bloem & Blad NL","offer_price":0.118,"offer_quantity":5000,"delivery_timing":"Morgen","supplier_quality_score":99,"supplier_reliability_score":97,"price_stability_index":96,"variance_vs_historical":-5.6,"variance_vs_offer":0.0},{"supplier_name":"Van der Berg Flowers","offer_price":0.122,"offer_quantity":3000,"delivery_timing":"Morgen","supplier_quality_score":97,"supplier_reliability_score":96,"price_stability_index":94,"variance_vs_historical":-2.4,"variance_vs_offer":3.4},{"supplier_name":"Rosalina BV","offer_price":0.128,"offer_quantity":6000,"delivery_timing":"Morgen","supplier_quality_score":95,"supplier_reliability_score":93,"price_stability_index":90,"variance_vs_historical":2.4,"variance_vs_offer":8.5},{"supplier_name":"Kenya Direct BV","offer_price":0.112,"offer_quantity":10000,"delivery_timing":"4 dagen","supplier_quality_score":86,"supplier_reliability_score":80,"price_stability_index":65,"variance_vs_historical":-10.4,"variance_vs_offer":-5.1}]'),
('3', 'Tulp Strong Gold', '40cm', 'Tulp', 'Jan de Vries', 9500, 4800, 2000, 2800, 1700, 0.055, 0.052, 0.054, 0.048, -5.5, 'Flora Holland Pool', 93, 91, 88, 'A1', 91, 'use_stock', 'low', 'deels', 'current', 'Gebruik voorraad: voldoende dekking', 'Vrije voorraad 2800 stelen. Resterend open behoefte 1700. Marktprijs daalt.', 'PR-003',
  '[{"customer":"Albert Heijn","product_name":"HBM Trend","stem_length":"40cm","quantity":5000,"departure_date":"14 mrt"},{"customer":"Jumbo","product_name":"HBM Spring Bouquet","stem_length":"40cm","quantity":4500,"departure_date":"15 mrt"}]',
  '[]'),
('4', 'Gerbera Kimsey', '55cm', 'Gerbera', 'Kees van Dam', 15000, 1200, 1200, 0, 7800, 0.046, 0.044, 0.045, 0.042, -4.3, 'Gerbera Kwekerij Jansen', 91, 88, 88, 'A2', 87, 'buy_now', 'high', 'actie_nodig', 'today', 'Directe actie: vandaag levering, geen vrije voorraad', 'Volledige voorraad gereserveerd. 7800 stelen open. Marktdruk kritiek.', 'PR-004',
  '[{"customer":"ALDI NL","product_name":"HBM Chique","stem_length":"55cm","quantity":15000,"departure_date":"13 mrt"}]',
  '[{"supplier_name":"Gerbera Kwekerij Jansen","offer_price":0.042,"offer_quantity":8000,"delivery_timing":"2 dagen","supplier_quality_score":91,"supplier_reliability_score":88,"price_stability_index":78,"variance_vs_historical":-8.7,"variance_vs_offer":-4.5},{"supplier_name":"Flora Holland Pool","offer_price":0.044,"offer_quantity":5000,"delivery_timing":"Morgen","supplier_quality_score":93,"supplier_reliability_score":91,"price_stability_index":85,"variance_vs_historical":-4.3,"variance_vs_offer":0.0},{"supplier_name":"Van der Berg Flowers","offer_price":0.046,"offer_quantity":4000,"delivery_timing":"Morgen","supplier_quality_score":97,"supplier_reliability_score":96,"price_stability_index":94,"variance_vs_historical":0.0,"variance_vs_offer":4.5}]'),
('5', 'Lisianthus Rosita White', '60cm', 'Lisianthus', 'Pieter Bakker', 6000, 2400, 800, 1600, 1600, 0.095, 0.091, 0.093, 0.088, -4.2, 'Bloem & Blad NL', 99, 97, 98, 'A1', 95, 'wait', 'low', 'deels', 'current', 'Afwachten: voldoende dekking, prijs stabiel', 'Vrije voorraad 1600. Marktprijs stabiel. Geen haast bij inkoop.', 'PR-005',
  '[{"customer":"Jumbo","product_name":"HBM Pastel","stem_length":"55cm","quantity":3000,"departure_date":"16 mrt"},{"customer":"Albert Heijn","product_name":"HBM Moederdag","stem_length":"60cm","quantity":3000,"departure_date":"17 mrt"}]',
  '[{"supplier_name":"Bloem & Blad NL","offer_price":0.091,"offer_quantity":3000,"delivery_timing":"Morgen","supplier_quality_score":99,"supplier_reliability_score":97,"price_stability_index":96,"variance_vs_historical":-4.2,"variance_vs_offer":0.0},{"supplier_name":"Flora Holland Pool","offer_price":0.098,"offer_quantity":4000,"delivery_timing":"Morgen","supplier_quality_score":93,"supplier_reliability_score":91,"price_stability_index":82,"variance_vs_historical":3.2,"variance_vs_offer":7.7}]'),
('6', 'Alstroemeria Virginia', '65cm', 'Alstroemeria', 'Kees van Dam', 8000, 900, 900, 0, 4600, 0.062, 0.068, 0.064, 0.062, 9.7, 'Bloem & Blad NL', 99, 97, 98, 'A1', 94, 'price_high', 'high', 'actie_nodig', 'urgent', 'Prijs te hoog: onderhandeling aanbevolen', 'Offerteprijs 9.7% boven historisch. Geen vrije voorraad. Overweeg substituut.', 'PR-006',
  '[{"customer":"Lidl NL","product_name":"HBM Field M","stem_length":"60cm","quantity":4000,"departure_date":"13 mrt"},{"customer":"ALDI NL","product_name":"HBM Zomermix","stem_length":"65cm","quantity":4000,"departure_date":"14 mrt"}]',
  '[{"supplier_name":"Bloem & Blad NL","offer_price":0.064,"offer_quantity":2000,"delivery_timing":"2 dagen","supplier_quality_score":99,"supplier_reliability_score":97,"price_stability_index":96,"variance_vs_historical":3.2,"variance_vs_offer":-5.9},{"supplier_name":"Flora Holland Pool","offer_price":0.068,"offer_quantity":3000,"delivery_timing":"Morgen","supplier_quality_score":93,"supplier_reliability_score":91,"price_stability_index":82,"variance_vs_historical":9.7,"variance_vs_offer":0.0}]'),
('7', 'Zonnebloem Sunrich', '80cm', 'Zonnebloem', 'Jan de Vries', 5000, 3100, 1000, 2100, 400, 0.088, 0.085, 0.087, 0.082, -3.4, 'Van der Berg Flowers', 97, 96, 95, 'A1', 97, 'contract_ok', 'low', 'deels', 'completed', 'Contract voldoende: minimale open behoefte', 'Slechts 400 stelen open. Contractprijs marktconform.', 'PR-007',
  '[{"customer":"Bloemenveiling NL","product_name":"HBM Zonnebloem","stem_length":"80cm","quantity":5000,"departure_date":"18 mrt"}]',
  '[]'),
('8', 'Roos Avalanche+', '60cm', 'Roos', 'Pieter Bakker', 14000, 1800, 1800, 0, 5200, 0.135, 0.130, 0.133, 0.125, -3.7, 'Bloem & Blad NL', 99, 97, 98, 'A1', 96, 'prefer_supplier', 'medium', 'actie_nodig', 'current', 'Voorkeursleverancier: beste prijs-kwaliteit', 'Geen vrije voorraad. 5200 open. Voorkeursleverancier biedt -3.7% vs historisch.', 'PR-008',
  '[{"customer":"Fleurop DE","product_name":"HBM De Luxe","stem_length":"60cm","quantity":9000,"departure_date":"14 mrt"},{"customer":"Bloemenveiling NL","product_name":"HBM Orchidee Mix","stem_length":"55cm","quantity":5000,"departure_date":"15 mrt"}]',
  '[{"supplier_name":"Bloem & Blad NL","offer_price":0.130,"offer_quantity":4000,"delivery_timing":"Morgen","supplier_quality_score":99,"supplier_reliability_score":97,"price_stability_index":96,"variance_vs_historical":-3.7,"variance_vs_offer":0.0},{"supplier_name":"Rosalina BV","offer_price":0.135,"offer_quantity":3000,"delivery_timing":"Morgen","supplier_quality_score":95,"supplier_reliability_score":93,"price_stability_index":90,"variance_vs_historical":0.0,"variance_vs_offer":3.8},{"supplier_name":"Kenya Direct BV","offer_price":0.125,"offer_quantity":7000,"delivery_timing":"4 dagen","supplier_quality_score":86,"supplier_reliability_score":80,"price_stability_index":65,"variance_vs_historical":-7.4,"variance_vs_offer":-3.8}]'),
('9', 'Chrysant Baltica White', '70cm', 'Chrysant', 'Jan de Vries', 10000, 5200, 3000, 2200, 800, 0.068, 0.066, 0.067, 0.060, -2.9, 'Van der Berg Flowers', 97, 96, 95, 'A1', 93, 'use_stock', 'low', 'deels', 'completed', 'Gebruik voorraad: grote vrije voorraad', 'Vrije voorraad 2200, slechts 800 open. Marktprijs dalend.', 'PR-009',
  '[{"customer":"Albert Heijn","product_name":"HBM Charme","stem_length":"70cm","quantity":10000,"departure_date":"16 mrt"}]',
  '[]'),
('10', 'Lelie Stargazer', '75cm', 'Lelie', 'Kees van Dam', 4000, 600, 600, 0, 1900, 0.185, 0.178, 0.182, 0.168, -3.8, 'Rosalina BV', 95, 93, 91, 'A1', 92, 'buy_now', 'medium', 'actie_nodig', 'today', 'Inkoop nodig: vandaag levering, premium product', 'Geen vrije voorraad. Premium product met -3.8% vs historisch.', 'PR-010',
  '[{"customer":"Bloemenveiling NL","product_name":"HBM Premium","stem_length":"75cm","quantity":2500,"departure_date":"15 mrt"},{"customer":"Fleurop DE","product_name":"HBM Elegance","stem_length":"70cm","quantity":1500,"departure_date":"16 mrt"}]',
  '[{"supplier_name":"Rosalina BV","offer_price":0.178,"offer_quantity":2000,"delivery_timing":"Morgen","supplier_quality_score":95,"supplier_reliability_score":93,"price_stability_index":90,"variance_vs_historical":-3.8,"variance_vs_offer":0.0},{"supplier_name":"Van der Berg Flowers","offer_price":0.185,"offer_quantity":1500,"delivery_timing":"Morgen","supplier_quality_score":97,"supplier_reliability_score":96,"price_stability_index":94,"variance_vs_historical":0.0,"variance_vs_offer":3.9},{"supplier_name":"Kenya Direct BV","offer_price":0.168,"offer_quantity":3000,"delivery_timing":"4 dagen","supplier_quality_score":86,"supplier_reliability_score":80,"price_stability_index":65,"variance_vs_historical":-9.2,"variance_vs_offer":-5.6}]');
