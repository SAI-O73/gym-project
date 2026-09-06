import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Sparkles, Torus, Icosahedron } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function EnergyRing({ color, radius, rotation, speed, opacity }) {
  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.8}>
      <Torus args={[radius, 0.012, 16, 96]} rotation={rotation}>
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </Torus>
    </Float>
  );
}

function HologramBars() {
  const bars = [0.5, 0.8, 0.62, 1, 0.72, 0.9];
  return (
    <group position={[2.65, -0.85, 0.1]} rotation={[0.08, -0.2, -0.05]}>
      {bars.map((height, index) => (
        <mesh key={index} position={[index * 0.18 - 0.45, height * 0.35, 0]}>
          <boxGeometry args={[0.1, height * 0.7, 0.06]} />
          <meshBasicMaterial color={index % 2 ? '#b026ff' : '#22d3ee'} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[1.15, 0.025, 0.05]} />
        <meshBasicMaterial color="#ff2bd6" transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Dumbbell({ position, rotation, color }) {
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      <group position={position} rotation={rotation}>
        <mesh>
          <cylinderGeometry args={[0.045, 0.045, 0.8, 16]} />
          <meshBasicMaterial color="#dffcff" transparent opacity={0.75} toneMapped={false} />
        </mesh>
        {[-0.42, 0.42].map((x) => (
          <group key={x} position={[0, x, 0]}>
            <mesh>
              <boxGeometry args={[0.24, 0.12, 0.12]} />
              <meshBasicMaterial color={color} transparent opacity={0.88} toneMapped={false} />
            </mesh>
            <mesh position={[0, x > 0 ? 0.09 : -0.09, 0]}>
              <boxGeometry args={[0.28, 0.05, 0.15]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function SceneContents({ pointer }) {
  const group = useRef();

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.current.x * 0.16, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * 0.1, 3, delta);
  });

  return (
    <group ref={group}>
      <Sparkles count={95} scale={[13, 8, 7]} size={2} speed={0.25} color="#a7f3ff" />
      <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.45}>
        <Icosahedron args={[1.05, 2]} position={[-2.4, 1.05, -0.2]}>
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.2} toneMapped={false} />
        </Icosahedron>
      </Float>
      <EnergyRing color="#22d3ee" radius={1.85} rotation={[1.35, 0.25, 0.2]} speed={1.2} opacity={0.42} />
      <EnergyRing color="#b026ff" radius={2.25} rotation={[0.3, 1.2, 0.7]} speed={0.8} opacity={0.32} />
      <EnergyRing color="#ff2bd6" radius={2.7} rotation={[1.9, 0.1, 1.2]} speed={0.6} opacity={0.25} />
      <Dumbbell position={[-3.2, -1.15, 0.4]} rotation={[0.2, 0.2, 0.7]} color="#b026ff" />
      <Dumbbell position={[3.15, 1.35, -0.4]} rotation={[0.3, -0.3, -0.5]} color="#ff2bd6" />
      <HologramBars />
    </group>
  );
}

export default function LoginScene() {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <div
      className="login-scene"
      onPointerMove={(event) => {
        pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#030308']} />
        <fog attach="fog" args={['#030308', 5, 13]} />
        <SceneContents pointer={pointer} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
      <div className="login-scene-grid" />
      <div className="login-scene-vignette" />
    </div>
  );
}
