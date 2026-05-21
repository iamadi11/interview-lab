import { useState, useRef, useCallback } from "react";
import { getVisibleRange, getTotalHeight } from "@/lib";

/**
 * Virtual list hook — renders only visible items for performance demos.
 * Compatible with any fixed-height list.
 */
export function useVirtualList<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const range = getVisibleRange({
    totalItems: items.length,
    itemHeight,
    containerHeight,
    scrollTop,
    overscan: 3,
  });

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.currentTarget as HTMLDivElement).scrollTop);
  }, []);

  const visibleItems = items.slice(range.start, range.end).map((item, i) => ({
    item,
    index: range.start + i,
    style: {
      position: "absolute" as const,
      top: (range.start + i) * itemHeight,
      height: itemHeight,
      width: "100%",
    },
  }));

  return {
    containerRef,
    onScroll,
    visibleItems,
    totalHeight: getTotalHeight(items.length, itemHeight),
    range,
  };
}
