import { useRef, useMemo, useState } from "react";
import { useTexture, Decal } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { DesignZone, ZoneDecals, DecalSettings } from "@/types/designer";

interface MultiZoneGarmentModelProps {
  color: string;
  type: string;
  zoneDecals: ZoneDecals;
  activeZone: DesignZone;
  onDecalDrag?: (zone: DesignZone, x: number, y: number) => void;
  isDraggable?: boolean;
}

interface ZoneDecalProps {
  imageUrl: string;
  settings: DecalSettings;
  zone: DesignZone;
  garmentType: string;
}

// Calculate decal position based on zone and garment type
const getDecalTransform = (zone: DesignZone, settings: DecalSettings, garmentType: string) => {
  const baseScale = settings.scale;
  
  // Zone-specific positioning
  const zonePositions: Record<DesignZone, { position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }> = {
    front: {
      position: new THREE.Vector3(settings.positionX * 0.5, settings.positionY * 0.6, 0.35),
      rotation: new THREE.Euler(0, 0, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * (settings.flipX ? -1 : 1), 
        baseScale * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    back: {
      position: new THREE.Vector3(settings.positionX * 0.5, settings.positionY * 0.6, -0.35),
      rotation: new THREE.Euler(0, Math.PI, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * (settings.flipX ? -1 : 1), 
        baseScale * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    leftSleeve: {
      position: new THREE.Vector3(-0.65, 0.4 + settings.positionY * 0.3, settings.positionX * 0.2),
      rotation: new THREE.Euler(0, -Math.PI / 2, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.5 * (settings.flipX ? -1 : 1), 
        baseScale * 0.5 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    rightSleeve: {
      position: new THREE.Vector3(0.65, 0.4 + settings.positionY * 0.3, settings.positionX * 0.2),
      rotation: new THREE.Euler(0, Math.PI / 2, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.5 * (settings.flipX ? -1 : 1), 
        baseScale * 0.5 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
  };
  
  return zonePositions[zone];
};

// Individual zone decal component
const ZoneDecalMesh = ({ imageUrl, settings, zone, garmentType }: ZoneDecalProps) => {
  const texture = useTexture(imageUrl);
  const transform = useMemo(
    () => getDecalTransform(zone, settings, garmentType),
    [zone, settings, garmentType]
  );

  return (
    <Decal
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
      map={texture}
      polygonOffsetFactor={-1}
    />
  );
};

export const MultiZoneGarmentModel = ({ 
  color, 
  type,
  zoneDecals,
  activeZone,
  onDecalDrag,
  isDraggable = false 
}: MultiZoneGarmentModelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  const materialProps = useMemo(
    () => ({
      color: color,
      roughness: 0.8,
      metalness: 0.1,
    }),
    [color]
  );

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isDraggable || !zoneDecals[activeZone].imageUrl) return;
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !onDecalDrag || !meshRef.current) return;
    e.stopPropagation();

    const intersects = e.intersections.filter(
      (i) => i.object === meshRef.current
    );
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Convert based on zone
      let newX: number, newY: number;
      
      if (activeZone === 'front' || activeZone === 'back') {
        newX = Math.max(-1, Math.min(1, point.x / 0.5));
        newY = Math.max(-1, Math.min(1, point.y / 0.6));
      } else {
        // For sleeves, X controls depth, Y controls height
        newX = Math.max(-1, Math.min(1, point.z / 0.2));
        newY = Math.max(-1, Math.min(1, (point.y - 0.4) / 0.3));
      }
      
      onDecalDrag(activeZone, newX, newY);
    }
  };

  const interactionProps = isDraggable && zoneDecals[activeZone].imageUrl ? {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerUp,
  } : {};

  // Render all zone decals
  const renderDecals = () => {
    return (Object.keys(zoneDecals) as DesignZone[]).map((zone) => {
      const decal = zoneDecals[zone];
      if (!decal.imageUrl) return null;
      return (
        <ZoneDecalMesh
          key={zone}
          imageUrl={decal.imageUrl}
          settings={decal.settings}
          zone={zone}
          garmentType={type}
        />
      );
    });
  };

  // Hoodie model
  if (type === "hoodie") {
    return (
      <group>
        {/* Main body */}
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          {...interactionProps}
          onPointerOver={() => isDraggable && zoneDecals[activeZone].imageUrl && (document.body.style.cursor = "grab")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <boxGeometry args={[1.8, 2.2, 0.7]} />
          <meshStandardMaterial {...materialProps} />
          {renderDecals()}
        </mesh>
        
        {/* Hood */}
        <mesh position={[0, 1.35, -0.15]}>
          <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Left sleeve */}
        <mesh position={[-1.15, 0.3, 0]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.25, 0.3, 1.3, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Right sleeve */}
        <mesh position={[1.15, 0.3, 0]} rotation={[0, 0, 0.25]}>
          <cylinderGeometry args={[0.25, 0.3, 1.3, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Pocket */}
        <mesh position={[0, -0.45, 0.37]}>
          <boxGeometry args={[1.0, 0.45, 0.04]} />
          <meshStandardMaterial color="#000" opacity={0.2} transparent />
        </mesh>
      </group>
    );
  }

  // Polo model
  if (type === "polo") {
    return (
      <group>
        {/* Main body */}
        <mesh 
          ref={meshRef} 
          position={[0, 0, 0]}
          {...interactionProps}
          onPointerOver={() => isDraggable && zoneDecals[activeZone].imageUrl && (document.body.style.cursor = "grab")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <boxGeometry args={[1.8, 2.0, 0.55]} />
          <meshStandardMaterial {...materialProps} />
          {renderDecals()}
        </mesh>
        
        {/* Collar base */}
        <mesh position={[0, 1.05, 0.08]}>
          <boxGeometry args={[0.7, 0.25, 0.6]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Collar fold */}
        <mesh position={[0, 1.18, 0.12]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.65, 0.12, 0.25]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Left sleeve */}
        <mesh position={[-1.05, 0.45, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Right sleeve */}
        <mesh position={[1.05, 0.45, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {/* Buttons */}
        {[0.7, 0.45, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.29]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  // T-Shirt (default)
  return (
    <group>
      {/* Main body */}
      <mesh 
        ref={meshRef} 
        position={[0, 0, 0]}
        {...interactionProps}
        onPointerOver={() => isDraggable && zoneDecals[activeZone].imageUrl && (document.body.style.cursor = "grab")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <boxGeometry args={[1.8, 2.0, 0.55]} />
        <meshStandardMaterial {...materialProps} />
        {renderDecals()}
      </mesh>
      
      {/* Neck opening */}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.3, 0.08, 8, 16, Math.PI]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Left sleeve */}
      <mesh position={[-1.05, 0.45, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      {/* Right sleeve */}
      <mesh position={[1.05, 0.45, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};
