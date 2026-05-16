"use client";

import React, { useCallback, useRef, useState } from "react";

export function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const stop = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="ba-slider"
      role="slider"
      aria-label="Before and after website comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      {/* Before (old) — base layer, fully visible underneath */}
      <img
        className="ba-slider-img"
        src="/assets/before.png"
        alt="Original website design before redesign"
        draggable={false}
      />

      {/* After (new) — overlay, clipped from the right so the left portion shows */}
      <div
        className="ba-slider-after"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          className="ba-slider-img"
          src="/assets/after.png"
          alt="Redesigned website after improvements"
          draggable={false}
        />
      </div>

      <span className="ba-slider-label ba-slider-label-after">AFTER</span>
      <span className="ba-slider-label ba-slider-label-before">BEFORE</span>

      <div className="ba-slider-divider" style={{ left: `${position}%` }}>
        <div className="ba-slider-handle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 6 9 12 15 18" />
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
