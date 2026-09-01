"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 3D Minecraft Diamond Pickaxe
function DiamondPickaxe() {
  const diamondMat = new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00f0ff",
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.7,
  });

  const woodStickMat = new THREE.MeshStandardMaterial({
    color: "#78350f",
    roughness: 0.9,
  });

  return (
    <group position={[0, -0.2, -0.3]} rotation={[0.4, 0, 0]}>
      {/* Wood Handle Shaft */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.06, 0.75, 0.06]} />
        <primitive object={woodStickMat} />
      </mesh>

      {/* Diamond Curved Pickaxe Head */}
      <group position={[-0.12, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.1, 0.08]} />
          <primitive object={diamondMat} />
        </mesh>
        {/* Left Tip */}
        <mesh position={[-0.24, -0.06, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <primitive object={diamondMat} />
        </mesh>
        {/* Right Tip */}
        <mesh position={[0.24, -0.06, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <primitive object={diamondMat} />
        </mesh>
      </group>
    </group>
  );
}

export default function VoxelCharacter({
  position = [0, 0, 0],
  velocity = 0,
  steerAngle = 0,
  facing = 0,
  playerRef,
  velocityRef,
  facingRef,
}) {
  const rootRef = useRef();
  const characterRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();

  // Minecraft Player Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: "#d4a373", // Skin tone
    roughness: 0.9,
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: "#451a03", // Brown hair
    roughness: 0.9,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: "#0284c7", // Steve Cyan Shirt
    roughness: 0.85,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: "#1e3a8a", // Blue Jeans
    roughness: 0.85,
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
  });

  const pupilMat = new THREE.MeshStandardMaterial({
    color: "#1d4ed8",
  });

  useFrame((_, delta) => {
    if (!rootRef.current) return;

    if (playerRef) rootRef.current.position.copy(playerRef.current);

    const time = performance.now() * 0.001;
    const speedFactor = Math.min(Math.abs(velocityRef ? velocityRef.current : velocity), 3.0);
    const isMoving = speedFactor > 0.05;

    // Minecraft classic limb swing cycle
    const strideFreq = 8.0 + speedFactor * 4.0;
    const legSwing = isMoving ? Math.sin(time * strideFreq) * (0.45 + speedFactor * 0.2) : 0;
    const armSwing = isMoving ? -Math.sin(time * strideFreq) * (0.45 + speedFactor * 0.2) : 0;

    // Swing legs
    if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;

    // Swing arms (Right arm holds pickaxe with slightly forward tilt)
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing - 0.2;

    // Head subtle bobbing
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 1.5) * 0.08 + steerAngle * 0.3;
    }

    // Walking vertical bobbing
    const stepBob = isMoving ? Math.abs(Math.sin(time * strideFreq)) * 0.06 : Math.sin(time * 2) * 0.01;
    // Keep the character on the voxel column surface; walking animation only
    // adds a small vertical bob instead of resetting the world-space height.
    const groundY = playerRef ? playerRef.current.y : position[1];
    rootRef.current.position.y = groundY + stepBob;

    if (characterRef.current) {
      characterRef.current.rotation.y = facingRef ? facingRef.current : facing;
      characterRef.current.rotation.z = THREE.MathUtils.lerp(
        characterRef.current.rotation.z,
        -steerAngle * 0.25,
        delta * 8
      );
      characterRef.current.rotation.x = THREE.MathUtils.lerp(
        characterRef.current.rotation.x,
        speedFactor * 0.08,
        delta * 6
      );
    }
  });

  return (
    <group ref={rootRef} position={position}>
      <group ref={characterRef}>
        {/* 1. Head (Block Cube with Hair & Eyes) */}
        <group ref={headRef} position={[0, 1.5, 0]}>
          {/* Main Face Cube */}
          <mesh material={skinMat} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          </mesh>

          {/* Brown Hair Helmet */}
          <mesh position={[0, 0.12, -0.02]} material={hairMat}>
            <boxGeometry args={[0.52, 0.3, 0.52]} />
          </mesh>
          <mesh position={[0, 0.22, 0.1]} material={hairMat}>
            <boxGeometry args={[0.52, 0.12, 0.35]} />
          </mesh>

          {/* Left Eye */}
          <mesh position={[-0.12, 0.02, -0.255]} material={eyeMat}>
            <planeGeometry args={[0.09, 0.06]} />
          </mesh>
          <mesh position={[-0.135, 0.02, -0.256]} material={pupilMat}>
            <planeGeometry args={[0.045, 0.06]} />
          </mesh>

          {/* Right Eye */}
          <mesh position={[0.12, 0.02, -0.255]} material={eyeMat}>
            <planeGeometry args={[0.09, 0.06]} />
          </mesh>
          <mesh position={[0.105, 0.02, -0.256]} material={pupilMat}>
            <planeGeometry args={[0.045, 0.06]} />
          </mesh>
        </group>

        {/* 2. Torso (Cyan Shirt) */}
        <group position={[0, 0.95, 0]}>
          <mesh material={shirtMat} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.65, 0.28]} />
          </mesh>
        </group>

        {/* 3. Left Arm */}
        <group ref={leftArmRef} position={[-0.375, 1.2, 0]}>
          {/* Upper Arm Shirt */}
          <mesh position={[0, -0.12, 0]} material={shirtMat} castShadow>
            <boxGeometry args={[0.22, 0.24, 0.24]} />
          </mesh>
          {/* Lower Arm Skin */}
          <mesh position={[0, -0.38, 0]} material={skinMat} castShadow>
            <boxGeometry args={[0.2, 0.32, 0.22]} />
          </mesh>
        </group>

        {/* 4. Right Arm holding Diamond Pickaxe */}
        <group ref={rightArmRef} position={[0.375, 1.2, 0]}>
          <mesh position={[0, -0.12, 0]} material={shirtMat} castShadow>
            <boxGeometry args={[0.22, 0.24, 0.24]} />
          </mesh>
          <mesh position={[0, -0.38, 0]} material={skinMat} castShadow>
            <boxGeometry args={[0.2, 0.32, 0.22]} />
          </mesh>

          {/* Equipped Diamond Pickaxe in hand */}
          <group position={[0.05, -0.42, -0.1]}>
            <DiamondPickaxe />
          </group>
        </group>

        {/* 5. Left Leg (Blue Pants) */}
        <group ref={leftLegRef} position={[-0.135, 0.6, 0]}>
          <mesh position={[0, -0.3, 0]} material={pantsMat} castShadow>
            <boxGeometry args={[0.23, 0.62, 0.26]} />
          </mesh>
        </group>

        {/* 6. Right Leg (Blue Pants) */}
        <group ref={rightLegRef} position={[0.135, 0.6, 0]}>
          <mesh position={[0, -0.3, 0]} material={pantsMat} castShadow>
            <boxGeometry args={[0.23, 0.62, 0.26]} />
          </mesh>
        </group>
      </group>

      {/* Voxel Shadow Plate on Ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, 0.6]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
