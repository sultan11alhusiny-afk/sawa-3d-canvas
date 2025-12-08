import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[60vh] flex items-center justify-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-8xl md:text-9xl font-display font-bold text-gradient-gold mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="gold" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="gold-outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default NotFound;
