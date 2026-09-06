"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { terrainSurfaceHeight } from "./Track";

// Floating 3D Musical Note Particle
function MusicalNote({ offset, color, isPlaying }) {
  const noteRef = useRef();
  const speed = 0.8 + Math.random() * 0.4;
  const initialPhase = offset * Math.PI * 0.4;

  useFrame(() => {
    if (!isPlaying || !noteRef.current) return;
    const t = performance.now() * 0.001 * speed + initialPhase;
    const heightProgress = (t % 2.5) / 2.5; // 0 to 1

    noteRef.current.position.y = 1.2 + heightProgress * 2.2;
    noteRef.current.position.x = Math.sin(t * 2.0) * (0.3 + heightProgress * 0.6);
    noteRef.current.position.z = Math.cos(t * 1.8) * (0.3 + heightProgress * 0.6);
    noteRef.current.rotation.y = t * 1.5;
    noteRef.current.rotation.z = Math.sin(t * 3.0) * 0.2;

    // Fade out as it rises
    const opacity = heightProgress < 0.2 ? heightProgress / 0.2 : 1 - (heightProgress - 0.2) / 0.8;
    if (noteRef.current.material) {
      noteRef.current.material.opacity = Math.max(0, opacity * 0.9);
    }
  });

  return (
    <group ref={noteRef} visible={isPlaying} position={[0, 1.2, 0]}>
      {/* Voxel Note Head */}
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} transparent />
      </mesh>
      {/* Voxel Note Stem */}
      <mesh position={[-0.04, 0.16, 0]}>
        <boxGeometry args={[0.04, 0.24, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} transparent />
      </mesh>
      {/* Voxel Note Flag */}
      <mesh position={[0.04, 0.26, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} transparent />
      </mesh>
    </group>
  );
}

// 3D Spinning Vinyl Record
function SpinningRecord({ isPlaying, discColor = "#10b981" }) {
  const recordRef = useRef();

  useFrame(() => {
    if (!recordRef.current) return;
    if (isPlaying) {
      recordRef.current.rotation.y += 0.04;
    }
  });

  return (
    <group ref={recordRef} position={[0, 1.05, 0]}>
      {/* Vinyl Disc Outer Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Colored Vinyl Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 24]} />
        <meshStandardMaterial color={discColor} roughness={0.4} emissive={discColor} emissiveIntensity={0.6} />
      </mesh>
      {/* Center Spindle Label */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.01, 16]} />
        <meshStandardMaterial color="#fef08a" roughness={0.6} />
      </mesh>
      {/* Center Hole */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Lit Fence Torch
function VoxelFenceTorch({ position }) {
  return (
    <group position={position}>
      {/* Fence post */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.22, 1.0, 0.22]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Torch stick */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Torch flame head */}
      <mesh position={[0, 1.38, 0]}>
        <boxGeometry args={[0.14, 0.12, 0.14]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3.2} />
      </mesh>
      <pointLight position={[0, 1.45, 0]} color="#f59e0b" intensity={2.2} distance={6} />
    </group>
  );
}

export default function VoxelJukebox({
  position = [4, 0, 34],
  playerPosition,
  onOpenJukebox,
  isPlaying = false,
  currentDisc = null,
  onNearJukebox,
}) {
  const jukeboxGroupRef = useRef();
  const lightRef = useRef();
  const isNearRef = useRef(false);

  // Compute terrain Y height
  const [posX, , posZ] = position;
  const groundY = useMemo(() => terrainSurfaceHeight(posX, posZ), [posX, posZ]);

  // Note particle colors (Minecraft multi-color notes)
  const noteColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4"];

  useFrame(() => {
    // Proximity check with player
    if (playerPosition?.current) {
      const dx = playerPosition.current.x - posX;
      const dz = playerPosition.current.z - posZ;
      const dist = Math.hypot(dx, dz);
      const near = dist <= 6.0;

      if (near !== isNearRef.current) {
        isNearRef.current = near;
        onNearJukebox?.(near);
      }
    }

    // Gentle light pulse when playing
    if (lightRef.current && isPlaying) {
      const t = performance.now() * 0.005;
      lightRef.current.intensity = 2.0 + Math.sin(t * 4) * 0.8;
    }
  });

  return (
    <group position={[posX, groundY, posZ]} ref={jukeboxGroupRef}>
      {/* Cobblestone Pedestal */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.3, 2.4]} />
        <meshStandardMaterial color="#475569" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Decorative Redstone Corner Trim */}
      <mesh position={[0, 0.32, 0]} receiveShadow>
        <boxGeometry args={[1.8, 0.05, 1.8]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.8} />
      </mesh>

      {/* JUKEBOX MAIN BLOCK */}
      <group
        position={[0, 0.85, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onOpenJukebox?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {/* Main Body (Dark Oak / Walnut Planks) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 1.0, 1.1]} />
          <meshStandardMaterial color="#5c3214" roughness={0.85} />
        </mesh>

        {/* Top Rim & Disc Platform */}
        <mesh position={[0, 0.51, 0]}>
          <boxGeometry args={[1.05, 0.04, 1.05]} />
          <meshStandardMaterial color="#783c1d" roughness={0.7} />
        </mesh>

        {/* Center Diamond / Inlay (from craft recipe) */}
        <mesh position={[0, 0.53, 0]}>
          <boxGeometry args={[0.22, 0.02, 0.22]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
        </mesh>

        {/* Jukebox Record Slot Hole */}
        <mesh position={[0, 0.54, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.38, 16]} />
          <meshBasicMaterial color="#1c1917" />
        </mesh>

        {/* Front Brass Speaker Grill Inset */}
        <mesh position={[0, 0, 0.56]}>
          <boxGeometry args={[0.65, 0.55, 0.04]} />
          <meshStandardMaterial color="#361f12" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.58]}>
          <boxGeometry args={[0.55, 0.45, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Spinning Vinyl Record when playing */}
        {isPlaying && <SpinningRecord isPlaying={isPlaying} discColor={currentDisc?.discColor || "#10b981"} />}

        {/* Floating Musical Notes Fountain */}
        {noteColors.map((col, idx) => (
          <MusicalNote key={idx} offset={idx} color={col} isPlaying={isPlaying} />
        ))}

        {/* Interactive Floating Label Badge */}
        <group position={[0, 1.8, 0]}>
          <mesh>
            <planeGeometry args={[2.0, 0.45]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.85} side={THREE.DoubleSide} />
          </mesh>
          <pointLight ref={lightRef} position={[0, 0.5, 0]} color={currentDisc?.color || "#f59e0b"} intensity={isPlaying ? 2.5 : 0.8} distance={6} />
        </group>
      </group>

      {/* Two Decorative Pathway Torches */}
      <VoxelFenceTorch position={[-1.3, 0, 0]} />
      <VoxelFenceTorch position={[1.3, 0, 0]} />
    </group>
  );
}
