"use client";

import { useEffect, useRef } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

const WORLD_SIZE = 80;

export default function Minimap({ playerPosition }) {
  const canvasRef = useRef(null);
  const playerRef = useRef(playerPosition);

  useEffect(() => {
    playerRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;

    const draw = (time) => {
      const scale = canvas.width / WORLD_SIZE;
      const map = (value) => canvas.width / 2 + value * scale;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Neo-brutalist ocean base
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw beach border
      ctx.fillStyle = "#d4a76a";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 36 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw island grass circle
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 32 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw lake
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 7 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw stations with crisp black outline
      PORTFOLIO_DATA.checkpoints.forEach((station) => {
        const sx = map(station.worldX);
        const sz = map(station.worldZ);

        ctx.fillStyle = "#090d16";
        ctx.beginPath();
        ctx.arc(sx, sz, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = station.color;
        ctx.beginPath();
        ctx.arc(sx, sz, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Jukebox position on map (x: 4, z: 34)
      const jx = map(4);
      const jz = map(34);
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(jx - 3, jz - 3, 6, 6);
      ctx.strokeStyle = "#090d16";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(jx - 3, jz - 3, 6, 6);

      // Draw player blinking marker
      const player = playerRef.current;
      const px = map(player.x);
      const pz = map(player.z);

      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.arc(px, pz, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = Math.floor(time / 350) % 2 ? "#ffffff" : "#facc15";
      ctx.beginPath();
      ctx.arc(px, pz, 4, 0, Math.PI * 2);
      ctx.fill();

      // Outer crisp black canvas border
      ctx.strokeStyle = "#090d16";
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 font-mono select-none pointer-events-none">
      <div className="rounded-2xl border-4 border-slate-950 bg-white p-1 shadow-[6px_6px_0px_0px_#090d16]">
        <div className="mb-1 flex items-center justify-between px-1 text-[9px] font-black uppercase text-slate-950">
          <span>RADAR // OVERWORLD</span>
          <span className="text-emerald-600">ONLINE</span>
        </div>
        <canvas
          ref={canvasRef}
          width="150"
          height="150"
          aria-label="Island minimap"
          className="h-32 w-32 rounded-xl sm:h-36 sm:w-36 block"
        />
      </div>
    </div>
  );
}
