import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Ruler, Scale, Loader2, Sparkles } from "lucide-react";

interface BodyMeasurementsFormProps {
  onGenerate: (measurements: BodyMeasurements) => void;
  isLoading: boolean;
}

export interface BodyMeasurements {
  height: number;
  weight: number;
  gender: "male" | "female" | "neutral";
  bodyType: string;
}

function calculateBodyType(height: number, weight: number): string {
  // Calculate BMI to determine body type
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) return "slim";
  if (bmi >= 18.5 && bmi < 25) return "average";
  if (bmi >= 25 && bmi < 30) return "athletic";
  return "plus";
}

function getBodyTypeLabel(bodyType: string): string {
  const labels: Record<string, string> = {
    slim: "Slim / Lean",
    average: "Average / Standard",
    athletic: "Athletic / Muscular",
    plus: "Plus Size / Broad",
  };
  return labels[bodyType] || bodyType;
}

export const BodyMeasurementsForm = ({ onGenerate, isLoading }: BodyMeasurementsFormProps) => {
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");
  const [gender, setGender] = useState<"male" | "female" | "neutral">("neutral");

  const heightNum = parseFloat(height) || 0;
  const weightNum = parseFloat(weight) || 0;
  const bodyType = heightNum > 0 && weightNum > 0 ? calculateBodyType(heightNum, weightNum) : "";

  const isValid = heightNum >= 140 && heightNum <= 220 && weightNum >= 30 && weightNum <= 200;

  const handleSubmit = () => {
    if (!isValid) return;
    
    onGenerate({
      height: heightNum,
      weight: weightNum,
      gender,
      bodyType,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 text-gold mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold">AI Body Preview</h3>
        <p className="text-sm text-muted-foreground">
          Generate a realistic AI model wearing your custom design
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Height Input */}
        <div className="space-y-2">
          <Label htmlFor="height" className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-muted-foreground" />
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            min={140}
            max={220}
            className="bg-secondary"
          />
          {heightNum > 0 && (heightNum < 140 || heightNum > 220) && (
            <p className="text-xs text-destructive">Enter 140-220 cm</p>
          )}
        </div>

        {/* Weight Input */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-muted-foreground" />
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            min={30}
            max={200}
            className="bg-secondary"
          />
          {weightNum > 0 && (weightNum < 30 || weightNum > 200) && (
            <p className="text-xs text-destructive">Enter 30-200 kg</p>
          )}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Body Style
        </Label>
        <Select value={gender} onValueChange={(v) => setGender(v as typeof gender)}>
          <SelectTrigger className="bg-secondary">
            <SelectValue placeholder="Select body style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="neutral">Neutral / Unisex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auto-calculated Body Type */}
      {bodyType && isValid && (
        <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Calculated Body Type</span>
            <span className="font-semibold text-gold">{getBodyTypeLabel(bodyType)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on height and weight proportions
          </p>
        </div>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full bg-gold hover:bg-gold/90 text-primary-foreground"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating AI Preview...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Model Preview
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        The AI model is 100% computer-generated. No real person is used.
      </p>
    </div>
  );
};
