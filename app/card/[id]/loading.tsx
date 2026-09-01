export default function Loading() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-between bg-background px-4 pb-4 pt-safe-top">
      <header className="flex w-full items-center justify-center py-6">
        <div className="h-7 w-40 animate-pulse rounded bg-secondary" />
      </header>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
        <div className="h-[42dvh] w-full max-w-sm animate-pulse rounded-xl bg-secondary" />
      </div>
      <div className="h-14 w-full max-w-sm animate-pulse rounded-2xl bg-secondary" />
    </main>
  );
}
