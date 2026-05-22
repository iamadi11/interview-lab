// loading.tsx — shown instantly while the async page suspends
// Next.js automatically wraps the page in a Suspense boundary using this file

export default function StreamingLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-slate-800 rounded-lg" />
      <div className="h-4 w-72 bg-slate-800/60 rounded" />
      <div className="space-y-2 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/60 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
