"use client";

import React from "react";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { soundFX } from "@/utils/soundFX";

export default function CheckpointBanner({ checkpointId, onJumpToCheckpoint }) {
  return (
    <div className="fixed left-3 md:left-4 top-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col gap-2.5 font-mono">
      {PORTFOLIO_DATA.checkpoints.map((cp, idx) => {
        const isActive = cp.id === checkpointId;
        const isUnlocked = cp.id <= checkpointId;

        return (
          <motion.button
            key={cp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, type: "spring", damping: 20, stiffness: 280 }}
            onClick={() => {
              soundFX.playChestOpen();
              if (onJumpToCheckpoint) onJumpToCheckpoint(cp.id);
            }}
            title={cp.title}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-2.5 py-2 border transition-all duration-300 cursor-pointer group
              ${isActive
                ? "bg-black/70 border-lime-400 shadow-[0_0_18px_rgba(132,204,22,0.55)] scale-105"
                : isUnlocked
                  ? "bg-black/50 border-white/30 hover:border-lime-400/70 hover:shadow-[0_0_12px_rgba(132,204,22,0.3)]"
                  : "bg-black/30 border-white/15 hover:border-white/30 opacity-60"
              } backdrop-blur-md`}
          >
            {/* Chest Icon */}
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-lg text-base flex-shrink-0 transition-all duration-300
                ${isActive ? "bg-lime-500/30 border border-lime-400/80 shadow-[0_0_10px_rgba(132,204,22,0.5)]" : "bg-white/10 border border-white/20"}`}
            >
              <span>{isUnlocked ? cp.itemIcon : "🔒"}</span>
            </div>

            {/* Station Label — expands on hover / active */}
            <div
              className={`overflow-hidden transition-all duration-300 text-left
                ${isActive ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0 group-hover:max-w-[140px] group-hover:opacity-100"}`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap
                ${isActive ? "text-lime-400" : "text-slate-300"}`}>
                STATION {cp.level}
              </div>
              <div className="text-[11px] font-semibold text-white whitespace-nowrap truncate max-w-[130px]">
                {cp.title}
              </div>
            </div>

            {/* Active Pulse Dot */}
            {isActive && (
              <span className="w-2 h-2 flex-shrink-0 rounded-full bg-lime-400 animate-ping ml-auto" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
