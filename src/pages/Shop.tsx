import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import {
  products,
  getProductsByCategory,
  getNewArrivals,
  getLimitedEdition,
} from "@/data/products";
import hoodieImage from "@/assets/hoodie-black.jpg";
import tshirtImage from "@/assets/tshirt-white.jpg";
import poloImage from "@/assets/polo-navy.jpg";

const categoryTitles: Record<string, string> = {
  hoodies: "Hoodies",
  tshirts: "T-Shirts",
  polos: "Polos",
};

const Shop = () => {
  const { category } = useParams();
  const location = useLocation();

  let displayProducts = products;
  let title = "All Products";
  let description = "Explore our complete collection of premium custom fashion.";

  if (category && category in categoryTitles) {
    displayProducts = getProductsByCategory(category as "hoodies" | "tshirts" | "polos");
    title = categoryTitles[category];
    description = `Shop our premium ${title.toLowerCase()} collection.`;
  } else if (location.pathname === "/limited") {
    displayProducts = getLimitedEdition();
    title = "Limited Edition";
    description = "Exclusive designs, limited availability. Don't miss out.";
  } else if (location.pathname === "/new") {
    displayProducts = getNewArrivals();
    title = "New Arrivals";
    description = "The latest additions to our collection.";
  }

  // Add images to products
  const productsWithImages = displayProducts.map((product, index) => ({
    ...product,
    images: [
      product.category === "hoodies" ? hoodieImage :
      product.category === "tshirts" ? tshirtImage :
      poloImage
    ],
  }));

  return (
    <>
      <Helmet>
        <title>{title} | SAWA - Custom 3D Fashion</title>
        <meta name="description" content={description} />
      </Helmet>
      <Layout>
        <section className="py-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-gold text-sm font-medium tracking-widest uppercase">
                Shop
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mt-2 mb-4">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {["All", "Hoodies", "T-Shirts", "Polos"].map((filter) => (
                <button
                  key={filter}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    (filter === "All" && !category) ||
                    filter.toLowerCase().replace("-", "") === category
                      ? "bg-gold text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-gold/20"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {productsWithImages.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {productsWithImages.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Shop;
