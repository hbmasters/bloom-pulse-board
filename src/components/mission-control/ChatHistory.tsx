import { Clock, MessageSquare, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  time: string;
  messages: number;
}

interface DayGroup {
  label: string;
  date: string;
  items: HistoryItem[];
}

const mockTimeline: DayGroup[] = [
  {
    label: "Vandaag",
    date: "2025-02-28",
    items: [
      { id: "1", title: "Productie analyse ochtend", preview: "De APU van BQ Field L ligt 10% boven target...", time: "09:15", messages: 8 },
      { id: "2", title: "Bezettingsadvies middag", preview: "Op basis van de huidige output raad ik aan...", time: "11:30", messages: 5 },
    ],
  },
  {
    label: "Gisteren",
    date: "2025-02-27",
    items: [
      { id: "3", title: "Koelcel voorraad check", preview: "De voorraad in koelcel 2 is voldoende voor...", time: "14:20", messages: 12 },
      { id: "4", title: "Storing lijn 3 diagnose", preview: "HBMaster heeft de storing geanalyseerd en...", time: "10:05", messages: 6 },
    ],
  },
  {
    label: "Woensdag 26 feb",
    date: "2025-02-26",
    items: [
      { id: "5", title: "Weekplanning review", preview: "Voor komende week staan 2400 boeketten gepland...", time: "16:00", messages: 15 },
    ],
  },
  {
    label: "Dinsdag 25 feb",
    date: "2025-02-25",
    items: [
      { id: "6", title: "Personeelsinzet optimalisatie", preview: "Bij de huidige bezetting adviseer ik 3 extra...", time: "08:45", messages: 9 },
      { id: "7", title: "Kwaliteitsrapport batch 44", preview: "Batch 44 toont een afkeurpercentage van 2.1%...", time: "13:30", messages: 4 },
    ],
  },
  {
    label: "Maandag 24 feb",
    date: "2025-02-24",
    items: [
      { id: "8", title: "Dagstart briefing", preview: "Goedemorgen! Vandaag staan 380 boeketten op...", time: "07:00", messages: 3 },
      { id: "9", title: "Leverancier vertraging", preview: "De levering van rozen uit Ecuador heeft 2 uur...", time: "11:15", messages: 7 },
      { id: "10", title: "Einde dag samenvatting", preview: "Productie afgerond: 372/380 boeketten. Output...", time: "17:00", messages: 11 },
    ],
  },
  {
    label: "Week 7 · 17-21 feb",
    date: "2025-02-21",
    items: [
      { id: "11", title: "Valentijnsdag evaluatie", preview: "De Valentijnsproductie is succesvol verlopen...", time: "Vrij 15:30", messages: 18 },
      { id: "12", title: "Nieuwe receptuur Charme XL", preview: "De aangepaste receptuur voor Charme XL is...", time: "Woe 09:00", messages: 6 },
    ],
  },
  {
    label: "Week 6 · 10-14 feb",
    date: "2025-02-14",
    items: [
      { id: "13", title: "Valentijn voorbereiding", preview: "Alle materialen voor de Valentijnsproductie...", time: "Din 14:00", messages: 22 },
    ],
  },
];

const ChatHistory = () => {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    new Set(mockTimeline.slice(0, 3).map(d => d.date))
  );

  const toggleDay = (date: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Chat Historie</h2>
      </div>

      {/* Timeline */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />

          {mockTimeline.map((group, gi) => {
            const isOpen = expandedDays.has(group.date);
            return (
              <div key={group.date} className="relative">
                {/* Day header with timeline dot */}
                <button
                  onClick={() => toggleDay(group.date)}
                  className="relative flex items-center gap-3 w-full text-left py-2.5 group"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    gi === 0
                      ? "border-primary bg-primary/20"
                      : "border-border bg-card group-hover:border-primary/40"
                  }`}>
                    {gi === 0 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Calendar className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                    <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${
                      gi === 0 ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {group.label}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground/50">
                      {group.items.length}
                    </span>
                  </div>

                  <ChevronDown className={`w-3 h-3 text-muted-foreground/40 transition-transform shrink-0 ${
                    isOpen ? "" : "-rotate-90"
                  }`} />
                </button>

                {/* Conversation cards for this day */}
                {isOpen && (
                  <div className="ml-[7px] pl-5 border-l border-transparent space-y-1.5 pb-2">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        className="w-full text-left p-3 rounded-lg bg-card/60 border border-border/60 hover:border-primary/25 hover:bg-card transition-all group/card"
                      >
                        <div className="flex items-start justify-between mb-0.5">
                          <h4 className="text-[11px] font-bold text-foreground group-hover/card:text-primary transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-mono text-muted-foreground/60 shrink-0 ml-2">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/70 truncate leading-relaxed">
                          {item.preview}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <MessageSquare className="w-2.5 h-2.5 text-muted-foreground/40" />
                          <span className="text-[8px] font-mono text-muted-foreground/50">
                            {item.messages} berichten
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
