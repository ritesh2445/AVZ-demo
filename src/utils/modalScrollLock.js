'use client';
import { useEffect } from 'react';

/**
 * Universal Modal Scroll Lock & Background Stabilization Manager
 * Ensures that when ANY modal/popup is open, the background is 100% frozen:
 * - Locks documentElement and body scrolling without layout shift
 * - Blocks wheel/touch event leakage (scroll chaining) to the background
 * - Prevents background drift and movement across all devices and browsers
 */

let openModalsCount = 0;
let isLocked = false;
let wheelListenerActive = false;

function handleWheel(e) {
  // Find closest scrollable container inside modal
  const scrollable = e.target.closest?.(
    '.modal-card, [data-modal-scrollable], .modal-scroll-area, .overflow-y-auto, [class*="overflow-y-auto"]'
  );

  // If scroll occurred outside any scrollable container (e.g. on backdrop or background), block it
  if (!scrollable) {
    if (e.cancelable) e.preventDefault();
    return;
  }

  // If container has no overflow, prevent background chaining
  const hasScrollableContent = scrollable.scrollHeight > scrollable.clientHeight;
  if (!hasScrollableContent) {
    if (e.cancelable) e.preventDefault();
    return;
  }

  // Prevent scroll chaining when hitting boundaries
  const isAtTop = scrollable.scrollTop <= 0;
  const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 1;

  if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
    if (e.cancelable) e.preventDefault();
  }
}

function handleTouchMove(e) {
  const scrollable = e.target.closest?.(
    '.modal-card, [data-modal-scrollable], .modal-scroll-area, .overflow-y-auto, [class*="overflow-y-auto"]'
  );

  if (!scrollable) {
    if (e.cancelable) e.preventDefault();
  }
}

function handleKeyDown(e) {
  // Prevent space, page up/down, arrows from scrolling background if not in an input
  const scrollKeys = ['Space', 'PageUp', 'PageDown', 'End', 'Home'];
  if (scrollKeys.includes(e.code) || ((e.code === 'ArrowUp' || e.code === 'ArrowDown') && !e.target.closest('.overflow-y-auto, [class*="overflow-y-auto"]'))) {
    const isInput = e.target.closest('input, textarea, select, [contenteditable="true"]');
    if (!isInput && e.cancelable) {
      e.preventDefault();
    }
  }
}

export function lockModalBackground() {
  if (typeof window === 'undefined') return;

  openModalsCount++;
  if (isLocked) return;

  isLocked = true;

  // Compensate for scrollbar width to prevent horizontal page jump
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  document.documentElement.classList.add('modal-scroll-locked');
  document.body.classList.add('modal-scroll-locked');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';

  if (!wheelListenerActive) {
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    wheelListenerActive = true;
  }

  // Notify background components (e.g. AvzMuseum auto-drift) to freeze movement
  window.dispatchEvent(new CustomEvent('avz-modal-lock-change', { detail: { locked: true } }));
}

export function unlockModalBackground() {
  if (typeof window === 'undefined') return;

  openModalsCount = Math.max(0, openModalsCount - 1);
  if (openModalsCount > 0 || !isLocked) return;

  isLocked = false;

  document.documentElement.classList.remove('modal-scroll-locked');
  document.body.classList.remove('modal-scroll-locked');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
  document.body.style.paddingRight = '';

  if (wheelListenerActive) {
    window.removeEventListener('wheel', handleWheel, { capture: true });
    window.removeEventListener('touchmove', handleTouchMove, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    wheelListenerActive = false;
  }

  // Notify background components to resume
  window.dispatchEvent(new CustomEvent('avz-modal-lock-change', { detail: { locked: false } }));
}

/**
 * React hook to automatically lock/unlock background scroll for any modal/popup
 * @param {boolean} isOpen
 */
export function useModalScrollLock(isOpen) {
  useEffect(() => {
    if (!isOpen) return;

    lockModalBackground();

    return () => {
      unlockModalBackground();
    };
  }, [isOpen]);
}

