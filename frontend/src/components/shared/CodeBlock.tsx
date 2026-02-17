export function CodeBlock({ code }: { code: string }) {
  return <pre className="overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-emerald-200"><code>{code}</code></pre>;
}
