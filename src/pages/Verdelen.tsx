import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Package, Bot, AlertTriangle, CheckCircle2, ArrowRight, Sparkles,
  ClipboardList, TrendingUp, ShieldAlert, Zap, FileText, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  productionOrders, aiActions, picklists, allocationLogs,
  statusColors, marginColors, aiIndicatorLabels,
  type ProductionOrder, type AIAction,
} from "@/components/verdelen/verdelen-data";

const Verdelen = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(productionOrders[0]?.id ?? null);
  const [actions, setActions] = useState<AIAction[]>(aiActions);
  const [confirmedOrders, setConfirmedOrders] = useState<Set<string>>(new Set());

  const selectedOrder = productionOrders.find(o => o.id === selectedOrderId) ?? null;
  const teVerdelenOrders = productionOrders.filter(o => o.status !== "completed");
  const verdeeldOrders = productionOrders.filter(o => o.status === "completed" || o.status === "ready");

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
              <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5">{teVerdelenOrders.length}</Badge>
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
        </div>

        {/* ─── Te Verdelen ─── */}
        <TabsContent value="te-verdelen" className="flex-1 min-h-0 m-0">
          <div className="flex flex-col lg:flex-row h-full">
            {/* LEFT — Orders Table */}
            <div className="lg:w-[55%] border-r border-border flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className="text-[10px] font-mono uppercase tracking-wider">
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="hidden sm:table-cell">Klant</TableHead>
                      <TableHead>Boeket</TableHead>
                      <TableHead className="hidden md:table-cell">Lijn</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="hidden sm:table-cell">Vertrek</TableHead>
                      <TableHead>Voortgang</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">AI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teVerdelenOrders.map(order => (
                      <TableRow
                        key={order.id}
                        className={cn(
                          "cursor-pointer transition-colors text-xs",
                          selectedOrderId === order.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-secondary/30"
                        )}
                        onClick={() => setSelectedOrderId(order.id)}
                      >
                        <TableCell className="p-2">
                          {order.status === "action" && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                          {order.status === "blocked" && <ShieldAlert className="w-3.5 h-3.5 text-destructive" />}
                          {order.status === "ready" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </TableCell>
                        <TableCell className="font-mono text-[11px]">{order.orderNumber.replace("PO-2026-", "")}</TableCell>
                        <TableCell className="hidden sm:table-cell">{order.customer}</TableCell>
                        <TableCell className="font-medium">{order.bouquet}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{order.productionLine}</TableCell>
                        <TableCell className="text-right font-mono">{order.quantity}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{order.departureDate.slice(5)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={order.allocationProgress} className="h-1.5 w-16" />
                            <span className="text-[10px] font-mono text-muted-foreground">{order.allocationProgress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[9px] font-mono uppercase px-1.5 py-0", statusColors[order.status])}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {order.aiIndicators.map(ind => (
                              <Badge key={ind} variant="outline" className={cn("text-[8px] px-1 py-0", aiIndicatorLabels[ind].className)}>
                                {aiIndicatorLabels[ind].label}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* RIGHT — Detail Panel */}
            <div className="lg:w-[45%] flex flex-col min-h-0">
              <ScrollArea className="flex-1">
                {selectedOrder ? (
                  <div className="p-4 space-y-4">
                    {/* Order header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{selectedOrder.orderNumber}</h3>
                        <p className="text-xs text-muted-foreground">{selectedOrder.customer} — {selectedOrder.bouquet}</p>
                        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                          {selectedOrder.productionLine} • {selectedOrder.quantity} stuks • Vertrek {selectedOrder.departureDate}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] font-mono uppercase", statusColors[selectedOrder.status])}>
                        {selectedOrder.status}
                      </Badge>
                    </div>

                    {/* Margin card */}
                    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">Marge Signalen</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <span className="text-[9px] font-mono text-muted-foreground block">Verwachte Marge %</span>
                          <span className={cn("text-lg font-bold", marginColors[selectedOrder.marginRisk])}>{selectedOrder.expectedMarginPct}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-muted-foreground block">Verwachte Marge €</span>
                          <span className={cn("text-lg font-bold", marginColors[selectedOrder.marginRisk])}>€{selectedOrder.expectedMarginEur.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-muted-foreground block">Risico</span>
                          <Badge variant="outline" className={cn("text-[10px] mt-1", statusColors[selectedOrder.marginRisk === "critical" ? "blocked" : selectedOrder.marginRisk === "warning" ? "action" : "ready"])}>
                            {selectedOrder.marginRisk === "ok" ? "Gezond" : selectedOrder.marginRisk === "warning" ? "Aandacht" : "Kritiek"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Article lines */}
                    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm p-3">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-2">Artikelregels</span>
                      <div className="space-y-2">
                        {selectedOrder.articles.map(art => (
                          <div key={art.id} className="flex items-center gap-3 py-1.5 border-b border-border/50 last:border-0">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-foreground block truncate">{art.articleName}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Progress value={(art.allocated / art.needed) * 100} className="h-1 w-20" />
                                <span className="text-[10px] font-mono text-muted-foreground">{art.allocated}/{art.needed}</span>
                              </div>
                            </div>
                            {art.substituteAvailable && (
                              <div className="text-right shrink-0">
                                <Badge variant="outline" className="text-[8px] bg-blue-500/10 text-blue-400 border-blue-500/30 mb-0.5">
                                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> {art.substituteName}
                                </Badge>
                                <div className="text-[9px] font-mono text-muted-foreground">
                                  {art.substituteConfidence}% conf • €{art.marginImpact! > 0 ? "+" : ""}{art.marginImpact?.toFixed(2)}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Actions */}
                    {orderActions.length > 0 && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-sm p-3">
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

                    {/* AI Indicators */}
                    {selectedOrder.aiIndicators.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOrder.aiIndicators.map(ind => (
                          <Badge key={ind} variant="outline" className={cn("text-[9px]", aiIndicatorLabels[ind].className)}>
                            {aiIndicatorLabels[ind].label}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Confirm */}
                    {selectedOrder.status !== "completed" && (
                      <div className="rounded-lg border border-border bg-card/60 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-medium text-foreground">Bevestig Allocatie</span>
                            <p className="text-[10px] text-muted-foreground">Menselijke bevestiging vereist voor picklijst</p>
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
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Selecteer een productieorder
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* ─── Verdeeld ─── */}
        <TabsContent value="verdeeld" className="flex-1 min-h-0 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              <Table>
                <TableHeader>
                  <TableRow className="text-[10px] font-mono uppercase tracking-wider">
                    <TableHead>Order</TableHead>
                    <TableHead>Klant</TableHead>
                    <TableHead>Boeket</TableHead>
                    <TableHead>Lijn</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Marge</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verdeeldOrders.map(order => (
                    <TableRow key={order.id} className="text-xs">
                      <TableCell className="font-mono text-[11px]">{order.orderNumber}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="font-medium">{order.bouquet}</TableCell>
                      <TableCell className="text-muted-foreground">{order.productionLine}</TableCell>
                      <TableCell className="text-right font-mono">{order.quantity}</TableCell>
                      <TableCell>
                        <span className={cn("font-mono", marginColors[order.marginRisk])}>{order.expectedMarginPct}%</span>
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
