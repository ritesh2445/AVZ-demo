"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
  title?: string;
  category?: string;
  price?: number | string;
  data?: any;
}

interface SocialCardsProps {
  cards: CardItem[];
  onCardClick?: (card: CardItem, index: number) => void;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * Returns a multiplier (0..1] that scales y-offsets and entry animation
 * distances when the viewport is too short for the ideal layout height.
 */
function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;       // 352px
  else if (width < 640) idealPx = 26 * 16;  // 416px
  else if (width < 768) idealPx = 28 * 16;  // 448px
  else if (width < 1024) idealPx = 34 * 16; // 544px
  else idealPx = 38 * 16;                    // 608px

  if (typeof window === 'undefined') return 1;
  const available = window.innerHeight * 0.7; // 70vh budget
  if (available >= idealPx) return 1;
  return Math.max(0.65, available / idealPx);
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-white/20 bg-black/60 backdrop-blur-[16px] text-white/80 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:border-pink hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-white/[0.08] before:pointer-events-none";

export default function SocialCards({ cards, onCardClick }: SocialCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback((center: number) => {
    const map = new Map<number, number>();
    if (!needsPagination) {
      cards.forEach((_, i) => map.set(i, i));
      return map;
    }
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      map.set(((center + slot - HALF) % totalCards + totalCards) % totalCards, slot);
    }
    return map;
  }, [totalCards, needsPagination, cards]);

  const cycle = useCallback((direction: "left" | "right") => {
    if (isAnimating.current || !needsPagination) return;
    isAnimating.current = true;
    directionRef.current = direction;
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );
  }, [totalCards, needsPagination]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    if (Math.abs(deltaX) > 25 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        cycle("right");
      } else {
        cycle("left");
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const hMult = getHeightMultiplier(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) {
      hasEntered.current = true;
      isAnimating.current = true;
    }

    gsap.killTweensOf(cardElements);

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
      }
    };

    // Failsafe fast unlock so user can rapidly cycle without getting locked out
    const unlockTimer = setTimeout(() => {
      isAnimating.current = false;
    }, 280);

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.fromTo(
            card,
            {
              x: `${x * multiplier * 0.6}rem`,
              y: `${y * hMult + 2.5}rem`,
              rotation: rot * 0.4,
              scale: scale * 0.92,
              opacity: 0.4,
              zIndex
            },
            {
              ...target,
              duration: 0.45,
              ease: "power2.out",
              delay: slot * 0.02,
              onComplete: onCardDone
            }
          );
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 35 : -35;
          gsap.fromTo(
            card,
            { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 25 : -25, scale: 0.55, opacity: 0 },
            { ...target, duration: 0.30, ease: "power2.out", onComplete: onCardDone }
          );
        } else {
          gsap.to(card, { ...target, duration: 0.28, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -35 : 35;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.55, rotation: direction === "right" ? -25 : 25, duration: 0.22, ease: "power2.in", zIndex: 0 });
      } else {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    // Instant Hover interactions
    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: NodeJS.Timeout | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      if (typeof window === 'undefined') return;
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        }

        gsap.to(el, {
          x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale,
          duration: 0.22, ease: "power2.out", overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 30);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => { updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      clearTimeout(unlockTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination, cards]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="flex flex-col items-center w-full py-2 px-2 sm:px-4 relative z-20">
      <div className="flex items-center justify-center w-full">
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fan-layout relative flex justify-center items-center w-full"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '34rem',
            minHeight: '520px',
            overflow: 'visible'
          }}
        >
          {cards.map((card, index) => {
            const cardBody = (
              <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl group bg-[#09090b]">
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `Card ${index}`}
                  className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent z-20 pointer-events-none" />

                {/* Card Editorial Info Overlay */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-30 pointer-events-none text-left">
                  {card.category && (
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-pink block mb-0.5">
                      {card.category}
                    </span>
                  )}
                  {card.title && (
                    <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase truncate">
                      {card.title}
                    </h3>
                  )}
                  {card.price && (
                    <span className="text-[10px] font-mono text-zinc-300 block mt-0.5">
                      {typeof card.price === 'number' ? `₹${card.price.toLocaleString('en-IN')}` : card.price}
                    </span>
                  )}
                </div>
              </div>
            );

            const cardInlineStyle: React.CSSProperties = {
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 'min(270px, 72vw)',
              height: 'min(390px, 104vw)',
              marginLeft: 'calc(-1 * min(270px, 72vw) / 2)',
              marginTop: 'calc(-1 * min(390px, 104vw) / 2)',
              transformOrigin: 'center bottom',
              willChange: 'transform, opacity',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              backgroundColor: '#09090b',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.18)',
              cursor: 'pointer',
              userSelect: 'none'
            };

            return card.linkUrl ? (
              <a
                key={index}
                href={card.linkUrl}
                onClick={(e) => {
                  if (onCardClick) {
                    e.preventDefault();
                    onCardClick(card, index);
                  }
                }}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="fan-card block"
                style={cardInlineStyle}
              >
                {cardBody}
              </a>
            ) : (
              <div
                key={index}
                onClick={() => onCardClick?.(card, index)}
                className="fan-card block"
                style={cardInlineStyle}
              >
                {cardBody}
              </div>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 z-30 select-none">
          <button
            className={`${ARROW_CLASSES} w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12`}
            onClick={() => cycle("left")}
            aria-label="Previous card"
          >
            {chevron("left")}
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  i === centerIndex
                    ? "bg-pink scale-[1.4] shadow-[0_0_10px_rgba(244,114,182,0.8)]"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <button
            className={`${ARROW_CLASSES} w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12`}
            onClick={() => cycle("right")}
            aria-label="Next card"
          >
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
