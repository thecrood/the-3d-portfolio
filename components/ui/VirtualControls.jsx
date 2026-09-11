"use client";

import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

/* ============================================================================
   VIRTUAL CONTROLS (mobile / touch devices)
   A neo-brutalist on-screen joystick + jump button that writes into a shared
   touchRef object. GameWorld reads that ref every frame (analog movement that
   mirrors WASD: stick x = strafe, stick y = forward/back) and a one-shot jump.
   Shrinks on small screens and only renders when a coarse/touch pointer is
   detected, so desktop keyboards are unaffected.
   ============================================================================ */

const STICK_MAX = 40; // px knob travel from centre (desktop fallback)

export default function VirtualControls({ touchRef }) {
  const [visible, setVisible] = useState(false);
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const activeRef = useRef(false);
  const originRef = useRef({ x: 0, y: 0 });
  const travelRef = useRef(STICK_MAX);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    if (isTouchDevice) setVisible(true);

    // Fallback: show controls on the first genuine touch gesture
    const enable = () => setVisible(true);
    window.addEventListener("touchstart", enable, { passive: true, once: true });
    return () => window.removeEventListener("touchstart", enable);
  }, []);

  /* Knob travel adapts to the rendered joystick size (responsive breakpoints) */
  const refillTravel = () => {
    if (!baseRef.current || !knobRef.current) return;
    const base = baseRef.current.getBoundingClientRect();
    const knob = knobRef.current.getBoundingClientRect();
    travelRef.current = Math.max(18, base.width / 2 - knob.width / 2);
  };

  const updateStick = (clientX, clientY) => {
    const dx = clientX - originRef.current.x;
    const dy = clientY - originRef.current.y;
    const dist = Math.hypot(dx, dy);
    const max = travelRef.current;
    const clamped = Math.min(dist, max);
    const nx = dist > 0 ? (dx / dist) * clamped : 0;
    const ny = dist > 0 ? (dy / dist) * clamped : 0;

    if (knobRef.current) knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
    if (touchRef?.current) touchRef.current.stick = [nx / max, -ny / max];
  };

  const handleDown = (e) => {
    if (!baseRef.current) return;
    e.preventDefault();
    activeRef.current = true;
    baseRef.current.setPointerCapture?.(e.pointerId);
    refillTravel();
    const rect = baseRef.current.getBoundingClientRect();
    originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    updateStick(e.clientX, e.clientY);
  };

  const handleMove = (e) => {
    if (activeRef.current) updateStick(e.clientX, e.clientY);
  };

  const handleUp = () => {
    activeRef.current = false;
    if (knobRef.current) knobRef.current.style.transform = "translate(0px, 0px)";
    if (touchRef?.current) touchRef.current.stick = [0, 0];
  };

  const handleJumpDown = (e) => {
    e.preventDefault();
    if (touchRef?.current) touchRef.current.jump = true;
  };

  const handleJumpUp = () => {
    if (touchRef?.current) touchRef.current.jump = false;
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-12 left-3 z-50 flex items-end gap-2.5 font-mono select-none sm:bottom-24 sm:left-6 sm:gap-4">
      {/* Virtual Joystick */}
      <div
        ref={baseRef}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        aria-label="Virtual joystick"
        className="relative flex h-20 w-20 sm:h-32 sm:w-32 touch-none items-center justify-center rounded-full border-4 border-slate-950 bg-white/70 shadow-[4px_4px_0px_0px_#090d16] cursor-grab active:cursor-grabbing"
      >
        <span className="absolute h-6 w-6 sm:h-10 sm:w-10 rounded-full border-2 border-slate-950/40 pointer-events-none" />
        <span
          ref={knobRef}
          className="pointer-events-none h-7 w-7 sm:h-12 sm:w-12 rounded-full border-3 border-slate-950 bg-sky-300 shadow-[2px_2px_0px_0px_#090d16] transition-transform duration-75"
        />
      </div>

      {/* Jump Button */}
      <button
        type="button"
        onPointerDown={handleJumpDown}
        onPointerUp={handleJumpUp}
        onPointerCancel={handleJumpUp}
        onPointerLeave={handleJumpUp}
        aria-label="Jump"
        className="flex h-11 w-11 sm:h-16 sm:w-16 touch-none items-center justify-center rounded-full border-3 border-slate-950 bg-amber-300 text-slate-950 shadow-[4px_4px_0px_0px_#090d16] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#090d16] cursor-pointer"
      >
        <Zap className="h-5 w-5 sm:h-7 sm:w-7 fill-current stroke-[2.5]" />
      </button>
    </div>
  );
}