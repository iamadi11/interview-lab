/**
 * ConceptBox — shows the interview-explainable summary for each demo page.
 * Purely presentational, no client JS.
 */
interface ConceptBoxProps {
  title: string;
  points: string[];
  code?: string;
}

export function ConceptBox({ title, points, code }: ConceptBoxProps) {
  return (
    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-sky-300">💡 {title}</h2>
      <ul className="space-y-1">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
            <span className="mt-0.5 w-1 h-1 rounded-full bg-sky-400 shrink-0" />
            {p}
          </li>
        ))}
      </ul>
      {code && (
        <pre className="rounded-lg bg-slate-900 border border-white/8 px-3 py-2 text-[11px] font-mono text-slate-300 overflow-x-auto">
          {code}
        </pre>
      )}
    </div>
  );
}
