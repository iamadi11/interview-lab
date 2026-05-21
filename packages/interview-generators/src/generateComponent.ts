export interface ComponentOptions {
  name: string;
  hasProps?: boolean;
  hasState?: boolean;
  withTests?: boolean;
  withStory?: boolean;
}

export function generateComponent(opts: ComponentOptions): string {
  const { name, hasProps = true, hasState = false } = opts;

  const propsBlock = hasProps
    ? `\ninterface ${name}Props {\n  className?: string;\n  children?: React.ReactNode;\n}\n`
    : "";

  const stateBlock = hasState
    ? `\n  const [state, setState] = React.useState(null);\n`
    : "";

  return `import React from "react";
${propsBlock}
export function ${name}(${hasProps ? `{ className = "", children }: ${name}Props` : ""}) {
  ${stateBlock}
  return (
    <div className={className}>
      {children}
    </div>
  );
}
`.trim();
}
