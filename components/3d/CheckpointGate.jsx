"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import VoxelChest from "./VoxelChest";
import { terrainSurfaceHeight, VoxelTorch } from "./Track";

const Block = ({ position, size, color, emissive }) => <mesh position={position} castShadow receiveShadow>
  <boxGeometry args={size} />
  <meshStandardMaterial color={color} emissive={emissive || "#000000"} emissiveIntensity={emissive ? 1.5 : 0} roughness={.82} />
</mesh>;

function AboutStation() {
  return <group>{/* Rohit's home-office cabin */}
    <Block position={[0, .25, 0]} size={[6, .5, 5]} color="#78350f" />
    {[-2.6, 2.6].flatMap((x) => [-2, 2].map((z) => <Block key={`${x}-${z}`} position={[x, 2, z]} size={[.45, 4, .45]} color="#854d0e" />))}
    <Block position={[0, 4, 0]} size={[6, .45, 5]} color="#a16207" />
    <Block position={[0, 1.15, .45]} size={[2.2, .2, 1.2]} color="#854d0e" />
    <Block position={[0, 1.75, .7]} size={[1.35, .85, .12]} color="#0f172a" emissive="#22c55e" />
    <Block position={[-1.7, 2.1, 2.2]} size={[1.5, 1.1, .15]} color="#166534" emissive="#22c55e" />
  </group>;
}

function SkillsStation() {
  return <group>{/* Enchanting-library skill altar */}
    <Block position={[0, .35, 0]} size={[3, .7, 3]} color="#171717" />
    <Block position={[0, .8, 0]} size={[2.2, .18, 2.2]} color="#7f1d1d" emissive="#3b82f6" />
    {[-3, 3].map((x) => <group key={x}><Block position={[x, 1.4, 0]} size={[1.1, 2.8, 2.8]} color="#713f12" /><Block position={[x, 1.4, -1.43]} size={[.8, 1.8, .08]} color="#2563eb" emissive="#60a5fa" /></group>)}
    <Block position={[0, 2.1, 0]} size={[1.3, .18, .9]} color="#fef3c7" emissive="#60a5fa" />
  </group>;
}

function ExperienceStation() {
  return <group>{/* Trophy vault / career monument */}
    <Block position={[0, .25, 0]} size={[7, .5, 4]} color="#3f3f46" />
    {[-2.7, 2.7].map((x) => <Block key={x} position={[x, 2, 0]} size={[.8, 4, .8]} color="#52525b" />)}
    <Block position={[0, 3.8, 0]} size={[6.2, .8, .8]} color="#52525b" />
    {[-1.35, 0, 1.35].map((x, index) => <group key={x}><Block position={[x, 1.1, .25]} size={[.8, 1.2 + index * .35, .8]} color="#713f12" /><Block position={[x, 2 + index * .35, .25]} size={[.38, .38, .38]} color="#facc15" emissive="#facc15" /></group>)}
  </group>;
}

function ToolkitStation() {
  return <group>{/* Crafting workshop / technology toolkit */}
    <Block position={[0, .7, 0]} size={[3.2, 1.4, 3.2]} color="#854d0e" />
    <Block position={[0, 1.46, 0]} size={[3.25, .12, 3.25]} color="#d97706" />
    {[-.8, 0, .8].flatMap((x) => [-.8, 0, .8].map((z) => <Block key={`${x}-${z}`} position={[x, 1.55, z]} size={[.55, .08, .55]} color="#fbbf24" />))}
    <Block position={[-2.2, .75, .2]} size={[.8, 1.5, .8]} color="#27272a" />
    <Block position={[2.2, 1.15, .2]} size={[.18, 2.3, .18]} color="#94a3b8" emissive="#f59e0b" />
    <Block position={[2.2, 2.25, .2]} size={[.9, .18, .18]} color="#94a3b8" />
  </group>;
}

function ProjectsStation() {
  return <group>{/* Portal for projects and contact */}
    <Block position={[0, .25, 0]} size={[6, .5, 3]} color="#18181b" />
    {[-1.8, 1.8].map((x) => <Block key={x} position={[x, 2.3, 0]} size={[.7, 4.6, .7]} color="#181125" emissive="#7e22ce" />)}
    <Block position={[0, 4.35, 0]} size={[4.2, .7, .7]} color="#181125" emissive="#7e22ce" />
    <mesh position={[0, 2.3, -.04]}><planeGeometry args={[2.9, 3.6]} /><meshBasicMaterial color="#ec4899" transparent opacity={.78} /></mesh>
    <Block position={[0, .9, 1.35]} size={[1.1, 1.1, 1.1]} color="#312e81" emissive="#ec4899" />
  </group>;
}

function StationStructure({ id }) {
  if (id === 1) return <AboutStation />;
  if (id === 2) return <SkillsStation />;
  if (id === 3) return <ExperienceStation />;
  if (id === 4) return <ToolkitStation />;
  return <ProjectsStation />;
}

export default function CheckpointGate({ checkpoint, playerPosition }) {
  const y = useMemo(() => terrainSurfaceHeight(checkpoint.worldX, checkpoint.worldZ), [checkpoint]);
  const [isOpen, setIsOpen] = useState(false);
  const wasNear = useRef(false);
  useFrame(() => {
    const near = Math.hypot(playerPosition.current.x - checkpoint.worldX, playerPosition.current.z - checkpoint.worldZ) < 5;
    if (near !== wasNear.current) { wasNear.current = near; setIsOpen(near); }
  });
  return <group position={[checkpoint.worldX, y, checkpoint.worldZ]}>
    <StationStructure id={checkpoint.id} />
    <VoxelChest position={[0, 0, -2.25]} isOpen={isOpen} color={checkpoint.id === 5 ? "#312e81" : checkpoint.id === 2 ? "#1d4ed8" : "#854d0e"} />
    <VoxelTorch position={[-2.7, 0, -2.4]} />
    <VoxelTorch position={[2.7, 0, -2.4]} />
  </group>;
}
