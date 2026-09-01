"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { terrainSurfaceHeight } from "./Track";

// Floating Speech Bubble Billboard
function StationBanner({ station, visible }) {
  return (
    <group position={[0, 3.2, 0]}>
      <Html center distanceFactor={11} style={{ pointerEvents: "none" }}>
        <div className="w-44 rounded-md border-2 bg-slate-950/95 px-2 py-1.5 text-center font-mono shadow-lg" style={{ borderColor: station.color }}>
          <div className="text-[9px] font-bold tracking-wider" style={{ color: station.color }}>STATION {station.level}</div>
          <div className="text-[11px] font-extrabold leading-tight text-white">{station.title}</div>
          {visible && <div className="mt-1 text-[9px] leading-tight text-slate-200">{station.npcSpeech}</div>}
        </div>
      </Html>
    </group>
  );
}

export default function VoxelNPC({ station, playerPos }) {
  const npcRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const isNearRef = useRef(false);

  const skinMat = new THREE.MeshStandardMaterial({ color: "#d4a373", roughness: 0.9 });
  const robeMat = new THREE.MeshStandardMaterial({ color: station.color, roughness: 0.85 });
  const robeBottomMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(station.color).multiplyScalar(0.7),
    roughness: 0.85,
  });
  const hatMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.9 });
  const noseMat = new THREE.MeshStandardMaterial({ color: "#b45309", roughness: 0.9 });

  const [isNear, setIsNear] = React.useState(false);

  useFrame((_, delta) => {
    const t = performance.now() * 0.001;

    // Check proximity
    const dx = playerPos.current.x - station.worldX;
    const dz = playerPos.current.z - station.worldZ;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const near = dist < 7;

    if (near !== isNearRef.current) {
      isNearRef.current = near;
      setIsNear(near);
    }

    // Idle head bobbing and look toward player
    if (headRef.current) {
      headRef.current.rotation.y = near
        ? THREE.MathUtils.lerp(headRef.current.rotation.y, Math.atan2(dx, dz) + Math.PI, delta * 4)
        : Math.sin(t * 1.2) * 0.25;
    }

    // Arm wave when player is near
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = near ? Math.sin(t * 4) * 0.6 - 0.4 : Math.sin(t * 0.8) * 0.15;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = near ? -Math.sin(t * 4 + 0.5) * 0.3 : 0;
    }

    // NPC body gentle idle sway
    if (npcRef.current) {
      npcRef.current.rotation.y = Math.sin(t * 0.6) * 0.08;
      npcRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group position={[station.worldX, terrainSurfaceHeight(station.worldX, station.worldZ - 3.5), station.worldZ - 3.5]} scale={1.25}>
      <group ref={npcRef}>
        {/* Speech Bubble */}
        <StationBanner station={station} visible={isNear} />

        {/* Head */}
        <group ref={headRef} position={[0, 1.7, 0]}>
          <mesh material={skinMat} castShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
          </mesh>
          {/* Hat */}
          <mesh position={[0, 0.3, 0]} material={hatMat}>
            <boxGeometry args={[0.6, 0.12, 0.6]} />
          </mesh>
          <mesh position={[0, 0.5, 0]} material={hatMat}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
          </mesh>
          {/* Big voxel nose */}
          <mesh position={[0, -0.02, -0.3]} material={noseMat}>
            <boxGeometry args={[0.14, 0.14, 0.14]} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.13, 0.05, -0.28]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.13, 0.05, -0.28]}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* Torso Robe */}
        <mesh position={[0, 1.05, 0]} material={robeMat} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.35]} />
        </mesh>

        {/* Robe Bottom */}
        <mesh position={[0, 0.52, 0]} material={robeBottomMat} castShadow>
          <boxGeometry args={[0.58, 0.55, 0.38]} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.4, 1.3, 0]}>
          <mesh position={[0, -0.22, 0]} material={robeMat} castShadow>
            <boxGeometry args={[0.2, 0.5, 0.22]} />
          </mesh>
          <mesh position={[0, -0.52, 0]} material={skinMat}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.4, 1.3, 0]}>
          <mesh position={[0, -0.22, 0]} material={robeMat} castShadow>
            <boxGeometry args={[0.2, 0.5, 0.22]} />
          </mesh>
          <mesh position={[0, -0.52, 0]} material={skinMat}>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
          </mesh>
        </group>

        {/* Glow light tint for station color */}
      </group>
    </group>
  );
}
