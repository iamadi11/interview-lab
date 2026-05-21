export function generateHook(name: string): string {
  const hookName = name.startsWith("use") ? name : `use${name}`;
  return `import { useState, useEffect } from "react";

export function ${hookName}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: implement
  }, []);

  return { data, loading, error };
}
`.trim();
}
