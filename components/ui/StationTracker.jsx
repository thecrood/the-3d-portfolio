"use client";

import { PORTFOLIO_DATA } from "@/data/portfolioData";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Minecraft-style icons for each station
const STATION_ICONS = {
  1: "📦", // Spawn Chest
  2: "📖", // Enchanting Altar
  3: "🏆", // Trophy Vault
  4: "🛠️", // Crafting Forge
  5: "🔮", // Nether Portal
};

export default function StationTracker({ currentStation, visitedStations = [], onStationClick }) {
  return (
    <AnimatePresence>
      <div className="pointer-events-none fixed left-4 top-1/2 z-30 -translate-y-1/2 flex flex-col gap-2 font-mono sm:left-6">
        {PORTFOLIO_DATA.checkpoints.map((station, index) => {
          const isVisited = visitedStations.includes(station.id);
          const isCurrent = currentStation?.id === station.id;
          const icon = STATION_ICONS[station.id] || "🎮";

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onStationClick?.(station)}
              className={`rounded-lg border px-3 py-2 backdrop-blur transition-all text-xs flex items-center gap-2 cursor-pointer pointer-events-auto hover:scale-105 ${
                isCurrent
                  ? "border-lime-400 bg-lime-400/20 text-lime-100"
                  : isVisited
                    ? "border-green-400/60 bg-green-400/10 text-white/80"
                    : "border-white/15 bg-white/5 text-white/50"
              }`}
            >
              <span className="text-sm">{icon}</span>
              <div>
                <p className="font-bold">{station.level}</p>
                <p className="text-[10px]">{station.title}</p>
              </div>
              {isVisited && <CheckCircle2 className="h-3 w-3 text-green-400 ml-auto flex-shrink-0" />}
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}
