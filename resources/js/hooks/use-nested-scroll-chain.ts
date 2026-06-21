import * as React from 'react';

export function getScrollableAncestor(
  node: HTMLElement | null,
): HTMLElement | null {
  let parent = node?.parentElement ?? null;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay'
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.scrollingElement as HTMLElement | null;
}

/**
 * When the inner scroller hits top/bottom, forward wheel delta to the page
 * (or nearest scrollable ancestor) so users can keep scrolling naturally.
 */
export function useNestedScrollChain<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      const shouldChainUp = atTop && event.deltaY < 0;
      const shouldChainDown = atBottom && event.deltaY > 0;
      if (!shouldChainUp && !shouldChainDown) return;

      const ancestor = getScrollableAncestor(el.parentElement);
      if (!ancestor || ancestor === el) return;

      ancestor.scrollTop += event.deltaY;
      event.preventDefault();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return ref;
}

/**
 * For page-scroll layouts: forward vertical wheel over non-scrolling regions (e.g. a
 * table with no tbody scrollport) to the nearest scrollable ancestor.
 */
export function usePageScrollWheelForward<T extends HTMLElement>(
  enabled: boolean,
) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;

      const ancestor = getScrollableAncestor(el);
      if (!ancestor) return;

      ancestor.scrollTop += event.deltaY;
      event.preventDefault();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [enabled]);

  return ref;
}
