import React, { useState, useEffect } from 'react';
import { ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CatCompanion({ enabled = true }) {
  const [pos, setPos] = useState({ x: 20, y: 350 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("hello, tiny human ♡");

  const messages = [
    "hello, tiny human ♡",
    "sniffing upcycled hardware...",
    "Dhristroyer approved ✂️",
    "real human hands > AI clones!",
    "one-of-one wearable art ✨",
    "purrhaps one more scroll?",
    "inspecting motherboard seams 🐾"
  ];

  useEffect(() => {
    if (!enabled) return;

    let index = 0;
    const interval = setInterval(() => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

      // Waypoints along screen edges and corners
      const waypoints = [
        { x: 30, y: vh * 0.35, flip: false },
        { x: vw - 140, y: vh * 0.28, flip: true },
        { x: vw - 160, y: vh * 0.75, flip: true },
        { x: 40, y: vh * 0.8, flip: false },
        { x: vw * 0.5 - 50, y: vh * 0.88, flip: false }
      ];

      index = (index + 1) % waypoints.length;
      const wp = waypoints[index];

      setFacingLeft(wp.flip);
      setPos({ x: Math.max(10, Math.min(vw - 120, wp.x)), y: Math.max(80, Math.min(vh - 120, wp.y)) });
      setCurrentMessage(messages[index % messages.length]);
      setIsSitting(true);

      setTimeout(() => {
        setIsSitting(false);
      }, 2500);
    }, 6000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed z-40 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Cute Speech Bubble */}
        <div className="mb-2 px-3 py-1 bg-black/80 backdrop-blur-md border border-pink/40 text-pink text-[11px] font-mono tracking-wider rounded-full shadow-lg shadow-black/80 whitespace-nowrap animate-bounce">
          {currentMessage}
        </div>

        {/* Anime Cat Companion Sprite */}
        <div
          className={`relative transition-transform duration-500 ${facingLeft ? '-scale-x-100' : 'scale-x-100'} ${
            isSitting ? 'translate-y-1' : ''
          }`}
        >
          <img
            src={ASSET_MANIFEST.cat}
            alt="Tiny black-and-white anime kitten companion"
            className="w-20 h-auto object-contain drop-shadow-[0_4px_12px_rgba(244,194,194,0.4)]"
          />
        </div>
      </div>
    </div>
  );
}
