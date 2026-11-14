export function Skeleton() {
  return (
    <div
      className="min-h-[65vh] bg-[var(--off-white)] py-20 px-6"
      aria-busy="true"
      aria-label="Loading page content"
    >
      <div className="mx-auto max-w-[var(--container-max)] space-y-8 animate-pulse">
        <div className="h-3 w-36 bg-[var(--border-light-strong)]" />
        <div className="h-14 w-3/4 max-w-2xl bg-[var(--border-light-strong)]" />
        <div className="h-6 w-2/3 max-w-xl bg-[var(--border-light)]" />
        <div className="grid gap-6 pt-8 md:grid-cols-3">
          <div className="h-44 border border-[var(--border-light)] bg-[var(--paper-tint)]" />
          <div className="h-44 border border-[var(--border-light)] bg-[var(--paper-tint)]" />
          <div className="h-44 border border-[var(--border-light)] bg-[var(--paper-tint)]" />
        </div>
      </div>
    </div>
  );
}
