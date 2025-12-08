import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Type, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: RotateCcw,
    title: "360° View",
    description: "Rotate and inspect every angle of your design in real-time 3D.",
  },
  {
    icon: Palette,
    title: "Custom Colors",
    description: "Choose from unlimited colors for body, sleeves, collar, and more.",
  },
  {
    icon: Type,
    title: "Add Text & Logos",
    description: "Personalize with names, numbers, and upload your own graphics.",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See exactly what you'll receive before placing your order.",
  },
];

export const DesignerPreview = () => {
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />

      <div className="container px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Revolutionary Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-6">
              Create in <span className="text-gradient-gold">3D</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-lg">
              Our state-of-the-art 3D customizer puts you in control. Design your perfect 
              piece from scratch, see it come to life in real-time, and make it uniquely yours.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/designer">
              <Button variant="hero" size="xl">
                Launch 3D Designer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* 3D Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-charcoal-light to-background border border-border overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-gradient-gold" />
              
              {/* 3D Visualization Mockup */}
              <div className="absolute inset-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative w-48 h-64"
                >
                  {/* Simple 3D Hoodie Shape */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gold/20 to-gold/5 rounded-lg transform perspective-1000 preserve-3d" />
                  <div className="absolute inset-4 bg-gradient-to-br from-card to-charcoal rounded-md" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-muted rounded-full" />
                </motion.div>
              </div>

              {/* UI Elements */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 animate-pulse-gold" />
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div className="w-8 h-8 rounded-full bg-secondary" />
              </div>

              {/* Color Picker Preview */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                {["#1a1a1a", "#f5f5dc", "#8a9a7b", "#0a1128", "#D4AF37"].map((color) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-border hover:border-gold transition-colors cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -right-4 px-6 py-3 rounded-full bg-gold text-primary-foreground font-semibold shadow-lg shadow-gold/30"
            >
              Free to Use
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
