import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useNotesStore, useUIStore } from '../../stores';
import type { Note } from '../../data/notes';

// Planet component for each note
function Planet({
  note,
  position,
  isSelected,
  onSelect
}: {
  note: Note;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    switch (note.category) {
      case 'solana': return '#00d4ff';
      case 'evm': return '#ff6b9d';
      case 'trading': return '#ffd700';
      default: return '#00ff88';
    }
  }, [note.category]);

  const size = 0.3 + (note.content.length / 5000) * 0.3;
  const brightness = 0.3 + (note.progress / 100) * 0.7;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered || isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={(hovered || isSelected) ? 0.15 : 0.05}
        />
      </mesh>

      {/* Main planet */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={brightness * 0.5}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Label */}
      {(hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, size + 0.5, 0]}>
          <div className="bg-nebula/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-plasma-blue/30 whitespace-nowrap">
            <div className="font-space text-sm text-starlight">{note.title}</div>
            <div className="text-xs text-starlight/50 font-mono">{note.category}</div>
            {note.progress > 0 && (
              <div className="mt-1 w-full h-1 bg-void rounded-full overflow-hidden">
                <div
                  className="h-full bg-matrix-green rounded-full"
                  style={{ width: `${note.progress}%` }}
                />
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection lines between related notes
function Connections({ notes }: { notes: Note[] }) {
  const lines = useMemo(() => {
    const result: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];

    notes.forEach((note, i) => {
      note.connections.forEach(connId => {
        const connIndex = notes.findIndex(n => n.id === connId);
        if (connIndex > i) {
          const startPos = getPosition(i, notes.length);
          const endPos = getPosition(connIndex, notes.length);
          result.push({
            start: startPos,
            end: endPos,
            color: '#00d4ff'
          });
        }
      });
    });

    return result;
  }, [notes]);

  return (
    <>
      {lines.map((line, i) => {
        const points = new Float32Array([...line.start, ...line.end]);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));

        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: line.color, transparent: true, opacity: 0.2 }))} />
        );
      })}
    </>
  );
}

// Calculate position for each note in 3D space
function getPosition(index: number, total: number): [number, number, number] {
  const radius = 5;
  const angle = (index / total) * Math.PI * 2;
  const y = ((index % 3) - 1) * 1.5;
  return [
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius
  ];
}

// Stars background
function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 12), 0.02);
  });

  return null;
}

// Main Universe component
export function KnowledgeUniverse() {
  const { notes, currentNoteId, setCurrentNote } = useNotesStore();
  const { setCurrentView } = useUIStore();

  const handlePlanetSelect = (noteId: string) => {
    setCurrentNote(noteId);
    setCurrentView('notes');
  };

  const positions = useMemo(() => {
    return notes.map((_, i) => getPosition(i, notes.length));
  }, [notes]);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <color attach="background" args={['#0a0a12']} />
        <fog attach="fog" args={['#0a0a12', 10, 50]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b9d" />

        <Stars />
        <Connections notes={notes} />

        {notes.map((note, i) => (
          <Planet
            key={note.id}
            note={note}
            position={positions[i]}
            isSelected={currentNoteId === note.id}
            onSelect={() => handlePlanetSelect(note.id)}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.3}
        />
        <CameraController />
      </Canvas>

      {/* Overlay UI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
      >
        <h2 className="font-space text-2xl gradient-text mb-2">Knowledge Universe</h2>
        <p className="text-starlight/50 text-sm font-mono">
          Click on a planet to explore • Drag to rotate • Scroll to zoom
        </p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 glass rounded-lg p-4"
      >
        <h3 className="font-space text-sm text-starlight mb-3">Categories</h3>
        <div className="space-y-2">
          {[
            { label: 'Solana', color: 'bg-plasma-blue' },
            { label: 'EVM', color: 'bg-nova-pink' },
            { label: 'Trading', color: 'bg-solar-gold' },
            { label: 'Other', color: 'bg-matrix-green' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-starlight/70">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 glass rounded-lg p-4"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="font-orbitron text-2xl text-plasma-blue">{notes.length}</div>
            <div className="text-xs text-starlight/50">Planets</div>
          </div>
          <div>
            <div className="font-orbitron text-2xl text-matrix-green">
              {notes.reduce((sum, n) => sum + n.connections.length, 0)}
            </div>
            <div className="text-xs text-starlight/50">Connections</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
