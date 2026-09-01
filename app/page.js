"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Pickaxe } from "lucide-react";
import { soundFX } from "@/utils/soundFX";
import GameHUD from "@/components/ui/GameHUD";
import Minimap from "@/components/ui/Minimap";
import InteractionPrompt from "@/components/ui/InteractionPrompt";
import Overlays from "@/components/ui/Overlays";
import ProjectModal from "@/components/ui/ProjectModal";
import StationTracker from "@/components/ui/StationTracker";
import BoatBanner from "@/components/ui/BoatBanner";

const GameWorld = dynamic(() => import("@/components/GameWorld"), { ssr: false, loading: () => <div className="fixed inset-0 z-50 grid place-items-center bg-sky-400 font-mono font-bold text-slate-950"><span className="flex items-center gap-3"><Loader2 className="animate-spin" /> GENERATING VOXEL ISLAND…</span></div> });

export default function Home() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 40, yaw: 0 });
  const [nearbyStation, setNearbyStation] = useState(null);
  const [openStation, setOpenStation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [tourId, setTourId] = useState(0);
  const [visitedStations, setVisitedStations] = useState([]);
  const nearbyStationRef = useRef(null);

  useEffect(() => {
    nearbyStationRef.current = nearbyStation;
  }, [nearbyStation]);

  const closeDrawer = useCallback(() => {
    if (openStation && !visitedStations.includes(openStation.id)) {
      setVisitedStations(prev => [...prev, openStation.id]);
    }
    setOpenStation(null);
  }, [openStation, visitedStations]);
  useEffect(() => {
    const onKeyDown = (event) => {
      const isInteractKey = event.code === "KeyE" || event.key?.toLowerCase() === "e";
      if (isInteractKey && nearbyStationRef.current && !openStation) {
        event.preventDefault();
        const station = nearbyStationRef.current;
        setOpenStation(station);
        if (!visitedStations.includes(station.id)) {
          setVisitedStations(prev => [...prev, station.id]);
        }
        soundFX.playChestOpen();
      }
      if (event.code === "Escape") {
        setOpenStation(null);
        setSelectedProject(null);
        setIsContactOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [openStation, visitedStations]);

  const toggleSound = useCallback(() => setIsMuted(soundFX.toggleMute()), []);
  
  const handleTourStation = useCallback((station) => {
    setNearbyStation(station);
    setOpenStation(station);
    if (!visitedStations.includes(station.id)) {
      setVisitedStations(prev => [...prev, station.id]);
    }
  }, [visitedStations]);

  const handleStationClick = useCallback((station) => {
    setOpenStation(station);
    if (!visitedStations.includes(station.id)) {
      setVisitedStations(prev => [...prev, station.id]);
    }
  }, [visitedStations]);

  return <main className="relative min-h-dvh overflow-hidden bg-sky-400 text-white">
    <GameWorld onPlayerPosition={setPlayerPosition} onNearbyStation={setNearbyStation} onSpeedUpdate={setSpeed} tourId={tourId} paused={Boolean(openStation)} onTourStation={handleTourStation} />
    <GameHUD speed={speed} isMuted={isMuted} onToggleSound={toggleSound} />
    <Minimap playerPosition={playerPosition} />
    <StationTracker currentStation={openStation} visitedStations={visitedStations} onStationClick={handleStationClick} />
    <InteractionPrompt station={nearbyStation && !openStation ? nearbyStation : null} onInteract={() => nearbyStation && setOpenStation(nearbyStation)} />
    <BoatBanner playerPosition={playerPosition} />
    <button onClick={() => { setOpenStation(null); setTourId((id) => id + 1); }} className="fixed bottom-16 left-1/2 z-40 -translate-x-1/2 animate-[pulse_2.4s_ease-in-out_infinite] rounded-xl border border-lime-300/70 bg-slate-950/90 px-4 py-2 text-xs font-extrabold text-lime-200 shadow-[0_0_22px_rgba(163,230,53,.35)] backdrop-blur transition hover:scale-105 hover:bg-slate-800 hover:shadow-[0_0_30px_rgba(163,230,53,.6)] sm:bottom-20 sm:text-sm flex items-center gap-2 justify-center"><Pickaxe className="h-4 w-4" />Start Guided Portfolio Route</button>
    <Overlays station={openStation} onClose={closeDrawer} onOpenProject={setSelectedProject} onOpenContact={() => setIsContactOpen(true)} />
    <ProjectModal project={selectedProject} isOpen={Boolean(selectedProject || isContactOpen)} onClose={() => { setSelectedProject(null); setIsContactOpen(false); }} />
  </main>;
}
