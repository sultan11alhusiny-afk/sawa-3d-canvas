import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DesignZone, getZoneCameraConfig } from "@/types/designer";

interface CameraControllerProps {
  targetZone: DesignZone;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

export const CameraController = ({ 
  targetZone, 
  isAnimating, 
  onAnimationComplete 
}: CameraControllerProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const animationProgress = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const config = getZoneCameraConfig(targetZone);
    targetPosition.current.set(...config.position);
    targetLookAt.current.set(...config.target);
    
    if (isFirstRender.current) {
      camera.position.set(...config.position);
      currentLookAt.current.set(...config.target);
      camera.lookAt(currentLookAt.current);
      isFirstRender.current = false;
    } else {
      animationProgress.current = 0;
    }
  }, [targetZone, camera]);

  useFrame((_, delta) => {
    if (!isAnimating) return;
    
    animationProgress.current += delta * 2; // Speed of animation
    const t = Math.min(animationProgress.current, 1);
    const eased = 1 - Math.pow(1 - t, 3); // Ease out cubic

    // Interpolate camera position
    camera.position.lerp(targetPosition.current, eased * 0.1);
    
    // Interpolate look-at target
    currentLookAt.current.lerp(targetLookAt.current, eased * 0.1);
    camera.lookAt(currentLookAt.current);

    // Check if animation is complete
    if (camera.position.distanceTo(targetPosition.current) < 0.01) {
      onAnimationComplete();
    }
  });

  return null;
};
