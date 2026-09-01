"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTFOLIO_DATA } from "@/data/portfolioData";

// Simple wave-based terrain height function (no external noise library needed)
export function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.18) * Math.cos(z * 0.15) * 1.8 +
    Math.sin(x * 0.08 + z * 0.11) * 1.2 +
    Math.cos(x * 0.12 - z * 0.09) * 0.8
  );
}

// Terrain is assembled from 2x2 voxel columns. Snap walkers to the same column
// surface so their feet never interpolate into the sides of a block.
export function terrainSurfaceHeight(x, z) {
  const voxelX = Math.round(x / 2) * 2;
  const voxelZ = Math.round(z / 2) * 2;
  return Math.max(0, terrainHeight(voxelX, voxelZ));
}

// Animated Water Plane
function WaterPlane() {
  const waterRef = useRef();
  useFrame(() => {
    const t = performance.now() * 0.001;
    if (waterRef.current) {
      waterRef.current.material.opacity = 0.72 + Math.sin(t * 1.8) * 0.08;
    }
  });

  return (
    <mesh ref={waterRef} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[18, 14, 1, 1]} />
      <meshStandardMaterial
        color="#38bdf8"
        transparent
        opacity={0.72}
        roughness={0.05}
        metalness={0.4}
      />
    </mesh>
  );
}

