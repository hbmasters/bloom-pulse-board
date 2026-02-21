import { useState } from "react";
import { Printer, UserCheck, Hand, Cog, User, Package, CalendarDays, Zap, Trophy, X, UserRound } from "lucide-react";
import {
  printedOrders,
  pickedOrders,
  waitingForHandOrders,
  waitingForBandOrders,
  waitingForOthersOrders,
  fastestPicker,
  type ColdStorageOrder,
  type PickedOrder,
} from "@/data/coldStorageData";

const formatHours = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}u${m > 0 ? `${m}m` : ""}` : `${m}m`;
};

const getTotalMinutes = (orders: ColdStorageOrder[]) =>
  orders.reduce((sum, o) => sum + o.estimatedMinutes, 0);

const getTotalQuantity = (orders: ColdStorageOrder[]) =>
  orders.reduce((sum, o) => sum + o.quantity, 0);

const SectionHeader = ({
  icon,
  title,
  count,
  totalMinutes,
  totalPcs,
  color,
  progress,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  totalMinutes: number;
  totalPcs: number;
  color: string;
  progress?: number;
}) => (
  <div className="mb-1.5 shrink-0">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${color}`}>{icon}</div>
        <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">{title}</h3>
        <span className="text-[9px] font-mono font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary border border-border">
          <span className="text-[8px] text-muted-foreground font-semibold">⏱</span>
          <span className="text-xs font-mono font-black text-foreground">{formatHours(totalMinutes)}</span>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
          <span className="text-xs font-mono font-black text-primary">{totalPcs.toLocaleString()}</span>
          <span className="text-[8px] text-muted-foreground font-semibold">pcs</span>
        </div>
      </div>
    </div>
    {progress !== undefined && (
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
  </div>
);

// Force scan popup
const ForceScanPopup = ({
  order,
  onClose,
  onConfirm,
}: {
  order: ColdStorageOrder | PickedOrder;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
    <div
      className="bg-card rounded-2xl border border-border shadow-2xl p-6 max-w-md w-full mx-4 animate-slide-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Force Uitscannen</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="bg-secondary rounded-xl p-4 mb-4">
        <div className="text-sm font-bold text-foreground mb-1">{order.name}</div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-mono font-bold">{order.quantity} pcs</span>
          <span>{formatHours(order.estimatedMinutes)}</span>
          {order.departureDate && <span>Vertrek: {order.departureDate}</span>}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Weet je zeker dat je deze productie order handmatig wilt uitscannen?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          Annuleren
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
        >
          Uitscannen
        </button>
      </div>
    </div>
  </div>
);

// Category color map
const categoryColors: Record<string, string> = {
  Hand: "bg-bloom-warm/15 text-bloom-warm border-bloom-warm/25",
  Band: "bg-primary/15 text-primary border-primary/25",
  Others: "bg-bloom-sky/15 text-bloom-sky border-bloom-sky/25",
};

// Printed order row — clean by default, details on hover
const PrintedOrderRow = ({ order, onClick }: { order: ColdStorageOrder; onClick: () => void }) => (
  <div
    className="group/row flex items-center gap-2 px-2 py-1 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:py-1.5 transition-all"
    onClick={onClick}
  >
    <div className="hidden group-hover/row:flex w-6 h-6 rounded-full bg-accent/15 border border-accent/25 items-center justify-center shrink-0" title={order.accountManager}>
      <UserRound className="w-3 h-3 text-accent" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-foreground truncate">{order.name}</span>
        {order.category && (
          <span className={`text-[7px] font-semibold px-1.5 py-0.5 rounded-full border shrink-0 ${categoryColors[order.category] || "bg-secondary text-muted-foreground border-border"}`}>
            {order.category}
          </span>
        )}
      </div>
      <div className="hidden group-hover/row:flex items-center gap-1.5 mt-0.5">
        <User className="w-2.5 h-2.5 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground">{order.printedBy}</span>
        <CalendarDays className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />
        <span className="text-[8px] text-muted-foreground">{order.departureDate}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[7px] text-muted-foreground">{formatHours(order.estimatedMinutes)}</div>
    </div>
  </div>
);

// Waiting order row — clean by default, details on hover
const WaitingOrderRow = ({ order, onClick }: { order: ColdStorageOrder; onClick: () => void }) => (
  <div
    className="group/row flex items-center gap-2 px-2 py-1 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:py-1.5 transition-all"
    onClick={onClick}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-foreground truncate">{order.name}</span>
        {order.category && (
          <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded-full bg-bloom-warm/15 text-bloom-warm border border-bloom-warm/25 shrink-0">
            {order.category}
          </span>
        )}
      </div>
      <div className="hidden group-hover/row:flex items-center gap-1.5 mt-0.5">
        <User className="w-2.5 h-2.5 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground">{order.pickedBy}</span>
        {order.advisedLine && (
          <span className="text-[8px] font-mono font-bold text-primary bg-primary/10 px-1 rounded">{order.advisedLine}</span>
        )}
        <CalendarDays className="w-2.5 h-2.5 text-muted-foreground ml-0.5" />
        <span className="text-[8px] text-muted-foreground">{order.departureDate}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[7px] text-muted-foreground">{formatHours(order.estimatedMinutes)}</div>
    </div>
  </div>
);

// Picked card: clean photo, info bar below
const PickedOrderCard = ({ order, onClick }: { order: PickedOrder; onClick: () => void }) => (
  <div
    className="bg-card rounded-xl border border-accent/25 overflow-hidden flex flex-col h-full shadow-sm cursor-pointer hover:border-accent/50 transition-colors"
    onClick={onClick}
  >
    <div className="relative flex-1 min-h-0 overflow-hidden bg-secondary flex items-center justify-center">
      {order.image ? (
        <img src={order.image} alt={order.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-black text-muted-foreground/30">{order.name.charAt(0)}</span>
      )}
      {/* Picker top-right */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1.5 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 border border-border shadow-sm">
        <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center">
          <span className="text-[8px] font-black text-primary-foreground">{order.picker.charAt(0)}</span>
        </div>
        <span className="text-[10px] font-bold text-foreground">{order.picker}</span>
      </div>
    </div>
    {/* Info bar below photo */}
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="min-w-0">
        <h3 className="text-[10px] font-bold text-foreground truncate">{order.name}</h3>
        <span className="text-[8px] text-muted-foreground">{order.departureDate}</span>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
        <div className="text-[7px] text-muted-foreground">{formatHours(order.estimatedMinutes)}</div>
      </div>
    </div>
  </div>
);

const getPickedGridCols = (count: number) => {
  if (count <= 6) return "grid-cols-3";
  return "grid-cols-4";
};

const getPickedGridRows = (count: number) => {
  const cols = count <= 6 ? 3 : 4;
  return Math.ceil(count / cols);
};

// Most orders done today panel
const FastestPickerPanel = () => (
  <div className="rounded-xl border border-bloom-warm/30 bg-bloom-warm/5 p-3">
    <div className="flex items-center gap-2 mb-1">
      <Trophy className="w-4 h-4 text-bloom-warm" />
      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Most Orders Done Today</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-warm to-bloom-warm/70 flex items-center justify-center shadow-md">
        <span className="text-sm font-black text-primary-foreground">{fastestPicker.name.charAt(0)}</span>
      </div>
      <div className="flex-1">
        <div className="text-base font-bold text-foreground">{fastestPicker.name}</div>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 text-bloom-warm" />
            {fastestPicker.ordersCompleted} orders
          </span>
          <span>avg {fastestPicker.avgMinutesPerOrder}min/order</span>
        </div>
      </div>
    </div>
  </div>
);

const ColdStorageSections = () => {
  const [selectedOrder, setSelectedOrder] = useState<ColdStorageOrder | PickedOrder | null>(null);
  const gridCols = getPickedGridCols(pickedOrders.length);
  const gridRows = getPickedGridRows(pickedOrders.length);

  return (
    <>
      <div className="grid gap-3 h-full grid-cols-[0.6fr_2fr_1fr] hover:[grid-template-columns:1fr_2fr_1fr] transition-all duration-300 group/grid">
        {/* Left: Printed + Fastest Picker — narrow by default, expands on hover */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0">
            <SectionHeader
              icon={<Printer className="w-3 h-3 text-primary-foreground" />}
              title="Printed"
              count={printedOrders.length}
              totalMinutes={getTotalMinutes(printedOrders)}
              totalPcs={getTotalQuantity(printedOrders)}
              color="bg-bloom-sky"
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {printedOrders.map((order) => (
                <PrintedOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Picked */}
        <div className="flex flex-col min-h-0">
          <SectionHeader
            icon={<UserCheck className="w-3 h-3 text-primary-foreground" />}
            title="Picked"
            count={pickedOrders.length}
            totalMinutes={getTotalMinutes(pickedOrders)}
            totalPcs={getTotalQuantity(pickedOrders)}
            color="bg-accent"
          />
          <div className={`flex-1 min-h-0 grid ${gridCols} gap-2 overflow-auto`} style={{ gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
            {pickedOrders.map((order) => (
              <PickedOrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
            ))}
          </div>
        </div>

        {/* Right: Waiting Hand + Band + Others (Others smaller) */}
        <div className="flex flex-col min-h-0 gap-2">
          <div className="flex-[4] flex flex-col min-h-0">
            <SectionHeader
              icon={<Hand className="w-3 h-3 text-primary-foreground" />}
              title="Waiting Hand"
              count={waitingForHandOrders.length}
              totalMinutes={getTotalMinutes(waitingForHandOrders)}
              totalPcs={getTotalQuantity(waitingForHandOrders)}
              color="bg-bloom-warm"
              progress={15}
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {waitingForHandOrders.map((order) => (
                <WaitingOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
          <div className="flex-[4] flex flex-col min-h-0">
            <SectionHeader
              icon={<Cog className="w-3 h-3 text-primary-foreground" />}
              title="Waiting Band"
              count={waitingForBandOrders.length}
              totalMinutes={getTotalMinutes(waitingForBandOrders)}
              totalPcs={getTotalQuantity(waitingForBandOrders)}
              color="bg-primary"
              progress={25}
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {waitingForBandOrders.map((order) => (
                <WaitingOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
          <div className="flex-[2] flex flex-col min-h-0">
            <SectionHeader
              icon={<Package className="w-3 h-3 text-primary-foreground" />}
              title="Others"
              count={waitingForOthersOrders.length}
              totalMinutes={getTotalMinutes(waitingForOthersOrders)}
              totalPcs={getTotalQuantity(waitingForOthersOrders)}
              color="bg-bloom-sky"
              progress={10}
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {waitingForOthersOrders.map((order) => (
                <WaitingOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <ForceScanPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={() => console.log("Force scan:", selectedOrder.name)}
        />
      )}
    </>
  );
};

export default ColdStorageSections;
