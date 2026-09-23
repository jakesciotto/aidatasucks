"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

export function TrackView({ event, threshold = 0.25, as: Tag = "div", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          posthog.capture(event);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [event, threshold]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
