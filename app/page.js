"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Pickaxe, Volume2 } from "lucide-react";
import { soundFX } from "@/utils/soundFX";
import { MUSIC_DISCS } from "@/data/musicDiscs";
import GameHUD from "@/components/ui/GameHUD";
import Minimap from "@/components/ui/Minimap";
import InteractionPrompt from "@/components/ui/InteractionPrompt";
import Overlays from "@/components/ui/Overlays";
import ProjectModal from "@/components/ui/ProjectModal";
import StationTracker from "@/components/ui/StationTracker";
import BoatBanner from "@/components/ui/BoatBanner";
import JukeboxModal from "@/components/ui/JukeboxModal";
import NowPlayingToast from "@/components/ui/NowPlayingToast";

const GameWorld = dynamic(() => import("@/components/GameWorld"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 grid place-items-center bg-sky-400 font-mono font-bold text-slate-950">
      <span className="flex items-center gap-3">
        <Loader2 className="animate-spin" /> GENERATING VOXEL ISLAND…
      </span>
    </div>
  ),
});

export default function Home() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 40, yaw: 0 });
  const [nearbyStation, setNearbyStation] = useState(null);
  const [openStation, setOpenStation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // Music ON by default!
  const [audioStarted, setAudioStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [tourId, setTourId] = useState(0);
  const [visitedStations, setVisitedStations] = useState([]);

  // Jukebox State
  const [isJukeboxOpen, setIsJukeboxOpen] = useState(false);
  const [currentDisc, setCurrentDisc] = useState(MUSIC_DISCS[0]); // Erik Satie - Gymnopédie No. 1
  const [isPlayingDisc, setIsPlayingDisc] = useState(false);
  const [isNearJukebox, setIsNearJukebox] = useState(false);

  const nearbyStationRef = useRef(null);
  const isNearJukeboxRef = useRef(false);

  useEffect(() => {
    nearbyStationRef.current = nearbyStation;
  }, [nearbyStation]);

  useEffect(() => {
    isNearJukeboxRef.current = isNearJukebox;
  }, [isNearJukebox]);

  // Sync soundFX listener
  useEffect(() => {
    soundFX.onTrackChange = (disc) => {
      setCurrentDisc(disc);
    };
    soundFX.onPlayStateChange = ({ isPlaying, isMuted: muted }) => {
      setIsPlayingDisc(isPlaying);
      setIsMuted(muted);
    };
  }, []);

  // AUTO-PLAY MUSIC & BIRDS ON STARTUP
  // Attempts instant start, and registers eager unlock on first click/keypress/touch
  useEffect(() => {
    const startAudio = () => {
      soundFX.startExperienceAudio();
      setAudioStarted(true);
      setIsMuted(soundFX.isMuted);
      setIsPlayingDisc(soundFX.isPlayingDisc);
    };

    // Attempt immediately
    startAudio();

    // Browser autoplay policy handler: unlock on first user gesture
    const interactionEvents = ["pointerdown", "keydown", "touchstart", "click", "wheel"];
    const handleFirstGesture = () => {
      startAudio();
      interactionEvents.forEach((ev) => window.removeEventListener(ev, handleFirstGesture, true));
    };

    interactionEvents.forEach((ev) =>
      window.addEventListener(ev, handleFirstGesture, { capture: true, passive: true })
    );

    return () => {
      interactionEvents.forEach((ev) => window.removeEventListener(ev, handleFirstGesture, true));
    };
  }, []);

  const closeDrawer = useCallback(() => {
    if (openStation && !visitedStations.includes(openStation.id)) {
      setVisitedStations((prev) => [...prev, openStation.id]);
    }
    setOpenStation(null);
  }, [openStation, visitedStations]);

  // Keyboard interaction handlers (E, J, M, Escape)
  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      const isInteractKey = event.code === "KeyE" || key === "e";
      const isJukeboxKey = event.code === "KeyJ" || key === "j" || event.code === "KeyM" || key === "m";

      // Toggle Jukebox with 'J' or 'M'
      if (isJukeboxKey && !event.target.matches("input, textarea")) {
        event.preventDefault();
        setIsJukeboxOpen((prev) => !prev);
        return;
      }

      // Interact with 'E' (skipped while typing in a form field)
      if (isInteractKey && !event.target.matches("input, textarea, [contenteditable='true']") && !openStation && !isJukeboxOpen) {
        if (isNearJukeboxRef.current && !nearbyStationRef.current) {
          event.preventDefault();
          setIsJukeboxOpen(true);
          return;
        }

        if (nearbyStationRef.current) {
          event.preventDefault();
          const station = nearbyStationRef.current;
          setOpenStation(station);
          if (!visitedStations.includes(station.id)) {
            setVisitedStations((prev) => [...prev, station.id]);
          }
          soundFX.playChestOpen();
        }
      }

      // Close open modals with Escape
      if (event.code === "Escape") {
        setOpenStation(null);
        setSelectedProject(null);
        setIsContactOpen(false);
        setIsJukeboxOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [openStation, isJukeboxOpen, visitedStations]);

  const toggleSound = useCallback(() => {
    setIsMuted(soundFX.toggleMute());
  }, []);

  // Jukebox Actions
  const handleSelectDisc = useCallback((disc) => {
    soundFX.playMusicDisc(disc.id);
    setCurrentDisc(disc);
    setIsPlayingDisc(true);
    setIsMuted(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    soundFX.togglePlayPause();
    setIsPlayingDisc(soundFX.isPlayingDisc);
    setIsMuted(soundFX.isMuted);
  }, []);

  const handleEjectDisc = useCallback(() => {
    soundFX.ejectDisc();
    setCurrentDisc(null);
    setIsPlayingDisc(false);
  }, []);

  const handleTourStation = useCallback((station) => {
    setNearbyStation(station);
    setOpenStation(station);
    if (!visitedStations.includes(station.id)) {
      setVisitedStations((prev) => [...prev, station.id]);
    }
  }, [visitedStations]);

  const handleStationClick = useCallback((station) => {
    setOpenStation(station);
    if (!visitedStations.includes(station.id)) {
      setVisitedStations((prev) => [...prev, station.id]);
    }
  }, [visitedStations]);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-sky-400 text-white font-sans">
      {/* 3D Voxel World Scene */}
      <GameWorld
        onPlayerPosition={setPlayerPosition}
        onNearbyStation={setNearbyStation}
        onSpeedUpdate={setSpeed}
        tourId={tourId}
        paused={Boolean(openStation || isJukeboxOpen)}
        onTourStation={handleTourStation}
        onOpenJukebox={() => setIsJukeboxOpen(true)}
        isPlayingJukebox={isPlayingDisc}
        currentDisc={currentDisc}
        onNearJukebox={setIsNearJukebox}
      />

      {/* Primary HUD with Jukebox Now Playing Widget */}
      <GameHUD
        speed={speed}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        currentDisc={currentDisc}
        isPlayingDisc={isPlayingDisc}
        onOpenJukebox={() => setIsJukeboxOpen(true)}
      />

      {/* Minimap radar in bottom right */}
      <Minimap playerPosition={playerPosition} />

      {/* Quest Station Tracker sidebar */}
      <StationTracker
        currentStation={openStation}
        visitedStations={visitedStations}
        onStationClick={handleStationClick}
      />

      {/* Contextual Interaction Prompts (Station Chest vs Jukebox) */}
      <InteractionPrompt
        station={nearbyStation && !openStation ? nearbyStation : null}
        isNearJukebox={isNearJukebox && !openStation && !isJukeboxOpen}
        onInteractStation={() => nearbyStation && setOpenStation(nearbyStation)}
        onInteractJukebox={() => setIsJukeboxOpen(true)}
      />

      {/* Action-Bar Toast when a new disc starts */}
      <NowPlayingToast currentDisc={currentDisc} isPlaying={isPlayingDisc} />

      {/* Spawn point introductory banner */}
      <BoatBanner playerPosition={playerPosition} />

      {/* Tap anywhere to enable audio banner (disappears as soon as audio starts) */}
      {!audioStarted && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div
            onClick={() => {
              soundFX.startExperienceAudio();
              setAudioStarted(true);
            }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border-3 border-slate-950 bg-emerald-200 px-4 py-2 text-xs font-mono font-black text-slate-950 shadow-[5px_5px_0px_0px_#090d16] cursor-pointer hover:bg-emerald-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] transition"
          >
            <Volume2 className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            <span>CLICK ANYWHERE TO START SOOTHING MUSIC & BIRDS 🕊️</span>
          </div>
        </div>
      )}

      {/* Guided Route CTA Button in Neo-Brutalist Style */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none sm:bottom-20">
        <button
          onClick={() => {
            setOpenStation(null);
            setIsJukeboxOpen(false);
            setTourId((id) => id + 1);
          }}
          className="pointer-events-auto flex items-center gap-2 justify-center rounded-xl border-3 border-slate-950 bg-lime-300 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950 shadow-[5px_5px_0px_0px_#090d16] hover:bg-lime-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#090d16] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer uppercase font-mono whitespace-nowrap"
        >
          <Pickaxe className="h-4 w-4 stroke-[2.5]" />
          <span>Start Guided Portfolio Route ↗</span>
        </button>
      </div>

      {/* Portfolio Station Slide-in Drawer */}
      <Overlays
        station={openStation}
        onClose={closeDrawer}
        onOpenProject={setSelectedProject}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Project Deep-Dive Inspection Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject || isContactOpen)}
        onClose={() => {
          setSelectedProject(null);
          setIsContactOpen(false);
        }}
      />

      {/* Interactive Voxel Jukebox & Music Discs Modal */}
      <JukeboxModal
        isOpen={isJukeboxOpen}
        onClose={() => setIsJukeboxOpen(false)}
        currentDisc={currentDisc}
        isPlaying={isPlayingDisc}
        onSelectDisc={handleSelectDisc}
        onTogglePlay={handleTogglePlay}
        onEject={handleEjectDisc}
      />
    </main>
  );
}
