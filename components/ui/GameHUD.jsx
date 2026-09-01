"use client";

import { Heart, Drumstick, Volume2, VolumeX } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function GameHUD({ isMuted, onToggleSound, speed = 0 }) {
  return <div className="pointer-events-none fixed inset-0 z-40 flex select-none flex-col justify-between p-4 font-mono sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="rounded-xl border border-white/20 bg-black/55 p-3 shadow-xl backdrop-blur">
        <div className="flex gap-1 text-red-500">{Array.from({ length: 5 }, (_, i) => <Heart key={i} className="h-4 w-4 fill-current" />)}</div>
        <div className="mt-1 flex gap-1 text-amber-400">{Array.from({ length: 5 }, (_, i) => <Drumstick key={i} className="h-4 w-4 fill-current" />)}</div>
        <p className="mt-2 text-[10px] font-bold text-lime-200">{PORTFOLIO_DATA.profile.handle} · WALKING {Math.round(speed)}</p>
      </div>
      <button onClick={onToggleSound} className="pointer-events-auto rounded-xl border border-white/20 bg-black/55 p-3 text-white backdrop-blur" aria-label="Toggle sound">
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
    <div className="mx-auto animate-[pulse_3s_ease-in-out_infinite] rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-center text-[10px] font-bold text-white/90 shadow-lg backdrop-blur transition hover:scale-105 sm:text-xs">WASD WALK · SPACE JUMP · DRAG LOOK · FIND A STATION AND PRESS E</div>
  </div>;
}
