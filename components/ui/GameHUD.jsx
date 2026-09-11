"use client";

import React from "react";
import { Heart, Drumstick, Volume2, VolumeX, Disc3 } from "lucide-react";

// Visitor-facing tag shown in the HUD (not the island owner's name).
const EXPLORER_NAME = "hey@explorer"

export default function GameHUD({
  isMuted,
  onToggleSound,
  speed = 0,
  currentDisc = null,
  isPlayingDisc = false,
  onOpenJukebox,
}) {
  const isMoving = speed > 0.1;
  const staminaPercent = Math.max(0, 100 - speed * 5);
  const staminaIcons = Math.ceil((staminaPercent / 100) * 5);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex select-none flex-col justify-between p-4 font-mono sm:p-6">
      {/* Top HUD Bar */}
      <div className="flex items-start justify-between gap-3">
        {/* Player Status & Health in Neo-Brutalist Style */}
        <div className="rounded-xl border-3 border-slate-950 bg-[#fdfbf7] p-3 shadow-[4px_4px_0px_0px_#090d16] text-slate-950 sm:w-64">
          <div className="flex items-center justify-between mb-1.5 min-w-0">
            <span className="text-[10px] font-black uppercase text-slate-950 tracking-wider truncate" title={EXPLORER_NAME}>
              {EXPLORER_NAME}
            </span>
            <span className="rounded border border-slate-950 bg-emerald-300 px-1.5 py-0.2 text-[9px] font-black uppercase">
              {isMoving ? "SPRINT" : "IDLE"}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex text-rose-500">
              {Array.from({ length: 5 }, (_, i) => (
                <Heart key={i} className="h-4 w-4 fill-current stroke-[2.5] stroke-slate-950" />
              ))}
            </div>
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }, (_, i) => (
                <Drumstick
                  key={i}
                  className={`h-4 w-4 ${i < staminaIcons ? "fill-current stroke-[2.5] stroke-slate-950" : "fill-none opacity-30 stroke-slate-950"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Widgets (Jukebox + Sound Toggle) */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Jukebox Quick Launch & Now Playing Pill */}
          <button
            onClick={onOpenJukebox}
            className="flex items-center gap-2.5 rounded-xl border-3 border-slate-950 bg-amber-300 px-3.5 py-2 text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-amber-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
            title="Open Jukebox & Music Discs [J]"
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-950 shadow-sm ${
                isPlayingDisc ? "animate-[spin_3s_linear_infinite]" : ""
              }`}
              style={{
                backgroundColor: currentDisc?.color || "#10b981",
              }}
            >
              <Disc3 className="h-3.5 w-3.5 text-slate-950" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-900 leading-none">
                {isPlayingDisc ? "PLAYING DISC" : "VOXEL JUKEBOX"}
              </div>
              <div className="text-[11px] font-black text-slate-950 max-w-[120px] truncate mt-0.5">
                {currentDisc ? currentDisc.title : "Insert Disc [J]"}
              </div>
            </div>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="rounded-xl border-3 border-slate-950 bg-white p-2.5 text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:bg-slate-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer"
            aria-label="Toggle sound"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="h-5 w-5 text-rose-600 stroke-[2.5]" /> : <Volume2 className="h-5 w-5 text-emerald-600 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Bottom Controls Legend — desktop keyboard hints */}
      <div className="mx-auto hidden rounded-xl border-3 border-slate-950 bg-[#fdfbf7] px-4 py-2 text-center text-[10px] font-black text-slate-950 shadow-[4px_4px_0px_0px_#090d16] sm:block sm:text-xs">
        <span className="rounded bg-emerald-200 border border-slate-950 px-1 py-0.5">WASD</span> WALK · <span className="rounded bg-emerald-200 border border-slate-950 px-1 py-0.5">SPACE</span> JUMP · <span className="rounded bg-sky-200 border border-slate-950 px-1 py-0.5">DRAG</span> LOOK · <span className="rounded bg-amber-200 border border-slate-950 px-1 py-0.5">E</span> INTERACT · <span className="rounded bg-amber-200 border border-slate-950 px-1 py-0.5">J</span> JUKEBOX
      </div>
    </div>
  );
}
