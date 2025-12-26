import { useRef, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Upload, X, RotateCw, Maximize2, Move, Target } from "lucide-react";
import DOMPurify from "dompurify";

interface DecalSettings {
  positionX: number;
  positionY: number;
  scale: number;
  rotation: number;
}

interface ImageUploadPanelProps {
  uploadedImage: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  decalSettings: DecalSettings;
  onSettingsChange: (settings: Partial<DecalSettings>) => void;
}

// Sanitize SVG content to remove any malicious scripts
const sanitizeSvg = async (file: File): Promise<Blob> => {
  const text = await file.text();
  
  // Configure DOMPurify to allow SVG elements but strip all scripts and event handlers
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

export const ImageUploadPanel = ({
  uploadedImage,
  onImageUpload,
  onImageRemove,
  decalSettings,
  onSettingsChange,
}: ImageUploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const positionGridRef = useRef<HTMLDivElement>(null);
  const [isDraggingOnGrid, setIsDraggingOnGrid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
      
      // Sanitize SVG files to prevent XSS attacks
      if (file.type === "image/svg+xml") {
        fileToUse = await sanitizeSvg(file);
      }
      
      const imageUrl = URL.createObjectURL(fileToUse);
      onImageUpload(imageUrl);
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

      onSettingsChange({
        positionX: Math.max(-1, Math.min(1, x)),
        positionY: Math.max(-1, Math.min(1, y)),
      });
    },
    [onSettingsChange]
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
    const touch = e.touches[0];
    handleGridInteraction(touch.clientX, touch.clientY);
  };

  const handleGridTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingOnGrid) return;
    const touch = e.touches[0];
    handleGridInteraction(touch.clientX, touch.clientY);
  };

  // Convert -1 to 1 range to percentage for positioning
  const markerLeft = ((decalSettings.positionX + 1) / 2) * 100;
  const markerTop = ((-decalSettings.positionY + 1) / 2) * 100;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div>
        <Label className="mb-4 block">Upload Your Design</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          onChange={handleFileChange}
          className="hidden"
        />

        {!uploadedImage ? (
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
                src={uploadedImage}
                alt="Uploaded design"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onImageRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Controls (only show when image is uploaded) */}
      {uploadedImage && (
        <div className="space-y-5 pt-2">
          {/* Interactive Position Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gold" />
              <Label className="text-sm">Position (drag to move)</Label>
            </div>
            <div
              ref={positionGridRef}
              className="relative aspect-square w-full max-w-[200px] mx-auto rounded-xl border-2 border-border bg-secondary/50 cursor-crosshair select-none overflow-hidden"
              onMouseDown={handleGridMouseDown}
              onMouseMove={handleGridMouseMove}
              onMouseUp={handleGridMouseUp}
              onMouseLeave={handleGridMouseUp}
              onTouchStart={handleGridTouchStart}
              onTouchMove={handleGridTouchMove}
              onTouchEnd={handleGridMouseUp}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-full h-px bg-border/50" />
                <div className="absolute h-full w-px bg-border/50" />
              </div>
              
              {/* Garment outline hint */}
              <div className="absolute inset-4 border border-dashed border-muted-foreground/30 rounded-lg pointer-events-none" />
              
              {/* Position marker */}
              <div
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${markerLeft}%`,
                  top: `${markerTop}%`,
                }}
              >
                <div className="w-full h-full rounded-full bg-gold border-2 border-background shadow-lg flex items-center justify-center">
                  <Move className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              
              {/* Image preview at position */}
              <div
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                style={{
                  left: `${markerLeft}%`,
                  top: `${markerTop}%`,
                  transform: `translate(-50%, -50%) rotate(${decalSettings.rotation}deg) scale(${decalSettings.scale})`,
                }}
              >
                <img
                  src={uploadedImage}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click and drag to position • Also drag on the 3D model
            </p>
          </div>

          {/* Fine-tune sliders */}
          <div className="grid grid-cols-2 gap-4">
            {/* Position X */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Horizontal</Label>
              <Slider
                value={[decalSettings.positionX]}
                onValueChange={([value]) => onSettingsChange({ positionX: value })}
                min={-1}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* Position Y */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Vertical</Label>
              <Slider
                value={[decalSettings.positionY]}
                onValueChange={([value]) => onSettingsChange({ positionY: value })}
                min={-1}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>

          {/* Scale */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-gold" />
              <Label className="text-sm">Size</Label>
            </div>
            <Slider
              value={[decalSettings.scale]}
              onValueChange={([value]) => onSettingsChange({ scale: value })}
              min={0.2}
              max={1.5}
              step={0.05}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-gold" />
              <Label className="text-sm">Rotation ({decalSettings.rotation}°)</Label>
            </div>
            <Slider
              value={[decalSettings.rotation]}
              onValueChange={([value]) => onSettingsChange({ rotation: value })}
              min={-180}
              max={180}
              step={5}
              className="w-full"
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onSettingsChange({
                positionX: 0,
                positionY: 0,
                scale: 0.8,
                rotation: 0,
              })
            }
          >
            Reset Position
          </Button>
        </div>
      )}
    </div>
  );
};
