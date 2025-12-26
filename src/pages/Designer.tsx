import { Suspense, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text, Center } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingBag, RotateCcw, Type, Palette, Save } from "lucide-react";

const colors = [
  { name: "Obsidian", hex: "#1a1a1a" },
  { name: "Bone", hex: "#f5f5dc" },
  { name: "Sage", hex: "#8a9a7b" },
  { name: "Navy", hex: "#0a1128" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Burgundy", hex: "#722F37" },
  { name: "Forest", hex: "#228b22" },
  { name: "Charcoal", hex: "#36454f" },
];

const garmentTypes = [
  { id: "hoodie", name: "Hoodie", price: 149 },
  { id: "tshirt", name: "T-Shirt", price: 69 },
  { id: "polo", name: "Polo", price: 119 },
];

interface GarmentProps {
  color: string;
  text: string;
  textColor: string;
  type: string;
}

const Garment = ({ color, text, textColor, type }: GarmentProps) => {

  // Different geometry based on type
  const renderGarment = () => {
    const materialProps = {
      color: color,
      roughness: 0.8,
      metalness: 0.1,
    };

    if (type === "hoodie") {
      return (
        <group>
          {/* Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2.5, 0.8]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Hood */}
          <mesh position={[0, 1.5, -0.2]}>
            <sphereGeometry args={[0.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Sleeves */}
          <mesh position={[-1.3, 0.3, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.3, 0.35, 1.5, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[1.3, 0.3, 0]} rotation={[0, 0, 0.3]}>
            <cylinderGeometry args={[0.3, 0.35, 1.5, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Pocket */}
          <mesh position={[0, -0.5, 0.42]}>
            <boxGeometry args={[1.2, 0.5, 0.05]} />
            <meshStandardMaterial color="#000" opacity={0.3} transparent />
          </mesh>
        </group>
      );
    } else if (type === "polo") {
      return (
        <group>
          {/* Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2.2, 0.6]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Collar */}
          <mesh position={[0, 1.15, 0.1]}>
            <boxGeometry args={[0.8, 0.3, 0.65]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Collar fold */}
          <mesh position={[0, 1.3, 0.15]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.7, 0.15, 0.3]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Short sleeves */}
          <mesh position={[-1.15, 0.5, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[1.15, 0.5, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Buttons */}
          {[0.8, 0.5, 0.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0.32]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.5} />
            </mesh>
          ))}
        </group>
      );
    } else {
      // T-Shirt
      return (
        <group>
          {/* Body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2.2, 0.6]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 1.15, 0]}>
            <torusGeometry args={[0.35, 0.1, 8, 16, Math.PI]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          {/* Short sleeves */}
          <mesh position={[-1.15, 0.5, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[1.15, 0.5, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </group>
      );
    }
  };

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {renderGarment()}
        {/* Custom Text */}
        {text && (
          <Center position={[0, 0, 0.45]}>
            <Text
              fontSize={0.25}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
              {text}
            </Text>
          </Center>
        )}
      </group>
    </Float>
  );
};

const Designer = () => {
  const [selectedType, setSelectedType] = useState("hoodie");
  const [selectedColor, setSelectedColor] = useState("#1a1a1a");
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#D4AF37");
  const [selectedSize, setSelectedSize] = useState("M");
  const { addItem } = useCart();

  const currentGarment = garmentTypes.find((g) => g.id === selectedType)!;
  const currentColorName = colors.find((c) => c.hex === selectedColor)?.name || "Custom";

  const handleAddToCart = () => {
    addItem({
      id: `custom-${selectedType}-${Date.now()}`,
      name: `Custom ${currentGarment.name}`,
      price: currentGarment.price,
      image: "/placeholder.svg",
      color: currentColorName,
      size: selectedSize,
      quantity: 1,
      customization: {
        text: customText,
        textColor: textColor,
      },
    });
    toast.success("Added to cart!", {
      description: "Your custom design has been saved.",
    });
  };

  return (
    <>
      <Helmet>
        <title>3D Designer | SAWA - Create Your Custom Fashion</title>
        <meta
          name="description"
          content="Design your own custom hoodie, t-shirt, or polo with our revolutionary 3D customizer. Full 360° view, unlimited colors, and personalized text."
        />
      </Helmet>
      <Layout>
        <section className="min-h-screen py-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                3D Customizer
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mt-2">
                Design Your <span className="text-gradient-gold">Style</span>
              </h1>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* 3D Viewer */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative aspect-square rounded-2xl bg-card border border-border overflow-hidden"
              >
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <pointLight position={[-10, -10, -10]} />
                  <Suspense fallback={null}>
                    <Garment
                      color={selectedColor}
                      text={customText}
                      textColor={textColor}
                      type={selectedType}
                    />
                    <Environment preset="studio" />
                  </Suspense>
                  <OrbitControls
                    enablePan={false}
                    minDistance={3}
                    maxDistance={8}
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                </Canvas>

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCcw className="w-4 h-4" />
                  Drag to rotate • Scroll to zoom
                </div>
              </motion.div>

              {/* Customization Panel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <Tabs defaultValue="type" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-secondary">
                    <TabsTrigger value="type">Type</TabsTrigger>
                    <TabsTrigger value="color">
                      <Palette className="w-4 h-4 mr-2" />
                      Color
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="w-4 h-4 mr-2" />
                      Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="type" className="mt-6">
                    <div className="space-y-4">
                      <Label>Select Garment Type</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {garmentTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              selectedType === type.id
                                ? "border-gold bg-gold/10"
                                : "border-border hover:border-gold/50"
                            }`}
                          >
                            <div className="text-lg font-semibold">{type.name}</div>
                            <div className="text-gold font-bold mt-1">${type.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="color" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <Label>Garment Color</Label>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {colors.map((color) => (
                            <button
                              key={color.hex}
                              onClick={() => setSelectedColor(color.hex)}
                              className={`aspect-square rounded-xl border-2 transition-all ${
                                selectedColor === color.hex
                                  ? "border-gold ring-2 ring-gold/30"
                                  : "border-border hover:border-gold/50"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="customText">Custom Text</Label>
                        <Input
                          id="customText"
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value.slice(0, 15))}
                          placeholder="Enter text (max 15 chars)"
                          className="mt-2 bg-secondary"
                        />
                      </div>
                      <div>
                        <Label>Text Color</Label>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {colors.map((color) => (
                            <button
                              key={color.hex}
                              onClick={() => setTextColor(color.hex)}
                              className={`aspect-square rounded-xl border-2 transition-all ${
                                textColor === color.hex
                                  ? "border-gold ring-2 ring-gold/30"
                                  : "border-border hover:border-gold/50"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Size Selection */}
                <div className="space-y-4">
                  <Label>Select Size</Label>
                  <div className="flex gap-3">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? "border-gold bg-gold text-primary-foreground"
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 rounded-xl bg-secondary space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Garment</span>
                    <span className="font-semibold">{currentGarment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="font-semibold">{currentColorName}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-semibold">{selectedSize}</span>
                  </div>
                  {customText && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custom Text</span>
                      <span className="font-semibold">"{customText}"</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Total</span>
                      <span className="text-2xl font-bold text-gradient-gold">
                        ${currentGarment.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button variant="gold-outline" size="lg" className="flex-1">
                    <Save className="w-5 h-5 mr-2" />
                    Save Design
                  </Button>
                  <Button variant="gold" size="lg" className="flex-1" onClick={handleAddToCart}>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Designer;
