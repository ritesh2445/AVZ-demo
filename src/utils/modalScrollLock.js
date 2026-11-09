'use client';
import { useEffect } from 'react';

/**
 * Clean & Safe Modal Scroll Lock Manager
 * Ensures that background scroll is paused when a modal is open,
 * without hijacking touchmove/wheel events which cause mobile freeze and lag.
 */

let openModalsCount = 0;

export function lockModalBackground() {
  if (typeof window === 'undefined') return;

  openModalsCount++;
  if (openModalsCount === 1) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('modal-scroll-locked');
    document.body.classList.add('modal-scroll-locked');
    window.dispatchEvent(new CustomEvent('avz-modal-lock-change', { detail: { locked: true } }));
  }
}

export function unlockModalBackground() {
  if (typeof window === 'undefined') return;

  openModalsCount = Math.max(0, openModalsCount - 1);
  if (openModalsCount === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.touchAction = '';
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('modal-scroll-locked');
    document.body.classList.remove('modal-scroll-locked');
    window.dispatchEvent(new CustomEvent('avz-modal-lock-change', { detail: { locked: false } }));
  }
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

export function forceUnlockAllModals() {
  if (typeof window === 'undefined') return;
  openModalsCount = 0;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.style.touchAction = '';
  document.documentElement.style.overflow = '';
  document.documentElement.classList.remove('modal-scroll-locked');
  document.body.classList.remove('modal-scroll-locked');
  window.dispatchEvent(new CustomEvent('avz-modal-lock-change', { detail: { locked: false } }));
}
