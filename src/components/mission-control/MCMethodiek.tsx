import { useState, useMemo } from "react";
import { FlaskConical } from "lucide-react";
import PageAgentBadges from "../PageAgentBadges";
import MethodiekList from "./MethodiekList";
import MethodiekEditor from "./MethodiekEditor";
import { initialMethodieken } from "./methodiek-data";
import type { Methodiek } from "./methodiek-types";

const MCMethodiek = () => {
  const [methodieken, setMethodieken] = useState<Methodiek[]>(initialMethodieken);
  const [selectedId, setSelectedId] = useState<string | null>(initialMethodieken[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return methodieken;
    const q = searchQuery.toLowerCase();
    return methodieken.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.methodiek_id.toLowerCase().includes(q) ||
      m.analysis_kind.toLowerCase().includes(q)
    );
  }, [methodieken, searchQuery]);

  const selected = methodieken.find(m => m.id === selectedId) ?? null;

  const handleSave = (updated: Methodiek) => {
    setMethodieken(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const activeCount = methodieken.filter(m => m.status === "active").length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Analyse Methodieken</h2>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-emerald-400">{activeCount} actief</span>
            <span className="text-muted-foreground">{methodieken.length} totaal</span>
          </div>
        </div>
        <PageAgentBadges pageId="methodiek" className="mb-0" />
      </div>

      {/* Split panel */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: List */}
        <div className="w-72 flex-shrink-0 overflow-hidden">
          <MethodiekList
            methodieken={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right: Editor */}
        <div className="flex-1 overflow-hidden">
          {selected ? (
            <MethodiekEditor methodiek={selected} onSave={handleSave} />
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Selecteer een methodiek</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCMethodiek;
