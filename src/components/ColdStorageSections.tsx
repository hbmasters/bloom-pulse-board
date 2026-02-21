import { Printer, UserCheck, Hand, Cog, User } from "lucide-react";
import {
  printedOrders,
  pickedOrders,
  waitingForHandOrders,
  waitingForBandOrders,
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
  <div className="flex items-center justify-between mb-2 shrink-0">
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${color}`}>{icon}</div>
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">{title}</h3>
      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    </div>
    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary border border-border">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
      <span className="text-sm font-mono font-black text-foreground">{formatHours(totalMinutes)}</span>
    </div>
  </div>
);

const PrintedOrderRow = ({ order }: { order: ColdStorageOrder }) => (
  <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-card">
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-bold text-foreground truncate block">{order.name}</span>
      <div className="flex items-center gap-1 mt-0.5">
        <User className="w-2.5 h-2.5 text-muted-foreground" />
        <span className="text-[9px] text-muted-foreground">{order.printedBy || "—"} · {formatHours(order.estimatedMinutes)}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="text-base font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[8px] text-muted-foreground">pcs</div>
    </div>
  </div>
);

const OrderRow = ({ order }: { order: ColdStorageOrder }) => (
  <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-border bg-card">
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-bold text-foreground truncate block">{order.name}</span>
      <span className="text-[9px] text-muted-foreground">{formatHours(order.estimatedMinutes)}</span>
    </div>
    <div className="text-right shrink-0">
      <div className="text-base font-mono font-black text-foreground leading-none">{order.quantity}</div>
      <div className="text-[8px] text-muted-foreground">pcs</div>
    </div>
  </div>
);

// Picker-centric card with photo, name central, scales for up to 12 pickers
const PickedOrderCard = ({ order }: { order: PickedOrder }) => (
  <div className="bg-card rounded-xl border border-accent/25 overflow-hidden flex flex-col h-full shadow-sm">
    <div className="relative flex-1 min-h-0 overflow-hidden bg-secondary">
      <img src={order.image} alt={order.name} className="absolute inset-0 w-full h-full object-cover" />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {/* Central picker name */}
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center shadow-md border-2 border-white/80 mb-0.5">
          <span className="text-[10px] font-black text-primary-foreground">{order.picker.charAt(0)}</span>
        </div>
        <span className="text-xs font-bold text-white drop-shadow-md">{order.picker}</span>
      </div>
      {/* Quantity badge */}
      <div className="absolute top-1.5 right-1.5 bg-card/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-border shadow-sm">
        <div className="text-sm font-mono font-black text-foreground leading-none">{order.quantity}</div>
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

// Dynamic columns: 3 cols for ≤6, 4 cols for 7-12
const getPickedGridCols = (count: number) => {
  if (count <= 3) return "grid-cols-3";
  if (count <= 6) return "grid-cols-3";
  if (count <= 8) return "grid-cols-4";
  return "grid-cols-4";
};

const getPickedGridRows = (count: number) => {
  const cols = count <= 6 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  return rows;
};

const ColdStorageSections = () => {
  const gridCols = getPickedGridCols(pickedOrders.length);
  const gridRows = getPickedGridRows(pickedOrders.length);

  return (
    <div className="grid grid-cols-3 gap-3 h-full" style={{ gridTemplateColumns: "1fr 2fr 1fr" }}>
      {/* Printed */}
      <div className="flex flex-col min-h-0">
        <SectionHeader
          icon={<Printer className="w-3.5 h-3.5 text-primary-foreground" />}
          title="Printed"
          count={printedOrders.length}
          totalMinutes={getTotalMinutes(printedOrders)}
          color="bg-bloom-sky"
        />
        <div className="flex-1 min-h-0 space-y-1 overflow-auto">
          {printedOrders.map((order) => (
            <PrintedOrderRow key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Picked - picker-centric with photos */}
      <div className="flex flex-col min-h-0">
        <SectionHeader
          icon={<UserCheck className="w-3.5 h-3.5 text-primary-foreground" />}
          title="Picked"
          count={pickedOrders.length}
          totalMinutes={getTotalMinutes(pickedOrders)}
          color="bg-accent"
        />
        <div className={`flex-1 min-h-0 grid ${gridCols} gap-2 overflow-auto`} style={{ gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
          {pickedOrders.map((order) => (
            <PickedOrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      {/* Waiting for Hand + Band stacked */}
      <div className="flex flex-col min-h-0 gap-3">
        <div className="flex-1 flex flex-col min-h-0">
          <SectionHeader
            icon={<Hand className="w-3.5 h-3.5 text-primary-foreground" />}
            title="Waiting Hand"
            count={waitingForHandOrders.length}
            totalMinutes={getTotalMinutes(waitingForHandOrders)}
            color="bg-bloom-warm"
          />
          <div className="flex-1 min-h-0 space-y-1 overflow-auto">
            {waitingForHandOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <SectionHeader
            icon={<Cog className="w-3.5 h-3.5 text-primary-foreground" />}
            title="Waiting Band"
            count={waitingForBandOrders.length}
            totalMinutes={getTotalMinutes(waitingForBandOrders)}
            color="bg-primary"
          />
          <div className="flex-1 min-h-0 space-y-1 overflow-auto">
            {waitingForBandOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdStorageSections;
