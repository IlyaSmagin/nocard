export function CardInitialsBg({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="Ndot57 Ndot57FontSizeMax text-muted-foreground leading-none tracking-tighter absolute top-0 right-0 bottom-0 flex items-center justify-center overflow-hidden opacity-20 pointer-events-none select-none">
        {initials || "?"}
    </div>
  );
}
