export default function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-bg" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-ink-3 text-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary-light" />
        Loading…
      </div>
    </div>
  );
}
