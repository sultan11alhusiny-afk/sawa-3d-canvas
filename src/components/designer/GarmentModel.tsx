import { useRef, useMemo, useState } from "react";
import { useTexture, Decal } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface DecalConfig {
  imageUrl: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface GarmentModelProps {
  color: string;
  type: string;
  decal?: DecalConfig | null;
  onDecalDrag?: (x: number, y: number) => void;
  isDraggable?: boolean;
}

export const GarmentModel = ({ 
  color, 
  type, 
  decal, 
  onDecalDrag,
  isDraggable = false 
}: GarmentModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera } = useThree();

  // Load decal texture if provided
  const decalTexture = useTexture(decal?.imageUrl || "/placeholder.svg");

  const materialProps = useMemo(
    () => ({
      color: color,
      roughness: 0.8,
      metalness: 0.1,
    }),
    [color]
  );

  // Calculate decal position based on garment type and user settings
  const decalPosition = useMemo(() => {
    if (!decal) return new THREE.Vector3(0, 0, 0.45);
    const x = decal.position.x * 0.6;
    const y = decal.position.y * 0.8;
    return new THREE.Vector3(x, y, 0.45);
  }, [decal]);

  const decalRotation = useMemo(() => {
    if (!decal) return new THREE.Euler(0, 0, 0);
    return new THREE.Euler(0, 0, THREE.MathUtils.degToRad(decal.rotation));
  }, [decal]);

  const decalScale = useMemo(() => {
    if (!decal) return new THREE.Vector3(0.8, 0.8, 1);
    const s = decal.scale;
    return new THREE.Vector3(s, s, 1);
  }, [decal]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isDraggable || !decal?.imageUrl) return;
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !onDecalDrag || !meshRef.current) return;
    e.stopPropagation();

    // Get intersection point on the mesh
    const intersects = e.intersections.filter(
      (i) => i.object === meshRef.current
    );
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Convert 3D point to normalized position (-1 to 1)
      const newX = Math.max(-1, Math.min(1, point.x / 0.6));
      const newY = Math.max(-1, Math.min(1, point.y / 0.8));
      onDecalDrag(newX, newY);
    }
  };

  const interactionProps = isDraggable && decal?.imageUrl ? {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerUp,
  } : {};

  const cursorStyle = isDraggable && decal?.imageUrl 
    ? (isDragging ? "grabbing" : "grab") 
    : "auto";

  if (type === "hoodie") {
    return (
      <group>
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          {...interactionProps}
          onPointerOver={() => isDraggable && decal?.imageUrl && (document.body.style.cursor = "grab")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <boxGeometry args={[2, 2.5, 0.8]} />
          <meshStandardMaterial {...materialProps} />
          {decal?.imageUrl && (
            <Decal
              position={decalPosition}
              rotation={decalRotation}
              scale={decalScale}
              map={decalTexture}
              polygonOffsetFactor={-1}
            />
          )}
        </mesh>
        <mesh position={[0, 1.5, -0.2]}>
          <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[-1.3, 0.3, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.3, 0.35, 1.5, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[1.3, 0.3, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.3, 0.35, 1.5, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, -0.5, 0.42]}>
          <boxGeometry args={[1.2, 0.5, 0.05]} />
          <meshStandardMaterial color="#000" opacity={0.3} transparent />
        </mesh>
      </group>
    );
  }

  if (type === "polo") {
    return (
      <group>
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          {...interactionProps}
          onPointerOver={() => isDraggable && decal?.imageUrl && (document.body.style.cursor = "grab")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <boxGeometry args={[2, 2.2, 0.6]} />
          <meshStandardMaterial {...materialProps} />
          {decal?.imageUrl && (
            <Decal
              position={decalPosition}
              rotation={decalRotation}
              scale={decalScale}
              map={decalTexture}
              polygonOffsetFactor={-1}
            />
          )}
        </mesh>
        <mesh position={[0, 1.15, 0.1]}>
          <boxGeometry args={[0.8, 0.3, 0.65]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[0, 1.3, 0.15]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.7, 0.15, 0.3]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[-1.15, 0.5, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        <mesh position={[1.15, 0.5, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        {[0.8, 0.5, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.32]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  // T-Shirt (default)
  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={[0, 0, 0]}
        {...interactionProps}
        onPointerOver={() => isDraggable && decal?.imageUrl && (document.body.style.cursor = "grab")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[2, 2.2, 0.6]} />
        <meshStandardMaterial {...materialProps} />
        {decal?.imageUrl && (
          <Decal
            position={decalPosition}
            rotation={decalRotation}
            scale={decalScale}
            map={decalTexture}
            polygonOffsetFactor={-1}
          />
        )}
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.35, 0.1, 8, 16, Math.PI]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[-1.15, 0.5, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      <mesh position={[1.15, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};
