import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

import hoodieImage from "@/assets/hoodie-black.jpg";
import tshirtImage from "@/assets/tshirt-white.jpg";
import poloImage from "@/assets/polo-navy.jpg";

// Update product images
const productsWithImages = products.map((product, index) => ({
  ...product,
  images: [
    index % 3 === 0 ? hoodieImage : 
    index % 3 === 1 ? tshirtImage : 
    poloImage
  ],
}));

export const FeaturedProducts = () => {
  const featuredProducts = productsWithImages.slice(0, 4);

  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Featured Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mt-2">
              Signature Pieces
            </h2>
          </div>
          <Link to="/shop" className="mt-4 md:mt-0">
            <Button variant="gold-outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
