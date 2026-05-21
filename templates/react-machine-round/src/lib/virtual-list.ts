/**
 * Virtual list helpers — compute visible item range for large lists.
 *
 * Use with useVirtualList hook for rendering only visible items.
 */

export interface VirtualRange {
  start: number;
  end: number;
  offsetTop: number;
}

export interface VirtualListOptions {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}

/**
 * Returns the visible range + pixel offset for a fixed-height virtual list.
 * O(1) — no iteration needed for fixed-height items.
 */
export function getVisibleRange({
  totalItems,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 3,
}: VirtualListOptions): VirtualRange {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);
  const offsetTop = start * itemHeight;
  return { start, end, offsetTop };
}

/** Total pixel height for the scroll container. */
export const getTotalHeight = (totalItems: number, itemHeight: number) =>
  totalItems * itemHeight;
