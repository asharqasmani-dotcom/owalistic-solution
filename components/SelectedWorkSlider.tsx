"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Project = {
  name: string;
  category: string;
  desc: string;
  img: string;
  color: string;
  link?: string;
  video?: string;
  ratio?: string;
};

interface Props {
  projects: Project[];
}

const AUTOPLAY_MS = 4000;
const MOBILE_BREAKPOINT = 768;

// Fisher-Yates shuffle with a fixed seed so order is non-sequential
// but stable per page load (no hydration mismatch, no churn on re-render).
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  let seed = 1337; // deterministic seed
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SelectedWorkSlider({ projects }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pausedRef = useRef(false);

  const orderedProjects = useMemo(() => shuffle(projects), [projects]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".sw-card");
    const target = cards[index];
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const goNext = () => {
    const next = (activeIndex + 1) % orderedProjects.length;
    setActiveIndex(next);
    scrollToIndex(next);
  };

  const goPrev = () => {
    const prev = (activeIndex - 1 + orderedProjects.length) % orderedProjects.length;
    setActiveIndex(prev);
    scrollToIndex(prev);
  };

  useEffect(() => {
    if (!isMobile) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((current) => {
        const next = (current + 1) % orderedProjects.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [isMobile, orderedProjects.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timeout: number | undefined;
    const onScroll = () => {
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        const cards = Array.from(track.querySelectorAll<HTMLElement>(".sw-card"));
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const cardCenter = card.offsetLeft - track.offsetLeft + card.clientWidth / 2;
          const dist = Math.abs(center - cardCenter);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      }, 120);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="sw-slider-wrap"
      onPointerEnter={() => { pausedRef.current = true; }}
      onPointerLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { pausedRef.current = false; }}
    >
      <button
        type="button"
        className="sw-slider-btn sw-slider-btn-prev"
        onClick={goPrev}
        aria-label="Previous project"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="sw-slider-btn sw-slider-btn-next"
        onClick={goNext}
        aria-label="Next project"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="sw-grid" ref={trackRef}>
        {orderedProjects.map((p, i) => {
          const projectHref = p.link || "/case-studies";
          const isExternal = Boolean(p.link);
          const targetProps = isExternal
            ? { target: "_blank" as const, rel: "noopener noreferrer" }
            : {};
          return (
            <div key={i} className="sw-card">
              <a href={projectHref} {...targetProps} className="sw-card-media-link" aria-label={p.name}>
                <div className="sw-card-img" style={{ background: p.color, aspectRatio: p.ratio }}>
                  {p.video ? (
                    <video src={p.video} autoPlay loop muted playsInline preload="metadata" />
                  ) : (
                    <img src={p.img} alt={p.name} />
                  )}
                </div>
              </a>
              <div className="sw-card-body">
                <a href={projectHref} {...targetProps} className="sw-card-text-link">
                  <span className="sw-tag">{p.category}</span>
                  <h3 className="sw-title">{p.name}</h3>
                  <p className="sw-desc">{p.desc}</p>
                </a>
                <a
                  href="https://dribbble.com/block_design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sw-link"
                >
                  View Portfolio →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sw-slider-dots" aria-hidden={!isMobile}>
        {orderedProjects.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`sw-slider-dot${i === activeIndex ? " is-active" : ""}`}
            onClick={() => {
              setActiveIndex(i);
              scrollToIndex(i);
            }}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
