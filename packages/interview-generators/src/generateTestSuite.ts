export interface TestSuiteOptions {
  subject: string;
  cases: string[];
  framework?: "vitest" | "jest";
}

export function generateTestSuite(opts: TestSuiteOptions): string {
  const { subject, cases, framework = "vitest" } = opts;
  const importLine = framework === "vitest"
    ? `import { describe, it, expect } from "vitest";`
    : `import { describe, it, expect } from "@jest/globals";`;

  const tests = cases.map((c) =>
    `  it("${c}", () => {\n    // TODO: implement\n    expect(true).toBe(true);\n  });`
  ).join("\n\n");

  return `${importLine}\n\ndescribe("${subject}", () => {\n${tests}\n});\n`;
}
