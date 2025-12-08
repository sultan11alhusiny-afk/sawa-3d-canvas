import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hoodieImage from "@/assets/hoodie-black.jpg";
import tshirtImage from "@/assets/tshirt-white.jpg";
import poloImage from "@/assets/polo-navy.jpg";

const categories = [
  {
    name: "Hoodies",
    description: "Premium heavyweight comfort",
    image: hoodieImage,
    path: "/shop/hoodies",
    count: "12 Styles",
  },
  {
    name: "T-Shirts",
    description: "Essential everyday luxury",
    image: tshirtImage,
    path: "/shop/tshirts",
    count: "18 Styles",
  },
  {
    name: "Polos",
    description: "Refined casual elegance",
    image: poloImage,
    path: "/shop/polos",
    count: "8 Styles",
  },
];

export const CategoryShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Shop by Category
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-2">
            Find Your Style
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link to={category.path} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 group-hover:border-gold/50 group-hover:shadow-2xl group-hover:shadow-gold/10">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-gold text-sm font-medium">
                      {category.count}
                    </span>
                    <h3 className="text-3xl font-display font-bold mt-1 mb-2 group-hover:text-gold transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-gold font-medium">
                      Explore Collection
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
