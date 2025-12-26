// Zone types for multi-zone customization
export type DesignZone = 'front' | 'back' | 'leftSleeve' | 'rightSleeve';

export interface DecalSettings {
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

export interface ZoneDecal {
  imageUrl: string | null;
  settings: DecalSettings;
}

export type ZoneDecals = Record<DesignZone, ZoneDecal>;

export const DEFAULT_DECAL_SETTINGS: DecalSettings = {
  positionX: 0,
  positionY: 0,
  scale: 0.8,
  rotation: 0,
  flipX: false,
  flipY: false,
};

export const createDefaultZoneDecals = (): ZoneDecals => ({
  front: { imageUrl: null, settings: { ...DEFAULT_DECAL_SETTINGS } },
  back: { imageUrl: null, settings: { ...DEFAULT_DECAL_SETTINGS } },
  leftSleeve: { imageUrl: null, settings: { ...DEFAULT_DECAL_SETTINGS } },
  rightSleeve: { imageUrl: null, settings: { ...DEFAULT_DECAL_SETTINGS } },
});

export interface ZoneInfo {
  id: DesignZone;
  label: string;
  icon: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export const ZONE_CONFIG: ZoneInfo[] = [
  { 
    id: 'front', 
    label: 'Front', 
    icon: 'shirt',
    cameraPosition: [0, 0, 5],
    cameraTarget: [0, 0, 0],
  },
  { 
    id: 'back', 
    label: 'Back', 
    icon: 'shirt',
    cameraPosition: [0, 0, -5],
    cameraTarget: [0, 0, 0],
  },
  { 
    id: 'leftSleeve', 
    label: 'Left Sleeve', 
    icon: 'grip',
    cameraPosition: [-5, 0.5, 0],
    cameraTarget: [0, 0.5, 0],
  },
  { 
    id: 'rightSleeve', 
    label: 'Right Sleeve', 
    icon: 'grip',
    cameraPosition: [5, 0.5, 0],
    cameraTarget: [0, 0.5, 0],
  },
];

// Camera positions per zone for auto-focus
export const getZoneCameraConfig = (zone: DesignZone): { position: [number, number, number]; target: [number, number, number] } => {
  const config = ZONE_CONFIG.find(z => z.id === zone);
  return config 
    ? { position: config.cameraPosition, target: config.cameraTarget }
    : { position: [0, 0, 5], target: [0, 0, 0] };
};
