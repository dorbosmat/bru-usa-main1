import React, { useEffect, useRef } from "react";

type HeadingTag = "h1" | "h2" | "h3";

interface Premium3DHeadingProps {
  children: React.ReactNode;
  /**
   * "hero"     — strongest treatment: stacked extrusion + per-letter wave +
   *              slanted light sweep + scroll-depth parallax. Use only on H1s.
   * "section"  — depth via stacked text-shadow + hover. No motion. Use on H2s.
   */
  variant?: "hero" | "section";
  /**
   * "light"    — light text on dark backgrounds (white text → dark extrusion).
   * "dark"     — dark text on light backgrounds (dark text → subtle navy extrusion).
   */
  theme?: "light" | "dark";
  className?: string;
  as?: HeadingTag;
}

/**
 * Walk a React node tree and split string children so:
 *  - Each WORD becomes an inline-block + whitespace-nowrap span (so the browser
 *    cannot break inside a word like "project").
 *  - Each LETTER inside a word becomes its own inline-block span with a
 *    sequential animationDelay (the per-letter wave).
 *  - Whitespace BETWEEN words is rendered as plain text so the browser can
 *    line-break there normally.
 *
 * Nested elements (e.g. <span className="text-accent">) are cloned so their
 * styling is preserved while their inner text gets word/letter-split.
 *
 * The shared {i} counter ensures stagger continues across nested elements.
 */
function splitWithStagger(
  node: React.ReactNode,
  ref: { i: number }
): React.ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    const str = String(node);
    const tokens = str.split(/(\s+)/);
    return tokens.map((token, tIdx) => {
      if (token === "") return null;
      if (/^\s+$/.test(token)) {
        // Plain breakable whitespace between words.
        return <React.Fragment key={`ws${tIdx}`}>{token}</React.Fragment>;
      }
      const letters = token.split("").map((ch) => {
        const i = ref.i++;
        return (
          <span
            key={i}
            className="inline-block motion-safe:animate-[title-letter-wave_4500ms_ease-in-out_infinite]"
            style={{ animationDelay: `${(i * 35).toFixed(0)}ms` }}
          >
            {ch}
          </span>
        );
      });
      return (
        <span
          key={`w${tIdx}`}
          className="inline-block whitespace-nowrap align-baseline"
        >
          {letters}
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return node.map((c, i) => (
      <React.Fragment key={i}>{splitWithStagger(c, ref)}</React.Fragment>
    ));
  }
  if (React.isValidElement(node)) {
    const childProps = node.props as { children?: React.ReactNode };
    return React.cloneElement(
      node,
      {},
      splitWithStagger(childProps.children, ref)
    );
  }
  return node;
}

const Premium3DHeading: React.FC<Premium3DHeadingProps> = ({
  children,
  variant = "section",
  theme = "dark",
  className = "",
  as = "h2",
}) => {
  const innerRef = useRef<HTMLHeadingElement | null>(null);
  const isHero = variant === "hero";

  // Hero-only scroll-depth: tiny GPU-accelerated transform driven by scroll position.
  // Disabled for prefers-reduced-motion. Single passive listener, rAF-throttled.
  useEffect(() => {
    if (!isHero) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = innerRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // p: -1 .. 1.5 — heading position relative to viewport top, normalized
      const p = Math.max(-1, Math.min(1.5, -rect.top / vh));
      el.style.setProperty("--p3d-ty", `${(p * 14).toFixed(2)}px`);
      el.style.setProperty("--p3d-rx", `${(p * -2).toFixed(2)}deg`);
      el.style.setProperty("--p3d-tz", `${(p * 20).toFixed(2)}px`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHero]);

  // Hero-only cursor lighting: drives --p3d-light-x / --p3d-light-y in -1..1
  // range based on pointer position relative to the viewport. The values are
  // smoothed with a slow lerp (~0.05) so the highlight glides like a real
  // reflection on a polished surface — never twitchy, never instant.
  // Skipped for reduced-motion users and coarse pointers (touch devices).
  useEffect(() => {
    if (!isHero) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = innerRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    let running = false;

    const tick = () => {
      // Slow lerp — ~0.05 gives a gentle, premium follow that lags the cursor
      // by ~300ms, so the highlight feels like reflected light, not a UI cursor.
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      el.style.setProperty("--p3d-light-x", currentX.toFixed(3));
      el.style.setProperty("--p3d-light-y", currentY.toFixed(3));
      // Stop the loop once we're effectively at rest to save battery.
      if (Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001) {
        currentX = targetX;
        currentY = targetY;
        el.style.setProperty("--p3d-light-x", currentX.toFixed(3));
        el.style.setProperty("--p3d-light-y", currentY.toFixed(3));
        running = false;
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    const ensureRunning = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Normalize to -1..1 relative to viewport center.
      targetX = (e.clientX / w) * 2 - 1;
      targetY = (e.clientY / h) * 2 - 1;
      ensureRunning();
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
      ensureRunning();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isHero]);

  const themeClass = theme === "light" ? "p3d-theme-light" : "p3d-theme-dark";
  const variantClass = isHero ? "p3d-variant-hero" : "p3d-variant-section";
  const positionClass = isHero ? "inline-block" : "";

  const content = isHero ? splitWithStagger(children, { i: 0 }) : children;

  const heading = React.createElement(
    as,
    {
      ref: innerRef,
      className: `relative ${positionClass} ${themeClass} ${variantClass} ${className}`
        .replace(/\s+/g, " ")
        .trim(),
    },
    content
  );

  // Hero needs a perspective container so rotateX renders in 3D space.
  if (isHero) {
    return <div className="[perspective:1400px]">{heading}</div>;
  }
  return heading;
};

export default Premium3DHeading;
