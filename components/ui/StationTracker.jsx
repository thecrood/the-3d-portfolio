"use client";

import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATION_ICONS = {
  1: "📦",
  2: "📖",
  3: "🏆",
  4: "🛠️",
  5: "🔮",
};

export default function StationTracker({ currentStation, visitedStations = [], onStationClick }) {
  return (
    <AnimatePresence>
      <div className="pointer-events-none fixed left-3 top-1/2 z-30 -translate-y-1/2 flex flex-col gap-2 font-mono sm:left-6 sm:gap-2.5 select-none">
        {PORTFOLIO_DATA.checkpoints.map((station, index) => {
          const isVisited = visitedStations.includes(station.id);
          const isCurrent = currentStation?.id === station.id;
          const icon = STATION_ICONS[station.id] || "🎮";

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStationClick?.(station)}
              className={`rounded-xl border-3 border-slate-950 p-2 sm:px-3 sm:py-2 flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer pointer-events-auto transition-all ${
                isCurrent
                  ? "bg-emerald-300 text-slate-950 shadow-[4px_4px_0px_0px_#090d16] translate-x-[2px] translate-y-[2px]"
                  : isVisited
                    ? "bg-purple-100 text-slate-950 shadow-[4px_4px_0px_0px_#090d16] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16]"
                    : "bg-white text-slate-800 shadow-[4px_4px_0px_0px_#090d16] hover:bg-amber-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#090d16]"
              }`}
            >
              <span className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-lg border-2 border-slate-950 bg-white text-base sm:text-sm shadow-[1px_1px_0px_0px_#090d16] flex-shrink-0">
                {icon}
              </span>
              <div className="hidden sm:block text-left">
                <p className="font-black text-[10px] uppercase tracking-wider text-slate-900 leading-none">
                  STATION {station.level}
                </p>
                <p className="text-[11px] font-black text-slate-950 leading-tight max-w-[220px] mt-0.5">
                  {station.title}
                </p>
              </div>
              {isVisited && (
                <CheckCircle2 className="hidden sm:block h-4 w-4 text-emerald-600 ml-auto flex-shrink-0 stroke-[2.5]" />
              )}
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
