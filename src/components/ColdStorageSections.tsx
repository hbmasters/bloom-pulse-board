import { useState } from "react";
import { Printer, UserCheck, Hand, Cog, User, Package, CalendarDays, Zap, Trophy, X } from "lucide-react";
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

const SectionHeader = ({
  icon,
  title,
  count,
  totalMinutes,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  totalMinutes: number;
  color: string;
}) => (
  <div className="flex items-center justify-between mb-1.5 shrink-0">
    <div className="flex items-center gap-1.5">
      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${color}`}>{icon}</div>
      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">{title}</h3>
      <span className="text-[9px] font-mono font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    </div>
    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary border border-border">
      <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
      <span className="text-xs font-mono font-black text-foreground">{formatHours(totalMinutes)}</span>
    </div>
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
          <span>{order.quantity} pcs</span>
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
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
        >
          Uitscannen
        </button>
      </div>
    </div>
  </div>
);

// Printed order row with printer and departure
const PrintedOrderRow = ({ order, onClick }: { order: ColdStorageOrder; onClick: () => void }) => (
  <div
    className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
    onClick={onClick}
  >
    <div className="flex-1 min-w-0">
      <span className="text-[10px] font-bold text-foreground truncate block">{order.name}</span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <User className="w-2.5 h-2.5 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground">{order.printedBy}</span>
        <CalendarDays className="w-2.5 h-2.5 text-muted-foreground ml-1" />
        <span className="text-[8px] text-muted-foreground">{order.departureDate}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[7px] text-muted-foreground">pcs</div>
    </div>
  </div>
);

// Waiting order row with picker, advised line, departure
const WaitingOrderRow = ({ order, onClick }: { order: ColdStorageOrder; onClick: () => void }) => (
  <div
    className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-colors"
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
      <div className="flex items-center gap-1.5 mt-0.5">
        <User className="w-2.5 h-2.5 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground">{order.pickedBy}</span>
        {order.advisedLine && (
          <span className="text-[8px] font-mono font-bold text-primary bg-primary/10 px-1 rounded">{order.advisedLine}</span>
        )}
        <CalendarDays className="w-2.5 h-2.5 text-muted-foreground ml-1" />
        <span className="text-[8px] text-muted-foreground">{order.departureDate}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[7px] text-muted-foreground">pcs</div>
    </div>
  </div>
);

// Picked card with photo
const PickedOrderCard = ({ order, onClick }: { order: PickedOrder; onClick: () => void }) => (
  <div
    className="bg-card rounded-xl border border-accent/25 overflow-hidden flex flex-col h-full shadow-sm cursor-pointer hover:border-accent/50 transition-colors"
    onClick={onClick}
  >
    <div className="relative flex-1 min-h-0 overflow-hidden bg-secondary">
      <img src={order.image} alt={order.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shadow-md border-2 border-white/80 mb-0.5">
          <span className="text-[10px] font-black text-primary-foreground">{order.picker.charAt(0)}</span>
        </div>
        <span className="text-xs font-bold text-white drop-shadow-md">{order.picker}</span>
      </div>
      <div className="absolute top-1.5 right-1.5 bg-card/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-border shadow-sm">
        <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
      </div>
      <div className="absolute top-1.5 left-1.5 bg-card/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-border shadow-sm">
        <span className="text-[8px] font-semibold text-muted-foreground">{order.departureDate}</span>
      </div>
    </div>
    <div className="p-2 shrink-0">
      <h3 className="text-[11px] font-bold text-foreground truncate mb-0.5">{order.name}</h3>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-success transition-all duration-1000"
            style={{ width: `${order.progress}%` }}
          />
        </div>
        <span className="text-[9px] font-mono font-bold text-foreground">{order.progress}%</span>
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

// Fastest picker panel
const FastestPickerPanel = () => (
  <div className="rounded-xl border border-bloom-warm/30 bg-bloom-warm/5 p-3">
    <div className="flex items-center gap-2 mb-1">
      <Trophy className="w-4 h-4 text-bloom-warm" />
      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Snelste Picker</span>
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
      <div className="grid gap-3 h-full" style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
        {/* Left: Printed + Fastest Picker */}
        <div className="flex flex-col min-h-0 gap-3">
          <div className="flex-1 flex flex-col min-h-0">
            <SectionHeader
              icon={<Printer className="w-3 h-3 text-primary-foreground" />}
              title="Printed"
              count={printedOrders.length}
              totalMinutes={getTotalMinutes(printedOrders)}
              color="bg-bloom-sky"
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {printedOrders.map((order) => (
                <PrintedOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <FastestPickerPanel />
          </div>
        </div>

        {/* Center: Picked */}
        <div className="flex flex-col min-h-0">
          <SectionHeader
            icon={<UserCheck className="w-3 h-3 text-primary-foreground" />}
            title="Picked"
            count={pickedOrders.length}
            totalMinutes={getTotalMinutes(pickedOrders)}
            color="bg-accent"
          />
          <div className={`flex-1 min-h-0 grid ${gridCols} gap-2 overflow-auto`} style={{ gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
            {pickedOrders.map((order) => (
              <PickedOrderCard key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
            ))}
          </div>
        </div>

        {/* Right: Waiting Hand + Band + Others stacked */}
        <div className="flex flex-col min-h-0 gap-2">
          <div className="flex-1 flex flex-col min-h-0">
            <SectionHeader
              icon={<Hand className="w-3 h-3 text-primary-foreground" />}
              title="Waiting Hand"
              count={waitingForHandOrders.length}
              totalMinutes={getTotalMinutes(waitingForHandOrders)}
              color="bg-bloom-warm"
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {waitingForHandOrders.map((order) => (
                <WaitingOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <SectionHeader
              icon={<Cog className="w-3 h-3 text-primary-foreground" />}
              title="Waiting Band"
              count={waitingForBandOrders.length}
              totalMinutes={getTotalMinutes(waitingForBandOrders)}
              color="bg-primary"
            />
            <div className="flex-1 min-h-0 overflow-auto space-y-1 pr-1">
              {waitingForBandOrders.map((order) => (
                <WaitingOrderRow key={order.id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <SectionHeader
              icon={<Package className="w-3 h-3 text-primary-foreground" />}
              title="Waiting Others"
              count={waitingForOthersOrders.length}
              totalMinutes={getTotalMinutes(waitingForOthersOrders)}
              color="bg-bloom-sky"
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
