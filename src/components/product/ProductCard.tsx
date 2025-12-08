import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-500 group-hover:border-gold/30 group-hover:shadow-xl group-hover:shadow-gold/10">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-gold text-primary-foreground text-xs font-semibold rounded-full">
                NEW
              </span>
            )}
            {product.isLimited && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                LIMITED
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Image */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Button variant="gold" className="w-full">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">
              ${product.price}
            </span>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
