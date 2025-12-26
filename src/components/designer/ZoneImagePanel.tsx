import { useRef, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  Upload, X, RotateCw, Maximize2, Move, Target, 
  FlipHorizontal, FlipVertical, RotateCcw 
} from "lucide-react";
import DOMPurify from "dompurify";
import { DesignZone, DecalSettings, ZONE_CONFIG } from "@/types/designer";

interface ZoneImagePanelProps {
  activeZone: DesignZone;
  imageUrl: string | null;
  settings: DecalSettings;
  onImageUpload: (zone: DesignZone, imageUrl: string) => void;
  onImageRemove: (zone: DesignZone) => void;
  onSettingsChange: (zone: DesignZone, settings: Partial<DecalSettings>) => void;
}

// Sanitize SVG content
const sanitizeSvg = async (file: File): Promise<Blob> => {
  const text = await file.text();
  const clean = DOMPurify.sanitize(text, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use'],
    FORBID_TAGS: ['script', 'foreignObject'],
    FORBID_ATTR: [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 
      'onfocus', 'onblur', 'onchange', 'oninput', 'onkeydown', 
      'onkeyup', 'onkeypress', 'onsubmit', 'onreset', 'onselect',
      'onabort', 'onanimationend', 'onanimationiteration', 'onanimationstart'
    ],
  });
  return new Blob([clean], { type: 'image/svg+xml' });
};

export const ZoneImagePanel = ({
  activeZone,
  imageUrl,
  settings,
  onImageUpload,
  onImageRemove,
  onSettingsChange,
}: ZoneImagePanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const positionGridRef = useRef<HTMLDivElement>(null);
  const [isDraggingOnGrid, setIsDraggingOnGrid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const zoneLabel = ZONE_CONFIG.find(z => z.id === activeZone)?.label || activeZone;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or SVG file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setIsProcessing(true);
    
    try {
      let fileToUse: File | Blob = file;
      if (file.type === "image/svg+xml") {
        fileToUse = await sanitizeSvg(file);
      }
      const imageUrlResult = URL.createObjectURL(fileToUse);
      onImageUpload(activeZone, imageUrlResult);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGridInteraction = useCallback(
    (clientX: number, clientY: number) => {
      if (!positionGridRef.current) return;
      const rect = positionGridRef.current.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      onSettingsChange(activeZone, {
        positionX: Math.max(-1, Math.min(1, x)),
        positionY: Math.max(-1, Math.min(1, y)),
      });
    },
    [activeZone, onSettingsChange]
  );

  const handleGridMouseDown = (e: React.MouseEvent) => {
    setIsDraggingOnGrid(true);
    handleGridInteraction(e.clientX, e.clientY);
  };

  const handleGridMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingOnGrid) return;
    handleGridInteraction(e.clientX, e.clientY);
  };

  const handleGridMouseUp = () => {
    setIsDraggingOnGrid(false);
  };

  const handleGridTouchStart = (e: React.TouchEvent) => {
    setIsDraggingOnGrid(true);
    handleGridInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleGridTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingOnGrid) return;
    handleGridInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const markerLeft = ((settings.positionX + 1) / 2) * 100;
  const markerTop = ((-settings.positionY + 1) / 2) * 100;

  const handleReset = () => {
    onSettingsChange(activeZone, {
      positionX: 0,
      positionY: 0,
      scale: 0.8,
      rotation: 0,
      flipX: false,
      flipY: false,
    });
  };

  return (
    <div className="space-y-5">
      {/* Zone indicator */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gold/10 border border-gold/30">
        <span className="text-sm font-medium">Editing: <span className="text-gold">{zoneLabel}</span></span>
        {imageUrl && (
          <span className="text-xs text-muted-foreground">Design applied</span>
        )}
      </div>

      {/* Upload Area */}
      <div>
        <Label className="mb-3 block">Upload Design for {zoneLabel}</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          onChange={handleFileChange}
          className="hidden"
        />

        {!imageUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-gold/50 transition-all flex flex-col items-center justify-center gap-3 bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Upload className={`w-6 h-6 text-gold ${isProcessing ? 'animate-pulse' : ''}`} />
            </div>
            <div className="text-center">
              <p className="font-medium">{isProcessing ? 'Processing...' : 'Click to upload'}</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, SVG (max 5MB)</p>
            </div>
          </button>
        ) : (
          <div className="relative">
            <div className="aspect-video rounded-xl border border-border overflow-hidden bg-secondary/50">
              <img
                src={imageUrl}
                alt="Uploaded design"
                className="w-full h-full object-contain"
                style={{
                  transform: `scaleX(${settings.flipX ? -1 : 1}) scaleY(${settings.flipY ? -1 : 1})`,
                }}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onImageRemove(activeZone)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      {imageUrl && (
        <div className="space-y-5">
          {/* Position Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gold" />
              <Label className="text-sm">Position</Label>
            </div>
            <div
              ref={positionGridRef}
              className="relative aspect-square w-full max-w-[180px] mx-auto rounded-xl border-2 border-border bg-secondary/50 cursor-crosshair select-none overflow-hidden"
              onMouseDown={handleGridMouseDown}
              onMouseMove={handleGridMouseMove}
              onMouseUp={handleGridMouseUp}
              onMouseLeave={handleGridMouseUp}
              onTouchStart={handleGridTouchStart}
              onTouchMove={handleGridTouchMove}
              onTouchEnd={handleGridMouseUp}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-full h-px bg-border/50" />
                <div className="absolute h-full w-px bg-border/50" />
              </div>
              <div className="absolute inset-4 border border-dashed border-muted-foreground/30 rounded-lg pointer-events-none" />
              <div
                className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${markerLeft}%`, top: `${markerTop}%` }}
              >
                <div className="w-full h-full rounded-full bg-gold border-2 border-background shadow-lg flex items-center justify-center">
                  <Move className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Flip Controls */}
          <div className="flex gap-2">
            <Button
              variant={settings.flipX ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onSettingsChange(activeZone, { flipX: !settings.flipX })}
            >
              <FlipHorizontal className="w-4 h-4 mr-1" />
              Flip H
            </Button>
            <Button
              variant={settings.flipY ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => onSettingsChange(activeZone, { flipY: !settings.flipY })}
            >
              <FlipVertical className="w-4 h-4 mr-1" />
              Flip V
            </Button>
          </div>

          {/* Scale */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-gold" />
              <Label className="text-sm">Size</Label>
            </div>
            <Slider
              value={[settings.scale]}
              onValueChange={([value]) => onSettingsChange(activeZone, { scale: value })}
              min={0.2}
              max={1.5}
              step={0.05}
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-gold" />
              <Label className="text-sm">Rotation ({settings.rotation}°)</Label>
            </div>
            <Slider
              value={[settings.rotation]}
              onValueChange={([value]) => onSettingsChange(activeZone, { rotation: value })}
              min={-180}
              max={180}
              step={5}
            />
          </div>

          {/* Reset */}
          <Button variant="outline" className="w-full" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset {zoneLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
