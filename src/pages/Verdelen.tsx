import { useState, useMemo } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Package, Bot, CheckCircle2, ArrowRight, Sparkles, ChevronRight, ChevronLeft,
  ClipboardList, TrendingUp, ShieldAlert, Zap, FileText, Printer, ArrowRightLeft,
  Truck, MapPin, Clock, CalendarIcon, Search, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  productionOrders, stockBatches, aiActions, picklists, allocationLogs,
  statusColors, marginColors, aiIndicatorLabels, trackTraceColors,
  type ProductionOrder, type AIAction, type StockBatch,
} from "@/components/verdelen/verdelen-data";

// Asset imports
import imgCharmeXl from "@/assets/product-charme-xl.jpg";
import imgFieldM from "@/assets/product-field-m.jpg";
import imgTrend from "@/assets/product-trend.jpg";
import imgDeLuxe from "@/assets/product-de-luxe.jpg";
import imgLovely from "@/assets/product-lovely.jpg";

const bouquetImageMap: Record<string, string> = {
  "product-charme-xl.jpg": imgCharmeXl,
  "product-field-m.jpg": imgFieldM,
  "product-trend.jpg": imgTrend,
  "product-de-luxe.jpg": imgDeLuxe,
  "product-lovely.jpg": imgLovely,
};

