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
    const ctx = canvas.getContext("2d");
    let frame;
    const draw = (time) => {
      const scale = canvas.width / WORLD_SIZE;
      const map = (value) => canvas.width / 2 + value * scale;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw circular background
      ctx.fillStyle = "#0369a1";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Clip to circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw island (green circle)
      ctx.fillStyle = "#3f8f3f";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 36 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw beach border
      ctx.fillStyle = "#d4a76a";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#d4a76a";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 32 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Draw lake
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Draw stations
      PORTFOLIO_DATA.checkpoints.forEach((station) => {
        ctx.fillStyle = station.color;
        ctx.beginPath();
        ctx.arc(map(station.worldX), map(station.worldZ), 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw player
      const player = playerRef.current;
      ctx.fillStyle = Math.floor(time / 400) % 2 ? "#ffffff" : "#d9f99d";
      ctx.beginPath();
      ctx.arc(map(player.x), map(player.z), 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw circular border
      ctx.strokeStyle = "#2c2c2c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      ctx.stroke();

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} width="160" height="160" aria-label="Island minimap" className="fixed bottom-5 right-5 z-40 h-36 w-36 rounded-full border-4 border-[#2c2c2c] bg-sky-900 shadow-2xl sm:h-40 sm:w-40" />;
}
