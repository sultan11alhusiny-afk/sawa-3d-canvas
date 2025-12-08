import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogIn } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Account = () => {
  const isLoggedIn = false; // This would come from auth context

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login functionality coming soon!");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account creation coming soon!");
  };

  if (!isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Account | SAWA - Custom 3D Fashion</title>
        </Helmet>
        <Layout>
          <section className="py-24 min-h-[80vh] flex items-center">
            <div className="container px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-gold" />
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">
                    Welcome to SAWA
                  </h1>
                  <p className="text-muted-foreground">
                    Sign in to access your account, orders, and saved designs.
                  </p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-secondary">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-secondary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-secondary"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          Remember me
                        </label>
                        <a href="#" className="text-sm text-gold hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Button variant="gold" size="lg" className="w-full">
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6">
                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-first">First Name</Label>
                          <Input
                            id="signup-first"
                            placeholder="John"
                            className="bg-secondary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-last">Last Name</Label>
                          <Input
                            id="signup-last"
                            placeholder="Doe"
                            className="bg-secondary"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          className="bg-secondary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-secondary"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms" className="text-gold hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-gold hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                      <Button variant="gold" size="lg" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-center text-muted-foreground text-sm mb-4">
                    Or continue as guest
                  </p>
                  <Link to="/shop">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
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

  // Logged in view (placeholder for future implementation)
  return (
    <>
      <Helmet>
        <title>My Account | SAWA</title>
      </Helmet>
      <Layout>
        <section className="py-24">
          <div className="container px-6">
            <h1 className="text-4xl font-display font-bold mb-8">My Account</h1>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Package, label: "Orders", href: "/orders" },
                { icon: Heart, label: "Wishlist", href: "/wishlist" },
                { icon: Settings, label: "Settings", href: "/settings" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="p-6 rounded-xl bg-card border border-border hover:border-gold/30 transition-colors text-center"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-4 text-gold" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Account;
