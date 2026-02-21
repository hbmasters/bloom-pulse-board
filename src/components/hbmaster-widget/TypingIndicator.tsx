const TypingIndicator = ({ accentHsl }: { accentHsl: string }) => (
  <div className="flex justify-start">
    <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{
            background: `hsl(${accentHsl} / 0.6)`,
            animationDelay: `${i * 200}ms`,
            animationDuration: "1.2s",
          }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
