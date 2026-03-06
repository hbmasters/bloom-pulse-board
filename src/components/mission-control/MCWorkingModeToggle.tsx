import { Sun, Moon } from "lucide-react";

interface MCWorkingModeToggleProps {
  isWorking: boolean;
  onToggle: () => void;
}

const MCWorkingModeToggle = ({ isWorking, onToggle }: MCWorkingModeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border transition-all duration-300 text-xs font-medium backdrop-blur-md ${
        isWorking
          ? "bg-white/90 border-primary/20 text-primary hover:bg-white hover:shadow-xl"
          : "bg-card/70 border-border text-muted-foreground hover:text-foreground hover:bg-card/90"
      }`}
      title={isWorking ? "Schakel naar Mission Control" : "Schakel naar Working Mode"}
    >
      {isWorking ? (
        <Moon className="w-3.5 h-3.5" />
      ) : (
        <Sun className="w-3.5 h-3.5" />
      )}
      <span className="hidden sm:inline">{isWorking ? "MC" : "Work"}</span>
    </button>
  );
};

export default MCWorkingModeToggle;
