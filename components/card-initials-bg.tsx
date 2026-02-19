export function CardInitialsBg({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="absolute top-0 right-0 bottom-0 flex items-center justify-center overflow-hidden opacity-20 pointer-events-none select-none pr-2">
      <span 
        className="text-muted-foreground leading-none tracking-tighter"
        style={{
          fontFamily: "'Ndot-57', 'Courier New', monospace",
          fontSize: '180px',
          fontWeight: 'bold',
          lineHeight: '1',
        }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}
