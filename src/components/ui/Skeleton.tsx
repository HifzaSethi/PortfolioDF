export function Skeleton() {
  return (
    <div
      className="min-h-[65vh] bg-[var(--bg-page)] py-20 px-6 transition-colors duration-300"
      aria-busy="true"
      aria-label="Loading page content"
    >
      <div className="mx-auto max-w-[var(--container-max)] space-y-8 animate-pulse">
        <div className="h-3 w-36 bg-[var(--border-strong)]" />
        <div className="h-14 w-3/4 max-w-2xl bg-[var(--border-strong)]" />
        <div className="h-6 w-2/3 max-w-xl bg-[var(--border-subtle)]" />
        <div className="grid gap-6 pt-8 md:grid-cols-3">
          <div className="h-44 border border-[var(--border-subtle)] bg-[var(--bg-tint)]" />
          <div className="h-44 border border-[var(--border-subtle)] bg-[var(--bg-tint)]" />
          <div className="h-44 border border-[var(--border-subtle)] bg-[var(--bg-tint)]" />
        </div>
      </div>
    </div>
  );
}
