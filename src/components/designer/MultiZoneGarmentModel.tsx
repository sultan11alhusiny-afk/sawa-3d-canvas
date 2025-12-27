import { useRef, useMemo, useState, useEffect } from "react";
import { useTexture, Decal, useGLTF } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DesignZone, ZoneDecals, DecalSettings } from "@/types/designer";

// Preload the hoodie model for faster initial load
useGLTF.preload("/models/hoodie.glb");

// Target height in Three.js units for normalized clothing (approximately 2 units tall)
const TARGET_MODEL_HEIGHT = 2.2;

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
  modelBounds: { width: number; height: number; depth: number };
}

interface ModelBounds {
  width: number;
  height: number;
  depth: number;
  center: THREE.Vector3;
  scale: number;
}

// Calculate normalized model bounds and scale
const calculateModelBounds = (scene: THREE.Object3D): ModelBounds => {
  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  
  box.getSize(size);
  box.getCenter(center);
  
  // Calculate scale to normalize to target height
  const scale = TARGET_MODEL_HEIGHT / size.y;
  
  return {
    width: size.x * scale,
    height: size.y * scale,
    depth: size.z * scale,
    center: center,
    scale: scale,
  };
};

// Calculate decal position based on zone and model bounds
const getDecalTransform = (
  zone: DesignZone, 
  settings: DecalSettings, 
  modelBounds: { width: number; height: number; depth: number }
) => {
  const baseScale = settings.scale;
  
  // Use model bounds for accurate positioning
  const halfWidth = modelBounds.width * 0.25;
  const halfHeight = modelBounds.height * 0.25;
  const frontOffset = modelBounds.depth * 0.52;
  const sleeveOffset = modelBounds.width * 0.4;
  
  const zonePositions: Record<DesignZone, { position: THREE.Vector3; rotation: THREE.Euler; scale: THREE.Vector3 }> = {
    front: {
      position: new THREE.Vector3(
        settings.positionX * halfWidth, 
        settings.positionY * halfHeight + 0.15, 
        frontOffset
      ),
      rotation: new THREE.Euler(0, 0, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.7 * (settings.flipX ? -1 : 1), 
        baseScale * 0.7 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    back: {
      position: new THREE.Vector3(
        settings.positionX * halfWidth, 
        settings.positionY * halfHeight + 0.15, 
        -frontOffset
      ),
      rotation: new THREE.Euler(0, Math.PI, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.7 * (settings.flipX ? -1 : 1), 
        baseScale * 0.7 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    leftSleeve: {
      position: new THREE.Vector3(
        -sleeveOffset, 
        0.35 + settings.positionY * 0.15, 
        settings.positionX * 0.1
      ),
      rotation: new THREE.Euler(0, -Math.PI / 2, THREE.MathUtils.degToRad(settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.35 * (settings.flipX ? -1 : 1), 
        baseScale * 0.35 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
    rightSleeve: {
      position: new THREE.Vector3(
        sleeveOffset, 
        0.35 + settings.positionY * 0.15, 
        settings.positionX * 0.1
      ),
      rotation: new THREE.Euler(0, Math.PI / 2, THREE.MathUtils.degToRad(-settings.rotation)),
      scale: new THREE.Vector3(
        baseScale * 0.35 * (settings.flipX ? -1 : 1), 
        baseScale * 0.35 * (settings.flipY ? -1 : 1), 
        1
      ),
    },
  };
  
  return zonePositions[zone];
};

// Individual zone decal component
const ZoneDecalMesh = ({ imageUrl, settings, zone, garmentType, modelBounds }: ZoneDecalProps) => {
  const texture = useTexture(imageUrl);
  const transform = useMemo(
    () => getDecalTransform(zone, settings, modelBounds),
    [zone, settings, modelBounds]
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

// GLB Hoodie Model Component with auto-scaling and centering
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
  const [modelBounds, setModelBounds] = useState<ModelBounds | null>(null);
  
  const { scene } = useGLTF("/models/hoodie.glb");
  const { viewport } = useThree();
  
  // Clone the scene to avoid modifying the cached version
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Calculate bounds and normalize on first load
  useEffect(() => {
    const bounds = calculateModelBounds(clonedScene);
    setModelBounds(bounds);
    
    // Log model info for debugging
    console.log("Model bounds calculated:", {
      originalSize: `${(bounds.width / bounds.scale).toFixed(2)} x ${(bounds.height / bounds.scale).toFixed(2)} x ${(bounds.depth / bounds.scale).toFixed(2)}`,
      normalizedSize: `${bounds.width.toFixed(2)} x ${bounds.height.toFixed(2)} x ${bounds.depth.toFixed(2)}`,
      scale: bounds.scale.toFixed(3),
      center: `(${bounds.center.x.toFixed(2)}, ${bounds.center.y.toFixed(2)}, ${bounds.center.z.toFixed(2)})`,
    });
  }, [clonedScene]);
  
  // Apply color to all meshes in the model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!meshRef.current) {
          meshRef.current = mesh;
        }
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

  // Responsive scale factor based on viewport
  const responsiveScale = useMemo(() => {
    // Base scale from model normalization
    const baseScale = modelBounds?.scale || 1;
    
    // Adjust for viewport (smaller screens get slightly smaller models)
    const viewportFactor = Math.min(1, viewport.width / 6);
    
    return baseScale * viewportFactor;
  }, [modelBounds, viewport.width]);

  // Center offset to position model at origin
  const centerOffset = useMemo(() => {
    if (!modelBounds) return new THREE.Vector3(0, 0, 0);
    return new THREE.Vector3(
      -modelBounds.center.x * modelBounds.scale,
      -modelBounds.center.y * modelBounds.scale,
      -modelBounds.center.z * modelBounds.scale
    );
  }, [modelBounds]);

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
    if (!isDragging || !onDecalDrag || !modelBounds) return;
    e.stopPropagation();

    if (e.intersections.length > 0) {
      const point = e.intersections[0].point;
      let newX: number, newY: number;
      
      const halfWidth = modelBounds.width * 0.25;
      const halfHeight = modelBounds.height * 0.25;
      
      if (activeZone === 'front' || activeZone === 'back') {
        newX = Math.max(-1, Math.min(1, point.x / halfWidth));
        newY = Math.max(-1, Math.min(1, (point.y - 0.15) / halfHeight));
      } else {
        newX = Math.max(-1, Math.min(1, point.z / 0.1));
        newY = Math.max(-1, Math.min(1, (point.y - 0.35) / 0.15));
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
    if (!modelBounds) return null;
    
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
          modelBounds={{
            width: modelBounds.width,
            height: modelBounds.height,
            depth: modelBounds.depth,
          }}
        />
      );
    });
  };

  if (!modelBounds) {
    return null; // Wait for bounds calculation
  }

  return (
    <group 
      ref={groupRef}
      scale={[responsiveScale, responsiveScale, responsiveScale]}
      position={[centerOffset.x, centerOffset.y - 0.3, centerOffset.z]}
      {...interactionProps}
      onPointerOver={() => isDraggable && zoneDecals[activeZone].imageUrl && (document.body.style.cursor = "grab")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <primitive object={clonedScene} />
      {/* Decal container mesh - positioned relative to normalized model */}
      <mesh ref={meshRef} visible={true}>
        <boxGeometry args={[modelBounds.width / responsiveScale * 0.5, modelBounds.height / responsiveScale * 0.8, modelBounds.depth / responsiveScale * 0.8]} />
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

  // Default bounds for primitive geometry garments
  const defaultBounds = { width: 1.8, height: 2.0, depth: 0.55 };

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
          modelBounds={defaultBounds}
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
