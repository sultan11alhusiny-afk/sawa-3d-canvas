import { motion } from "framer-motion";
import { Shirt, ArrowLeft, ArrowRight } from "lucide-react";
import { DesignZone, ZONE_CONFIG, ZoneDecals } from "@/types/designer";

interface ZoneSelectorProps {
  selectedZone: DesignZone;
  onZoneChange: (zone: DesignZone) => void;
  zoneDecals: ZoneDecals;
}

export const ZoneSelector = ({ selectedZone, onZoneChange, zoneDecals }: ZoneSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Select Zone</span>
        <span className="text-xs text-gold">
          {ZONE_CONFIG.filter(z => zoneDecals[z.id].imageUrl).length} zones with designs
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {ZONE_CONFIG.map((zone) => {
          const hasImage = !!zoneDecals[zone.id].imageUrl;
          const isSelected = selectedZone === zone.id;
          
          return (
            <motion.button
              key={zone.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onZoneChange(zone.id)}
              className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${
                isSelected
                  ? "border-gold bg-gold/10 shadow-lg shadow-gold/20"
                  : "border-border hover:border-gold/50 bg-secondary/50"
              }`}
            >
              <div className={`relative ${isSelected ? "text-gold" : "text-muted-foreground"}`}>
                {zone.id === 'front' && <Shirt className="w-5 h-5" />}
                {zone.id === 'back' && <Shirt className="w-5 h-5 rotate-180" />}
                {zone.id === 'leftSleeve' && (
                  <div className="flex items-center">
                    <ArrowLeft className="w-4 h-4" />
                    <div className="w-3 h-5 border-2 border-current rounded-sm" />
                  </div>
                )}
                {zone.id === 'rightSleeve' && (
                  <div className="flex items-center">
                    <div className="w-3 h-5 border-2 border-current rounded-sm" />
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
                
                {/* Indicator dot for zones with images */}
                {hasImage && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
                )}
              </div>
              
              <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {zone.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
