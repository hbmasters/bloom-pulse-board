import { useState } from "react";
import { AlertTriangle, GripVertical } from "lucide-react";
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

const columns: { id: ActionStatus; label: string; dotColor: string; accent: string }[] = [
  { id: "open", label: "Open", dotColor: "bg-yellow-500", accent: "bg-yellow-500/15 text-yellow-500" },
  { id: "in_progress", label: "In Uitvoering", dotColor: "bg-primary", accent: "bg-primary/15 text-primary" },
  { id: "completed", label: "Afgerond", dotColor: "bg-accent", accent: "bg-accent/15 text-accent" },
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
      className={`p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors group shadow-sm ${
        isDragging ? "shadow-lg ring-2 ring-primary/30 z-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="touch-none text-muted-foreground/30 hover:text-muted-foreground shrink-0 mt-0.5 cursor-grab active:cursor-grabbing"
            aria-label="Drag handle"
          >
            <GripVertical className="w-3 h-3" />
          </button>
          <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${priorityDot[action.priority]}`} />
          <span className="text-xs font-semibold text-foreground leading-snug">{action.action_title}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mt-2 pl-4">
        <DepartmentBadge department={action.department_owner} size="sm" />
        {action.sub_department && <SubdepartmentChip sub={action.sub_department} />}
      </div>

      {/* Impact summary */}
      <div className="space-y-0.5 pl-4 mt-2">
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
        <div className="mt-2 pl-4 text-[9px] font-mono text-muted-foreground/50 italic truncate">
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

    const targetColumn = columns.find((c) => c.id === overId);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {columns.map((col) => {
          const items = actions.filter((a) => a.status === col.id);
          const itemIds = items.map((a) => a.id);

          return (
            <div key={col.id} id={col.id} className="flex flex-col min-h-0">
              {/* Column header — matching KanbanBoard style */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-bold text-muted-foreground">{col.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${col.accent}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 min-h-[120px]">
                  {items.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-[10px] font-mono text-muted-foreground/40">
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
