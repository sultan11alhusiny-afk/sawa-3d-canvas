import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, RefreshCw, X } from "lucide-react";
import { BodyMeasurementsForm, BodyMeasurements } from "./BodyMeasurementsForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIPreviewModalProps {
  garmentType: string;
  garmentColor: string;
  customText?: string;
  zoneImages: Record<string, string | null>;
}

export const AIPreviewModal = ({ 
  garmentType, 
  garmentColor, 
  customText,
  zoneImages 
}: AIPreviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastMeasurements, setLastMeasurements] = useState<BodyMeasurements | null>(null);

  const handleGenerate = async (measurements: BodyMeasurements) => {
    setIsLoading(true);
    setLastMeasurements(measurements);

    try {
      // Get the first zone image if available for the design reference
      const designImage = Object.values(zoneImages).find(img => img !== null) || null;

      const { data, error } = await supabase.functions.invoke("generate-ai-preview", {
        body: {
          measurements,
          garmentType,
          garmentColor,
          customText,
          designImage,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate preview");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("AI preview generated successfully!");
      } else {
        throw new Error("No image returned from AI");
      }
    } catch (error) {
      console.error("Error generating AI preview:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate AI preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastMeasurements) {
      handleGenerate(lastMeasurements);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `sawa-ai-preview-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const handleClose = () => {
    setIsOpen(false);
    // Don't reset the image so user can reopen and see it
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1 border-gold/50 text-gold hover:bg-gold/10"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            AI Body Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedImage ? (
            <BodyMeasurementsForm onGenerate={handleGenerate} isLoading={isLoading} />
          ) : (
            <div className="space-y-4">
              {/* Generated Image Display */}
              <div className="relative rounded-xl overflow-hidden bg-secondary">
                <img
                  src={generatedImage}
                  alt="AI Generated Preview"
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
                <div className="absolute top-3 right-3">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setGeneratedImage(null)}
                    className="bg-background/80 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Info Card */}
              <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Garment:</span>
                    <span className="ml-2 font-medium capitalize">{garmentType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Body Type:</span>
                    <span className="ml-2 font-medium capitalize">{lastMeasurements?.bodyType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Height:</span>
                    <span className="ml-2 font-medium">{lastMeasurements?.height} cm</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="ml-2 font-medium">{lastMeasurements?.weight} kg</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gold hover:bg-gold/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                This is an AI-generated preview. The actual garment may vary slightly.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
