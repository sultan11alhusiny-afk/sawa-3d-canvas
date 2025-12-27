import { useRef, useMemo, useState, useEffect } from "react";
import { useTexture, Decal, useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DesignZone, ZoneDecals, DecalSettings } from "@/types/designer";

// Preload the hoodie model for faster initial load
useGLTF.preload("/models/hoodie.glb");

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
  meshRef: React.RefObject<THREE.Mesh | THREE.Group>;
}

// Calculate decal position based on zone and garment type
const getDecalTransform = (zone: DesignZone, settings: DecalSettings, garmentType: string, isGLB: boolean = false) => {
  const baseScale = settings.scale;
  
  // Adjust positions for GLB model (different mesh dimensions)
  const glbScaleFactor = isGLB ? 1.2 : 1;
  
  // Zone-specific positioning
  const zonePositions: Record<DesignZone, { position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }> = {
    front: {
      position: new THREE.Vector3(
        settings.positionX * 0.3 * glbScaleFactor, 
        settings.positionY * 0.4 * glbScaleFactor + (isGLB ? 0.5 : 0), 
        isGLB ? 0.15 : 0.35
      ),
      rotation: new THREE.Euler(0, 0, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.8 * (settings.flipX ? -1 : 1), 
        baseScale * 0.8 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    back: {
      position: new THREE.Vector3(
        settings.positionX * 0.3 * glbScaleFactor, 
        settings.positionY * 0.4 * glbScaleFactor + (isGLB ? 0.5 : 0), 
        isGLB ? -0.15 : -0.35
      ),
      rotation: new THREE.Euler(0, Math.PI, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.8 * (settings.flipX ? -1 : 1), 
        baseScale * 0.8 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    leftSleeve: {
      position: new THREE.Vector3(
        isGLB ? -0.4 : -0.65, 
        (isGLB ? 0.7 : 0.4) + settings.positionY * 0.2, 
        settings.positionX * 0.15
      ),
      rotation: new THREE.Euler(0, -Math.PI / 2, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.4 * (settings.flipX ? -1 : 1), 
        baseScale * 0.4 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    rightSleeve: {
      position: new THREE.Vector3(
        isGLB ? 0.4 : 0.65, 
        (isGLB ? 0.7 : 0.4) + settings.positionY * 0.2, 
        settings.positionX * 0.15
      ),
      rotation: new THREE.Euler(0, Math.PI / 2, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.4 * (settings.flipX ? -1 : 1), 
        baseScale * 0.4 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
  };
  
  return zonePositions[zone];
};

// Individual zone decal component
const ZoneDecalMesh = ({ imageUrl, settings, zone, garmentType, meshRef }: ZoneDecalProps) => {
  const texture = useTexture(imageUrl);
  const isGLB = garmentType === "hoodie";
  const transform = useMemo(
    () => getDecalTransform(zone, settings, garmentType, isGLB),
    [zone, settings, garmentType, isGLB]
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

// GLB Hoodie Model Component
const GLBHoodieModel = ({ 
  color, 
  zoneDecals,
  activeZone,
  onDecalDrag,
  isDraggable = false 
}: Omit<MultiZoneGarmentModelProps, 'type'>) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { scene } = useGLTF("/models/hoodie.glb");
  
  // Clone the scene to avoid modifying the cached version
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Apply color to all meshes in the model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Store reference to main mesh for decals
        if (!meshRef.current) {
          meshRef.current = mesh;
        }
        // Create new material with the selected color
        if (mesh.material) {
          const newMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.8,
            metalness: 0.1,
          });
          mesh.material = newMaterial;
        }
      }
    });
  }, [clonedScene, color]);

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
    if (!isDragging || !onDecalDrag) return;
    e.stopPropagation();

    if (e.intersections.length > 0) {
      const point = e.intersections[0].point;
      let newX: number, newY: number;
      
      if (activeZone === 'front' || activeZone === 'back') {
        newX = Math.max(-1, Math.min(1, point.x / 0.3));
        newY = Math.max(-1, Math.min(1, (point.y - 0.5) / 0.4));
      } else {
        newX = Math.max(-1, Math.min(1, point.z / 0.15));
        newY = Math.max(-1, Math.min(1, (point.y - 0.7) / 0.2));
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

  // Render all zone decals on the model
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
          garmentType="hoodie"
          meshRef={meshRef}
        />
      );
    });
  };

  return (
    <group 
      ref={groupRef}
      scale={[1.8, 1.8, 1.8]}
      position={[0, -1.2, 0]}
      {...interactionProps}
      onPointerOver={() => isDraggable && zoneDecals[activeZone].imageUrl && (document.body.style.cursor = "grab")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <primitive object={clonedScene} />
      {/* Decal container mesh - invisible, used for decal placement */}
      <mesh ref={meshRef} visible={true}>
        <boxGeometry args={[0.5, 1.0, 0.3]} />
        <meshStandardMaterial transparent opacity={0} />
        {renderDecals()}
      </mesh>
    </group>
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
      let newX: number, newY: number;
      
      if (activeZone === 'front' || activeZone === 'back') {
        newX = Math.max(-1, Math.min(1, point.x / 0.5));
        newY = Math.max(-1, Math.min(1, point.y / 0.6));
      } else {
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

  // Render all zone decals for primitive geometry garments
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
          meshRef={meshRef}
        />
      );
    });
  };

  // Use GLB model for hoodie
  if (type === "hoodie") {
    return (
      <GLBHoodieModel
        color={color}
        zoneDecals={zoneDecals}
        activeZone={activeZone}
        onDecalDrag={onDecalDrag}
        isDraggable={isDraggable}
      />
    );
  }

  // Polo model (primitive geometry)
  if (type === "polo") {
    return (
      <group>
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
        
        <mesh position={[0, 1.05, 0.08]}>
          <boxGeometry args={[0.7, 0.25, 0.6]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        <mesh position={[0, 1.18, 0.12]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.65, 0.12, 0.25]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        <mesh position={[-1.05, 0.45, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        <mesh position={[1.05, 0.45, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>
        
        {[0.7, 0.45, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.29]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }

  // T-Shirt (default - primitive geometry)
  return (
    <group>
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
      
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.3, 0.08, 8, 16, Math.PI]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      <mesh position={[-1.05, 0.45, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      
      <mesh position={[1.05, 0.45, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.3, 0.35, 0.7, 16]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </group>
  );
};
