import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart | SAWA - Custom 3D Fashion</title>
        </Helmet>
        <Layout>
          <section className="min-h-[60vh] py-24 flex items-center">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-display font-bold mb-4">
                  Your Cart is Empty
                </h1>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added anything yet. Start designing your
                  unique piece or explore our collection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/designer">
                    <Button variant="gold" size="lg">
                      Start Designing
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="gold-outline" size="lg">
                      Browse Shop
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cart ({items.length}) | SAWA - Custom 3D Fashion</title>
      </Helmet>
      <Layout>
        <section className="py-24">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground mt-2">
                {items.length} {items.length === 1 ? "item" : "items"} in your cart
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.color} • Size {item.size}
                          </p>
                          {item.customization?.text && (
                            <p className="text-sm text-gold mt-1">
                              Custom: "{item.customization.text}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xl font-bold">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear cart
                </button>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:sticky lg:top-32"
              >
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4 pb-6 border-b border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-gold">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-6">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-gradient-gold">
                      ${total}
                    </span>
                  </div>

                  <Button variant="gold" size="xl" className="w-full">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Cart;
