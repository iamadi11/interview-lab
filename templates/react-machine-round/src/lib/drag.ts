/**
 * Drag system — minimal reorder logic for kanban/list drag demos.
 * Works with Framer Motion's Reorder component or raw mouse events.
 */

export interface DragItem {
  id: string;
  [key: string]: unknown;
}

/** Reorder array after drag — O(n). */
export function reorder<T>(list: T[], from: number, to: number): T[] {
  const result = [...list];
  const [moved] = result.splice(from, 1);
  if (moved !== undefined) result.splice(to, 0, moved);
  return result;
}

/** Move item between two lists (e.g. kanban columns). */
export function moveBetween<T>(
  source: T[],
  destination: T[],
  sourceIndex: number,
  destIndex: number
): { source: T[]; destination: T[] } {
  const newSource = [...source];
  const newDest = [...destination];
  const [moved] = newSource.splice(sourceIndex, 1);
  if (moved !== undefined) newDest.splice(destIndex, 0, moved);
  return { source: newSource, destination: newDest };
}

/** Get mouse position relative to an element. */
export function getRelativePos(e: MouseEvent | React.MouseEvent, el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
