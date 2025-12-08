import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { DesignerPreview } from "@/components/home/DesignerPreview";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { Testimonials } from "@/components/home/Testimonials";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SAWA | Design Your Identity - Custom 3D Fashion</title>
        <meta
          name="description"
          content="Create custom hoodies, t-shirts, and polos with SAWA's revolutionary 3D designer. Premium quality, unlimited creativity, uniquely you."
        />
      </Helmet>
      <Layout>
        <HeroSection />
        <FeaturedProducts />
        <DesignerPreview />
        <CategoryShowcase />
        <Testimonials />
      </Layout>
    </>
  );
};

export default Index;
