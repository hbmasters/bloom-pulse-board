import { useState } from "react";
import { Zap, AlertTriangle, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DepartmentBadge, SubdepartmentChip } from "@/components/department/DepartmentBadge";
import type { ActionItem, ActionStatus } from "./types";

const columns: { id: ActionStatus; label: string; accent: string; bg: string }[] = [
  { id: "open", label: "Open", accent: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { id: "in_progress", label: "In Progress", accent: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { id: "completed", label: "Completed", accent: "text-accent", bg: "bg-accent/10 border-accent/20" },
];

const priorityDot: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-400",
  Medium: "bg-yellow-500",
  Low: "bg-muted-foreground",
};

/* ── Draggable Card ── */

const DraggableCard = ({ action }: { action: ActionItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-card/60 p-3 hover:shadow-sm transition-all ${
        isDragging ? "shadow-lg ring-2 ring-primary/30 z-50" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <button
          {...attributes}
          {...listeners}
          className="touch-none text-muted-foreground/40 hover:text-muted-foreground shrink-0"
          aria-label="Drag handle"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[action.priority]}`} />
        <span className="text-[11px] font-bold text-foreground truncate">{action.action_title}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-2 pl-5">
        <DepartmentBadge department={action.department_owner} size="sm" />
        {action.sub_department && <SubdepartmentChip sub={action.sub_department} />}
      </div>

      {/* Impact summary */}
      <div className="space-y-0.5 pl-5">
        {action.impact_financial != null && (
          <div className="text-[10px] font-mono font-bold text-accent">
            €{action.impact_financial.toLocaleString("nl-NL")}
          </div>
        )}
        {action.impact_efficiency != null && (
          <div className="text-[10px] font-mono text-primary">
            +{action.impact_efficiency} W-APU
          </div>
        )}
        {action.impact_risk_reduction && action.impact_risk_reduction !== "none" && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-yellow-500">
            <AlertTriangle className="w-2.5 h-2.5" />
            {action.impact_risk_reduction}
          </div>
        )}
      </div>

      {/* Source signal */}
      {action.source_signal && (
        <div className="mt-2 pl-5 text-[9px] font-mono text-muted-foreground/50 italic truncate">
          {action.source_signal}
        </div>
      )}
    </div>
  );
};

/* ── Pipeline Component ── */

interface Props {
  actions: ActionItem[];
}

export const ActionPipeline = ({ actions: initialActions }: Props) => {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);

  // Update internal state when props change
  if (initialActions !== actions && initialActions.length > 0 && initialActions[0]?.id !== actions[0]?.id) {
    setActions(initialActions);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = columns.find((c) => c.id === overId);
    // Or on another card — find which column the target card is in
    const targetCard = actions.find((a) => a.id === overId);

    let newStatus: ActionStatus | null = null;

    if (targetColumn) {
      newStatus = targetColumn.id;
    } else if (targetCard) {
      newStatus = targetCard.status;
    }

    if (newStatus && activeId !== overId) {
      setActions((prev) =>
        prev.map((a) => (a.id === activeId ? { ...a, status: newStatus! } : a))
      );
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const items = actions.filter((a) => a.status === col.id);
          const itemIds = items.map((a) => a.id);

          return (
            <div key={col.id} id={col.id}>
              {/* Column header */}
              <div className={`rounded-t-xl border px-4 py-2.5 ${col.bg} flex items-center justify-between`}>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${col.accent}`}>
                  {col.label}
                </span>
                <span className={`text-[10px] font-mono font-bold ${col.accent}`}>{items.length}</span>
              </div>

              {/* Cards */}
              <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div className="border border-t-0 rounded-b-xl bg-card/30 p-2 space-y-2 min-h-[120px]">
                  {items.length === 0 && (
                    <div className="text-[10px] font-mono text-muted-foreground/40 text-center py-6">
                      Sleep acties hierheen
                    </div>
                  )}
                  {items.map((action) => (
                    <DraggableCard key={action.id} action={action} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};
