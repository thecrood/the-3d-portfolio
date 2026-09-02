"use client";

import { Heart, Drumstick, Volume2, VolumeX } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

export default function GameHUD({ isMuted, onToggleSound, speed = 0 }) {
  const isMoving = speed > 0.1;
  const staminaPercent = Math.max(0, 100 - speed * 5);
  const staminaIcons = Math.ceil((staminaPercent / 100) * 5);

  return <div className="pointer-events-none fixed inset-0 z-40 flex select-none flex-col justify-between p-4 font-mono sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div className="rounded-xl border border-white/20 bg-black/55 p-3 shadow-xl backdrop-blur sm:w-64">
        <p className="mb-2 text-[10px] font-bold text-lime-200">{PORTFOLIO_DATA.profile.handle} · {isMoving ? 'RUNNING' : 'WALKING'} {Math.round(speed)}</p>
        <div className="flex gap-2">
            <div className="flex text-red-500">{Array.from({ length: 5 }, (_, i) => <Heart key={i} className="h-4 w-4 fill-current" />)}</div>
            <div className="flex text-amber-400">{Array.from({ length: 5 }, (_, i) => <Drumstick key={i} className={`h-4 w-4 ${i < staminaIcons ? 'fill-current' : 'fill-none opacity-30'}`} />)}</div>
        </div>
      </div>
      <button onClick={onToggleSound} className="pointer-events-auto rounded-xl border border-white/20 bg-black/55 p-3 text-white backdrop-blur" aria-label="Toggle sound">
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </div>
    <div className="mx-auto animate-[pulse_3s_ease-in-out_infinite] rounded-lg border border-white/15 bg-black/55 px-3 py-1.5 text-center text-[10px] font-bold text-white/90 shadow-lg backdrop-blur transition hover:scale-105 sm:text-xs">WASD WALK · SPACE JUMP · DRAG LOOK · FIND A STATION AND PRESS E</div>
  </div>;
}
