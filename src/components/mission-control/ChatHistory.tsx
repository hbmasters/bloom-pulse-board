import { Clock, MessageSquare } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  time: string;
  messages: number;
}

const mockHistory: HistoryItem[] = [
  { id: "1", title: "Productie analyse ochtend", preview: "De APU van BQ Field L ligt 10% boven target...", time: "09:15", messages: 8 },
  { id: "2", title: "Bezettingsadvies middag", preview: "Op basis van de huidige output raad ik aan...", time: "11:30", messages: 5 },
  { id: "3", title: "Koelcel voorraad check", preview: "De voorraad in koelcel 2 is voldoende voor...", time: "Gisteren", messages: 12 },
  { id: "4", title: "Weekplanning review", preview: "Voor komende week staan 2400 boeketten gepland...", time: "19 feb", messages: 15 },
];

const ChatHistory = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Chat Historie</h2>
      </div>

      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto">
        {mockHistory.map(item => (
          <button key={item.id} className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">{item.title}</h4>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0 ml-2">{item.time}</span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{item.preview}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <MessageSquare className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-[9px] font-mono text-muted-foreground">{item.messages} berichten</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
