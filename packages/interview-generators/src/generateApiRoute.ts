export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRouteOptions {
  path: string;
  methods: HttpMethod[];
  framework?: "express" | "fastify" | "nextjs";
}

export function generateApiRoute(opts: ApiRouteOptions): string {
  const { path, methods, framework = "express" } = opts;

  if (framework === "nextjs") {
    const handlers = methods.map((m) => `
export async function ${m}(request: Request) {
  // ${m} ${path}
  return Response.json({ message: "ok" });
}`).join("\n");
    return `// app/api${path}/route.ts\n${handlers}`.trim();
  }

  const handlers = methods.map((m) =>
    `router.${m.toLowerCase()}("${path}", async (req, res) => {\n  // TODO: implement\n  res.json({ message: "ok" });\n});`
  ).join("\n\n");

  return `import { Router } from "express";\n\nconst router = Router();\n\n${handlers}\n\nexport default router;`;
}
