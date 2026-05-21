/**
 * Canvas 2D helpers — interview-ready drawing utilities.
 * Use for: particle systems, games, diagrams, visualisations.
 */

export type Vec2 = { x: number; y: number };

/** Clear the entire canvas. */
export const clear = (ctx: CanvasRenderingContext2D) =>
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

/** Draw a filled circle. */
export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Draw a line between two points. */
export function line(ctx: CanvasRenderingContext2D, from: Vec2, to: Vec2, color: string, width = 1) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

/** Draw a rounded rectangle. */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

/** RAF game loop — returns a stop function. */
export function startLoop(tick: (dt: number) => void): () => void {
  let lastTime = 0;
  let rafId = 0;
  const loop = (time: number) => {
    const dt = lastTime ? (time - lastTime) / 1000 : 0;
    lastTime = time;
    tick(dt);
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(rafId);
}

/** Vector math. */
export const vec = {
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
  scale: (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s }),
  len: (v: Vec2) => Math.hypot(v.x, v.y),
  norm: (v: Vec2): Vec2 => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; },
  dist: (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.y - b.y),
};