const Verdelen = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(productionOrders[0]?.id ?? null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [actions, setActions] = useState<AIAction[]>(aiActions);
  const [confirmedOrders, setConfirmedOrders] = useState<Set<string>>(new Set());
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date("2026-03-17"));
  const [orderSearch, setOrderSearch] = useState("");
  const [orderNavOpen, setOrderNavOpen] = useState(true);

  // Filter orders by departure date
  const dateFilteredOrders = useMemo(() => {
    if (!departureDate) return productionOrders;
    const dateStr = format(departureDate, "yyyy-MM-dd");
    return productionOrders.filter(o => o.departureDate === dateStr);
  }, [departureDate]);

  // Further filter by search
  const filteredTeVerdelen = useMemo(() => {
    const base = dateFilteredOrders.filter(o => o.status !== "completed");
    if (!orderSearch.trim()) return base;
    const q = orderSearch.toLowerCase();
    return base.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.bouquet.toLowerCase().includes(q)
    );
  }, [dateFilteredOrders, orderSearch]);

  const selectedOrder = productionOrders.find(o => o.id === selectedOrderId) ?? null;
  const verdeeldOrders = dateFilteredOrders.filter(o => o.status === "completed" || o.status === "ready");

  // Filter batches relevant to selected order's articles
  const relevantBatches = useMemo(() => {
    if (!selectedOrder) return stockBatches;
    const articleNames = selectedOrder.articles.map(a => a.articleName);
    const substitutes = selectedOrder.articles
      .filter(a => a.substituteName)
      .map(a => a.substituteName!);
    const allNames = [...articleNames, ...substitutes];
    return stockBatches.filter(b => allNames.includes(b.articleName));
  }, [selectedOrder]);

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  };

  const confirmOrder = (orderId: string) => {
    setConfirmedOrders(prev => new Set(prev).add(orderId));
  };

  const orderActions = selectedOrder
    ? actions.filter(a => a.orderId === selectedOrder.id)
    : [];

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Package className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">Verdelen</h2>
          <p className="text-[10px] font-mono text-muted-foreground">Allocatie Cockpit — Voorraad → Productieorders</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono bg-primary/10 text-primary border-primary/30">
            <Bot className="w-3 h-3 mr-1" /> AI Assist Actief
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="te-verdelen" className="flex-1 min-h-0 flex flex-col">
        <div className="px-4 md:px-6 pt-2 flex-shrink-0">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="te-verdelen" className="text-xs gap-1.5">
              <Package className="w-3.5 h-3.5" /> Te Verdelen
              <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{filteredTeVerdelen.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="verdeeld" className="text-xs gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verdeeld
              <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{verdeeldOrders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="picklijsten" className="text-xs gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" /> Picklijsten
              <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{picklists.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Compact date + search filter bar */}
          <div className="flex items-center gap-2 ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-[10px] font-mono gap-1.5 h-7 px-2">
                  <CalendarIcon className="w-3 h-3" />
                  {departureDate ? format(departureDate, "dd MMM", { locale: nl }) : "Alle data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="px-3 pb-2">
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setDepartureDate(undefined)}>
                    Alle data tonen
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                placeholder="Zoek order..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="h-7 w-36 pl-6 text-[10px] font-mono bg-secondary/30 border-border"
              />
            </div>
          </div>
        </div>

        {/* ─── Te Verdelen ─── */}
        <TabsContent value="te-verdelen" className="flex-1 min-h-0 m-0">
          <div className="flex h-full">
            {/* ─── Order navigator sidebar ─── */}
            <div className={cn(
              "flex flex-col border-r border-border bg-card/30 transition-all duration-200 shrink-0",
              orderNavOpen ? "w-56" : "w-10"
            )}>
              <button
                onClick={() => setOrderNavOpen(!orderNavOpen)}
                className="flex items-center justify-between px-2 py-1.5 border-b border-border text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:bg-secondary/30"
              >
                {orderNavOpen && <span>Orders ({filteredTeVerdelen.length})</span>}
                {orderNavOpen ? <ChevronLeft className="w-3 h-3" /> : <Package className="w-3.5 h-3.5 mx-auto" />}
              </button>
              {orderNavOpen && (
                <ScrollArea className="flex-1">
                  <div className="py-0.5">
                    {filteredTeVerdelen.map(order => {
                      const isActive = selectedOrderId === order.id;
                      return (
                        <button
                          key={order.id}
                          onClick={() => { setSelectedOrderId(order.id); setSelectedArticleId(null); setSelectedBatchId(null); }}
                          className={cn(
                            "w-full flex items-center gap-1.5 px-2 py-1.5 text-left transition-colors",
                            isActive ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-secondary/30 border-l-2 border-l-transparent"
                          )}
                        >
                          <div className="shrink-0">
                            {order.status === "action" && <Zap className="w-3 h-3 text-amber-400" />}
                            {order.status === "blocked" && <ShieldAlert className="w-3 h-3 text-destructive" />}
                            {order.status === "ready" && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-mono font-medium text-foreground">{order.orderNumber.replace("PO-2026-", "")}</span>
                              <span className="text-[9px] font-mono text-muted-foreground">{order.allocationProgress}%</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground truncate block">{order.bouquet}</span>
                          </div>
                        </button>
                      );
                    })}
                    {filteredTeVerdelen.length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-4 px-2">Geen orders gevonden</p>
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Main content area */}
            {selectedOrder && (
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row min-w-0">

                {/* ═══ LEFT PANEL: Beschikbare Voorraad ═══ */}
                <div className="lg:w-[48%] flex flex-col min-h-0 border-r border-border">
                  <div className="px-4 py-2 border-b border-border flex-shrink-0 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        Beschikbare Voorraad
                      </span>
                      {selectedArticleId && (
                        <span className="text-[10px] font-mono text-primary ml-2">
                          — gefilterd
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <MapPin className="w-2.5 h-2.5 mr-0.5" /> Binnengemeld
                      </Badge>
                      <Badge variant="outline" className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border-blue-500/30">
                        <Truck className="w-2.5 h-2.5 mr-0.5" /> Onderweg
                      </Badge>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-[10px] font-mono uppercase tracking-wider">
                          <TableHead className="w-6"></TableHead>
                          <TableHead>Artikel</TableHead>
                          <TableHead className="text-right">AVE</TableHead>
                          <TableHead className="text-right hidden md:table-cell">APE</TableHead>
                          <TableHead className="text-right">€ Prijs</TableHead>
                          <TableHead className="hidden lg:table-cell">Leverancier</TableHead>
                          <TableHead className="hidden xl:table-cell">Leeft.</TableHead>
                          <TableHead className="hidden xl:table-cell">Kwal</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relevantBatches.map(batch => {
                          const isSelected = selectedBatchId === batch.id;
                          const lowStock = batch.ave < 100;
                          const tt = trackTraceColors[batch.trackTrace];
                          return (
                            <TableRow
                              key={batch.id}
                              className={cn(
                                "cursor-pointer transition-colors text-xs",
                                isSelected ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/30",
                                batch.ave === 0 && "opacity-40"
                              )}
                              onClick={() => setSelectedBatchId(isSelected ? null : batch.id)}
                            >
                              <TableCell className="p-2">
                                <div className={cn("w-2 h-2 rounded-full", batch.ave === 0 ? "bg-destructive" : lowStock ? "bg-amber-400" : "bg-emerald-400")} />
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-foreground block truncate max-w-[160px]">{batch.articleName}</span>
                                <span className="text-[9px] font-mono text-muted-foreground">{batch.articleCode} • {batch.origin}</span>
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                <span className={batch.ave === 0 ? "text-destructive" : lowStock ? "text-amber-400" : "text-foreground"}>{batch.ave.toLocaleString()}</span>
                              </TableCell>
                              <TableCell className="text-right font-mono hidden md:table-cell text-muted-foreground">{batch.ape.toLocaleString()}</TableCell>
                              <TableCell className="text-right font-mono font-medium">€{batch.valuationPrice.toFixed(2)}</TableCell>
                              <TableCell className="hidden lg:table-cell text-muted-foreground text-[11px] max-w-[110px] truncate">{batch.supplier}</TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-mono",
                                  batch.ageDays >= 3 ? "text-amber-400 border-amber-500/30" : "text-muted-foreground border-border"
                                )}>
                                  {batch.ageDays}d
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-mono",
                                  batch.quality === "A" ? "text-emerald-400 border-emerald-500/30" : "text-amber-400 border-amber-500/30"
                                )}>
                                  {batch.quality}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("text-[8px] font-mono", tt.className)}>
                                  {batch.trackTrace === "binnengemeld" && <MapPin className="w-2.5 h-2.5 mr-0.5" />}
                                  {batch.trackTrace === "onderweg" && <Truck className="w-2.5 h-2.5 mr-0.5" />}
                                  {batch.trackTrace === "verwacht" && <Clock className="w-2.5 h-2.5 mr-0.5" />}
                                  {tt.label}
                                </Badge>
                                {batch.expectedArrival && batch.trackTrace !== "binnengemeld" && (
                                  <span className="text-[8px] font-mono text-muted-foreground block mt-0.5">
                                    ETA: {batch.expectedArrival.slice(5)}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                {/* ═══ CENTER: Allocation arrows + AI auto ═══ */}
                <div className="hidden lg:flex flex-col items-center justify-center w-16 shrink-0 gap-3 py-8">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-primary/40 text-primary hover:bg-primary/10"
                    disabled={!selectedBatchId || !selectedArticleId}
                    title="Verdeel naar order →"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[8px] font-mono text-muted-foreground text-center leading-tight">
                      Verdeel
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-10 h-10 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                    disabled={!selectedArticleId}
                    title="← Verwijder van order"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  {/* AI Auto Verdeel */}
                  <div className="mt-4 border-t border-border pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] gap-1.5 border-primary/40 text-primary hover:bg-primary/10 px-2.5 py-4 flex-col h-auto"
                      title="AI verdeelt automatisch de beste batches"
                    >
                      <Bot className="w-4 h-4" />
                      <span className="leading-tight text-center">Auto<br/>Verdeel</span>
                    </Button>
                  </div>
                </div>

                {/* Mobile allocate bar */}
                <div className="lg:hidden flex items-center justify-center gap-2 py-2 border-y border-border bg-secondary/20 shrink-0">
                  <Button variant="outline" size="sm" className="text-xs gap-1 text-primary border-primary/30" disabled={!selectedBatchId || !selectedArticleId}>
                    Verdeel <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1 border-primary/30 text-primary" title="AI Auto Verdeel">
                    <Bot className="w-3.5 h-3.5" /> Auto
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1 text-destructive border-destructive/30" disabled={!selectedArticleId}>
                    <ChevronLeft className="w-3.5 h-3.5" /> Verwijder
                  </Button>
                </div>

                {/* ═══ RIGHT PANEL: Product / Order detail ═══ */}
                <div className="lg:flex-1 flex flex-col min-h-0 min-w-0">
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                      {/* Order header with large photo */}
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg border border-border overflow-hidden shrink-0 bg-secondary/30">
                          <img
                            src={bouquetImageMap[selectedOrder.bouquetImage]}
                            alt={selectedOrder.bouquet}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-foreground">{selectedOrder.bouquet}</h3>
                            <Badge variant="outline" className={cn("text-[9px] font-mono uppercase", statusColors[selectedOrder.status])}>
                              {selectedOrder.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{selectedOrder.customer}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {selectedOrder.orderNumber} • {selectedOrder.productionLine} • {selectedOrder.quantity} st
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            Vertrek: {selectedOrder.departureDate}
                          </p>
                          {/* AI indicators */}
                          {selectedOrder.aiIndicators.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {selectedOrder.aiIndicators.map(ind => (
                                <Badge key={ind} variant="outline" className={cn("text-[8px]", aiIndicatorLabels[ind].className)}>
                                  {aiIndicatorLabels[ind].label}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Margin panel */}
                      <div className="rounded-lg border border-border bg-card/60 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Marge</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[9px] font-mono text-muted-foreground block">Gewenste Marge</span>
                            <span className="text-base font-bold text-foreground">{selectedOrder.targetMarginPct}% <span className="text-xs text-muted-foreground font-normal">/ €{selectedOrder.targetMarginEur.toFixed(2)}</span></span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-muted-foreground block">Huidige Marge</span>
                            <span className={cn("text-base font-bold", marginColors[selectedOrder.marginRisk])}>
                              {selectedOrder.currentMarginPct}% <span className="text-xs font-normal opacity-70">/ €{selectedOrder.currentMarginEur.toFixed(2)}</span>
                            </span>
                          </div>
                        </div>
                        {selectedOrder.currentMarginPct < selectedOrder.targetMarginPct && (
                          <div className="mt-2 text-[10px] font-mono text-amber-400">
                            ⚠ Marge {(selectedOrder.targetMarginPct - selectedOrder.currentMarginPct)}% onder target
                          </div>
                        )}
                      </div>

                      {/* Allocation progress */}
                      <div className="flex items-center gap-2">
                        <Progress value={selectedOrder.allocationProgress} className="h-2 flex-1" />
                        <span className="text-xs font-mono text-muted-foreground">{selectedOrder.allocationProgress}% verdeeld</span>
                      </div>

                      {/* Article lines */}
                      <div className="rounded-lg border border-border bg-card/60 p-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-2">Artikelregels (recept)</span>
                        <div className="space-y-1">
                          {selectedOrder.articles.map(art => {
                            const pct = art.needed > 0 ? (art.allocated / art.needed) * 100 : 0;
                            const isSelected = selectedArticleId === art.id;
                            return (
                              <button
                                key={art.id}
                                onClick={() => setSelectedArticleId(isSelected ? null : art.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 py-2 px-2 rounded-md text-left transition-colors",
                                  isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary/30 border border-transparent"
                                )}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-foreground truncate">{art.articleName}</span>
                                    {art.substituteAvailable && (
                                      <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Progress value={pct} className="h-1 w-16" />
                                    <span className="text-[10px] font-mono text-muted-foreground">{art.allocated}/{art.needed}</span>
                                  </div>
                                </div>
                                <ChevronRight className={cn("w-3 h-3 text-muted-foreground transition-transform", isSelected && "rotate-90")} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Substitute advice for selected article */}
                      {selectedArticleId && (() => {
                        const art = selectedOrder.articles.find(a => a.id === selectedArticleId);
                        if (!art?.substituteAvailable) return null;
                        return (
                          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">AI Substitutie Advies</span>
                            </div>
                            <p className="text-xs text-foreground">
                              <span className="font-medium">{art.substituteName}</span>
                              <span className="text-muted-foreground"> — {art.substituteConfidence}% vertrouwen</span>
                            </p>
                            <p className="text-[10px] font-mono text-muted-foreground">
                              Marge impact: <span className={art.marginImpact! >= 0 ? "text-emerald-400" : "text-amber-400"}>
                                €{art.marginImpact! > 0 ? "+" : ""}{art.marginImpact?.toFixed(2)}/stuk
                              </span>
                            </p>
                          </div>
                        );
                      })()}

                      {/* AI Actions */}
                      {orderActions.length > 0 && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">AI Acties</span>
                          </div>
                          <div className="space-y-1.5">
                            {orderActions.map(act => (
                              <label key={act.id} className="flex items-center gap-2 cursor-pointer group">
                                <Checkbox checked={act.done} onCheckedChange={() => toggleAction(act.id)} />
                                <span className={cn("text-xs transition-colors", act.done ? "line-through text-muted-foreground" : "text-foreground group-hover:text-primary")}>
                                  {act.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Confirm */}
                      {selectedOrder.status !== "completed" && (
                        <div className="rounded-lg border border-border bg-card/60 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-medium text-foreground">Bevestig Allocatie</span>
                              <p className="text-[10px] text-muted-foreground">Menselijke bevestiging vereist</p>
                            </div>
                            <Button
                              size="sm"
                              disabled={confirmedOrders.has(selectedOrder.id) || selectedOrder.allocationProgress < 100}
                              onClick={() => confirmOrder(selectedOrder.id)}
                              className="text-xs gap-1.5"
                            >
                              {confirmedOrders.has(selectedOrder.id) ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Bevestigd</>
                              ) : (
                                <><ArrowRight className="w-3.5 h-3.5" /> Bevestigen</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ─── Verdeeld ─── */}
        <TabsContent value="verdeeld" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              <Table>
                <TableHeader>
                  <TableRow className="text-[10px] font-mono uppercase tracking-wider">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Klant</TableHead>
                    <TableHead>Boeket</TableHead>
                    <TableHead>Lijn</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Gewenste Marge</TableHead>
                    <TableHead>Huidige Marge</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verdeeldOrders.map(order => (
                    <TableRow key={order.id} className="text-xs">
                      <TableCell className="p-2">
                        <div className="w-8 h-8 rounded overflow-hidden bg-secondary/30">
                          <img src={bouquetImageMap[order.bouquetImage]} alt={order.bouquet} className="w-full h-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-[11px]">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="font-medium">{order.bouquet}</TableCell>
                      <TableCell className="text-muted-foreground">{order.productionLine}</TableCell>
                      <TableCell className="text-right font-mono">{order.quantity}</TableCell>
                      <TableCell>
                        <span className="font-mono">{order.targetMarginPct}%</span>
                        <span className="text-[10px] text-muted-foreground ml-1">/ €{order.targetMarginEur.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("font-mono", marginColors[order.marginRisk])}>{order.currentMarginPct}%</span>
                        <span className="text-[10px] text-muted-foreground ml-1">/ €{order.currentMarginEur.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] font-mono uppercase", statusColors[order.status])}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Allocation logs */}
              <div className="mt-6 rounded-lg border border-border bg-card/60 p-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-3">Allocatie Log</span>
                <div className="space-y-2">
                  {allocationLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{log.time}</span>
                      <div className="flex-1">
                        <span className="font-medium text-foreground">{log.user}</span>
                        <span className="text-muted-foreground"> — {log.aiSuggestion}</span>
                        {log.overrideReason && (
                          <span className="text-amber-400 block text-[10px]">Override: {log.overrideReason}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* ─── Picklijsten ─── */}
        <TabsContent value="picklijsten" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              <div className="grid gap-3">
                {picklists.map(pk => (
                  <div key={pk.id} className="rounded-lg border border-border bg-card/60 backdrop-blur-sm p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-foreground">{pk.orderNumber}</span>
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-mono uppercase",
                          pk.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : pk.status === "printed" ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        )}>
                          {pk.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{pk.customer} — {pk.bouquet}</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        Gegenereerd: {pk.generatedAt} door {pk.generatedBy}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5 shrink-0">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] font-mono text-muted-foreground mt-4 px-1">
                Pagina 1: Technische productiedata • Pagina 2: Ontwerp instructies • Prijzen worden nooit getoond
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Verdelen;
