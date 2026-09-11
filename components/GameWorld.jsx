"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PORTFOLIO_DATA } from "@/data/portfolioData";
import VoxelCharacter from "./3d/Vehicle";
import VoxelIsland, { terrainSurfaceHeight } from "./3d/Track";
import CheckpointGate from "./3d/CheckpointGate";
import EnvironmentFX from "./3d/EnvironmentFX";
import VoxelNPC from "./3d/VoxelNPC";
import VoxelJukebox from "./3d/VoxelJukebox";
import { soundFX } from "@/utils/soundFX";

const MAX_WORLD_COORDINATE = 33;

function WorldScene({
  onPlayerPosition,
  onNearbyStation,
  onSpeedUpdate,
  tourId = 0,
  paused = false,
  onTourStation,
  onOpenJukebox,
  isPlayingJukebox = false,
  currentDisc = null,
  onNearJukebox,
  touchRef,
}) {
  const { camera, gl } = useThree();
  const player = useRef(new THREE.Vector3(0, 1.2, 40));
  const keys = useRef(new Set());
  const yaw = useRef(0);
  const targetYaw = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const nearbyId = useRef(null);
  const velocity = useRef(0);
  const movementVelocity = useRef(new THREE.Vector3());
  const jumpOffset = useRef(0);
  const jumpVelocity = useRef(0);
  const lastPublished = useRef(0);
  const routeIndex = useRef(0);
  const routeActive = useRef(false);
  const lastFootstep = useRef(0);

  useEffect(() => {
    if (tourId) {
      routeIndex.current = 0;
      routeActive.current = true;
    }
  }, [tourId]);

  useEffect(() => {
    const down = (event) => {
      // Ignore game controls while the user is typing in a form field
      // (e.g. the "Parchment" contact form) so letters like W/A/S/D and
      // space are not stolen by the movement/jump handlers.
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest?.("input, textarea, [contenteditable='true']"));

      if (isTyping) {
        keys.current.delete(event.code);
        return;
      }

      if (["KeyW", "KeyA", "KeyS", "KeyD"].includes(event.code)) {
        event.preventDefault();
        keys.current.add(event.code);
      }
      if (event.code === "Space") {
        event.preventDefault();
        if (jumpOffset.current <= 0) jumpVelocity.current = 6.2;
      }
    };
    const up = (event) => keys.current.delete(event.code);
    const blur = () => keys.current.clear();
    const pointerDown = (event) => {
      dragging.current = true;
      lastPointerX.current = event.clientX;
      gl.domElement.setPointerCapture?.(event.pointerId);
    };
    const pointerMove = (event) => {
      if (!dragging.current) return;
      yaw.current -= (event.clientX - lastPointerX.current) * 0.008;
      lastPointerX.current = event.clientX;
    };
    const pointerUp = () => { dragging.current = false; };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    gl.domElement.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      gl.domElement.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const direction = new THREE.Vector3();
    if (keys.current.has("KeyW")) direction.add(forward);
    if (keys.current.has("KeyS")) direction.sub(forward);
    if (keys.current.has("KeyD")) direction.add(right);
    if (keys.current.has("KeyA")) direction.sub(right);

    // Touch joystick (mobile): x = strafe (+right), y = forward (+up)
    const stick = touchRef?.current?.stick || [0, 0];
    const [stickX, stickY] = stick;
    if (!routeActive.current && (stickX !== 0 || stickY !== 0)) {
      direction.addScaledVector(right, stickX);
      direction.addScaledVector(forward, stickY);
    }

    // Touch jump button (mobile): consume one-shot per press
    if (touchRef?.current?.jump && jumpOffset.current <= 0) {
      jumpVelocity.current = 6.2;
      touchRef.current.jump = false;
    }

    if (routeActive.current && !paused) {
      const station = PORTFOLIO_DATA.checkpoints[routeIndex.current];
      if (station) {
        const target = new THREE.Vector3(station.worldX, 0, station.worldZ);
        
        direction.copy(target).sub(player.current).setY(0);
        const distance = direction.length();
        if (distance < 6) {
          routeIndex.current += 1;
          onTourStation?.(station);
          if (routeIndex.current >= PORTFOLIO_DATA.checkpoints.length) routeActive.current = false;
          direction.set(0, 0, 0);
        } else {
          direction.normalize();
          yaw.current = Math.atan2(-direction.x, -direction.z);
          keys.current.clear();
        }
      }
    }
    const maxSpeed = routeActive.current ? 5 : 8;
    // Analog joystick scales speed by stick magnitude; keyboard uses full speed
    const stickMag = Math.hypot(stickX, stickY);
    const speedScale = stickMag > 0.01 ? stickMag : 1;
    const targetVelocity = direction.lengthSq() > 0
      ? direction.normalize().multiplyScalar(maxSpeed * speedScale)
      : new THREE.Vector3();
    // Smooth acceleration and deceleration with better interpolation
    movementVelocity.current.lerp(targetVelocity, 1 - Math.exp(-delta * 20));
    if (movementVelocity.current.lengthSq() < 0.0001) movementVelocity.current.set(0, 0, 0);
    player.current.x = THREE.MathUtils.clamp(player.current.x + movementVelocity.current.x * delta, -MAX_WORLD_COORDINATE, MAX_WORLD_COORDINATE);
    player.current.z = THREE.MathUtils.clamp(player.current.z + movementVelocity.current.z * delta, -MAX_WORLD_COORDINATE, MAX_WORLD_COORDINATE);
    
    // Smooth ground height transition
    const targetGroundY = terrainSurfaceHeight(player.current.x, player.current.z);
    // Directly use the target ground height to prevent conflicting physics updates
    const groundY = targetGroundY;

    if (jumpVelocity.current !== 0 || jumpOffset.current > 0) {
      jumpVelocity.current -= 16 * delta;
      jumpOffset.current += jumpVelocity.current * delta;
      if (jumpOffset.current <= 0) {
        jumpOffset.current = 0;
        jumpVelocity.current = 0;
      }
    }
    player.current.y = groundY + 0.08 + jumpOffset.current;
    
    velocity.current = THREE.MathUtils.lerp(velocity.current, movementVelocity.current.length(), 1 - Math.exp(-delta * 6));

    if (velocity.current > 1.2 && jumpOffset.current <= 0.05) {
      const now = performance.now();
      if (now - lastFootstep.current > 380) {
        lastFootstep.current = now;
        soundFX.playFootstep();
      }
    }

    const desiredCamera = player.current.clone().addScaledVector(forward, -7).add(new THREE.Vector3(0, 4.5, 0));
    camera.position.lerp(desiredCamera, 1 - Math.exp(-delta * 5));
    camera.lookAt(player.current.clone().addScaledVector(forward, 5).add(new THREE.Vector3(0, 1.4, 0)));

    const closest = PORTFOLIO_DATA.checkpoints.reduce((best, station) => {
      // Calculate distance to the Station Gate
      const distToGate = Math.hypot(player.current.x - station.worldX, player.current.z - station.worldZ);
      // Calculate distance to the NPC (positioned at Z - 3)
      const distToNPC = Math.hypot(player.current.x - station.worldX, player.current.z - (station.worldZ - 3));
      
      // Use the smaller of the two distances
      const distance = Math.min(distToGate, distToNPC);
      
      return !best || distance < best.distance ? { station, distance } : best;
    }, null);
    const nextNearby = closest?.distance <= 7 ? closest.station : null;
    if (nearbyId.current !== nextNearby?.id) {
      nearbyId.current = nextNearby?.id ?? null;
      onNearbyStation?.(nextNearby);
    }
    const now = performance.now();
    if (now - lastPublished.current > 50) {
      lastPublished.current = now;
      onPlayerPosition?.({ x: player.current.x, z: player.current.z, yaw: yaw.current });
      onSpeedUpdate?.(velocity.current * 8);
    }
  });

  return <>
    <EnvironmentFX />
    <VoxelIsland />
    {PORTFOLIO_DATA.checkpoints.map((station) => <CheckpointGate key={station.id} checkpoint={station} playerPosition={player} />)}
    {PORTFOLIO_DATA.checkpoints.map((station) => <VoxelNPC key={`npc-${station.id}`} station={station} playerPos={player} />)}
    <VoxelJukebox
      position={[4, 0, 34]}
      playerPosition={player}
      onOpenJukebox={onOpenJukebox}
      isPlaying={isPlayingJukebox}
      currentDisc={currentDisc}
      onNearJukebox={onNearJukebox}
    />
    <VoxelCharacter playerRef={player} velocityRef={velocity} facingRef={yaw} />
  </>;
}

export default function GameWorld(props) {
  return <div className="fixed inset-0 z-0 h-full w-full touch-none">
    <Canvas shadows="percentage" camera={{ position: [0, 5, 27], fov: 55, near: 0.1, far: 250 }} dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}>
      <WorldScene {...props} />
    </Canvas>
  </div>;
}