// Voxel Oak / Birch Tree
function VoxelTree({ position, isBirch = false, scale = 1 }) {
  const trunkColor = isBirch ? "#d4d4d4" : "#78350f";
  const leafColor = isBirch ? "#a3e635" : "#15803d";
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.7, 3, 0.7]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <boxGeometry args={[3.0, 1.0, 3.0]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[2.2, 0.9, 2.2]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.9, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 1.2]} />
        <meshStandardMaterial color={leafColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

// Voxel Torch
export function VoxelTorch({ position }) {
  const flameRef = useRef();
  useFrame(() => {
    const time = performance.now() * 0.001;
    if (flameRef.current) {
      flameRef.current.position.y = 0.87 + Math.sin(time * 9 + position[0]) * 0.035;
      flameRef.current.scale.y = 0.85 + Math.sin(time * 12 + position[2]) * 0.2;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.12, 0.75, 0.12]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <group ref={flameRef} position={[0, 0.87, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.28, 0.22]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={3.5} />
        </mesh>
        <mesh position={[0, .06, -.02]}>
          <boxGeometry args={[0.11, 0.19, 0.11]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={4} />
        </mesh>
      </group>
    </group>
  );
}

function PineTree({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <mesh position={[0, 1.3, 0]} castShadow><cylinderGeometry args={[.22, .3, 2.6, 6]} /><meshStandardMaterial color="#78350f" /></mesh>
    {[2.1, 2.9, 3.7].map((y, i) => <mesh key={y} position={[0, y, 0]} castShadow><coneGeometry args={[1.45 - i * .28, 1.8, 6]} /><meshStandardMaterial color={i === 2 ? "#166534" : "#14532d"} /></mesh>)}
  </group>;
}

function RockCluster({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <mesh position={[-.55, .35, 0]} rotation={[0, .3, .1]} castShadow><dodecahedronGeometry args={[.7, 0]} /><meshStandardMaterial color="#64748b" roughness={1} /></mesh>
    <mesh position={[.45, .25, .25]} rotation={[.2, .1, 0]} castShadow><dodecahedronGeometry args={[.5, 0]} /><meshStandardMaterial color="#475569" roughness={1} /></mesh>
  </group>;
}

function FallenLog({ position, rotation = 0 }) {
  return <group position={position} rotation={[0, rotation, .12]}>
    <mesh position={[0, .35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[.3, .38, 2.8, 6]} /><meshStandardMaterial color="#713f12" /></mesh>
    <mesh position={[1.45, .35, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[.22, .22, .05, 6]} /><meshStandardMaterial color="#d6d3d1" /></mesh>
  </group>;
}

function LakeDetails() {
  const lilyPads = [[-6, -4], [5, -3], [-4, 4], [6, 3]];
  const reeds = [[-8, 0], [8, 1], [-7, 5], [7, -5]];
  return <group>
    {lilyPads.map(([x, z], i) => <mesh key={`lily-${i}`} position={[x, .18, z]} rotation={[-Math.PI / 2, 0, i]}><circleGeometry args={[.55, 6]} /><meshStandardMaterial color="#4d7c0f" /></mesh>)}
    {reeds.flatMap(([x, z], i) => [0, 1, 2].map((offset) => <mesh key={`reed-${i}-${offset}`} position={[x + offset * .18, .7, z + offset * .12]}><cylinderGeometry args={[.035, .05, 1.4, 5]} /><meshStandardMaterial color="#65a30d" /></mesh>))}
    <group position={[0, .2, 8]}>
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => <mesh key={x} position={[x, 0, 0]}><boxGeometry args={[1, .18, 2.3]} /><meshStandardMaterial color="#a16207" roughness={.9} /></mesh>)}
      <mesh position={[0, -.28, 1]}><boxGeometry args={[6.5, .18, .18]} /><meshStandardMaterial color="#78350f" /></mesh>
    </group>
  </group>;
}

function Fireflies() {
  const groupRef = useRef();
  useFrame(() => {
    const t = performance.now() * .001;
    const cycle = (t * .0033) % 1;
    if (groupRef.current) {
      groupRef.current.visible = cycle > .68 || cycle < .08;
      groupRef.current.children.forEach((child, i) => {
        child.position.y = 1.5 + Math.sin(t * 1.6 + i) * .5;
        child.position.x += Math.sin(t * .7 + i) * .001;
      });
    }
  });
  const positions = [[-16, 21], [-20, 24], [-12, 26], [18, 22], [22, 25], [25, 20], [-24, -21], [-19, -24]];
  return <group ref={groupRef}>{positions.map(([x, z], i) => <mesh key={i} position={[x, 1.5, z]}><sphereGeometry args={[.09, 6, 6]} /><meshBasicMaterial color="#bef264" /></mesh>)}</group>;
}

function Pathways() {
  const paths = useMemo(() => PORTFOLIO_DATA.checkpoints.flatMap((station) => {
    const start = new THREE.Vector2(station.worldX, station.worldZ).normalize().multiplyScalar(9);
    const count = Math.ceil(start.distanceTo(new THREE.Vector2(station.worldX, station.worldZ)) / 2);
    return Array.from({ length: count + 1 }, (_, i) => {
      const p = new THREE.Vector2().lerpVectors(start, new THREE.Vector2(station.worldX, station.worldZ), i / count);
      return [Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2];
    });
  }), []);
  return <group>{paths.map(([x, z], i) => <mesh key={`path-${i}`} position={[x, terrainSurfaceHeight(x, z) + .08, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[1.7, 1.7]} /><meshStandardMaterial color={i % 3 ? "#78716c" : "#a8a29e"} roughness={1} /></mesh>)}</group>;
}

function Clouds() {
  return <group position={[0, 28, 0]}>
    {[-80, -35, 20, 70].map((x, i) => <group key={x} position={[x, (i % 2) * 3, -55 - i * 18]}>
      {[0, 1, 2].map((j) => <mesh key={j} position={[j * 5, Math.sin(j) * 1.5, 0]}><boxGeometry args={[8, 2.4, 5]} /><meshStandardMaterial color="#f8fafc" transparent opacity={.22} depthWrite={false} /></mesh>)}
    </group>)}
  </group>;
}

function VoxelBoat() {
  const wavingArm = useRef();
  useFrame(() => {
    if (wavingArm.current) wavingArm.current.rotation.z = -.35 + Math.sin(performance.now() * .006) * .45;
  });
  return <group position={[0, .15, 40]} rotation={[0, .35, 0]} scale={1.7}>
    <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[6, .55, 2]} /><meshStandardMaterial color="#78350f" roughness={.9} /></mesh>
    <mesh position={[0, .35, 0]}><boxGeometry args={[4.8, .25, 1.5]} /><meshStandardMaterial color="#a16207" /></mesh>
    <mesh position={[0, 1.8, 0]}><boxGeometry args={[.16, 3, .16]} /><meshStandardMaterial color="#451a03" /></mesh>
    <mesh position={[.9, 2, 0]} rotation={[0, 0, -.08]}><planeGeometry args={[2.2, 2.4]} /><meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} /></mesh>
    {/* Signal flag */}
    <mesh position={[.75, 3.05, 0]} rotation={[0, 0, -.08]}><planeGeometry args={[1.25, .75]} /><meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, .95, 0]}><boxGeometry args={[1.8, .7, 1.2]} /><meshStandardMaterial color="#b45309" /></mesh>
    <mesh position={[0, 1.35, 0]}><boxGeometry args={[1.2, .22, 1]} /><meshStandardMaterial color="#facc15" /></mesh>
    {/* Waving deck passenger */}
    <group position={[-1.25, 1.2, 0]}>
      <mesh position={[0, .65, 0]}><boxGeometry args={[.42, .55, .42]} /><meshStandardMaterial color="#d4a373" /></mesh>
      <mesh position={[0, .18, 0]}><boxGeometry args={[.5, .6, .32]} /><meshStandardMaterial color="#2563eb" /></mesh>
      <mesh ref={wavingArm} position={[.38, .45, 0]}><mesh position={[0, .35, 0]}><boxGeometry args={[.16, .7, .16]} /><meshStandardMaterial color="#d4a373" /></mesh></mesh>
    </group>
    {/* Visible lantern flames and warm boat lights */}
    <VoxelTorch position={[-2.2, .55, -.72]} />
    <VoxelTorch position={[2.2, .55, -.72]} />
  </group>;
}

// Blocky Voxel Bird
function VoxelBird({ index }) {
  const birdRef = useRef();
  const speed = 0.3 + index * 0.07;
  const radius = 16 + index * 5;
  const height = 18 + index * 3;

  useFrame(() => {
    const t = performance.now() * 0.001;
    if (birdRef.current) {
      birdRef.current.position.x = Math.cos(t * speed + index * 2.1) * radius;
      birdRef.current.position.z = Math.sin(t * speed + index * 2.1) * radius;
      birdRef.current.position.y = height + Math.sin(t * 2 + index) * 0.8;
      birdRef.current.rotation.y = -(t * speed + index * 2.1) + Math.PI / 2;
    }
  });

  return (
    <group ref={birdRef}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.5, 0.2, 0.2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Left Wing */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Right Wing */}
      <mesh position={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

// Small Island in Ocean
function OceanIsland({ position, hasTree = false, size = 1 }) {
  return (
    <group position={position}>
      {/* Island terrain - larger voxel blocks */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) =>
        [-3, -1.5, 0, 1.5, 3].map((z, j) => {
          const dist = Math.sqrt(x * x + z * z);
          if (dist > 4.5) return null;
          const h = size * 2.5 * (1 - dist * 0.15);
          return (
            <mesh key={`${i}-${j}`} position={[x, h / 2, z]} castShadow receiveShadow>
              <boxGeometry args={[1.4, Math.max(0.3, h), 1.4]} />
              <meshStandardMaterial
                color={dist < 1.8 ? "#16a34a" : "#d4a76a"}
                roughness={0.88}
              />
            </mesh>
          );
        })
      )}
      {/* Multiple trees on island */}
      {hasTree && (
        <>
          <VoxelTree position={[-1.8, size * 2.5, -1.2]} scale={0.65} isBirch={false} />
          <VoxelTree position={[1.5, size * 2.5, -0.8]} scale={0.65} isBirch={true} />
          <VoxelTree position={[-0.8, size * 2.3, 1.5]} scale={0.6} isBirch={false} />
          <VoxelTree position={[1.8, size * 2.3, 1.0]} scale={0.6} isBirch={true} />
          <VoxelTree position={[0, size * 2.4, -0.2]} scale={0.55} isBirch={false} />
        </>
      )}
    </group>
  );
}

// Wrecked Boat
function WreckedBoat({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0.3]}>
      {/* Boat hull - tilted and broken */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[4.5, 0.8, 1.8]} />
        <meshStandardMaterial color="#654321" roughness={0.95} />
      </mesh>
      {/* Broken mast */}
      <mesh position={[-0.5, 1.5, 0]}>
        <boxGeometry args={[0.2, 2.2, 0.2]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      {/* Torn sail fragment */}
      <mesh position={[-0.8, 1.8, 0.1]} rotation={[0.3, 0.2, 0.4]}>
        <planeGeometry args={[1.5, 1.8]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Damaged planks floating */}
      <mesh position={[1.8, -0.1, -0.8]} rotation={[0.2, -0.5, 0.1]}>
        <boxGeometry args={[1.2, 0.15, 0.4]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[-1.8, -0.15, 0.9]} rotation={[-0.3, 0.6, 0.15]}>
        <boxGeometry args={[1.0, 0.15, 0.35]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Barrel - Floating wooden barrel
function Barrel({ position, index }) {
  const barrelRef = useRef();
  useFrame(() => {
    if (barrelRef.current) {
      const t = performance.now() * 0.001;
      barrelRef.current.position.y = position[1] + Math.sin(t * 1.6 + index) * 0.2;
      barrelRef.current.rotation.x += 0.001;
    }
  });
  return (
    <group ref={barrelRef} position={[position[0], position[1], position[2]]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.8, 8]} />
        <meshStandardMaterial color="#8b6914" roughness={0.9} />
      </mesh>
      {/* Metal band */}
      <mesh position={[0, 0.25, 0]}>
        <torusGeometry args={[0.48, 0.08, 6, 16]} />
        <meshStandardMaterial color="#6b4423" roughness={0.8} />
      </mesh>
      {/* Top lid */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 8]} />
        <meshStandardMaterial color="#6b4423" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Treasure Chest - Sunken treasure
function TreasureChest({ position }) {
  return (
    <group position={position}>
      {/* Chest body */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.7]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      {/* Curved lid */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.25, 0.4, 0.75]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Gold detail */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.0, 0.3, 0.5]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      {/* Lock */}
      <mesh position={[0, 0.3, 0.37]}>
        <boxGeometry args={[0.25, 0.25, 0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// Driftwood Log - Natural floating debris
function DriftwoodLog({ position, rotation, index }) {
  const logRef = useRef();
  useFrame(() => {
    if (logRef.current) {
      const t = performance.now() * 0.001;
      logRef.current.position.y = position[1] + Math.sin(t * 1.2 + index) * 0.15;
      logRef.current.rotation.y += 0.0005;
    }
  });
  return (
    <group ref={logRef} position={[position[0], position[1], position[2]]} rotation={[rotation[0], rotation[1], rotation[2]]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.28, 2.2, 8]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.95} />
      </mesh>
      {/* Bark detail */}
      <mesh position={[0, 0, 1.1]}>
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshStandardMaterial color="#3d2817" roughness={1} />
      </mesh>
    </group>
  );
}

export default function VoxelIsland() {
  // Procedurally generate the terrain tiles
  const terrainTiles = useMemo(() => {
    const tiles = [];
  const islandRadius = 36;

    for (let x = -islandRadius; x <= islandRadius; x += 2) {
      for (let z = -islandRadius; z <= islandRadius; z += 2) {
        // Circular island shape
        const dist = Math.sqrt(x * x + z * z);
        if (dist > islandRadius) continue;

        // Skip lake area
        if (Math.abs(x) < 10 && Math.abs(z) < 8) continue;

        const h = terrainHeight(x, z);
        const isBeach = dist > islandRadius - 10;
        const color = isBeach ? "#d4a76a" : h > 1.5 ? "#71717a" : "#16a34a";
        const sideColor = isBeach ? "#92400e" : "#78350f";

        tiles.push({ x, z, h: Math.max(0, h), color, sideColor, isBeach });
      }
    }
    return tiles;
  }, []);

  // Generate trees
  const trees = useMemo(() => {
    const list = [];
    const positions = [
      [-8, -32], [8, -30], [-12, -24], [14, -22], [-5, -18],
      [32, -10], [30, 8], [-30, -8], [-32, 12], [20, 28],
      [-18, 30], [8, 32], [-10, 28], [15, 14], [-15, 12],
      [22, -28], [-20, -26], [5, 24], [-6, 22], [28, 20],
    ];
    positions.forEach(([x, z], i) => {
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 34) return;
      const h = Math.max(0, terrainHeight(x, z));
      list.push({ x, y: h, z, scale: 0.8 + (i % 4) * 0.1, isBirch: i % 3 === 0 });
    });
    return list;
  }, []);

  // Torches along paths near stations
  const torches = useMemo(() => [
    [0, -20], [0, -24], [20, -12], [24, -14],
    [20, 12], [24, 14], [-20, 12], [-24, 14],
    [-20, -12], [-24, -14],
  ], []);

  return (
    <group>
      {/* Terrain Tiles */}
      {terrainTiles.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2 - 0.5, t.z]} receiveShadow castShadow>
          <boxGeometry args={[2.1, Math.max(0.5, t.h + 1), 2.1]} />
          <meshStandardMaterial color={t.color} roughness={0.88} metalness={0.05} />
        </mesh>
      ))}

      {/* Animated Water Lake */}
      <WaterPlane />
      <LakeDetails />
      <Pathways />

      {/* Decorative lake shore sand */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 18]} />
        <meshStandardMaterial color="#d4a76a" roughness={0.9} />
      </mesh>

      {/* Outer Ocean Water (beyond island) */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.3} />
      </mesh>
      <VoxelBoat />

      {/* Ocean Scenery: Wrecked Boats */}
      {[
        { pos: [0, -80], type: "wreck" },
        { pos: [80, 0], type: "wreck" },
        { pos: [-80, 0], type: "wreck" },
        { pos: [0, 80], type: "wreck" },
        { pos: [60, -60], type: "wreck" },
        { pos: [-60, 60], type: "wreck" },
        { pos: [70, 50], type: "wreck" },
        { pos: [-70, -50], type: "wreck" },
      ].map(({ pos, type }, i) => {
        const [x, z] = pos;
        return (
          <group key={`ocean-feature-${i}`}>
            {type === "wreck" && <WreckedBoat position={[x, 0.05, z]} rotation={i * 0.5} />}
          </group>
        );
      })}



      {/* Barrels */}
      {[
        [30, -65], [-60, -40], [55, 25], [-35, 60], [65, -30], [-50, 45], [40, 50], [-45, -55],
      ].map(([x, z], i) => (
        <Barrel key={`barrel-${i}`} position={[x, 0.25, z]} index={i} />
      ))}

      {/* Treasure Chests */}
      {[
        [45, -50], [-70, 30], [60, 40], [-40, -60], [25, 55],
      ].map(([x, z], i) => (
        <TreasureChest key={`chest-${i}`} position={[x, -0.5, z]} />
      ))}

      {/* Driftwood Logs */}
      {[
        [35, -60, [0, 0, 0.3]],
        [-65, 45, [0, Math.PI / 4, 0.2]],
        [55, 35, [0, -Math.PI / 6, 0.15]],
        [-30, -50, [0, Math.PI / 3, 0.25]],
        [50, 15, [0, -Math.PI / 2, 0.1]],
        [-55, 50, [0, Math.PI / 5, 0.2]],
      ].map(([x, z, rot], i) => (
        <DriftwoodLog key={`log-${i}`} position={[x, 0.2, z]} rotation={rot} index={i} />
      ))}

      {/* Voxel Trees */}
      {trees.map((t, i) => (
        <VoxelTree key={`tree-${i}`} position={[t.x, t.y, t.z]} scale={t.scale} isBirch={t.isBirch} />
      ))}

      {/* Biome accents: pine corner, flower meadow, rocky hill, portal clearing */}
      {[-22, -18, -14, -10].map((x, i) => <PineTree key={`pine-${i}`} position={[x, terrainSurfaceHeight(x, -23), -23 + (i % 2) * 3]} scale={.8 + i * .08} />)}
      {[[23, 22], [27, 24], [29, 18], [20, 26], [25, 28]].map(([x, z], i) => <RockCluster key={`rock-${i}`} position={[x, terrainSurfaceHeight(x, z), z]} scale={.8 + i * .12} />)}
      <FallenLog position={[-8, terrainSurfaceHeight(-8, 23), 23]} rotation={.5} />
      <FallenLog position={[14, terrainSurfaceHeight(14, 26), 26]} rotation={-0.8} />

      {/* Pathway Torches */}
      {torches.map(([x, z], i) => {
        const h = Math.max(0, terrainHeight(x, z));
        return <VoxelTorch key={`torch-${i}`} position={[x, h, z]} />;
      })}

      <Fireflies />
      <Clouds />

      {/* Voxel Birds */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <VoxelBird key={`bird-${i}`} index={i} />
      ))}
    </group>
  );
}
