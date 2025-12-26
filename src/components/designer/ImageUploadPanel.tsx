import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Upload, X, Move, RotateCw, Maximize2 } from "lucide-react";

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

export const ImageUploadPanel = ({
  uploadedImage,
  onImageUpload,
  onImageRemove,
  decalSettings,
  onSettingsChange,
}: ImageUploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or SVG file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(imageUrl);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
            className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-gold/50 transition-all flex flex-col items-center justify-center gap-3 bg-secondary/50"
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gold" />
            </div>
            <div className="text-center">
              <p className="font-medium">Click to upload</p>
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
          {/* Position X */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-gold" />
              <Label className="text-sm">Horizontal Position</Label>
            </div>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-gold rotate-90" />
              <Label className="text-sm">Vertical Position</Label>
            </div>
            <Slider
              value={[decalSettings.positionY]}
              onValueChange={([value]) => onSettingsChange({ positionY: value })}
              min={-1}
              max={1}
              step={0.05}
              className="w-full"
            />
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
